import { environment } from './../../../../environments/environment';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';

import * as _ from 'lodash';
import { SessionStorageService } from 'angular-web-storage';


@Component({
  selector: 'app-common-payble',
  templateUrl: './common-payble.component.html',
  styleUrls: ['./common-payble.component.scss']
})
export class CommonPaybleComponent implements OnInit {

  translateKey: string = "addTransctionScreen";

  paymentsForm: FormGroup;
  PayableServices: Object[];
  currPaySerData: any;
  isRecordExists: boolean = false;
  isECRCSearch: boolean = false;
  payModeArr: Array<any> = [
    { name: 'Net Banking', code: 'NETBANKING' }, { name: 'Debit / Credit Card banking', code: 'CARDBANKING' }
  ];
  placeholder: string = 'Reference Number';
  responseData: any;
  duesDetailsArr: any = [];

  constructor(
    private formService: FormsActionsService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private commonService: CommonService,
    private session: SessionStorageService
  ) {
    this.getPayableServicesList();
    this.createPayementControls();
  }

  ngOnInit() {

  }

	/**
	 * This method is used to initialize controls for payement form
	 */
  createPayementControls() {
    this.paymentsForm = this.fb.group({
      refNumber: [null, Validators.required],
      amount: 0,
      payableServices: this.fb.group({
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

    if (!this.paymentsForm.get('payMode.code').value) {
      this.commonService.openAlert("Warning", "Select payment mode", "warning");
      return;
    }

    let obj = {
      payableServiceType: payData.payableServices.code,
      refNumber: payData.refNumber,
      amount: payData.amount,
      paymentMode: payData.payMode.code,
      returnUrl: environment.returnUrl
    }

    this.formService.paymentGatewayUrl(obj).subscribe(res => {
      if (res) {
        this.session.set('paymentData', JSON.stringify(obj));
        window.open(res.data, "_self");
      } else {
        this.toaster.warning('something went wrong!');
      }

    });

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

    if (paySerCode === 'PROFESSIONAL_TAX')
      this.placeholder = 'EC / RC Number';
    else
      this.placeholder = 'Reference Number';

    this.isRecordExists = false;
    this.responseData = undefined;
    this.paymentsForm.get('amount').setValue(null);
    this.paymentsForm.get('refNumber').setValue(null);
    this.currPaySerData = _.filter(this.PayableServices, { 'code': paySerCode })[0];
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

    this.formService.apiType = 'searchPayment';

    let resData = {
      refNumber: refNumber,
      serviceType: serviceType
    }

    this.isRecordExists = false;
    this.isECRCSearch = false;

    this.paymentsForm.get('amount').setValue(null);

    if (serviceType === 'PROFESSIONAL_TAX') {

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
              }
            } else {
              if (this.responseData.prcPendingDemands && this.responseData.prcPendingDemands.length > 0) {
                _.forEach(this.responseData.prcPendingDemands, (element) => {
                  element.children = _.cloneDeep(element.children);
                });
                this.duesDetailsArr = _.cloneDeep(this.responseData.prcPendingDemands);
              }
            }
            this.paymentsForm.get('amount').setValue(this.responseData.dueAmount);
          } else {
            this.toaster.warning('No record found !');
          }

        }
      );

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

}
