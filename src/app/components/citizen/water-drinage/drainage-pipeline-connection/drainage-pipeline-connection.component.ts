import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { WaterDrinageConfig } from '../water-drinage-config';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ManageRoutes } from 'src/app/config/routes-conf';

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
    private formService: FormsActionsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });
    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }
    else {
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
      schemeName: [null, [Validators.required, Validators.maxLength(200)]],
      landmark: [null],
      societyName: [null, [Validators.required, Validators.maxLength(150)]],
      propertyAddress: [null, [Validators.required, Validators.maxLength(200)]],
      contractorAddress: [null, [Validators.required, Validators.maxLength(200)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      drainagePipelineZone: this.fb.group({
        code: [null, Validators.required]
      }),
      drainagePipelineWard: this.fb.group({
        code: [null, Validators.required]
      }),
      firmCity: [null, [Validators.required, Validators.maxLength(10)]],
      tpNo: [null],
      fpNo: [null],
      revenueSurveyNo: [null],
      citySurveyNo: [null],
      buildingPermissionNo: [null],
      buildingPermissionDate: [null],
      developerFullName: [null, [Validators.required, Validators.maxLength(200)]],
      developerAddress: [null, [Validators.required, Validators.maxLength(200)]],
      developerMobileNo: [null, [Validators.maxLength(10)]],
      developerEmailId: [null],
      reraRegNo: [null, [Validators.required]],

      contractorFullName: [null, [Validators.required, Validators.maxLength(200)]],
      contractorMobileNo: [null, [Validators.maxLength(10)]],
      contractorEmailId: [null],
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
      })
    });
  }


  /**
   * 
   * @param id 
   * this pethod is used to set upload documents.
   */
  getFormData(id: number) {
    debugger;
    this.formService.getFormData(id).subscribe(res => {
      debugger;
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        debugger;
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
    console.log("flag", flag);
    let step0 = 12;
    let step1 = 18;
    let step2 = 28;

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
      else if (count <= step2) {
        this.tabIndex = 2;
        //	this.checkReligion();
        return false;
      }
      else {
        console.log("else condition");
      }

    }
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

}
