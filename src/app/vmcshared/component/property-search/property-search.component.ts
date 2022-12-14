import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Constants } from 'src/app/vmcshared/Constants';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { PropertySearchSharingService } from './property-search-sharing.service';
import { PropertySearchService } from './property-search.service';
import { CommonService } from '../../Services/common-service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.scss']
})
export class PropertySearchComponent implements OnInit {

  searchModel: any = {};
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;

  displayedColumns: string[] = ['propertyNo', 'address', 'ownerNames', 'serialNo', 'select'];
  dataSource = new MatTableDataSource([]);
  selectedItem: any = null;
  isSearchByPropertyNo: boolean = false;
  isShowTable: boolean = false;
  @ViewChild(MatSort)
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageRecord = Constants.pageRecord;
  resultsLength: number = 0;

  constructor(
    private propertySearchSharingService: PropertySearchSharingService,
    private propertySearchService: PropertySearchService,
    private commonService:CommonService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
    this.paginator.pageSize=Constants.pageSize;
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
      this.serachOptions();
    } else {
      formDetails.form.get('level1Id').markAsTouched();
      formDetails.form.get('Level2Id').markAsTouched();
    }
  }

  searchByPropertyNo() {
    if (!this.propertyNo) {
      this.alertService.error("Please enter property no.");
    } else {
      this.searchModel = {};
      if (this.propertyNo) {
        this.searchModel.propertyNo = this.propertyNo.toString().trim();
      }
      this.isSearchByPropertyNo = true;
      this.searchPropertyList();
    }
  }
  clear() {
    this.propertyNo = null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = {};
    this.propertySearchSharingService.setPropertyModel(null);
    this.isShowTable = false;
  }

  onBack() {
    this.propertySearchSharingService.setIsOpenSearchForm(false);
  }

  serachOptions() {
    this.paginator.pageIndex = 0;
    this.searchModel.pageNo = null;
    this.searchModel.pageSize = null;
    this.searchPropertyList();
  }

  searchPropertyList() {
    merge(this.paginator.page)
      .pipe( startWith({}), switchMap(() => {

          if (this.searchModel.pageNo !== this.paginator.pageIndex || this.searchModel.pageSize !== this.paginator.pageSize){
            if (this.searchModel.pageSize === this.paginator.pageSize) {
              this.searchModel.pageNo = this.paginator.pageIndex;
            } else {
              this.searchModel.pageNo = 0;
              this.paginator.pageIndex = 0;
            }
            this.searchModel.pageSize = this.paginator.pageSize;
            return this.propertySearchService.searchPropertyDetailsInPage(this.searchModel);
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
          if (data.body.length === 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && data.length === 0)) {
              this.isShowTable = false;
            }
            this.resultsLength = 0;
          } else {
            this.isShowTable = true;
            this.dataSource = new MatTableDataSource(data.body.data);
            this.resultsLength = data.body.totalRecords;
            this.dataSource.sort = this.sort;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onSelect(item) {
    this.propertySearchSharingService.setPropertyModel(item);
    this.propertySearchSharingService.setIsOpenSearchForm(false);
  }

  onBackFromSearch() {
    this.propertySearchSharingService.setIsOpenSearchForm(false);
  }
}
