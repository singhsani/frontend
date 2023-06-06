import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { Subscription } from 'rxjs';
import { SearchModel, DataModel } from '../../Models/tax-rebate-application.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort,MatPaginator } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
	resultsLength: number = 0;	
  constructor(private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
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
   /* this.taxRebateApplicationService.search(this.searchModel).subscribe(
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
          return this.taxRebateApplicationService.search(this.searchModel);
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
              this.taxRebateApplicationDataSharingService.updatedIsShowTable(false);
            }
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
    this.isShowPayMode = true;
  }

  onEnterClick() {
    if(this.selectedItem.isTented || !this.selectedItem.isResidential || this.selectedItem.billDueDate == ''){
      let msg = '';
      if(this.selectedItem.isTented){
        msg = 'You are not eligible for applying this service as you are Tenant.';
      }else if(!this.selectedItem.isResidential){
        msg = 'You are not eligible for applying this service as your property is not Residential.';
      }else{
        msg = 'You are not eligible for applying this service as your current year bill is not generated.';
      }
      this.alertService.info(msg);
      return;
    }
    this.taxRebateApplicationService.getOutsatndingDetails(this.selectedItem.propertyBasicId,this.selectedItem.propertyOccupierId).subscribe(
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
