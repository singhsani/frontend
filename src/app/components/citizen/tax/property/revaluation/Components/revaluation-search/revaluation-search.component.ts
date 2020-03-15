import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { RevaluationService } from '../../Services/revaluation.service';
import { SearchModel } from '../../Models/revaluation.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-revaluation-search',
  templateUrl: './revaluation-search.component.html',
  styleUrls: ['./revaluation-search.component.scss']
})
export class RevaluationSearchComponent implements OnInit {

  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.revaluationService.getWardZoneLevel().subscribe(
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
    this.revaluationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.revaluationService.getWardZone(postData).subscribe(
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
      this.revaluationDataSharingService.updatedIsSearchByPropertyNo(false);
      this.revaluationDataSharingService.updatedSearchModel(this.searchModel);
      this.revaluationDataSharingService.updatedIsShowForm(false);
      this.revaluationDataSharingService.updatedIsShowTable(true);
    }
  }

  searchByPropertyNo() {
    if (!this.propertyNo) {
      this.alertService.error('Please enter property number.');
    }
    else {
      this.searchModel = new SearchModel();
      if (this.propertyNo) {
        this.searchModel.propertyNo = this.propertyNo.toString().trim();
      }

      this.revaluationDataSharingService.updatedIsSearchByPropertyNo(true);
      this.revaluationDataSharingService.updatedSearchModel(this.searchModel);
      this.revaluationDataSharingService.updatedIsShowForm(false);
      this.revaluationDataSharingService.updatedIsShowTable(true);


    }
  }
  clear() {
    this.propertyNo = null;
    this.searchModel = new SearchModel();
    this.revaluationDataSharingService.updatedIsShowTable(false);
    this.revaluationDataSharingService.updatedIsClear(true);
  }
}
