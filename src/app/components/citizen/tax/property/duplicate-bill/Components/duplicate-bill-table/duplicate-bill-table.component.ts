import { Component, OnInit, ViewChild } from '@angular/core';
import { DuplicateBillDataSharingService } from '../../Services/duplicate-bill-data-sharing.service';
import { DuplicateBillService } from '../../Services/duplicate-bill.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge } from '../../Models/duplicate-bill.model';
import { NgForm } from '@angular/forms';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { CommonService as CommonServiceTwo} from 'src/app/shared/services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';
import { Router } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { environment } from 'src/environments/environment';
import { SelectPaymentGatewayPropertyComponent } from 'src/app/vmcshared/component/select-payment-gateway-property/select-payment-gateway-property.component';


@Component({
  selector: 'app-duplicate-bill-table',
  templateUrl: './duplicate-bill-table.component.html',
  styleUrls: ['./duplicate-bill-table.component.scss']
})
export class DuplicateBillTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  serviceCharge = new ServiceCharge();
  isShowPayMode = false;
  isShowDetail = false;
  detailButtonText = "Show Detail";
  detailOutstandingButtonText = "Show Detail";
  isShowOutstandingDetail: boolean = false;
  isSearchByPropertyNo: boolean = false;
  billTypeList = [];
  @ViewChild(MatSort) sort: MatSort;
  totalCount: any = 0;
  @ViewChild('paymentGateway') public paymentGateway: SelectPaymentGatewayPropertyComponent;

  constructor(
    private duplicateBillDataSharingService: DuplicateBillDataSharingService,
    private duplicateBillService: DuplicateBillService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService: CommonService,
    private alertService: AlertService,
    private cService: CommonServiceTwo,
    private formService: FormsActionsService,
    private paymentService : PaymentNewService,
    private router: Router) {
  }

  ngOnInit() {
    this.formService.apiType = 'duplicateBill';
    this.getLookups();
    this.duplicateBillDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.duplicateBillDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.duplicateBillDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.duplicateBillDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
        this.isShowPayMode = false;
        this.isShowDetail = false;
        this.isShowOutstandingDetail = false;
        this.selectedItem=null;
        this.search();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Property_Bill_Type}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.billTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Property_Bill_Type))[0].items;
    });
  }

  search() {
    this.duplicateBillService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            this.duplicateBillDataSharingService.updatedIsShowTable(false);
            this.dataSource = [];
          }
          else {
            this.dataSource = new MatTableDataSource(data.body);
            this.dataSource.sort = this.sort;
            this.totalCount = this.dataSource.data.length;
          }
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  onChangeSelect(event) {
    this.serviceCharge.billTypeLookupId = null;
    this.isShowPayMode = true;
    this.serviceCharge.noofCopies = 1;
    this.serviceCharge.totalAmount = 0;

  }

  onChangeBillType(event) {
    if(!event) {
      return ;
    }
    this.duplicateBillService.calculateFee({ occupierId: this.selectedItem.propertyOccupierId, billTypeLookupId: event, propertyBasicId: this.selectedItem.propertyBasicId }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.serviceCharge = data.body.data;
          this.serviceCharge.noofCopies = 1;
          this.serviceCharge.totalAmountOriginal = this.serviceCharge.totalAmount;
          this.serviceCharge.occupierId = this.selectedItem.propertyOccupierId;
          this.serviceCharge.propertyBasicId = this.selectedItem.propertyBasicId;
          this.serviceCharge.billTypeLookupId = event;
        }
      },
      (error) => {
        if (error.status === 400) {
          this.isShowPayMode = false;
          var errorMessage = '';
          error.error[0].propertyList.forEach(element => {
            errorMessage = errorMessage + element + "</br>";
          });
          this.alertService.info(errorMessage);
        }
        else {
          this.alertService.info(error.error.message);
        }
      });

  }

  onBlurNoofCopies(event) {
    this.serviceCharge.totalAmount = this.serviceCharge.totalAmountOriginal * event.target.value;
  }

  onDetailCLick() {
    this.isShowDetail = !this.isShowDetail;
    this.detailButtonText = "Show Detail";
    if (this.isShowDetail) {
      this.detailButtonText = "Hide Detail";
    }
  }

  onOutstandingDetailCLick() {
    this.isShowOutstandingDetail = !this.isShowOutstandingDetail;
    this.detailOutstandingButtonText = "Show Detail";
    if (this.isShowOutstandingDetail) {
      this.detailOutstandingButtonText = "Hide Detail";
    }
  }

  onEnterClick(formDetail: NgForm) {
    if (formDetail.form.valid) {
      if (this.serviceCharge.noofCopies > 0) {
        this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Duplicate_Bill);
        this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        if(this.cService.fromAdmin()){
          this.duplicateBillDataSharingService.updatedIsShowForm(true);
        }else{
          var data = {
            occupierId: this.serviceCharge.occupierId, 
            propertyBasicId: this.serviceCharge.propertyBasicId,  
            noofCopies: this.serviceCharge.noofCopies
          }
          this.formService.saveDuplicateBill('saveDuplicate', data).subscribe
          (res=> {
            console.log(data);
            this.formService.submitFormData(res.serviceFormId).subscribe(res => {
              if(this.paymentService.isGuestUser()){
                this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENDASHBOARD"));
              }else{
                this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
              }
            }, err => {
              let retUrl: string = '/citizen/my-applications';
              let retAfterPayment: string = environment.returnUrl;
              if(err.status === 402){
                const errData = err.error.data;
                retUrl = retUrl + '?apiCode='+ errData.serviceCode +'?id='+ errData.serviceFormId;
                let payData = this.cService.storePaymentInfo(errData, retUrl, retAfterPayment);
                let words = this.commonService.getToWords(payData.amount);
                let html = 
                `
                <div class="text-center">
                <h2>Total Fee Pay</h2>
                <div class="payAmount">
                  <i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
                </div>
                <p>Rupees in words</p>` + words + ` Rupees Only
              </div>
                `

                this.cService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
                  this.paymentGateway.setPaymentDetailsFromActionBar(payData);
                  this.paymentGateway.openModel();
                }, rj => {
                  return;
                });
              } else{
                this.cService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning");
              }
            });
          }, error => {
            this.alertService.error(error);
          }
        )};
      }
      else {
        this.alertService.error('No. of Copies should be greater than zero');
      }
    }
  }
}
