import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { Subscription } from 'rxjs';
import { SearchModel, DataModel } from '../../Models/tax-rebate-application.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';


@Component({
  selector: 'app-tax-rebate-application-table',
  templateUrl: './tax-rebate-application-table.component.html',
  styleUrls: ['./tax-rebate-application-table.component.scss']
})
export class TaxRebateApplicationTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  dataMoodel = new DataModel();
  isShowPayMode = false;
  isShowDetail = false;
  detailButtonText = "Show Detail";
  isSearchByPropertyNo: boolean = false;
  totalCount: any = 0;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.taxRebateApplicationDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.taxRebateApplicationDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.taxRebateApplicationDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.taxRebateApplicationDataSharingService.observableIsShowTable.subscribe((data) => {
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
    this.taxRebateApplicationService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.taxRebateApplicationDataSharingService.updatedIsShowTable(false);
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
    this.isShowPayMode = true;
  }

  onEnterClick() {


    this.taxRebateApplicationService.getOutsatndingDetails(this.selectedItem.propertyBasicId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataMoodel.propertyOccupierId = this.selectedItem.propertyOccupierId;
          this.dataMoodel.propertyBasicId = this.selectedItem.propertyBasicId;
          this.dataMoodel.totalOutstanding = data.body.outstandingAmount;
          this.taxRebateApplicationDataSharingService.updatedDataModel(this.dataMoodel);
          this.taxRebateApplicationDataSharingService.updatedIsShowForm(true);
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }
}
