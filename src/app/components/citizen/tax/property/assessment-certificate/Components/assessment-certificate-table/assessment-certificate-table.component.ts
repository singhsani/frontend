import { Component, OnInit, ViewChild } from '@angular/core';
import { AssessmentCertificateDataSharingService } from '../../Services/assessment-certificate-data-sharing.service';
import { AssessmentCertificateService } from '../../Services/assessment-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge } from '../../Models/assessment-certificate.model';
import { NgForm } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { DatePipe } from '@angular/common';
import { SelectPaymentGatewayPropertyComponent } from 'src/app/vmcshared/component/select-payment-gateway-property/select-payment-gateway-property.component';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Router } from '@angular/router';
import {CommonService as CommonNascentService} from '../../../../../../../shared/services/common.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { environment } from 'src/environments/environment';
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';


@Component({
  selector: 'app-assessment-certificate-table',
  templateUrl: './assessment-certificate-table.component.html',
  styleUrls: ['./assessment-certificate-table.component.scss'],
  providers:[DatePipe]

})
export class AssessmentCertificateTableComponent implements OnInit {

  
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

  constructor(private assessmentCertificateDataSharingService: AssessmentCertificateDataSharingService,
    private assessmentCertificateService: AssessmentCertificateService,
    private paymentDataSharingService: PaymentDataSharingService,
    private alertService: AlertService,
    private commonService:CommonService,
    private formService: FormsActionsService,
    private datePipe: DatePipe,
    private router: Router,
    private commonNascentService: CommonNascentService,
    private paymentService : PaymentNewService
  ) { }

  ngOnInit() {
    this.formService.apiType = 'assessmentCertificate';
    this.assessmentCertificateDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.assessmentCertificateDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.assessmentCertificateDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.assessmentCertificateDataSharingService.observableIsShowTable.subscribe((data) => {
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
    this.assessmentCertificateService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.assessmentCertificateDataSharingService.updatedIsShowTable(false);
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
        this.commonService.callErrorResponse(error);
      });
  }

  onChangeSelect(event) {
    this.assessmentCertificateService.calculateFee({propertyBasicId: this.selectedItem.propertyBasicId , occupierId: this.selectedItem.propertyOccupierId }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.serviceCharge = data.body.data;
          this.serviceCharge.noofCopies = 1;
          this.serviceCharge.totalAmountOriginal = this.serviceCharge.totalAmount;
          this.serviceCharge.occupierId = this.selectedItem.propertyOccupierId;
          this.serviceCharge.propertyBasicId = this.selectedItem.propertyBasicId;
          this.isShowPayMode = true;
          this.getOutstandingDetails(this.selectedItem.propertyOccupierId);
        }
        else {
          this.isShowPayMode = false;
        }
      },
      (error) => {
      //  this.commonService.callErrorResponse(error);
          this.commonService.callInfoResponse(error);
      });
  }

  private getOutstandingDetails(propertyOccupierId:number) {
    this.assessmentCertificateService.getOutsatndingDetail(propertyOccupierId).subscribe(
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
        let formdata = formDetail.form.value;
        let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        //call save api befor submit
        console.log("selected item", this.selectedItem);
        
        this.formService.saveNoDueCertificate('saveAssessmentCertificate',formdata.noofCopies, date, this.serviceCharge.occupierId,this.selectedItem.propertyBasicId).subscribe(res=> {
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
              let payData = this.commonNascentService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);

              // if (this.commonNascentService.fromAdmin()) {
              if (resData.isPaymentReceipt) {
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
                //  let payData = this.commonNascentService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
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
        // this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Assessment_Certificate);
        // this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        // this.assessmentCertificateDataSharingService.updatedIsShowForm(true);
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
}
