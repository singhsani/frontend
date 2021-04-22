import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { WaterDrinageConfig } from '../water-drinage-config';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from '../../../../vmcshared/Constants';
import { BookingUtils } from '../../facilities/bookings/config/booking-config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drainage-pipeline-connection',
  templateUrl: './drainage-pipeline-connection.component.html',
  styleUrls: ['./drainage-pipeline-connection.component.scss']
})
export class DrainagePipelineConnectionComponent implements OnInit {


  formId: number;
  apiCode: string;

  drainagePipeliConnectionForm: FormGroup;
  translateKey: string = 'drainagePipelineConnectionScreen';

  tabIndex: number = 0;

  public showButtons: boolean = false;

  //Lookups Array
  uploadFilesArray: Array<any> = [];
  WARD: Array<any> = [];
  LOOKUP: any;
  City_ZONE: Array<any> = [];
  
  config: WaterDrinageConfig = new WaterDrinageConfig();

  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
  
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];

  public formControlNameToTabIndex = new Map();

  bookingUtils: BookingUtils;

  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param validationService - Declare validations property.
   */
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    public translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private toaster: ToastrService,
  ) { 
    this.bookingUtils = new BookingUtils(formService, toaster);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });
    this.setFormControlToTabIndexMap();
    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }
    else {
      this.getWardZoneLevel();
      this.getLookupData();
      this.getDrainagePipelineConnectionNewData();
      this.drainagePipeliConnectionFormControls();
      this.getFormData(this.formId);
    }
  }

  /**
   * Initialize drainage pipeline connection form controls.
   * 
   */
  drainagePipeliConnectionFormControls() {
    this.drainagePipeliConnectionForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'HEL-WTR-PIPELINE',
      /* Step 1 controls start */
      fieldView: [null],
      fieldList: [null],
      schemeName: [null, [Validators.required, Validators.maxLength(250)]],
      landmark: [null,Validators.maxLength(100)],
      societyName: [null, [Validators.required, Validators.maxLength(250)]],
      propertyAddress: [null, [Validators.required, Validators.maxLength(250)]],
      contractorAddress: [null, [Validators.required, Validators.maxLength(250)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      // drainagePipelineZone: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      // drainagePipelineWard: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      drainagePipelineZoneId: [null, [Validators.required]],
      drainagePipelineWardId: [null, [Validators.required]],
      pinCode: [null, Validators.required],
      //firmCity: [null, [Validators.required, Validators.maxLength(10)]],
      tpNo: [null],
      fpNo: [null],
      revenueSurveyNo: [null],
      citySurveyNo: [null,Validators.maxLength(50)],
      buildingPermissionNo: [null,Validators.maxLength(50)],
      buildingPermissionDate: [null],
      developerFullName: [null, [Validators.required, Validators.maxLength(200)]],
      developerAddress: [null, [Validators.required, Validators.maxLength(200)]],
      developerMobileNo: [null, [Validators.maxLength(10)]],
      developerEmailId: [null,ValidationService.emailValidator],
      reraRegNo: [null, [Validators.required]],
      contractorFullName: [null, [Validators.required, Validators.maxLength(250)]],
      contractorMobileNo: [null, [Validators.maxLength(10)]],
      contractorEmailId: [null,ValidationService.emailValidator],
      registrationNumber: [null, [Validators.required]],
      registrationDate: [null, Validators.required],
      registrationClass: [null, Validators.required],
      workExecutionFromAmount: [null, [Validators.required]],
      workExecutionToAmount: [null, [Validators.required]],
      registrationValidity: [null],
      reraRegistrationDate: [null, Validators.required],
      attachments: [],
      paymentMode: this.fb.group({
        code: [null]
      }),
      workOrderNo: [null],
      workOrderDate: [null],
      estimateAmount: [0],
      connectionStatus: [null]
    }, { validator: this.myAwesomeRangeValidator });
  }


  /**
   * 
   * @param id 
   * this pethod is used to set upload documents.
   */
  getFormData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      if(res.drainagePipelineWardId) {
        this.getWardZone(res.drainagePipelineZoneId, 2);
      }
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.drainagePipeliConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
      });
      this.requiredDocumentList();
    })
  }

  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.drainagePipeliConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
    console.log("uploadFileArray", this.uploadFilesArray);
  }

  /**
	* Method is used to get lookup data
	*/
  getLookupData() {
    this.formService.getDataFromLookups().subscribe(res => {
      this.LOOKUP = res;
      this.City_ZONE = res.FIRM_ZONE;
    });
  }

  /**
   * this method is used to get drainage pipeline connection data
   * 
   */
  getDrainagePipelineConnectionNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      try {
        this.drainagePipeliConnectionForm.patchValue(res);
        this.showButtons = true;
      } catch (error) {
        console.log(error.message)
      }
    });
  }

  /**
	*  Method is used get selected data from lookup when change dropdown in grid.
	* @param lookups : Array
	* @param code : String
	* return object
	*/
  getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
    return lookups.find((obj: any) => obj.code === code)
  }

  handleOnSaveAndNext(res) {
    this.requiredDocumentList();
  }

  /**
   * This method required for final form submition.
   * @param flag - flag of invalid control.
   */
  handleErrorsOnSubmit(flag) {

    const key = this.bookingUtils.getInvalidFormControlKey(this.drainagePipeliConnectionForm);
		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 1;
		if (index) {
			this.tabIndex = index - 1;
			return false;
		}
    // console.log("flag", flag);
    // let step0 = 12;
    // let step1 = 18;
    // let step2 = 28;

    // if (flag != null) {
    //   //Check validation for step by step
    //   let count = flag;

    //   if (count <= step0) {
    //     this.tabIndex = 0;
    //     return false;
    //   } else if (count <= step1) {
    //     this.tabIndex = 1;
    //     return false;
    //   }
    //   else if (count <= step2) {
    //     this.tabIndex = 2;
    //     //	this.checkReligion();
    //     return false;
    //   }
    //   else {
    //     console.log("else condition");
    //   }

    // }
  }

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
  onTabChange(evt) {
    this.tabIndex = evt;
  }

  dateFormate(date, controlType: string) {
    if (date) {
      this.drainagePipeliConnectionForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
    }
  }

  patchValue() {
    this.drainagePipeliConnectionForm.patchValue(this.dummyJSON);
  }

  dummyJSON: any = {
    "apiType": "waterPipeLineConnection",
    "serviceCode": "HEL-WTR-PIPELINE",
    "fieldView": "ALL",
    "serviceType": "WATER_PIPELINE_CONNECTION_REGISTRATION",
    "fieldList": null,
    "schemeName": "fdgfdgfdg",
    "landmark": "fdgfdg",
    "societyName": "gfdg",
    "propertyAddress": "fdgfdgfdgfdg",
    "drainagePipelineZone": {
      "code": "NORTH_ZONE"
    },
    "drainagePipelineWard": {
      "code": "WARD_7"
    },
    "firmCity": "Vadodara",
    "tpNo": "234543",
    "fpNo": "4354354354",
    "revenueSurveyNo": "4354353454",
    "citySurveyNo": "4545gdgdgd",
    "buildingPermissionNo": "22332sada313",
    "paymentMode": {
      "code": "NET_BANKING"
    },
    "reraRegNo": 1213323,
    "developerFullName": "Test",
    "developerAddress": "Test",
    "developerMobileNo": 1111111111,
    "developerEmailId": "Test@Test.com",
    "contractorFullName": "Test",
    "contractorAddress": "Test",
    "contractorMobileNo": 1234567890,
    "contractorEmailId": "Test@Demo.com",
    "registrationNumber": 12125454,
    "registrationClass": "abc",
    "workExecutionFromAmount": 10.0,
    "workExecutionToAmount": 10.11,
    // "reraRegistrationDate":new Date(),
    // "registrationDate":new Date(),
    // "registrationValidity":new Date(),
    // "buildingPermissionDate":new Date(),
  };


  myAwesomeRangeValidator: ValidatorFn = (fg: FormGroup) => {
    const start = Number(fg.get('workExecutionFromAmount').value);
    const end = Number(fg.get('workExecutionToAmount').value);
    // return start != 0 && end != 0 && start < end
    //   ? null
    //   : { range: true };
    if(start != 0 && end != 0) {
      if(start < end) {
        return null;
      } else {
        fg.get('workExecutionToAmount').setErrors({ range: true });
        return { range: true }
      }
    }
  };

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
      //this.drainagePipeliConnectionForm.controls.drainagePipelineWard.setValue({code: ''});
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

  setFormControlToTabIndexMap() {
    // tab 1
    this.formControlNameToTabIndex.set('schemeName', 1)
    this.formControlNameToTabIndex.set('societyName', 1)
    this.formControlNameToTabIndex.set('propertyAddress', 1)
    this.formControlNameToTabIndex.set('waterPipelineZoneId', 1)
    this.formControlNameToTabIndex.set('waterPipelineWardId', 1)
    this.formControlNameToTabIndex.set('pinCode', 1)
    
    // tab 2
    this.formControlNameToTabIndex.set('developerFullName', 2)
    this.formControlNameToTabIndex.set('developerAddress', 2)
    this.formControlNameToTabIndex.set('developerMobileNo', 2)
    this.formControlNameToTabIndex.set('reraRegNo', 2)
    this.formControlNameToTabIndex.set('reraRegistrationDate', 2)

    // tab 3
    this.formControlNameToTabIndex.set('contractorFullName', 3)
    this.formControlNameToTabIndex.set('contractorMobileNo', 3)
    this.formControlNameToTabIndex.set('contractorAddress', 3)
    this.formControlNameToTabIndex.set('registrationNumber', 3)
    this.formControlNameToTabIndex.set('registrationDate', 3)
    this.formControlNameToTabIndex.set('registrationClass', 3)
    this.formControlNameToTabIndex.set('workExecutionFromAmount', 3)
    this.formControlNameToTabIndex.set('workExecutionToAmount', 3)

  }
  
}
