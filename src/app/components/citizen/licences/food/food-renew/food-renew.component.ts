
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { FoodService } from '../common/services/food.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-food-renew',
	templateUrl: './food-renew.component.html',
	styleUrls: ['./food-renew.component.scss']
})
export class FoodRenewComponent implements OnInit {

	foodRenewForm: FormGroup;
	translateKey: string = 'foodRenewScreen';

	formId: number;
	apiCode: string;
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

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber:""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.FoodService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayRenewLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			})
	}

	/**
	 * @param fb - Declare FormBuilder property.
	 * @param validationError - Declare validation service property
	 * @param formService - Declare form service property 
     * @param FoodService - Declare search API.
	 * @param commonService - Declare sweet alert.
	 */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private formService: FormsActionsService,
		private FoodService: FoodService,
		private location: Location
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
		this.foodRenewFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getFoodLicNewData();

		}
	}


	/**
   * This method is use to create new record for citizen.
   * @param searchData: exciting licence number data
   */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.foodRenewForm.patchValue(searchData);

			this.foodRenewForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				paymentStatus: res.paymentStatus,
				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode,
				applicationNo: res.applicationNo,

				periodFrom: res.periodFrom,
				periodTo: res.periodTo,
				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				// attachments: []
			});

			this.showButtons = true;

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * Method is used to get form data
	 */
	getFoodLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.foodRenewForm.patchValue(res);
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

			this.onChangeZone(this.foodRenewForm.get('firmZone').value.code);
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
			this.foodRenewForm.get('regOrLic').setValue('Registration');
			this.foodRenewForm.get('regOrLic').disable();
		}
		if (event == 'GREATER_THAN_12LK') {
			this.foodRenewForm.get('regOrLic').setValue('License');
			this.foodRenewForm.get('regOrLic').disable();

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
	foodRenewFormControls() {
		this.foodRenewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FL-REN',
			refNumber: [null],
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
			firmCity: [null, [Validators.required, Validators.maxLength(10)]],
			firmPincode: [null, [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
			mobileNo: [null, [Validators.maxLength(10)]],
			firmLandLineNo: [null, [ValidationService.telPhoneNumberValidator]],
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
