import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { SearchModel } from '../../Models/tax-rebate-application.model';

@Component({
  selector: 'app-tax-rebate-application-search',
  templateUrl: './tax-rebate-application-search.component.html',
  styleUrls: ['./tax-rebate-application-search.component.scss']
})
export class TaxRebateApplicationSearchComponent implements OnInit {

  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.taxRebateApplicationService.getWardZoneLevel().subscribe(
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
    this.taxRebateApplicationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.taxRebateApplicationService.getWardZone(postData).subscribe(
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
      this.taxRebateApplicationDataSharingService.updatedIsSearchByPropertyNo(false);
      this.taxRebateApplicationDataSharingService.updatedSearchModel(this.searchModel);
      this.taxRebateApplicationDataSharingService.updatedIsShowForm(false);
      this.taxRebateApplicationDataSharingService.updatedIsShowTable(true);
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
        
        this.taxRebateApplicationDataSharingService.updatedIsSearchByPropertyNo(true);
        this.taxRebateApplicationDataSharingService.updatedSearchModel(this.searchModel);
        this.taxRebateApplicationDataSharingService.updatedIsShowForm(false);
        this.taxRebateApplicationDataSharingService.updatedIsShowTable(true);
        
        
    }
}
  clear() {
    this.propertyNo=null;
    this.searchModel = new SearchModel();
    this.taxRebateApplicationDataSharingService.updatedIsShowTable(false);
    this.taxRebateApplicationDataSharingService.updatedIsClear(true);
  }
}
