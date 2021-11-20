import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PropertyOccupierSearchSharingService } from './property-occupier-search-sharing.service';
import { PropertySearchService } from '../property-search/property-search.service';
import { AlertService } from '../../Services/alert.service';
import { Constants } from '../../Constants';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../Services/common-service';
import { merge, of, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-property-occupier-search',
  templateUrl: './property-occupier-search.component.html',
  styleUrls: ['./property-occupier-search.component.scss']
})
export class PropertyOccupierSearchComponent implements OnInit {

  @Output() showPayable = new EventEmitter();

  searchModel: any = {};
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;

  displayedColumns: string[] = ['propertyNo', 'propertyAddress', 'ownerNames', 'occupierName', 'select'];
  dataSource: any = [];
  selectedItem: any = null;
  isSearchByPropertyNo: boolean = false;
  isShowTable: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  //variables for paginator 
  @ViewChild(MatPaginator) paginator:MatPaginator;
  resultsLength: number = 0;
  pageRecord = Constants.pageRecord;
  pageSize:number = 5;
  pageNo:number = 0;
  totalCount: any = 0;

  constructor(
    private propertyOccupierSearchSharingService: PropertyOccupierSearchSharingService,
    private propertySearchService: PropertySearchService,
    private commonService:CommonService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }

  getWardZoneLevel() {
    this.propertySearchService.getWardZoneLevel().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel = data.body;
          this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
          this.getWardZoneFirstLevel();
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  onChangedWardZone(value, level) {
    if (level == 2) {
      this.wardZoneLevel2List = [];
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.searchModel.level2Id = null;
      this.searchModel.level3Id = null;
      this.searchModel.level4Id = null;
    }
    else if (level == 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.searchModel.level3Id = null;
      this.searchModel.level4Id = null;
    }
    else if (level == 4) {
      this.wardZoneLevel4List = [];
      this.searchModel.level4Id = null;
    }
    this.getWardZone(value, level)
  }

  getWardZoneFirstLevel() {
    this.propertySearchService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getWardZone(parentId, level) {
    var postData = {};
    postData = { parentId: parentId };
    this.propertySearchService.getWardZone(postData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          if (level == 2) {
            this.wardZoneLevel2List = data.body;
          }
          else if (level == 3) {
            this.wardZoneLevel3List = data.body;
          }
          else if (level == 4) {
            this.wardZoneLevel4List = data.body;
          }
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  search(formDetails: NgForm) {
    this.propertyNo = null;
    if (formDetails.form.valid) {
      this.searchModel.propertyNo = null;
      this.isSearchByPropertyNo = false;
      this.paginationActivity()
    }
  }

  searchByPropertyNo() {
    if (!this.propertyNo) {
      this.alertService.error("Please enter property no.");
    }
    else {
      this.searchModel = {};
      if (this.propertyNo) {
        this.searchModel.propertyNo = this.propertyNo.toString().trim();
      }
      this.isSearchByPropertyNo = true;
      this.paginationActivity()
    }
  }
  clear() {
    this.propertyNo = null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = {};
    this.propertyOccupierSearchSharingService.setPropertyModel(null);
    this.isShowTable=false;
  }

  onBack() {
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
  }

  onSelect(item) {
    this.propertyOccupierSearchSharingService.setPropertyModel(item);
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
    this.showPayable.emit(true);
  }

  onBackFromSearch() {
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
    this.showPayable.emit(true);
  }

  paginationActivity(){
    this.paginator.pageIndex = 0;
    this.pageNo = null;
    this.pageSize = null;
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
        if(this.pageNo !== this.paginator.pageIndex || this.pageSize !== this.paginator.pageSize){
          if (this.pageSize === this.paginator.pageSize) {
            this.pageNo = this.paginator.pageIndex;
          } else {
            this.pageNo = 0;
            this.paginator.pageIndex = 0;
          }
          this.pageSize = this.paginator.pageSize;
          return this.propertySearchService.searchPropertyByPage({model:this.searchModel,pageNo:this.pageNo,pageSize:this.pageSize});
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
          if (data.body.data.length === 0) {
            this.isShowTable=false;
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length === 0)) {
              this.isShowTable=false;
            }
            this.resultsLength = 0;
          } else {
            this.isShowTable = true;
            this.dataSource = new MatTableDataSource(data.body.data);
            this.dataSource.sort = this.sort;
            this.totalCount = data.body.totalRecords;
            this.resultsLength = data.body.totalRecords;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

}