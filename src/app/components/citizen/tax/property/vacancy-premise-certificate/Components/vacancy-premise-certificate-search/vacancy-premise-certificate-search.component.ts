import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { VacancyPremiseCertificateService } from '../../Services/vacancy-premise-certificate.service';
import { SearchModel } from '../../Models/vacancy-premise-certificate.model';

@Component({
  selector: 'app-vacancy-premise-certificate-search',
  templateUrl: './vacancy-premise-certificate-search.component.html',
  styleUrls: ['./vacancy-premise-certificate-search.component.scss']
})
export class VacancyPremiseCertificateSearchComponent implements OnInit {
  
  @ViewChild('formDetail') mytemplateForm : NgForm;
  searchModel = new SearchModel();
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyNo: string;
  constructor(
    private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService,
    private vacancyPremiseCertificateService: VacancyPremiseCertificateService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWardZoneLevel();
  }
  getWardZoneLevel() {
    this.vacancyPremiseCertificateService.getWardZoneLevel().subscribe(
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
    this.vacancyPremiseCertificateService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
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
    this.vacancyPremiseCertificateService.getWardZone(postData).subscribe(
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
      this.vacancyPremiseCertificateDataSharingService.updatedIsSearchByPropertyNo(false);
      this.vacancyPremiseCertificateDataSharingService.updatedSearchModel(this.searchModel);
      this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(false);
      this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(true);
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
        
        this.vacancyPremiseCertificateDataSharingService.updatedIsSearchByPropertyNo(true);
        this.vacancyPremiseCertificateDataSharingService.updatedSearchModel(this.searchModel);
        this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(false);
        this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(true);
        
        
    }
}
  clear() {
    this.mytemplateForm.reset();
    this.propertyNo=null;
    this.wardZoneLevel2List = [];
    this.wardZoneLevel3List = [];
    this.wardZoneLevel4List = [];
    this.searchModel = new SearchModel();
    this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(false);
    this.vacancyPremiseCertificateDataSharingService.updatedIsClear(true);
  }
}
