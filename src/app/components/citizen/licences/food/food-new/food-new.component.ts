import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { identity } from 'rxjs';

@Component({
  selector: 'app-food-new',
  templateUrl: './food-new.component.html',
  styleUrls: ['./food-new.component.scss']
})
export class FoodNewComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  @ViewChild(MatStepLabel) steplable: MatStepLabel;

  // Select id for edit form
  formId: number;
  apiCode: string;
  foodlicForm: FormGroup;

  translateKey: string = 'foodRegScreen';
  // Steps Titles
  stepLable1: string = "Aplicant Detail";
  stepLable2: string = "Shop Detail";

  //lookup array
  firmZoneArray: any = [];
  adminWardArray: any = [];
  businessTypeArray: any = [];
  foodRegTypeArray: any = [];
  businessCategoryArray: any = [];
  businessTurnOverArray: any = [];
  regOrLicArray: any = [];
  licenceYearArray: any = [];
  paymentModeArray: any = [];

  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param uploadFileService - Declare upload file service property.
   * @param commonService - Declare sweet alert.
   */
  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public validationError: ValidationService,
    private formService: FormsActionsService,
    private router: Router
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
      this.controlName();
      this.getLookupsData();
      this.getFormData(this.formId);

    }

  }

  /**
  * This method is listed form controls.
  */
  controlName() {
    this.foodlicForm = this.fb.group({

      // "id": 8,
      // "uniqueId": "2018-06-06-FL-K8NQBJHF",
      // "version": 0,
      // "serviceDetail": {
      //     "code": "FL",
      //     "name": "Food Licensing & Registration",
      //     "gujName": "Food Licensing & Registration",
      //     "feesOnScrutiny": false,
      //     "appointmentRequired": false
      //}
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceFormId: [null],
      serviceType: ['FOOD_LICENCE'],

      deptFileStatus: [null],
      serviceName: [null],
      fileNumber: [null],
      pid: [null],
      outwardNo: [null],
      // firstName: [null],
      // lastName: [null],
      // middleName: [null],
      // contactNo: [null],
      // email: [null],
      // aadhaarNo: [null],

      serviceCode: ["FL"],
      firmName: [null, [Validators.required, ValidationService.nameValidator]],
      firmZone: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      firmAdministrativeWard: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      firmCity: [null],
      firmPincode: [null, [Validators.required, Validators.maxLength(6)]],
      mobileNo: [null],
      landlineNo: [null],
      emailId: [null, [Validators.required, ValidationService.emailValidator]],
      businessType: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      foodRegType: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      businessCategory: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      businessTurnOver: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      regOrLic: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      licenceForNoOfYear: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      }),
      paymentMode: this.fb.group({
        code: [null],
        gujName: [null],
        name: [null]
      })
    });

  }


  /**
   * This method is use to patch Value
   */
  getFormData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      this.foodlicForm.patchValue(res);
    }, err => {
      console.log("get fail" + err);
    }
    );
  }


  /**
   * This method is loaded lookups array.
   */
  getLookupsData() {
    this.formService.getDataFromLookups().subscribe(res => {
      this.firmZoneArray = res.FIRM_ZONE;
      this.adminWardArray = res.SOUTH_ZONE;
      this.businessTypeArray = res.FOOD_BUSINESS_TYPES;
      this.foodRegTypeArray = res.FOOD_REG_TYPE;
      this.businessCategoryArray = res.FOOD_BUSINESS_TYPES;
      this.businessTurnOverArray = res.FOOD_BUSINESS_TURN_OVER;
      this.regOrLicArray = res.FOOD_REGISTRATION_OR_LICENCE;
      this.licenceYearArray = res.FOOD_LICENCE_NO_OF_YEAR;
      this.paymentModeArray = res.FOOD_PAYMENT_MODE;

      // res.WEST_ZONE;
      // res.NORTH_ZONE
      // res.EAST_ZONE;
    });
  }

  /**
  * This method for dropdown.
  */
  onChange() {
    // console.log("change event");
  }


  /**
   * Method is used to reset form its a output event from action bar.
   */
  stepReset() {
    this.stepper.reset();
  }


  /**
   * This method required for final form submition.
   * @param count - flag of invalid control.
   */
  handleErrorsOnSubmit(flag) {

    let step1 = 14;
    let step2 = 21;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;

      if (count <= step1) {
        this.stepper.selectedIndex = 0;
        return false;
      } else if (count <= step2) {
        this.stepper.selectedIndex = 1;
        return false;
      }
      else {
        console.log("else condition");
      }
    }
  }
}
