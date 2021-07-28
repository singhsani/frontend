import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NoDueCertificateDataSharingService } from '../../Services/no-due-certificate-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { NoDueCertificateService } from '../../Services/no-due-certificate.service';
import { SearchModel } from '../../Models/no-due-certificate.model';

@Component({
  selector: 'app-no-due-certificate-search',
  templateUrl: './no-due-certificate-search.component.html',
  styleUrls: ['./no-due-certificate-search.component.scss']
})
export class NoDueCertificateSearchComponent implements OnInit {

  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private noDueCertificateDataSharingService: NoDueCertificateDataSharingService,
    private noDueCertificateService: NoDueCertificateService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.noDueCertificateService.getWardZoneLevel().subscribe(
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
    this.noDueCertificateService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.noDueCertificateService.getWardZone(postData).subscribe(
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
      this.noDueCertificateDataSharingService.updatedIsSearchByPropertyNo(false);
      this.noDueCertificateDataSharingService.updatedSearchModel(this.searchModel);
      this.noDueCertificateDataSharingService.updatedIsShowForm(false);
      this.noDueCertificateDataSharingService.updatedIsShowTable(true);
    } else {  
      formDetails.form.get('level1Id').markAsTouched();
      formDetails.form.get('Level2Id').markAsTouched();
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

      this.noDueCertificateDataSharingService.updatedIsSearchByPropertyNo(true);
      this.noDueCertificateDataSharingService.updatedSearchModel(this.searchModel);
      this.noDueCertificateDataSharingService.updatedIsShowForm(false);
      this.noDueCertificateDataSharingService.updatedIsShowTable(true);


    }
  }
  clear() {
    this.propertyNo = null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = new SearchModel();
    this.noDueCertificateDataSharingService.updatedIsShowTable(false);
    this.noDueCertificateDataSharingService.updatedIsClear(true);
  }
}
