import { Component, OnInit, ViewChild } from '@angular/core';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, OutstandingDetailModel, OccupierOutstandingDetails, TaxRateWiseOutstandingDetails } from '../../Models/transfer-property.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


@Component({
  selector: 'app-transfer-property-table',
  templateUrl: './transfer-property-table.component.html',
  styleUrls: ['./transfer-property-table.component.scss']
})
export class TransferPropertyTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  isShowDetail = false;
  isSearchByPropertyNo: boolean = false;
  detailOutstandingButtonText = "Show Detail";
  isShowOutstandingDetail: boolean = false;
  outstandingDetailModel = new OutstandingDetailModel();

  @ViewChild(MatSort) sort: MatSort;
  totalCount: any = 0;
  constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.transferPropertyDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.transferPropertyDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.transferPropertyDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.transferPropertyDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
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
    this.transferPropertyService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.transferPropertyDataSharingService.updatedIsShowTable(false);
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
    this.isShowDetail = true;
    this.transferPropertyService.getOutsatndingDetail(this.selectedItem.propertyBasicId).subscribe(
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
          this.isShowDetail = false;
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


  onOutstandingDetailCLick() {
    this.isShowOutstandingDetail = !this.isShowOutstandingDetail;
    this.detailOutstandingButtonText = "Show Detail";
    if (this.isShowOutstandingDetail) {
      this.detailOutstandingButtonText = "Hide Detail";
    }
  }


  onEnterClick() {
    // if(!this.outstandingDetailModel.applicationNo) {
    //   return;
    // }
    if (this.outstandingDetailModel.outstandingAmount == 0) {
      this.selectedItem.outstandingAmount = this.outstandingDetailModel.outstandingAmount;
      this.selectedItem.applicationNo = this.outstandingDetailModel.applicationNo;
      this.transferPropertyDataSharingService.updatedPropertyDetailModel(null);
      this.transferPropertyDataSharingService.updatedIsRefreshTable(false);
      this.transferPropertyDataSharingService.updatedIsShowForm(true);
      this.transferPropertyDataSharingService.updatedDataModel(this.selectedItem);
    }
    else {
      //this.alertService.error('Outstanding amount should be zero');
      this.commonService.dueToOutstandingMessage(this.selectedItem.propertyNo)
    }
  }
}
