import { environment } from './../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { SessionStorageService } from 'angular-web-storage';
import { MyApplicationsComponent } from '../my-applications/my-applications.component'
import { error } from 'protractor';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { ProfessionalTaxService } from 'src/app/core/services/citizen/data-services/professional-tax.service';
import { CollectionService } from '../tax/water-supply/tax-transaction-history/Services/collection.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { PropertyOccupierSearchSharingService } from 'src/app/vmcshared/component/property-occupier-search/property-occupier-search-sharing.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-common-payble',
  templateUrl: './common-payble.component.html',
  styleUrls: ['./common-payble.component.scss']
})
export class CommonPaybleComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: any;

  translateKey: string = "addTransctionScreen";

  paymentsForm: FormGroup;
  PayableServices: Object[];
  currPaySerData: any;
  isRecordExists: boolean = false;
  isPropertyRecordExists: boolean = false;
  isWaterRecordExists: boolean = false;
  isECRCSearch: boolean = false;

  isPropertyTax: boolean = false;
  isWaterTax: boolean = false
  userServicesList = [];
  applicationrouter: any;
  redirectURLAfterPayment: any;

  model: any;

  payModeArr: Array<any> = [
    { name: 'Net Banking', code: 'NETBANKING' }, { name: 'Debit / Credit Card banking', code: 'CARDBANKING' }
  ];
  placeholder: string = 'Reference Number';
  placeHolderMessage: string;
  responseData: any;
  receiptEntry: any;
  feePaymentData: any;
  duesDetailsArr: any = [];
  isProfessionalTax: boolean = false;
  inputData: any
  selected: any;

  collectionModel: any;
  collectionWaterModel: any;
  isShowTaxDetailTable: boolean = false;
  isShowPayableScreen: boolean = true;
  propertyTaxDetailData = [];

  isShowWaterTaxDetailTable: boolean = false;
  waterTaxDetailData = [];

  isShowPropertySearchForm: boolean = false;
  propertyModelSub: Subscription;
  rupeeSign='(₹)'
  isVehileTax : boolean = false;
  uniqueId: any;
  chequeReturn = 0;
  

  constructor(
    private formService: FormsActionsService,
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private toaster: ToastrService,
    private commonService: CommonService,
    private profeService: ProfessionalTaxService,
    private session: SessionStorageService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private alertService: AlertService,
    private propertyOccupierSearchSharingService: PropertyOccupierSearchSharingService,
  ) {
    this.getPayableServicesList();
    this.createPayementControls();
  }

  ngOnInit() {

    this.route.queryParams.subscribe(d => {
      if (d.apiCode && d.id) {
        this.printReceipt(d.apiCode, '', d.id);
        setTimeout(() => {
          this.location.go(this.router.url.split('?')[0]);
        }, 3000);
      }
      if (d.code) {
        this.selected = d.code;
      }
    })

    this.getAllServices();

    this.propertyOccupierSearchSharingService.getIsOpenSearchForm().subscribe(data => {
      this.isShowPropertySearchForm = data;
    });

    this.propertyModelSub = this.propertyOccupierSearchSharingService.getPropertyModel().subscribe(data => {
      if (data) {
        this.fetchOccupierCollectionDetails(data.propertyNo);
        this.propertyOccupierSearchSharingService.setPropertyModel(null);
      }
    });

  }
  showHidePaybleScreen(event: boolean) {
    this.isShowPayableScreen = event;
  }

  showHideTaxDetailScreen(event: boolean) {
    this.isShowTaxDetailTable = event;
  }

  showHideWaterTaxDetailScreen(event: boolean) {
    this.isShowWaterTaxDetailTable = event;
  }

  /**
   * This method is used to initialize controls for payement form
   */
  createPayementControls() {
    this.paymentsForm = this.fb.group({
      id: null,
      refNumber: [null, Validators.required],
      amount: 0,
      payableServices: this.fb.group({
        code: [null, Validators.required]
      }),
      module: this.fb.group({
        code: [null, Validators.required]
      }),
      payMode: this.fb.group({
        code: null
      })
    });
  }

  /**
   * 
   * @param payData - json data as payment data.
   */
  makePayment(payData) {
    if (this.paymentsForm.get('amount').value < 0 || !this.paymentsForm.get('amount').value) {
      this.commonService.openAlert("Warning", "Insufficient amount", "warning");
      return;
    }
    this.formService.apiType = 'professional'

    let serviceType = this.paymentsForm.get('payableServices').get('code').value;

    let filterObj = _.filter(this.PayableServices, { 'code': serviceType })[0];

    if (payData.payableServices.code == 'PAY-PRO-TAX') {
      this.paymentsForm.get('payableServices').get('code').setValue('PROFESSIONAL_TAX');
    }

    let updateAmount = '';
    let updatePayableServiceType = ''
    if (payData.module.code == 'PROPERTY-TAX' || payData.module.code == 'WATER-TAX') {
      updateAmount = this.model;
      updatePayableServiceType = payData.payableServices.code;
    } else if (payData.module.code == 'PROFESSIONAL') {
      updateAmount = payData.amount;
      updatePayableServiceType = payData.payableServices.code;
    } else {
      updateAmount = payData.amount;
      updatePayableServiceType = payData.module.code
    }

    let retUrl: string = environment.returnUrl;

    let obj = {
      payableServiceType: updatePayableServiceType,
      refNumber: updatePayableServiceType == 'VEHICLE' ?  this.uniqueId : payData.refNumber,
      amount: updateAmount,
      paymentMode: "NETBANKING",
      returnUrl: retUrl,
      searchable: false,
      txtadditionalInfo1: payData.payableServices.code
    }

    if (payData.payableServices.code == 'PAY-PRO-TAX') {
      obj['txtadditionalInfo1'] = 'PAY-PRO-TAX';
    } else if (payData.payableServices.code == 'PAY-WTR-TAX') {
      obj['txtadditionalInfo1'] = 'PAY-WTR-TAX';
    }

    let words = this.commonService.getToWords(updateAmount)
    let html =
      `
					<div class="text-center">
						<h2>Total Fee Pay</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + updateAmount + `</i>
						</div>
						<p>Rupees in words</p>`
      + words + `
					</div>`


    this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
      // this.formService.createTokenforServicePayment(payData).subscribe(resp => {
      // 	window.open(resp.data, "_self");
      // }, err => {
      // 	this.toastr.error(err.error.message);
      // })
      this.session.set('paymentData', JSON.stringify(obj));

      this.paymentGateway.setPaymentDetails(obj, this.paymentsForm, this.router, this.applicationrouter, retUrl)
      this.paymentGateway.setPaymentDetailsFromActionBar(obj);
      this.paymentGateway.openModel();

    });





    // this.formService.ccAvenueMakePayment(obj).subscribe(res => {
    //   if (res) {
    //     this.session.set('paymentData', JSON.stringify(obj));
    //   } else {
    //     this.toaster.warning('something went wrong!');
    //   }
    // });

    // this.formService.ccAvenueMakePayment(obj).subscribe(res => {
    //   this.getTransactionDetail(res.data);
    // });

  }


  getTransactionDetail(data) {
    let form = $(document.createElement('form'));
    $(form).attr("action", data.url);
    $(form).attr("method", "POST");

    let input = $("<input>")
      .attr("type", "hidden")
      .attr("name", "access_code")
      .val(data.access_code);

    let input2 = $("<input>")
      .attr("type", "hidden")
      .attr("name", "encRequest")
      .val(data.encRequest);

    $(form).append($(input));
    $(form).append($(input2));

    form.appendTo(document.body);

    $(form).submit();

  }


  get f() {
    return this.paymentsForm.controls;
  }

  /**
   * Method is used to get all payable services list from api.
   */
  getPayableServicesList() {
    this.formService.apiType = 'payableServices';
    this.formService.paymentServiceGet().subscribe(respData => {
      this.PayableServices = respData.list;
      if (this.paymentsForm.get('payableServices').get('code')) {
        this.showHideSearchable(this.paymentsForm.get('payableServices').get('code').value);
      }
    })
  }

  /**
   * This method is used for show hide searchable option
   * @param searchable - boolean (true/false)
   */
  showHideSearchable(paySerCode) {
    this.updateIsProfessionalTax(paySerCode);
    if (paySerCode === 'PAY_PROF_TAX' || paySerCode === 'PEC_REG' || paySerCode === 'PRC_REG') {
      // this.isProfessionalTax = true;
      this.placeholder = 'PEC Number';
      this.placeHolderMessage = 'PEC Number is Required';
    } else if (paySerCode === 'PAY-PRO-TAX') {
      this.placeholder = 'Property Number';
      this.placeHolderMessage = 'Property Number is Required';
    } else if (paySerCode === 'PAY-WTR-TAX') {
      this.placeholder = 'Connection Number';
      this.placeHolderMessage = 'Connection Number is Required';
    }
    else {
      this.placeholder = 'Reference Number';
      this.placeHolderMessage = 'Reference Number is Required';
    }

    this.isRecordExists = false;
    this.responseData = undefined;
    this.paymentsForm.get('amount').setValue(null);
    this.paymentsForm.get('refNumber').setValue(null);
    this.currPaySerData = _.filter(this.PayableServices, { 'code': paySerCode })[0];
  }

  updateIsProfessionalTax(paySerCode) {
    if (paySerCode === 'PAY_PROF_TAX' || paySerCode === 'PEC_REG' || paySerCode === 'PRC_REG') {
      this.isProfessionalTax = true;
    } else if(paySerCode === 'VEHICLE'){
      this.paymentsForm.get('refNumber').setValidators([Validators.required])
    }else {
      this.isProfessionalTax = false;
      this.paymentsForm.get('refNumber').setValidators(null);
    }
  }

  getServices() {
    let serviceType = this.paymentsForm.get('payableServices').get('code').value;
    if (serviceType === 'PAY-PRO-TAX') {
      this.getAmountDataProperty();
    } else if (serviceType === 'PAY_PROF_TAX') {
      this.isPropertyTax = false;
      this.isWaterTax = false;
      this.getAmountData();
    } else if (serviceType === 'PAY-WTR-TAX') {
      this.getAmountDataWater();
    }
    else {
      this.isPropertyTax = false;
      this.getCitizenForm();
    }

  }
  getAmountDataProperty() {
    if (this.paymentsForm.invalid) {
      this.markFormGroupTouched(this.paymentsForm);
      this.commonService.openAlert("Warning", "Enter all the required information", "warning");
      return;
    }
    else {
      this.fetchOccupierCollectionDetails(this.paymentsForm.get('refNumber').value);
    }

  }

  fetchOccupierCollectionDetails(propertyNo: string) {
    this.isPropertyTax = true;
    this.collectionService.getoccupierOutstandingAmount({ propertyNo: propertyNo }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.isPropertyRecordExists = true;
          this.collectionModel = data.body;
          this.model = this.collectionModel.payableAmount;
          this.paymentsForm.get('amount').setValue(this.model);
          this.paymentsForm.get('refNumber').setValue(propertyNo);
          console.log("model: " + this.model)
        }
      },
      (error) => {
        this.commonService.openAlert("Warning", "Enter Valid Property Number", "warning");
        this.paymentsForm.get('refNumber').setValue(null);
        this.isPropertyRecordExists = false
      });
  }

  getAmountDataWater() {
    this.isWaterTax = true;
    if (this.paymentsForm.invalid) {
      this.markFormGroupTouched(this.paymentsForm);
      this.commonService.openAlert("Warning", "Enter all the required information", "warning");
      return;
    } else {
      this.collectionService.getWaterOccupierOutstandingAmount(this.paymentsForm.get('refNumber').value).subscribe((data) => {
        if (data.status === 200) {
          this.isWaterRecordExists = true;
          this.collectionWaterModel = data.body;
          this.collectionWaterModel.collectedAmount = data.body.outstandingAmount;
          this.model = this.collectionWaterModel.collectedAmount;
          this.paymentsForm.get('amount').setValue(this.model);
        }
      },
        (error) => {
          this.commonService.openAlert("Warning", "Enter Valid Connection Number", "warning");
          this.paymentsForm.get('refNumber').setValue(null);
          this.isWaterRecordExists = false;
        });
    }
  }
  /**
   * - This method is used to get the type of tax and referance number and get the amount from the API
   */
  getAmountData() {

    if (this.paymentsForm.invalid) {
      this.markFormGroupTouched(this.paymentsForm);
      this.commonService.openAlert("Warning", "Enter all the required information", "warning");
      return;
    }

    let serviceType = this.paymentsForm.get('payableServices').get('code').value;
    let refNumber = this.paymentsForm.get('refNumber').value;

    this.formService.apiType = 'professional';

    let resData = {
      refNumber: refNumber,
      serviceType: serviceType
    }

    this.isRecordExists = false;
    this.isPropertyRecordExists = false;
    this.isECRCSearch = false;

    this.paymentsForm.get('amount').setValue(null);

    if (serviceType === 'PAY_PROF_TAX') {
      this.duesDetailsArr = [];
      this.formService.getDueDetails(refNumber).subscribe(
        res => {
          if (res && res.data && Object.keys(res.data).length) {
            this.isRecordExists = true;
            this.isECRCSearch = true;
            this.responseData = res.data;
            this.responseData['ecrcNo'] = refNumber;
            if (this.responseData.formType === 'BUS_REG_PEC') {
              if (this.responseData.pendingDemands && this.responseData.pendingDemands.length > 0) {
                this.duesDetailsArr = _.cloneDeep(res.data.pendingDemands);
                this.chequeReturn = res.data.chequeReturn
              }
            } else {
              if (this.responseData.prcPendingDemands && this.responseData.prcPendingDemands.length > 0) {
                _.forEach(this.responseData.prcPendingDemands, (element) => {
                  element.children = _.cloneDeep(element.children);
                });
                this.duesDetailsArr = _.cloneDeep(this.responseData.prcPendingDemands);
              }
            }

            this.paymentsForm.get('id').setValue(this.responseData.serviceFormId);
            this.paymentsForm.get('amount').setValue(this.responseData.dueAmount + this.chequeReturn);

            if (res.data.messageForValidation != null) {
              this.toaster.warning(res.data.messageForValidation);
            }

            // this.profeService.saveReceiptDetails(this.responseData).subscribe(res => {

            //     this.receiptEntry = res.data;
            //         console.log(this.receiptEntry);
            // });
          } else {
            this.toaster.warning('No record found !');
          }
        });
    } else {
      this.formService.paymentServicePost(resData).subscribe(
        res => {
          if (res) {
            this.isRecordExists = true;

            if (this.currPaySerData.fixAmount) {
              this.paymentsForm.get('amount').setValue(res.amount);
              this.paymentsForm.get('amount').disable();
            } else {
              this.paymentsForm.get('amount').setValue(res.amount);
            }
          } else {
            this.toaster.warning('No record found !');
          }

        }
      );
    }


  }

  toggleRow(obj) {
    obj.hidden = !obj.hidden;
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The group to caress
  */
  markFormGroupTouched(formGroup: FormGroup) {
    if (Reflect.getOwnPropertyDescriptor(formGroup, 'controls')) {
      (<any>Object).values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // FormGroup
          this.markFormGroupTouched(control);
        }
        // FormControl
        control.markAsTouched();
      });
    }
  }

  getCitizenForm() {

    if (this.paymentsForm.invalid) {
      this.markFormGroupTouched(this.paymentsForm);
      this.commonService.openAlert("Warning", "Enter all the required information", "warning");
      return;
    }

    let serviceType = this.paymentsForm.get('payableServices').get('code').value;
    let refNumber = this.paymentsForm.get('refNumber').value;

    this.formService.apiType = 'appsByRef';

    let resData = {
      refNumber: refNumber,
      serviceType: serviceType
    }

    this.formService.getCitizenForm(resData).subscribe(data => {
      if( serviceType == 'VEHICLE'){
        if(resData.refNumber){
          this.isVehileTax = true;
          this.inputData = data.data;
          this.paymentsForm.get('amount').setValue(this.inputData[0].amount);
          this.paymentsForm.get('refNumber').setValue(this.inputData[0].fileNumber);
          this.uniqueId = this.inputData[0].uniqueId;
        }else{
          this.alertService.info('Enter all the required information')
        }
      }else{
        this.inputData = data.data;
      }
      console.log('input data', this.inputData);
    }, error => {
      console.log(error)
    })
  }

  /**
   * This method use to application print receipt.
   * @param id citizen api code
   * @param id citizen api name
   * @param id citizen id
   */
  printReceipt(apiCode: string, apiName: string, id: number) {

    this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
    this.formService.printReceipt(id).subscribe(
      receiptResponse => {
        let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
        sectionToPrintReceipt.innerHTML = receiptResponse;
        setTimeout(() => {
          window.print();
        }, 400);
      },
      err => {
        this.commonService.openAlert('Error!', err.error[0].message, 'error');
      }
    );
  }

  getAllServices() {
    this.formService.getUserServices().subscribe(
      res => {
        this.userServicesList = res.modules;
        if (this.selected == 'PROFESSIONAL') {
          this.paymentsForm.get('module').get('code').setValue(this.selected);
          this.setPayableServices('PROFESSIONAL')
          this.paymentsForm.get('payableServices').get('code').setValue('PAY_PROF_TAX');
          this.showHideSearchable('PAY_PROF_TAX');
        }
        else if (this.selected == 'PROPERTY-TAX') {
          this.paymentsForm.get('module').get('code').setValue(this.selected);
          this.setPayableServices('PROPERTY-TAX');
          this.paymentsForm.get('payableServices').get('code').setValue('PAY-PRO-TAX');
          this.showHideSearchable('PAY-PRO-TAX');
        }
        else if (this.selected == 'WATER-TAX') {
          this.paymentsForm.get('module').get('code').setValue(this.selected);
          this.setPayableServices('WATER-TAX');
          this.paymentsForm.get('payableServices').get('code').setValue('PAY-WTR-TAX');
          this.showHideSearchable('PAY-WTR-TAX');
        }
      },
      err => {

      }
    );
  }

  setPayableServices(code) { 
    const filteredModules = this.userServicesList.filter(module => module.code === code);
    if (filteredModules.length > 0) {
      if (filteredModules[0].code == 'PROFESSIONAL') {
        this.PayableServices = filteredModules[0].services.filter(services => services.code == 'PAY_PROF_TAX');
      } else {
        this.PayableServices = filteredModules[0].services;
      }
      this.paymentsForm.get('payableServices').get('code').setValue(null);
      this.isWaterRecordExists = false;
      this.isPropertyRecordExists = false;
    }
  }

  onDetailClick(item) {
    if (item.taxWiseOutstandings && item.taxWiseOutstandings.length > 0) {
      this.propertyTaxDetailData = item.taxWiseOutstandings;
      this.isShowPayableScreen = false
      this.isShowTaxDetailTable = true;
    }
    else {
      this.alertService.info('No detail found!');
    }
  }

  onWaterDetailClick(item) {
    if (item.taxWiseOutstandings && item.taxWiseOutstandings.length > 0) {
      this.waterTaxDetailData = item.taxWiseOutstandings;
      this.isShowPayableScreen = false;
      this.isShowWaterTaxDetailTable = true;
    } else {
      this.alertService.info('No detail found!');
    }
  }

  isShowSearchButton(form: any) {
    if ((form.get('module').get('code').value == 'PROPERTY-TAX') && form.get('payableServices').get('code').value == 'PAY-PRO-TAX') {
      return true;
    } else {
      return false;
    }
  }

  onSearchProperty() {
    this.isShowPayableScreen = false;
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(true);
  }

  changeRefNumber(event) {
    if (!event) {
      // This is for professional tax record
      this.duesDetailsArr = [];
      this.isRecordExists = false;
      this.isECRCSearch = false;

      // This is for vehicle tax record
      this.isVehileTax = false;
      this.inputData = [];

      // This is for Property tax record
      this.isPropertyRecordExists = false;
      this.collectionModel = [];
      this.model = [];

      // This is for Water tax record
      this.isWaterRecordExists = false;
      this.collectionWaterModel = [];
      this.collectionWaterModel.collectedAmount = [];
    }

  }
}
