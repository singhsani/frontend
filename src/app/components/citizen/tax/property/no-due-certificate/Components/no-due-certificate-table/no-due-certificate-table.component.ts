import { Component, OnInit, ViewChild } from '@angular/core';
import { NoDueCertificateDataSharingService } from '../../Services/no-due-certificate-data-sharing.service';
import { NoDueCertificateService } from '../../Services/no-due-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge, OutstandingDetailModel, TaxRateWiseOutstandingDetails, OccupierOutstandingDetails } from '../../Models/no-due-certificate.model';
import { NgForm } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


@Component({
  selector: 'app-no-due-certificate-table',
  templateUrl: './no-due-certificate-table.component.html',
  styleUrls: ['./no-due-certificate-table.component.scss']
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
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private noDueCertificateDataSharingService: NoDueCertificateDataSharingService,
    private noDueCertificateService: NoDueCertificateService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService:CommonService,
    private alertService: AlertService) { }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.noDueCertificateService.search(this.searchModel).subscribe(
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
      });
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
          this.alertService.error(errorMessage);
        }
        else {
          this.alertService.error(error.error.message);
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
        this.serviceCharge.outstandingTax = this.outstandingDetailModel.outstandingAmount;
        this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.No_Due_Certificate);
        this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        this.noDueCertificateDataSharingService.updatedIsShowForm(true);
      } 
    }
  }
}
