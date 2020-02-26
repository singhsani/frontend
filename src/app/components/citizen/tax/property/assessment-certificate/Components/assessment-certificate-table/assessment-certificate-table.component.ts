import { Component, OnInit, ViewChild } from '@angular/core';
import { AssessmentCertificateDataSharingService } from '../../Services/assessment-certificate-data-sharing.service';
import { AssessmentCertificateService } from '../../Services/assessment-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge } from '../../Models/assessment-certificate.model';
import { NgForm } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


@Component({
  selector: 'app-assessment-certificate-table',
  templateUrl: './assessment-certificate-table.component.html',
  styleUrls: ['./assessment-certificate-table.component.scss']
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

  constructor(private assessmentCertificateDataSharingService: AssessmentCertificateDataSharingService,
    private assessmentCertificateService: AssessmentCertificateService,
    private paymentDataSharingService: PaymentDataSharingService,
    private alertService: AlertService,
    private commonService:CommonService) { }

  ngOnInit() {
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
       this.commonService.callErrorResponse(error);
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
        this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Assessment_Certificate);
        this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        this.assessmentCertificateDataSharingService.updatedIsShowForm(true);
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
