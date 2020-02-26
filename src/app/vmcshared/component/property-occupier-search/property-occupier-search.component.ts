import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PropertyOccupierSearchSharingService } from './property-occupier-search-sharing.service';
import { PropertySearchService } from '../property-search/property-search.service';
import { AlertService } from '../../Services/alert.service';
import { Constants } from '../../Constants';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../Services/common-service';

@Component({
  selector: 'app-property-occupier-search',
  templateUrl: './property-occupier-search.component.html',
  styleUrls: ['./property-occupier-search.component.scss']
})
export class PropertyOccupierSearchComponent implements OnInit {

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
      this.searchsearchProperty();
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
      this.searchsearchProperty();
    }
  }
  clear() {
    this.propertyNo = null;
    this.searchModel = {};
    this.propertyOccupierSearchSharingService.setPropertyModel(null);
    this.isShowTable=false;
  }

  onBack() {
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
  }


  searchsearchProperty() {
    this.propertySearchService.searchProperty(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.isShowTable=false;
            }
          }
          else {
            this.isShowTable=true;
            this.dataSource = new MatTableDataSource(data.body);
            this.dataSource.sort = this.sort;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onSelect(item) {
    this.propertyOccupierSearchSharingService.setPropertyModel(item);
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
  }

  onBackFromSearch() {
    this.propertyOccupierSearchSharingService.setIsOpenSearchForm(false);
  }

}
