import { Component, OnInit, ViewChild } from '@angular/core';
import { DuplicateBillDataSharingService } from '../../Services/duplicate-bill-data-sharing.service';
import { DuplicateBillService } from '../../Services/duplicate-bill.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge } from '../../Models/duplicate-bill.model';
import { NgForm } from '@angular/forms';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { CommonService as CommonServiceTwo} from 'src/app/shared/services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';
import { Router } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { environment } from 'src/environments/environment';
import { SelectPaymentGatewayPropertyComponent } from 'src/app/vmcshared/component/select-payment-gateway-property/select-payment-gateway-property.component';
import {CommonService as CommonNascentService} from '../../../../../../../shared/services/common.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
  resultsLength: number = 0;	
  feesDetails = [];
  serviceFeesDetails: Array<any> = [];
  NumberOfCopies :number = 1;
  checkForCurrentBill: boolean = false;
  
  constructor(
    private duplicateBillDataSharingService: DuplicateBillDataSharingService,
    private duplicateBillService: DuplicateBillService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService: CommonService,
    private alertService: AlertService,
    private cService: CommonServiceTwo,
    private formService: FormsActionsService,
    private paymentService : PaymentNewService,
    private router: Router,
    private commonNascentService: CommonNascentService) {
  }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
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
   /* this.duplicateBillService.search(this.searchModel).subscribe(
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
      });*/
      this.paginator.pageIndex=0;
      this.searchModel.pageNo=null;
	    this.searchModel.pageSize=null;
      this.searchList();
  }
  searchList() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if(this.searchModel.pageNo!=this.paginator.pageIndex || this.searchModel.pageSize!=this.paginator.pageSize){
            if(this.searchModel.pageSize==this.paginator.pageSize){
              this.searchModel.pageNo=this.paginator.pageIndex;
            }else{
              this.searchModel.pageNo=0;
              this.paginator.pageIndex=0;
            }
          this.searchModel.pageSize=this.paginator.pageSize;
          return this.duplicateBillService.search(this.searchModel);
          }
        }),
        map(data => {				
          return data;
        }),
        catchError(() => {
          return of([]);
        })
      ).subscribe((data) => {
        if (data.status === 200) {
          if (data.body.data.length == 0) {
            this.alertService.info('No Data Found!');
            this.duplicateBillDataSharingService.updatedIsShowTable(false);
            this.dataSource = [];
            this.resultsLength=0;
          } else {
            this.dataSource = new MatTableDataSource(data.body.data);    
            this.dataSource.sort = this.sort;               
            this.totalCount = data.body.totalRecords;
            this.resultsLength= data.body.totalRecords;
          }
        }               
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
      );
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
          this.serviceFeesDetails = data.body.data.serviceChargeDetail;
          this.setOrUpdateFeesDetails(this.serviceFeesDetails,this.NumberOfCopies);
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
    this.NumberOfCopies = event.target.value;
    this.setOrUpdateFeesDetails(this.serviceFeesDetails,this.NumberOfCopies);
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
        // this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Duplicate_Bill);
        // this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        // if(this.cService.fromAdmin()){
        //   this.duplicateBillDataSharingService.updatedIsShowForm(true);
        // }else{
          var data = {
            occupierId: this.serviceCharge.occupierId, 
            propertyBasicId: this.serviceCharge.propertyBasicId,  
            numberOfCopies: this.serviceCharge.noofCopies,
            billTypeLookupId: this.serviceCharge.billTypeLookupId,
            propertyServiceApplicationId: this.commonService.serviceFormId,
            checkForCurrentBill : this.checkForCurrentBill
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
                const resData = err.error.data;
                let payData = this.cService.storePaymentInfo(errData, retUrl, retAfterPayment);
                
                 if (this.commonNascentService.fromAdmin()) {
                if (resData.isPaymentReceipt) {

                  this.alertService.propertyConfirm(resData.refNumber);
                  var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
                    if (isConfirm) {

                  const url = '/citizen/my-applications' +
                    '?printPaymentReceipt=' + resData.isPaymentReceipt +
                    '&apiCode=' + resData.serviceCode +
                    '&id=' + resData.serviceFormId;

                  this.router.navigateByUrl(url);

                } else {
                  this.router.navigateByUrl('/citizen/my-applications');
                } 
                  subConfirm.unsubscribe();
              });


                } else {
                  //  this.openOfflinePaymentComponent(payData,retUrl,data.serviceCode,data.serviceFormId);
                }
              }else{
                retUrl = retUrl + '?apiCode='+ errData.serviceCode +'?id='+ errData.serviceFormId;
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
                }

              } else {
                this.cService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning");
              }
            });
          }, error => {
            if (error.status == 403) {
              this.cService.commonAlert('Warning', 'Property Bill of Current Year will not be generated. Do you want to generate Previous Bill?', 'info', 'Yes', true, '', cb => {
                this.checkForCurrentBill = true;
                this.onEnterClick(formDetail);
              })

            } else {
              this.cService.openAlert("Warning", "Property Bill does not Exists.", "warning");
            }
          }
          )
        // }; // from Admin else
      } // no of copies
      else {
        this.alertService.error('No. of Copies should be greater than zero');
      }
    }
  }

  setOrUpdateFeesDetails(serviceFeesDetails,NumberOfCopies){
    this.feesDetails = [];
    serviceFeesDetails.forEach((value) => {
    let chargeName = value.chargeName;
    let chargeAmount = value.chargeAmount *NumberOfCopies;
    let obj = {'chargeName' : chargeName,'chargeAmount':chargeAmount}
    this.feesDetails.push(obj);
  });
}
}
