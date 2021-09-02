import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Constants } from 'src/app/vmcshared/Constants';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { BillPrintingModel, PropertyGenerateBill } from '../../models/bill-printing.model';
import { BillprintingdatasharingserviceService } from '../../services/billprintingdatasharingservice.service';
import { BillprintingserviceService } from '../../services/billprintingservice.service';

@Component({
  selector: 'app-bill-printing-form',
  templateUrl: './bill-printing-form.component.html',
  styleUrls: ['./bill-printing-form.component.scss']
})
export class BillPrintingFormComponent implements OnInit {

  usageList = [];
  subUsageList = [];
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  propertyTypeList = [];
  propertySubTypeList = [];
  financialYear = [];
  model = new BillPrintingModel();
  isSubmitted = false;

  constructor(private billPrintingDataSharingService: BillprintingdatasharingserviceService,
    private billPrintingService: BillprintingserviceService,
    private alertService: AlertService) {
    this.model.propertyGenerateBill = new PropertyGenerateBill();
  }

  ngOnInit() {
    this.getUsageList();
    this.getWardZoneLevel();
    this.getPropertyTypeList();
    this.getFinancialYear();
  }


  getFinancialYear() {
    this.billPrintingService.getFinancialYear().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.financialYear = data.body;
          this.getCurrentFY();
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    );
  }

  getCurrentFY() {
    if (this.financialYear) {
      const todayDate = new Date();
      let obj = this.financialYear.filter(f => new Date(f.startDate) <= todayDate && new Date(f.endDate) >= todayDate)[0];
      if (obj) {
        this.model.financialyearId = obj.financialYearId;
      }
    }
  }

  getWardZoneLevel() {
    this.billPrintingService.getWardZoneLevel().subscribe(
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
    );
  }

  onChangedWardZone(value, level) {
    if (level === 2) {
      this.wardZoneLevel2List = [];
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.model.level2Id = null;
      this.model.level3Id = null;
      this.model.level4Id = null;
    } else if (level === 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.model.level3Id = null;
      this.model.level4Id = null;
    } else if (level === 4) {
      this.wardZoneLevel4List = [];
      this.model.level4Id = null;
    }
    if (value && level) {
      this.getWardZone(value, level);
    }
  }

  getWardZoneFirstLevel() {
    this.billPrintingService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    );
  }

  getWardZone(parentId, level) {
    var postData = {};
    postData = { parentId: parentId };
    this.billPrintingService.getWardZone(postData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          if (level === 2) {
            this.wardZoneLevel2List = data.body;
          } else if (level === 3) {
            this.wardZoneLevel3List = data.body;
          } else if (level === 4) {
            this.wardZoneLevel4List = data.body;
          }
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  onChangedUsage(val) {
    this.subUsageList = [];
    this.model.subUsageId = null;
    if (val) {
      this.getSubUsageList(val);
    }
  }

  getUsageList() {
    this.billPrintingService.getUsageList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.usageList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    );
  }

  getSubUsageList(usageMasterId) {
    this.billPrintingService.getSubUsageList({ usageMasterId: usageMasterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.subUsageList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  onChangedPropertyType(val) {
    this.propertySubTypeList = [];
    this.model.propertySubTypeId = null;
    if (val) {
      this.getPropertySubTypeList(val);
    }
  }

  getPropertyTypeList() {
    this.billPrintingService.getPropertyTypeList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertyTypeList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    );
  }

  getPropertySubTypeList(masterId) {
    this.billPrintingService.getPropertySubTypeList({ propertyTypeMstId: masterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertySubTypeList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  onSearch(formDetail: NgForm) {
    this.isSubmitted = true;
    if (formDetail.form.valid && this.isValidForm) {
      if (this.model.propertyNo) {
        this.model.propertyNo = this.model.propertyNo.toString().trim();
      }
      this.billPrintingDataSharingService.updatedSearchModel(this.model);
      this.billPrintingDataSharingService.updatedIsShowTable(true);
    }
  }
  onClear() {
    this.model = new BillPrintingModel();
    this.getCurrentFY();
    this.billPrintingDataSharingService.updatedIsShowTable(false);
  }
  onTabChanged(event) {
    this.model = new BillPrintingModel();
    this.getCurrentFY();
    this.billPrintingDataSharingService.updatedIsShowTable(false);
  }

  isValidForm = true;
  checkValidBatchNo(c1, c2) {
    var a = c1.control.value;
    var b = c2.control.value;
    c2.control.status = "VALID";
    this.isValidForm = true;
    if (a && b) {
      if (Number(a) > Number(b)) {
        c2.control.status = "INVALID";
        this.isValidForm = false;
      } else {
        c2.control.status = "VALID";
        this.isValidForm = true;
      }
    }
  }
}
