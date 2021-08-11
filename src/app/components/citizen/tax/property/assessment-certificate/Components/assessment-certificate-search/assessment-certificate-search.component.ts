import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { AssessmentCertificateDataSharingService } from '../../Services/assessment-certificate-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { AssessmentCertificateService } from '../../Services/assessment-certificate.service';
import { SearchModel } from '../../Models/assessment-certificate.model';

@Component({
  selector: 'app-assessment-certificate-search',
  templateUrl: './assessment-certificate-search.component.html',
  styleUrls: ['./assessment-certificate-search.component.scss']
})
export class AssessmentCertificateSearchComponent implements OnInit {
  @ViewChild('formDetail') mytemplateForm : NgForm;
  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private assessmentCertificateDataSharingService: AssessmentCertificateDataSharingService,
    private assessmentCertificateService: AssessmentCertificateService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.assessmentCertificateService.getWardZoneLevel().subscribe(
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
    this.assessmentCertificateService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.assessmentCertificateService.getWardZone(postData).subscribe(
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
      this.assessmentCertificateDataSharingService.updatedIsSearchByPropertyNo(false);
      this.assessmentCertificateDataSharingService.updatedSearchModel(this.searchModel);
      this.assessmentCertificateDataSharingService.updatedIsShowForm(false);
      this.assessmentCertificateDataSharingService.updatedIsShowTable(true);
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

      this.assessmentCertificateDataSharingService.updatedIsSearchByPropertyNo(true);
      this.assessmentCertificateDataSharingService.updatedSearchModel(this.searchModel);
      this.assessmentCertificateDataSharingService.updatedIsShowForm(false);
      this.assessmentCertificateDataSharingService.updatedIsShowTable(true);


    }
  }
  clear() {
    this.mytemplateForm.reset();
    this.propertyNo = null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = new SearchModel();
    this.assessmentCertificateDataSharingService.updatedIsShowTable(false);
    this.assessmentCertificateDataSharingService.updatedIsClear(true);
  }
}
