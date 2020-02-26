import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { SearchModel } from '../../Models/transfer-property.model';

@Component({
  selector: 'app-transfer-property-search',
  templateUrl: './transfer-property-search.component.html',
  styleUrls: ['./transfer-property-search.component.scss']
})
export class TransferPropertySearchComponent implements OnInit {

  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.transferPropertyService.getWardZoneLevel().subscribe(
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
    this.transferPropertyService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.transferPropertyService.getWardZone(postData).subscribe(
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
      this.searchModel.transferOfproperty = true;
      this.searchModel.propertyNo = null;
      this.transferPropertyDataSharingService.updatedIsSearchByPropertyNo(false);
      this.transferPropertyDataSharingService.updatedSearchModel(this.searchModel);
      this.transferPropertyDataSharingService.updatedIsShowForm(false);
      this.transferPropertyDataSharingService.updatedIsShowTable(true);
    }
  }

  searchByPropertyNo() {
    if (!this.propertyNo) {
      this.alertService.error('Please enter property no');
    }
    else {
      this.searchModel = new SearchModel();
      this.searchModel.transferOfproperty = true;
      if (this.propertyNo) {
        this.searchModel.propertyNo = this.propertyNo.toString().trim();
      }

      this.transferPropertyDataSharingService.updatedIsSearchByPropertyNo(true);
      this.transferPropertyDataSharingService.updatedSearchModel(this.searchModel);
      this.transferPropertyDataSharingService.updatedIsShowForm(false);
      this.transferPropertyDataSharingService.updatedIsShowTable(true);


    }
  }
  clear() {
    this.propertyNo = null;
    this.searchModel = new SearchModel();
    this.transferPropertyDataSharingService.updatedIsShowTable(false);
    this.transferPropertyDataSharingService.updatedIsClear(true);
  }
}
