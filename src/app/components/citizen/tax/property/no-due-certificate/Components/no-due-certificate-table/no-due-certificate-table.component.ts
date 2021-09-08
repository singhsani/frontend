import { Component, OnInit, ViewChild } from '@angular/core';
import { NoDueCertificateDataSharingService } from '../../Services/no-due-certificate-data-sharing.service';
import { NoDueCertificateService } from '../../Services/no-due-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge, OutstandingDetailModel, TaxRateWiseOutstandingDetails, OccupierOutstandingDetails } from '../../Models/no-due-certificate.model';
import { NgForm } from '@angular/forms';
import { MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';
import { SelectPaymentGatewayPropertyComponent } from 'src/app/vmcshared/component/select-payment-gateway-property/select-payment-gateway-property.component';
import { environment } from 'src/environments/environment';
import {CommonService as CommonNascentService} from '../../../../../../../shared/services/common.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-no-due-certificate-table',
  templateUrl: './no-due-certificate-table.component.html',
  styleUrls: ['./no-due-certificate-table.component.scss'],
  providers:[DatePipe]
})
export class NoDueCertificateTableComponent implements OnInit {

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
  outstandingDetailModel = new OutstandingDetailModel();
  isSearchByPropertyNo: boolean = false;
  totalCount: any = 0;
  modelFileDownload = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paymentGateway') public paymentGateway: SelectPaymentGatewayPropertyComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
	resultsLength: number = 0;	
  feesDetails = [];
  serviceFeesDetails: Array<any> = [];
  NumberOfCopies :number = 1;

  constructor(
    private noDueCertificateDataSharingService: NoDueCertificateDataSharingService,
    private noDueCertificateService: NoDueCertificateService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService:CommonService,
    private alertService: AlertService,
    private formService: FormsActionsService,
    private datePipe: DatePipe,
    private router: Router,
    private paymentService : PaymentNewService,
    private commonNascentService: CommonNascentService) { }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
    this.formService.apiType = 'noDueCertificate';
    this.outstandingDetailModel.occupierOutstandingDetails = new OccupierOutstandingDetails();
    this.outstandingDetailModel.occupierOutstandingDetails.taxRateWiseOutstandingDetails = new TaxRateWiseOutstandingDetails();
    this.noDueCertificateDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.noDueCertificateDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.noDueCertificateDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.noDueCertificateDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
        this.isShowPayMode = false;
        this.isShowDetail = false;
        this.isShowOutstandingDetail = false;
        this.search();
      }
    })

    this.modelFileDownload =  [
      {
        "fileType": "application/pdf",
        "displayName": "Payment Receipt",
        "fileName": "propertyApplicationPaymentReceipt",
        "fileUrl": "/property/applicationPaymentReciept?reporttype=noDueCertificate&receiptnumber=7&receiptId=15&applicationNo=1598613575113"
      },
      {
        "fileType": "application/pdf",
        "displayName": "Property No Due Certificate",
        "fileName": "noDueCertificate",
        "fileUrl": "/property/noduecertificate/printNodueCertificate?applicationNo=1598613575113"
      }
    ];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
   /* this.noDueCertificateService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.noDueCertificateDataSharingService.updatedIsShowTable(false);
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
          return this.noDueCertificateService.search(this.searchModel);
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
              this.noDueCertificateDataSharingService.updatedIsShowTable(false);
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
    this.noDueCertificateService.calculateFee({ propertyBasicId: this.selectedItem.propertyBasicId }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.serviceCharge = data.body.data;
          this.serviceCharge.noofCopies = 1;
          this.serviceCharge.totalAmountOriginal = this.serviceCharge.totalAmount;
          this.serviceCharge.occupierId = this.selectedItem.propertyOccupierId;
          this.serviceCharge.propertyBasicId = this.selectedItem.propertyBasicId;
          this.isShowPayMode = true;
          this.serviceFeesDetails = data.body.data.serviceChargeDetail;
          this.setOrUpdateFeesDetails(this.serviceFeesDetails,this.NumberOfCopies);

        }
        else {
          this.isShowPayMode = false;
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

    this.noDueCertificateService.getOutsatndingDetail(this.selectedItem.propertyBasicId).subscribe(
      (data) => {
        if (data.status === 200) {
          
          this.outstandingDetailModel = data.body;
          if (!this.outstandingDetailModel.occupierOutstandingDetails) {
            this.outstandingDetailModel.occupierOutstandingDetails = new OccupierOutstandingDetails();
          }
          if (!this.outstandingDetailModel.occupierOutstandingDetails.taxRateWiseOutstandingDetails) {
            this.outstandingDetailModel.occupierOutstandingDetails.taxRateWiseOutstandingDetails = new TaxRateWiseOutstandingDetails();
          }
        }
      },
      (error) => {
        if (error.status === 400) {
          this.isShowPayMode = false;
          var errorMessage = '';
          error.error[0].propertyList.forEach(element => {
            errorMessage = errorMessage + element + "</br>";
          });
          this.alertService.error(errorMessage);
        }
        else {
          this.alertService.error(error.error.message);
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
      if (this.outstandingDetailModel.outstandingAmount != 0) {
        this.commonService.dueToOutstandingMessage(this.selectedItem.propertyNo);
      } else if (this.serviceCharge.noofCopies < 1) {
        this.alertService.error('No. of Copies should be greater than zero.');
      } else {
        let formdata = formDetail.form.value;
        let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        //call save api befor submit
        console.log("selected item", this.selectedItem);
        
        this.formService.saveNoDueCertificate('saveNoDueCertificate',formdata.noofCopies,
         date, 
         this.outstandingDetailModel.occupierOutstandingDetails[0].occupierId,
         this.selectedItem.propertyBasicId,
         this.commonService.serviceFormId).subscribe(res=> {
          console.log('res in save is');
          console.log(res);
          let data = res;
          this.formService.submitFormData(res.data.serviceFormId).subscribe(res => {
            console.log('in res is:');
            console.log(res);
            if(this.paymentService.isGuestUser()){
              this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENDASHBOARD"));
            }else{
              this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
            }
          }, err => {
            let retUrl: string = '/citizen/my-applications';
            let retAfterPayment: string = environment.returnUrl;
            if (err.status === 402) {
              const errData = err.error.data;
              const resData = err.error.data;
              let payData = this.commonNascentService.storePaymentInfo(errData, retUrl, retAfterPayment);

              if (this.commonNascentService.fromAdmin()) {
                  if (resData.isPaymentReceipt) {
                  const url = '/citizen/my-applications' +
                    '?printPaymentReceipt=' + resData.isPaymentReceipt +
                    '&apiCode=' + resData.serviceCode +
                    '&id=' + resData.serviceFormId;

                  this.router.navigateByUrl(url);
                } else {
                  //  this.openOfflinePaymentComponent(payData,retUrl,data.serviceCode,data.serviceFormId);
                }
              } else {

                retUrl = retUrl + '?apiCode=' + errData.serviceCode + '&id=' + errData.serviceFormId;
                //let payData = this.commonNascentService.storePaymentInfo(errData, retUrl, retAfterPayment);
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
                this.commonNascentService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
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
  



        // this.serviceCharge.outstandingTax = this.outstandingDetailModel.outstandingAmount;
        // this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.No_Due_Certificate);
        // this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        // this.noDueCertificateDataSharingService.updatedIsShowForm(true);
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
