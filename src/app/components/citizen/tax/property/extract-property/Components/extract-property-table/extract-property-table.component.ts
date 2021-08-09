import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ExtractPropertyDataSharingService } from '../../Services/extract-property-data-sharing.service';
import { ExtractPropertyService } from '../../Services/extract-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge, TaxRateWiseOutstandingDetails } from '../../Models/extract-property.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort,MatPaginator } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import {CommonService as CommonNascentService} from '../../../../../../../shared/services/common.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SelectPaymentGatewayPropertyComponent } from 'src/app/vmcshared/component/select-payment-gateway-property/select-payment-gateway-property.component';
import { DatePipe } from '@angular/common';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Console } from 'console';
import * as moment from 'moment';

@Component({
  selector: 'app-extract-property-table',
  templateUrl: './extract-property-table.component.html',
  styleUrls: ['./extract-property-table.component.scss'],
  providers:[DatePipe]
})
export class ExtractPropertyTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  serviceCharge = new ServiceCharge();
  isShowPayMode = false;
  isShowDetail = false;
  detailButtonText = "Show Detail";
  isSearchByPropertyNo: boolean = false;
  totalCount: any = 0;
  @ViewChild(MatSort) sort: MatSort;
  detailOutstandingButtonText = "Show Detail";
  isShowOutstandingDetail: boolean = false;
  @ViewChild('paymentGateway') public paymentGateway: SelectPaymentGatewayPropertyComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
	resultsLength: number = 0;	
  feesDetails = [];
  serviceFeesDetails: Array<any> = [];
  NumberOfCopies :number = 1;
  endMaxDate = moment(new Date()).toDate();

  constructor(private extractPropertyDataSharingService: ExtractPropertyDataSharingService,
    private extractPropertyService: ExtractPropertyService,
    private paymentDataSharingService: PaymentDataSharingService,
    private alertService: AlertService,
    private commonService:CommonService,
    private formService: FormsActionsService,
    private commonNascentService: CommonNascentService,
    private router: Router,
    private datePipe: DatePipe
    ) { }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
    this.formService.apiType = 'extractOfProperty';
    this.extractPropertyDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.extractPropertyDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.extractPropertyDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.extractPropertyDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
        this.isShowPayMode = false;
        this.isShowDetail = false;
        this.search();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
   /* this.extractPropertyService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.extractPropertyDataSharingService.updatedIsShowTable(false);
            }
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
      this.searchList();
  }
  searchList() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
        if(this.searchModel.pageNo!=this.paginator.pageIndex || this.searchModel.pageSize!=this.paginator.pageSize){
          this.searchModel.pageNo=this.paginator.pageIndex;
          this.searchModel.pageSize=this.paginator.pageSize;
          return this.extractPropertyService.search(this.searchModel);
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
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.extractPropertyDataSharingService.updatedIsShowTable(false);
            }
            this.resultsLength=0;
          } else {
            this.dataSource = new MatTableDataSource(data.body.data);                   
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
    this.extractPropertyService.calculateFee({ occupierId: this.selectedItem.propertyOccupierId }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.serviceCharge = data.body.data;
          this.serviceCharge.noofCopies = 1;
          this.serviceCharge.totalAmountOriginal = this.serviceCharge.totalAmount;
          this.serviceCharge.occupierId = this.selectedItem.propertyOccupierId;
          this.serviceCharge.asonDate = new Date();
          this.isShowPayMode = true;
          this.getOutstandingDetails(this.selectedItem.propertyOccupierId);
          this.serviceFeesDetails = data.body.data.serviceChargeDetail; 
          this.setOrUpdateFeesDetails(this.serviceFeesDetails,this.NumberOfCopies);
        }
        else {
          this.isShowPayMode = false;
        }
      },
      (error) => {
        //this.commonService.callErrorResponse(error);
        this.commonService.callInfoResponse(error);
        this.serviceCharge = new ServiceCharge();
      });
  }

  private getOutstandingDetails(propertyOccupierId:number) {
    this.extractPropertyService.getOutsatndingDetail(propertyOccupierId).subscribe(
      (data) => {
        if (data.status === 200) {
          if(data.body) {
            this.serviceCharge.outstandingAmount = data.body.outstandingAmount;
            this.serviceCharge.taxRateWiseOutstandingDetails = data.body.taxRateWiseOutstandingDetails;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
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
  onEnterClick(formDetail: NgForm) {
    if (formDetail.form.valid) {
      if (this.serviceCharge.outstandingAmount > 0) {
        this.commonService.dueToOutstandingMessage(this.selectedItem.propertyNo);
      } else if (this.serviceCharge.noofCopies > 0) {
        // this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Extract_Property);
        // this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        // this.extractPropertyDataSharingService.updatedIsShowForm(true);
        let formdata = formDetail.form.value;
        let date = this.datePipe.transform(formdata.asonDate, 'yyyy-MM-dd')
        //call save api befor submit
        this.formService.saveCustomCallApi('saveExtractOfProperty',
        formdata.noofCopies, date, this.serviceCharge.occupierId,
        this.commonService.serviceFormId).subscribe(res=> {
          console.log('res in save is');
          console.log(res);
          let data = res;
          this.formService.submitFormData(res.data.serviceFormId).subscribe(res => {
            console.log('in res is:');
            console.log(res);
            if(this.commonNascentService.isGuestUser()){
              this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENDASHBOARD"));
            }else{
              this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
            }
          }, err => {
            let retUrl: string = '/citizen/my-applications';
            let retAfterPayment: string = environment.returnUrl;
            if (err.status === 402) {
              const resData = err.error.data;
              let payData = this.commonNascentService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
              
                if (this.commonNascentService.fromAdmin()) {
							 	if(resData.isPaymentReceipt) {
									const url = '/citizen/my-applications' + 
									'?printPaymentReceipt=' + resData.isPaymentReceipt + 
									'&apiCode=' + resData.serviceCode +
									'&id=' + resData.serviceFormId;

									this.router.navigateByUrl(url);
								} else {		
                //  this.openOfflinePaymentComponent(payData,retUrl,data.serviceCode,data.serviceFormId);
                }
							 }else{

              const errData = err.error.data;
              retUrl = retUrl + '?apiCode='+ errData.serviceCode + '&id=' + errData.serviceFormId;
              // let payData = this.commonNascentService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
              let words = this.commonService.getToWords(payData.amount);
              let html =
            
                `
              <div class="text-center">
                <h2>Total Fee Pay</h2>
                <div class="payAmount">
                  <i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
                </div>
                <p>Amount in words</p>
                <p style="font-weight: bold;">` + words + ` Rupees Only</p>
              </div>
              `
                this.commonNascentService.commonAlert('Payment Details', '', 'info', 'Make Payment', false, html, cb => {
                  this.paymentGateway.setPaymentDetailsFromActionBar(payData);
                  this.paymentGateway.openModel();
                }, rj => {
                  return;
                });

              }
            } else {
              this.commonNascentService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
            }
          });
        }, error => {
          this.alertService.error(error);
        });
      } else {
        this.alertService.error('No. of Copies should be greater than zero.');
      }
    }
  }

  onOutstandingDetailCLick() {
    this.isShowOutstandingDetail = !this.isShowOutstandingDetail;
    this.detailOutstandingButtonText = "Show Detail";
    if (this.isShowOutstandingDetail) {
      this.detailOutstandingButtonText = "Hide Detail";
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
