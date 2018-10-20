
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-food-new',
  templateUrl: './food-new.component.html',
  styleUrls: ['./food-new.component.scss']
})
export class FoodNewComponent implements OnInit {

  // Select id for edit form
  formId: number;
  apiCode: string;

  @ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

  foodLicNewForm: FormGroup;
  translateKey: string = 'foodNewScreen';

  tabIndex: number = 0;

  //File and image upload
  uploadModel: any = {};
  private showButtons: boolean = false;

  //Lookups Array
  WARD: Array<any> = [];
  FOOD_BUSINESS_CATE_MANU: Array<any> = [];
  FOOD_BUSINESS_CATE_OTH: Array<any> = [];
  LOOKUP: any;
  // SOUTH_ZONE : Array<any> = [];
  // EAST_ZONE : Array<any> = [];
  // WEST_ZONE : Array<any> = [];
  // NORTH_ZONE : Array<any> = [];
  FIRM_ZONE: Array<any> = [];
  FOOD_BUSINESS_TURNOVER: Array<any> = [];
  FOOD_BUSINESS_TYPES: Array<any> = [];
  FOOD_IS_REG_OR_LIC: Array<any> = [];
  FOOD_LICENCE_NO_OF_YEAR: Array<any> = [];
  FOOD_LIC_FEES_TYPE: Array<any> = [];
  FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE: Array<any> = [];
  FOOD_OTHERS_BUSINESSTYPE: Array<any> = [];
  FOOD_PAYMENT_MODE: Array<any> = [];
  FOOD_REG_LIC_SINGLE_OR_MULTIPLE: Array<any> = [];

  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param uploadFileService - Declare upload file service property.
   * @param commonService - Declare sweet alert.
   * @param toastrService - Show massage with timer.
   */
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private commonService: CommonService,
    private toastrService: ToastrService
  ) { }

	/**
	 * This method call initially required methods.
	 */
  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });

    this.getLookupData();
    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }
    else {
      this.getAnimalPondLicNewData();
      this.foodLicNewFormControls();
    }
  }

	/**
	 * Method is used to get form data
	 */
  getAnimalPondLicNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      try {
        this.foodLicNewForm.patchValue(res);
        this.showButtons = true;
        // this.onChangeZone(this.foodLicNewForm.get('zoneNo').value.code);
        // this.onChangeWard(this.foodLicNewForm.get('wardNo').value.code);
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
      this.LOOKUP = res;
      this.FIRM_ZONE = res.FIRM_ZONE;
      this.FOOD_BUSINESS_TURNOVER = res.FOOD_BUSINESS_TURNOVER;
      this.FOOD_BUSINESS_TYPES = res.FOOD_BUSINESS_TYPES;
      this.FOOD_LICENCE_NO_OF_YEAR = res.FOOD_LICENCE_NO_OF_YEAR;
      this.FOOD_LIC_FEES_TYPE = res.FOOD_LIC_FEES_TYPE;
      this.FOOD_IS_REG_OR_LIC = res.FOOD_IS_REG_OR_LIC;
      this.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE = res.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE;
      this.FOOD_OTHERS_BUSINESSTYPE = res.FOOD_OTHERS_BUSINESSTYPE;
      this.FOOD_PAYMENT_MODE = res.FOOD_PAYMENT_MODE;
      this.FOOD_REG_LIC_SINGLE_OR_MULTIPLE = res.FOOD_REG_LIC_SINGLE_OR_MULTIPLE;

      this.onChangeZone(this.foodLicNewForm.get('firmZone').value.code);
      // this.onChangeWard(this.foodLicNewForm.get('wardNo').value.code);
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
	 * Method is used for get FOOD BUSINESS CATE as per selection
	 * @param event : selected ward code
	 */
  onChangeCatType(event) {
    this.FOOD_BUSINESS_CATE_MANU = [];
    if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
      this.FOOD_BUSINESS_CATE_MANU = this.LOOKUP[event];
    }
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

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
  foodLicNewFormControls() {
    this.foodLicNewForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'FL',
      /* Step 1 controls start */
      fieldView: [null],
      fieldList: [null],
      holderName: [null, [Validators.required, Validators.maxLength(200)]],
      holderAddress: [null, [Validators.required, Validators.maxLength(300)]],
      firmName: [null,[Validators.required, Validators.maxLength(150)]],
      firmAddress: [null,[Validators.required, Validators.maxLength(200)]],
      firmZone: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      firmAdministrativeWard: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      firmCity: [null,Validators.required],
      firmPincode: [null, [Validators.maxLength(6), Validators.minLength(6)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      firmLandLineNo: [null,[Validators.maxLength(10)]],
      firmEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      businessType: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      regLicType: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      businessCategories: [null],
      businessTurnOver: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      isRegOrLic: [null,Validators.required],
      licenceForNoOfYear: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      feesType: this.fb.group({
        code: [null,Validators.required],
        name: [null]
      }),
      totalFeesAmount: [null],
      paymentMode: this.fb.group({
        code: [null],
        name: [null]
      }),
      loinumber: [null],

      /* Step 4 controls start*/
      attachments: ['']
      /* Step 4 controls end */
    });
  }

	/**
     * Method is used to set data value to upload method.
     * @param indentifier - file identifier
     * @param labelName - file label name.
     * @param formPart - file form part
     * @param variableName - file variable name.
     */
  setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {
    this.uploadModel = {
      fieldIdentifier: indentifier.toString(),
      labelName: labelName,
      formPart: formPart,
      variableName: variableName,
      serviceFormId: this.formId,
    }
    return this.uploadModel;
  }

  // set business turnover fields and registrastion type(disble mode) 
  setDependedFields(event: any) {
    console.log(event);
    let catValue = event;
    let sliptvalue = catValue.split('_');
    console.log(sliptvalue);
    if (sliptvalue[0] = 'LT12L') {
      this.foodLicNewForm.get('businessTurnOver').value.code.setValue('LESS_THAN_12LK');
    }
    else if(sliptvalue[0] = 'MT12L'){
      this.foodLicNewForm.get('businessTurnOver').value.code.setValue('GREATER_THAN_12LK');
    }
   
    // if (data.length) {
    // 	switch (filterType) {
    // 		case 'young': // age is 14 -18 for young person
    // 			countNumber = data.filter((obj: any) => obj.get('age').value >= 14 && obj.get('age').value <= 18 && (obj.get('gender').value.code == "MALE" || obj.get('gender').value.code == "FEMALE"))
    // 			break;

    // 		case 'total':
    // 			countNumber = data;
    // 			break;
    // 	}
    // 	this.shopLicNewForm.get(fieldsType).setValue(countNumber.length);
    // 	return countNumber.length;
    // }
    // this.foodLicNewForm.get('businessTurnOver').value.code.setValue();
    // this.foodLicNewForm.get('isRegOrLic').setValue('null');
  }

  /**
   * This method required for final form submition.
   * @param flag - flag of invalid control.
   */
  handleErrorsOnSubmit(flag) {

    let step0 = 13;
    let step1 = 24;

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
      // else if (count == 67) {
      // 	this.checkReligion();
      // 	return false;
      // }
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

}
