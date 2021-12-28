import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewWaterConnectionEntryService } from '../../Services/new-water-connection-entry.service';
import { NewWaterConnectionEntryDataSharingService } from '../../Services/new-water-connection-entry-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { NewWaterConnectionEntry, ApplicationModel } from '../../Models/new-water-connection-entry.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-consumer-detail',
  templateUrl: './consumer-detail.component.html',
  styleUrls: ['./consumer-detail.component.scss']
})

export class ConsumerDetailComponent implements OnInit {
  model: NewWaterConnectionEntry;
  applicationModel: ApplicationModel;
  consumerFormDetails: NgForm;

  constructor(private newNewWaterConnectionEntryDataSharingService: NewWaterConnectionEntryDataSharingService,
    private commonService: CommonService,
    private newNewWaterConnectionEntryService: NewWaterConnectionEntryService,
    private alertService: AlertService) {
    this.model = new NewWaterConnectionEntry();
    this.applicationModel = new ApplicationModel();

    // TODO
    // this.applicationModel.applicationNumber = "11110001";
    this.applicationModel.applicantName = "Test name";
    this.applicationModel.mobileNumber = "123456";
    this.applicationModel.aadharNumber = "123456";
    this.applicationModel.emailID = "test@test.com";
  }

  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  limitList = [];
  connectionUsageList = [];
  connectionSubUsageList = [];
  connectionSizeList = [];
  connectionTypeList = [];
  wardZoneLevel = [];
  messageArray: any = [];
  isOutofLimit: boolean = false;
  plumberList: any = [];
  plumerCtrl = new FormControl();
  filteredPlumerList: Observable<any[]>;

  ngOnInit() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Water_Within_Limit}&lookup_codes=${Constants.LookupCodes.Connection_Type}`
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.connectionTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Connection_Type))[0].items;
      this.limitList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Water_Within_Limit))[0].items;
      // var objLimit = this.limitList.filter(f => f.itemCode == Constants.ItemCodes.With_In_Limit)[0];
      // this.model.limitLookupId = objLimit.itemId;
      // var objconnectionType = this.connectionTypeList.filter(f => f.itemCode == Constants.ItemCodes.Meter)[0];
      // this.model.connectionTypeId = objconnectionType.itemId;
    });
    this.getConnectionSizeList();
    this.getUsageList();
    this.getWardZoneLevel();
    this.getPlumberList();
  }

  getConnectionSizeList() {
    this.newNewWaterConnectionEntryService.getConnectionSizeList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.connectionSizeList = data.body;
          this.shortDropdown(this.connectionSizeList,'connectionSize');
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  onChangedConnectionUsage(val) {
    this.model.subusageId = null;
    this.connectionSubUsageList = null;
    if (val)
      this.getSubUsageList(val);
  }

  getUsageList() {
    this.newNewWaterConnectionEntryService.getUsageList({active:true}).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.connectionUsageList = data.body;
          this.shortDropdown(this.connectionUsageList,'usageName')
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getSubUsageList(usageMasterId) {
    var postToData = { usageMasterId: usageMasterId, active: true };
    this.newNewWaterConnectionEntryService.getSubUsageList(postToData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.connectionSubUsageList = data.body;
          this.shortDropdown(this.connectionSubUsageList,'subUsage')
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getWardZoneLevel() {
    this.newNewWaterConnectionEntryService.getWardZoneLevel().subscribe(
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

  getWardZoneFirstLevel() {
    this.newNewWaterConnectionEntryService.getWardZoneFirstLevel(1, Constants.ModuleKey.Water_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
          this.shortDropdown(this.wardZoneLevel1List,'wardzoneName');
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
      this.model.level2Id = null;
      this.model.level3Id = null;
      this.model.level4Id = null;
    }
    else if (level == 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.model.level3Id = null;
      this.model.level4Id = null;
    }
    else if (level == 4) {
      this.wardZoneLevel4List = [];
      this.model.level4Id = null;
    }
    if (value)
      this.getWardZone(value, level)
  }

  onChangedLimit(val) {
    if (val) {
      var objLimit = this.limitList.filter(f => f.itemId == val)[0];
      if (objLimit.itemCode == Constants.ItemCodes.Out_of_Limit) {
        this.isOutofLimit = true;
      }
      else {
        this.isOutofLimit = false;
      }
    }
  }

  getWardZone(parentId, level) {
    var postData = {};
    postData = { parentId: parentId };
    this.newNewWaterConnectionEntryService.getWardZone(postData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          if (level == 2) {
            this.wardZoneLevel2List = data.body;
            this.shortDropdown(this.wardZoneLevel2List,'wardzoneName');
          }
          else if (level == 3) {
            this.wardZoneLevel3List = data.body;
            this.shortDropdown(this.wardZoneLevel3List,'wardzoneName');
          }
          else if (level == 4) {
            this.wardZoneLevel4List = data.body;
            this.shortDropdown(this.wardZoneLevel4List,'wardzoneName');
          }
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  saveConsumerDetail(formDetails: NgForm) {
    if (formDetails.form.valid) {
      this.model.applicationNumber = this.applicationModel.applicationNumber;
      //this.model.plumberId = this.plumberId;
      this.newNewWaterConnectionEntryService.saveConnectionDataEntry(this.model).subscribe(
        (data) => {
          this.model.connectionDtlId = data.body.data;
          this.newNewWaterConnectionEntryDataSharingService.updateDataSourceNewWaterConnectionEntry(this.model);
          if (!this.isOutofLimit) {
            this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(2);
          }
          else {
            this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(3, 0);
          }
          if (data.status === 200) {
            this.alertService.success(data.body.message);
          }
        },
        (error) => {
          if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            this.alertService.error(error.error.message);
          }
        });
    }
  }

  onClickIsApplicationisConnectionOwner(event) {
    if (event.checked) {
      this.model.mobileNo = this.applicationModel.mobileNumber;
      this.model.ownerName = this.applicationModel.applicantName;
      this.model.aadharNo = this.applicationModel.aadharNumber;
    }
  }

  getPlumberList() {
    this.newNewWaterConnectionEntryService.getPlumberList({ licenseFor: Constants.ItemCodes.License_Water,activeOnly:true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.plumberList = data.body;
          this.shortDropdown(this.plumberList,'nameOfApplicant');
          this.filteredPlumerList = this.plumerCtrl.valueChanges
            .pipe(
              startWith(''),
              map(f => f ? this.filterPlumber(f) : this.plumberList.slice())
            );
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  filterPlumber(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.plumberList.filter(f => f.nameOfApplicant.toLowerCase().indexOf(filterValue) === 0);
  }
  plumberId: number;
  onChangePlumber(value) {
    this.plumberId = value;
  }

  keyPressAlphaNumeric(event) {
    
    var alphaNumeric = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(alphaNumeric)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;    
    return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true    
  }
  
  shortDropdown(item:any,columnName:any){
    item.sort((a, b) => {      
      return typeof a[columnName] === 'number' ?  a[columnName] - b[columnName] : a[columnName].localeCompare(b[columnName]);
     });
  }
}