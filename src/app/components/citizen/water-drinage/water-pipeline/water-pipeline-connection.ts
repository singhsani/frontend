
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import * as _ from 'lodash';
import * as moment from 'moment';
import { WaterDrinageConfig } from '../water-drinage-config';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { PropertySearchService } from '../../../../vmcshared/component/property-search/property-search.service';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from '../../../../vmcshared/Constants';
import { BookingUtils } from '../../facilities/bookings/config/booking-config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'water-pipeline-connection',
  templateUrl: './water-pipeline-connection.html',
  styleUrls: ['./water-pipeline-connection.scss']
})
export class WaterPipelineConnection implements OnInit {

  formId: number;
  apiCode: string;

  waterPipeliConnectionForm: FormGroup;
  translateKey: string = 'waterPipelineConnectionScreen';

  tabIndex: number = 0;

  public showButtons: boolean = false;

  //Lookups Array
  uploadFilesArray: Array<any> = [];
  WARD: Array<any> = [];
  FOOD_BUSINESS_CATE_MANU: Array<any> = [];
  FOOD_BUSINESS_CATE_OTH: Array<any> = [];
  LOOKUP: any;
  City_ZONE: Array<any> = [];

  // FOOD_BUSINESS_TYPES: Array<any> = [];
  // FOOD_IS_REG_OR_LIC: Array<any> = [];





  FOOD_PAYMENT_MODE: Array<any> = [];

  config: WaterDrinageConfig = new WaterDrinageConfig();

  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];

  	// Map for the formcontrol to tabIndex id;

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

	/**
	 * This method call initially required methods.
	 */
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
      this.getAnimalPondLicNewData();
      this.waterPipeliConnectionFormControls();
      this.getFormData(this.formId);
    }
    
  }

	/**
	 * Method is used to get form data
	 */
  getAnimalPondLicNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {      
      try {
        res.workExecutionFromAmount === 0 ? res.workExecutionFromAmount=null:res.workExecutionFromAmount;
        res.workExecutionToAmount === 0 ? res.workExecutionToAmount=null:res.workExecutionToAmount;
        this.waterPipeliConnectionForm.patchValue(res);
        this.showButtons = true;
      } catch (error) {
        console.log(error.message)
      }
    });
  }

	/**
	* Method is used to get lookup data
	*/
  getLookupData() {
    this.formService.getDataFromLookups().subscribe(res => {
      console.log("getLookupData", res);

      this.LOOKUP = res;
      this.City_ZONE = res.FIRM_ZONE;
      this.FOOD_PAYMENT_MODE = res.FOOD_PAYMENT_MODE;
      //this.onChangeZone(this.waterPipeliConnectionForm.get('zone').value.code);
    });
  }

	/**
	 * Method is used for get WARD as per zone selection
	 * @param event : selected zone code
	 */
  onChangeZone(event) {
    this.WARD = [];
    if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
      this.WARD = this.LOOKUP[event];
    }
  }

	/**
	 * Method is used for get registration type or License type as per business turn over selection
	 * @param event : selected ward code
	 */
  // onChangeRegOrLicType(event) {
  //   if (event == 'LESS_THAN_12LK') {
  //     this.waterPipeliConnectionForm.get('regOrLic').setValue('Registration');
  //     this.waterPipeliConnectionForm.get('regOrLic').disable();
  //   }
  //   if (event == 'GREATER_THAN_12LK') {
  //     this.waterPipeliConnectionForm.get('regOrLic').setValue('License');
  //     this.waterPipeliConnectionForm.get('regOrLic').disable();

  //   }
  // }

  // updateCatArray(event: any) {
  //   console.log(event);
  //   const catArray = <FormArray>this.waterPipeliConnectionForm.controls.businessCategories;
  //   if (event) {
  //     event.forEach(catValue => {
  //       (catArray.push(this.pushItem(catValue)));
  //     });
  //   }
  //   else {
  //     let index = catArray.controls.findIndex(x => x.value == event)
  //     catArray.removeAt(index);
  //   }
  // }

  // pushItem(data?: any) {
  //   return this.fb.group({
  //     categoryCode: [data ? data : '']
  //   });
  // }


  // set business turnover fields and registrastion type(disble mode) 
  // setDependedFields(event: any) {
  //   console.log(event);
  //   let catValue = event;
  //   let sliptvalue = catValue.split('_');
  //   console.log(sliptvalue);
  //   if (sliptvalue[0] = 'LT12L') {
  //     this.waterPipeliConnectionForm.get('businessTurnOver').value.code.setValue('LESS_THAN_12LK');
  //   }
  //   else if(sliptvalue[0] = 'MT12L'){
  //     this.waterPipeliConnectionForm.get('businessTurnOver').value.code.setValue('GREATER_THAN_12LK');
  //   }
  // }

	/**
	*  Method is used get selected data from lookup when change dropdown in grid.
	* @param lookups : Array
	* @param code : String
	* return object
	*/
  getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
    return lookups.find((obj: any) => obj.code === code)
  }

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
  waterPipeliConnectionFormControls() {
    this.waterPipeliConnectionForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'HEL-WTR-PIPELINE',
      /* Step 1 controls start */
      fieldView: [null],
      fieldList: [null],
      schemeName: [null, [Validators.required, Validators.maxLength(250)]],
      landmark: [null,Validators.maxLength(250)],
      societyName: [null, [Validators.required, Validators.maxLength(250)]],
      propertyAddress: [null, [Validators.required, Validators.maxLength(250)]],
      contractorAddress: [null, [Validators.required, Validators.maxLength(200)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      // waterPipelineZone: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      // waterPipelineWard: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      waterPipelineZoneId: [null, [Validators.required]],
      waterPipelineWardId: [null, [Validators.required]],
      pinCode: [null, Validators.required],
      //firmCity: [null, [Validators.required, Validators.maxLength(10)]],
      tpNo: [null,[Validators.maxLength(10)]],
      fpNo: [null],
      revenueSurveyNo: [null],
      citySurveyNo: [null],
      buildingPermissionNo: [null],
      buildingPermissionDate: [null],
      developerFullName: [null, [Validators.required, Validators.maxLength(250)]],
      developerAddress: [null, [Validators.required, Validators.maxLength(200)]],
      developerMobileNo: [null, [Validators.maxLength(10)]],
      developerEmailId: [null,[ValidationService.emailValidator]],
      reraRegNo: [null, [Validators.required]],
       contractorFullName: [null, [Validators.required, Validators.maxLength(250)]],
      contractorMobileNo: [null, [Validators.maxLength(10)]],
      contractorEmailId: [null,[ValidationService.emailValidator]],
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
      // loinumber: [null]

      /* Step 4 controls start*/
      // attachments: ['']
      /* Step 4 controls end */
    }, { validator: this.myAwesomeRangeValidator }
    );
  }

  getFormData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      if(res.waterPipelineWardId) {
        this.getWardZone(res.waterPipelineZoneId, 2);
      }
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.waterPipeliConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
      });
      this.requiredDocumentList();
    })
  }
  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.waterPipeliConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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

  // dependentAttachment(eventValue: any, dependedKey: string) {

  // 	var control = (<FormArray>this.waterPipeliConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).controls
  // 	var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

  // 	if (eventValue && fields) {
  // 		fields.get('mandatory').setValue(true);
  // 		if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
  // 			this.uploadFilesArray.push({
  // 				'labelName': fields.get('documentLabelEn').value,
  // 				'fieldIdentifier': fields.get('fieldIdentifier').value,
  // 				'documentIdentifier': dependedKey
  // 			})
  // 		}
  // 	} else {
  // 		if (fields) {
  // 			fields.get('mandatory').setValue(false);
  // 			var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
  // 			if (indewx != -1) {
  // 				this.uploadFilesArray.splice(indewx, 1);
  // 			}
  // 		}
  // 	}

  // }

  handleOnSaveAndNext(res) {
    this.requiredDocumentList();
  }


  // setValidatonForbusinessCategorie() {

  //   if (this.waterPipeliConnectionForm.get('regLicType').get('code').value === 'FOOD_REG_LIC_MULTIPLE' && this.waterPipeliConnectionForm.get('businessTurnOver').get('code').value === 'LESS_THAN_12LK' && this.waterPipeliConnectionForm.get('businessType').get('code').value === 'FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE') {
  //     this.waterPipeliConnectionForm.get('businessCategories').setValidators(Validators.required);
  //     this.waterPipeliConnectionForm.get('businessCategories').markAsTouched();
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').clearValidators();
  //   }
  //   if (this.waterPipeliConnectionForm.get('regLicType').get('code').value === 'FOOD_REG_LIC_SINGLE' && this.waterPipeliConnectionForm.get('businessTurnOver').get('code').value === 'LESS_THAN_12LK' && this.waterPipeliConnectionForm.get('businessType').get('code').value === 'FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE') {
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').setValidators(Validators.required);
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').markAsTouched();
  //     this.waterPipeliConnectionForm.get('businessCategories').clearValidators();
  //   }
  //   if (this.waterPipeliConnectionForm.get('regLicType').get('code').value === 'FOOD_REG_LIC_MULTIPLE' && this.waterPipeliConnectionForm.get('businessTurnOver').get('code').value === 'LESS_THAN_12LK' && this.waterPipeliConnectionForm.get('businessType').get('code').value === 'FOOD_OTHER') {
  //     this.waterPipeliConnectionForm.get('businessCategories').setValidators(Validators.required);
  //     this.waterPipeliConnectionForm.get('businessCategories').markAsTouched();
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').clearValidators();
  //   }
  //   if (this.waterPipeliConnectionForm.get('regLicType').get('code').value === 'FOOD_REG_LIC_SINGLE' && this.waterPipeliConnectionForm.get('businessTurnOver').get('code').value === 'LESS_THAN_12LK' && this.waterPipeliConnectionForm.get('businessType').get('code').value === 'FOOD_OTHER') {
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').setValidators(Validators.required);
  //     this.waterPipeliConnectionForm.get('singleBusinessCategorie').markAsTouched();
  //     this.waterPipeliConnectionForm.get('businessCategories').clearValidators();
  //   }
  //   this.waterPipeliConnectionForm.get('singleBusinessCategorie').updateValueAndValidity();
  //   this.waterPipeliConnectionForm.get('businessCategories').updateValueAndValidity();
  // }

  /**
   * This method required for final form submition.
   * @param flag - flag of invalid control.
   */
  handleErrorsOnSubmit(flag) {

    const key = this.bookingUtils.getInvalidFormControlKey(this.waterPipeliConnectionForm);
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
      this.waterPipeliConnectionForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
    }
  }

  patchValue() {
    this.waterPipeliConnectionForm.patchValue(this.dummyJSON);
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
    "waterPipelineZone": {
      "code": "NORTH_ZONE"
    },
    "waterPipelineWard": {
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

  /**
   * 
   * Work execution from amount and work execution to amount validation.
   * 
   */
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
