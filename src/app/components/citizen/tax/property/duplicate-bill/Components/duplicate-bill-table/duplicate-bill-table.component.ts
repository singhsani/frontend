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

  constructor(
    private duplicateBillDataSharingService: DuplicateBillDataSharingService,
    private duplicateBillService: DuplicateBillService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService: CommonService,
    private alertService: AlertService) {
  }

  ngOnInit() {
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
      if (this.serviceCharge.noofCopies > 0) {
        this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Duplicate_Bill);
        this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        this.duplicateBillDataSharingService.updatedIsShowForm(true);
      }
      else {
        this.alertService.error('No. of Copies should be greater than zero');
      }
    }
  }
}
