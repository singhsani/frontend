import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NewWaterConnectionEntryService } from '../../tax/water-supply/new-water-connection-entry/Services/new-water-connection-entry.service';
import { WaterDrinageConfig} from '../water-drinage-config';
import * as _ from 'lodash';

 
@Component({
  selector: 'app-new-drainage-connection',
  templateUrl: './new-drainage-connection.component.html',
  styleUrls: ['./new-drainage-connection.component.scss']
})
export class NewDrainageConnectionComponent implements OnInit {

  formId: number;
  apiCode: string;

  newDrainageConnectionForm: FormGroup;
  translateKey: string = 'newDrainageConnectionKey';

  tabIndex: number = 0;

  uploadFilesArray: Array<any> = [];
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];

  connectionUsageList = [];
  connectionSubUsageList = [];

  config: WaterDrinageConfig = new WaterDrinageConfig();
  public showButtons: boolean = true;


  plumberList: any = [];

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    public translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private newWaterConnectionEntryService: NewWaterConnectionEntryService,
    private alertService: AlertService
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });

    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }else{
      this.newDrainageConnectionFormControls();
      this.getWardZoneLevel();
      this.getUsageList();
      this.getPlumberList();
      this.getFormData(this.formId);
    }

  
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }

  handleErrorsOnSubmit(flag) {
    console.log("flag", flag);
    let step0 = 11;
    let step1 = 15;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;

      if (count <= step0) {
        this.tabIndex = 0;
        return false;
      } else if (count <= step1) {
        this.tabIndex = 1;
        return false;
      }
      else {
        console.log("else condition");
      }

    }
  }

  getFormData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("Get form data", res);
      if(res.waterDrainageWardId) {
        this.getWardZone(res.waterDrainageZoneId, 2);
      }
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.newDrainageConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
      });
      this.requiredDocumentList();
    })
  }
  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.newDrainageConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
    console.log("uploadFileArray", this.uploadFilesArray);
    //check for attachment is mandatory
    //	this.dependentAttachment(this.waterPipeliConnectionForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
    //this.dependentAttachment(this.waterPipeliConnectionForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
  }

  newDrainageConnectionFormControls() {
    this.newDrainageConnectionForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      /* Step 1 controls start */
      drainageConnectionNo: [null, [Validators.required]],
      oldDrainageConnectionNo: [null],
      censusNo: [null],
      connectionOwnerName: [null, [Validators.required]],
      mobileNo: [null, [Validators.maxLength(10)]],
      emailId: [null],
      //TODO Ask to nikulbhai about about withinLimit code
      withinLimitOutOfLimit: [null],
      drainageConnectionZoneId: [null, [Validators.required]],
      drainageConnectionWardId: [null, [Validators.required]],
      drainageConnectionBlockId: [null, [Validators.required]],

      connectionUsage: [null, [Validators.required]],
      connectionSubUsage: [null, [Validators.required]],
      plumber: [null, [Validators.required]]
    }, {});
  }

  getWardZoneLevel() {
    this.taxRebateApplicationService.getWardZoneLevel().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel = data.body;
          console.log('wardZoneLevel', this.wardZoneLevel);
          this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
          this.getWardZoneFirstLevel();
        }
      },
      (error) => {
        console.log('error', error);
      }
    )
  }

  getWardZoneFirstLevel() {
    this.taxRebateApplicationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
        }
      },
      (error) => {
        console.log('error', error);
      })
  }

  onChangedWardZone(value, level) {
    if (level == 2) {
      //this.waterPipeliConnectionForm.controls.waterPipelineWard.setValue();
      this.wardZoneLevel2List = [];
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
    }
    else if (level == 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
    }
    else if (level == 4) {
      this.wardZoneLevel4List = [];
    }
    if (value)
      this.getWardZone(value, level)
  }

  getPlumberList() {
    this.newWaterConnectionEntryService.getPlumberList({ licenseFor: Constants.ItemCodes.License_Water, activeOnly: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.plumberList = data.body;
          console.log("plumber list", this.plumberList)
          //TODO Ask to nikulbhai about filter plumber list

          // this.filteredPlumerList = this.plumerCtrl.valueChanges
          //   .pipe(
          //     startWith(''),
          //     map(f => f ? this.filterPlumber(f) : this.plumberList.slice())
          //   );
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
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
        console.log('error', error);
      })
  }

  onChangedConnectionUsage(val) {
    console.log("value", val)
    this.connectionSubUsageList = null;
    if (val)
      this.getSubUsageList(val);
  }

  getUsageList() {
    this.newWaterConnectionEntryService.getUsageList({ active: true }).subscribe(
      (data) => {
        console.log("new_water ", data.body);
        if (data.status === 200 && data.body.length) {
          this.connectionUsageList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getSubUsageList(usageMasterId) {
    var postToData = { usageMasterId: usageMasterId, active: true };
    this.newWaterConnectionEntryService.getSubUsageList(postToData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.connectionSubUsageList = data.body;
          console.log("sub list", this.connectionSubUsageList)
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

}
