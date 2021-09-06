import { Component, OnInit, ViewChild } from '@angular/core';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, OutstandingDetailModel, OccupierOutstandingDetails, TaxRateWiseOutstandingDetails } from '../../Models/transfer-property.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort,MatPaginator } from '@angular/material';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
  resultsLength: number = 0;	
  
  constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
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
    /*this.transferPropertyService.search(this.searchModel).subscribe(
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
          return this.transferPropertyService.search(this.searchModel);
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
              this.transferPropertyDataSharingService.updatedIsShowTable(false);
            }
            this.resultsLength=0;
          } else {
            this.dataSource = new MatTableDataSource(data.body.data); 
            this.totalCount = data.body.data.length;
            this.resultsLength = data.body.data.length
                        // this.totalCount = data.body.totalRecords;
            // this.resultsLength= data.body.totalRecords;
          }    
        }          
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
      );
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
