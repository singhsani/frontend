import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { DuplicateBillDataSharingService } from '../../Services/duplicate-bill-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { DuplicateBillService } from '../../Services/duplicate-bill.service';
import { SearchModel } from '../../Models/duplicate-bill.model';

@Component({
  selector: 'app-duplicate-bill-search',
  templateUrl: './duplicate-bill-search.component.html',
  styleUrls: ['./duplicate-bill-search.component.scss']
})
export class DuplicateBillSearchComponent implements OnInit {

  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private duplicateBillDataSharingService: DuplicateBillDataSharingService,
    private duplicateBillService: DuplicateBillService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.duplicateBillService.getWardZoneLevel().subscribe(
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
    if (value)
      this.getWardZone(value, level)
  }

  getWardZoneFirstLevel() {
    this.duplicateBillService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.duplicateBillService.getWardZone(postData).subscribe(
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
      this.duplicateBillDataSharingService.updatedIsSearchByPropertyNo(false);
      this.duplicateBillDataSharingService.updatedSearchModel(this.searchModel);
      this.duplicateBillDataSharingService.updatedIsShowForm(false);
      this.duplicateBillDataSharingService.updatedIsShowTable(true);
    }
  }

  searchByPropertyNo() {
    if (!this.propertyNo) {
      this.alertService.error('Please enter property no');
    }
    else {
      this.searchModel = new SearchModel();
      if (this.propertyNo) {
        this.searchModel.propertyNo = this.propertyNo.toString().trim();
      }

      this.duplicateBillDataSharingService.updatedIsSearchByPropertyNo(true);
      this.duplicateBillDataSharingService.updatedSearchModel(this.searchModel);
      this.duplicateBillDataSharingService.updatedIsShowForm(false);
      this.duplicateBillDataSharingService.updatedIsShowTable(true);


    }
  }
  clear() {
    this.propertyNo = null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = new SearchModel();
    this.duplicateBillDataSharingService.updatedIsShowTable(false);
    this.duplicateBillDataSharingService.updatedIsClear(true);
  }
}
