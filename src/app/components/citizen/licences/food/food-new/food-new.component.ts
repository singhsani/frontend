
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-food-new',
  templateUrl: './food-new.component.html',
  styleUrls: ['./food-new.component.scss']
})
export class FoodNewComponent implements OnInit {

  formId: number;
  apiCode: string;

  foodLicNewForm: FormGroup;
  translateKey: string = 'foodNewScreen';

  tabIndex: number = 0;

  public showButtons: boolean = false;

  //Lookups Array
  WARD: Array<any> = [];
  FOOD_BUSINESS_CATE_MANU: Array<any> = [];
  FOOD_BUSINESS_CATE_OTH: Array<any> = [];
  LOOKUP: any;
  FIRM_ZONE: Array<any> = [];
  FOOD_BUSINESS_TURNOVER: Array<any> = [];
  FOOD_BUSINESS_TYPES: Array<any> = [];
  FOOD_IS_REG_OR_LIC: Array<any> = [];
  FOOD_LICENCE_NO_OF_YEAR: Array<any> = [];
  FOOD_LIC_FEES_TYPE: Array<any> = [];
  FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_LT12L: Array<any> = [];
  FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_MT12L: Array<any> = [];
  FOOD_OTHERS_BUSINESSTYPE_LT12L: Array<any> = [];
  FOOD_OTHERS_BUSINESSTYPE_MT12L: Array<any> = [];
  FOOD_PAYMENT_MODE: Array<any> = [];
  FOOD_REG_LIC_SINGLE_OR_MULTIPLE: Array<any> = [];

  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param validationService - Declare validations property.
   */
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService
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
      this.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_LT12L = res.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_LT12L;
      this.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_MT12L = res.FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE_MT12L;
      this.FOOD_OTHERS_BUSINESSTYPE_LT12L = res.FOOD_OTHERS_BUSINESSTYPE_LT12L;
      this.FOOD_OTHERS_BUSINESSTYPE_MT12L = res.FOOD_OTHERS_BUSINESSTYPE_MT12L;
      this.FOOD_PAYMENT_MODE = res.FOOD_PAYMENT_MODE;
      this.FOOD_REG_LIC_SINGLE_OR_MULTIPLE = res.FOOD_REG_LIC_SINGLE_OR_MULTIPLE;

      this.onChangeZone(this.foodLicNewForm.get('firmZone').value.code);
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
  onChangeRegOrLicType(event) {
    if (event == 'LESS_THAN_12LK') {
      this.foodLicNewForm.get('regOrLic').setValue('Registration');
      this.foodLicNewForm.get('regOrLic').disable();
    }
    if (event == 'GREATER_THAN_12LK') {
      this.foodLicNewForm.get('regOrLic').setValue('License');
      this.foodLicNewForm.get('regOrLic').disable();

    }
  }

  // updateCatArray(event: any) {
  //   console.log(event);
  //   const catArray = <FormArray>this.foodLicNewForm.controls.businessCategories;
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
  //     this.foodLicNewForm.get('businessTurnOver').value.code.setValue('LESS_THAN_12LK');
  //   }
  //   else if(sliptvalue[0] = 'MT12L'){
  //     this.foodLicNewForm.get('businessTurnOver').value.code.setValue('GREATER_THAN_12LK');
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
  foodLicNewFormControls() {
    this.foodLicNewForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'FL',
      /* Step 1 controls start */
      fieldView: [null],
      fieldList: [null],
      holderName: [null, [Validators.required, Validators.maxLength(200)]],
      holderAddress: [null, [Validators.required, Validators.maxLength(300)]],
      firmName: [null, [Validators.required, Validators.maxLength(150)]],
      firmAddress: [null, [Validators.required, Validators.maxLength(200)]],
      firmZone: this.fb.group({
        code: [null, Validators.required]
      }),
      firmAdministrativeWard: this.fb.group({
        code: [null, Validators.required]
      }),
      firmCity: [null, Validators.required],
      firmPincode: [null, [ Validators.required,Validators.maxLength(6), Validators.minLength(6)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      firmLandLineNo: [null, [Validators.maxLength(10)]],
      firmEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      businessType: this.fb.group({
        code: [null, Validators.required]
      }),
      regLicType: this.fb.group({
        code: [null, Validators.required]
      }),
      //businessCategories: this.fb.array([]),
      businessCategories: [null],
      singleBusinessCategorie: [null],
      businessTurnOver: this.fb.group({
        code: [null, Validators.required]
      }),
      regOrLic: [null, Validators.required],
      licenceForNoOfYear: this.fb.group({
        code: [null, Validators.required]
      }),
      feesType: this.fb.group({
        code: [null]
      }),
      totalFeesAmount: [null],
      paymentMode: this.fb.group({
        code: [null]
      }),
      loinumber: [null]

      /* Step 4 controls start*/
      // attachments: ['']
      /* Step 4 controls end */
    });
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
