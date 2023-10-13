import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
	selector: 'app-water-tanker-app',
	templateUrl: './water-tanker-app.component.html',
	styleUrls: ['./water-tanker-app.component.scss']
})
export class WaterTankerAppComponent implements OnInit {

	waterTankerAppForm: FormGroup;
	applicantDetails : FormGroup;
	formDetails : FormGroup;
	translateKey: string = 'waterSupplyScreen';

	formId: number;
	apiCode: string;

	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();
	licenseConfiguration : LicenseConfiguration = new LicenseConfiguration();

	//Lookups Array
	FS_REQUIRE_IN: Array<any> = [];
	FS_REQUIRED_ON_FLOOR: Array<any> = [];
	FS_WATER_TANKER_PURPOSE: Array<any> = [];
	FS_MORNING: Array<any> = [];
	FS_EVENING: Array<any> = [];
	FS_AFTERNOON: Array<any> = [];
	REQUIRE_TIME: Array<any> = [];
	LOOKUP: any;

	disablepastDate = new Date(moment().format('YYYY-MM-DD'));
	appDate = moment(new Date()).add('day').toISOString();

	// required attachment array
	uploadFilesArray: Array<any> = [];

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
		private formService: FormsActionsService,
		public TranslateService: TranslateService,
		public fireFacilitiesService: FireFacilitiesService,
		private toaster: ToastrService,
		private commonService : CommonService
	) { }

	/**
	 * This method call initially required methods.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
			this.fireFacilitiesService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getLookupData();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getWaterTankerLicNewData();
			this.waterTankerAppFormControls();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getWaterTankerLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.waterTankerAppForm.patchValue(res);
				this.applicantDetails.patchValue(res);
				this.formDetails.patchValue(res)
        this.onChangeTime(res.requireIn.code);
       	this.fireFacilityConfig.isAttachmentButtonsVisible = true;
        let applicantNameGujFields = this.applicantDetails.get('applicantNameGuj');
				let applicantNameValue = this.applicantDetails.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.waterTankerAppForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
				});
				this.requiredDocumentList();
				this.resetsuggestedfields();
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
			this.FS_REQUIRED_ON_FLOOR = res.FS_REQUIRED_ON_FLOOR;
			this.FS_REQUIRE_IN = res.FS_REQUIRE_IN;
			this.FS_WATER_TANKER_PURPOSE = res.FS_WATER_TANKER_PURPOSE;
			this.FS_MORNING = res.FS_MORNING;
			this.FS_EVENING = res.FS_EVENING;
			this.FS_AFTERNOON = res.FS_AFTERNOON;
			this.onChangeTime(this.formDetails.get('requireIn').value.code);
		});
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.waterTankerAppForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		// this.dependentAttachment(this.waterTankerAppForm.get('trainedFiremanStaffKept').value, 'TRAIN_FIRE_PERSON_LIST');
	}
	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event
	 * @param dependedKey
	 */
	dependentAttachment(dependedKey: string) {
		var control = (<FormArray>this.waterTankerAppForm.get('serviceDetail').get('serviceUploadDocuments')).controls
		var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

		if (fields) {
			fields.get('mandatory').setValue(true);
			if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
				this.uploadFilesArray.push({
					'labelName': fields.get('documentLabelEn').value,
					'fieldIdentifier': fields.get('fieldIdentifier').value,
					'documentIdentifier': dependedKey
				})
			}
		} else {

			this.uploadFilesArray = [];
			// fields.get('mandatory').setValue(false);
			// var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
			// if (indewx != -1) {
			// 	this.uploadFilesArray.splice(indewx, 1);
			// }

		}

	}

	/**
	 * Method is used for get FS_REQUIRE_IN as per zone selection
	 * @param event : selected zone code
	 */
	onChangeTime(event) {
		this.REQUIRE_TIME = [];
		if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
			this.REQUIRE_TIME = this.LOOKUP[event];
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
	waterTankerAppFormControls() {

		/* Step 1 controls start */
		this.applicantDetails = this.fb.group({
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			email: [null, [Validators.required, Validators.maxLength(50), Validators.email, ValidationService.emailValidator]],
			applicationDate: [null, [Validators.required]],//not now
		})
		/* Step 1 controls end */

		/* Step 2 controls start */
		this.formDetails = this.fb.group({
			oldReferenceNumber: [null],
			requiredOnFloor: this.fb.group({
				code: [null, Validators.required]
			}),
			purpose: this.fb.group({
				code: [null, Validators.required]
			}),
			withinVMCBoundary: [null, [Validators.required]],
			requiredOnDate: [null, Validators.required],
			requireIn: this.fb.group({
				code: [null, Validators.required]
			}),
			requireAtTime: this.fb.group({
				code: [null, Validators.required]
			}),
			whoSuggested: [null, [Validators.maxLength(150)]],
			totalTankRequired: [null, [Validators.required, Validators.maxLength(1)]],
			totalAmount: [null, [Validators.maxLength(5)]],
			tankDeliveryAddress: [null, [Validators.required, Validators.maxLength(250)]]
		})
		/* Step 2 controls end */

		this.waterTankerAppForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-WATER',
			withinVMCBoundary: [null, [Validators.required]],
			requiredOnDate: [null, Validators.required],
			attachments: [],
			serviceDetail: this.fb.group({
				code: [null],
				name: [null],
				gujName: [null],
				feesOnScrutiny: [null],
				appointmentRequired: [null],
				serviceUploadDocuments: this.fb.array([])
			}),

		});

		this.commonService.createCloneAbstractControl(this.applicantDetails,this.waterTankerAppForm);
		this.commonService.createCloneAbstractControl(this.formDetails,this.waterTankerAppForm);
	}

	/**
	 * This method for reset dependent field.
	 */
	resetsuggestedfields() {
		this.applicantDetails.get('applicationDate').disable();
		if (this.formDetails.get('purpose').get('code').value == 'FS_SUGGESTED') {
			this.waterTankerAppForm.controls.whoSuggested.setValidators([Validators.required]);
			// console.log(this.waterTankerAppForm.get('serviceDetail').get('serviceUploadDocuments').value[0].mandatory)
			this.dependentAttachment('UPLOAD_LETTER');
		}
		else {
			this.waterTankerAppForm.get('whoSuggested').clearValidators();
			this.waterTankerAppForm.get('whoSuggested').reset();
			this.waterTankerAppForm.get('attachments').reset();
			this.dependentAttachment('');
		}
		this.waterTankerAppForm.get('whoSuggested').updateValueAndValidity();

	}

	/**
	 * This method required for calculation of total tanks fee.
	 */
	calculateTotalAmount() {
		if (this.formDetails.get('totalTankRequired').value && this.formDetails.controls.requiredOnFloor.get('code')) {
			this.fireFacilitiesService.getWaterTankersFee(this.formDetails.value).subscribe(
				res => {
					if(res.totalTanks != 9){
						let maxTank = 9;
						let tempTank = maxTank - res.totalTanks;
						if(tempTank < Number(this.formDetails.get('totalTankRequired').value)){
							this.toaster.warning('Water Tanker limit is fixed for 9. No booking is Acceptable');
							this.formDetails.get('totalTankRequired').reset();
						}else{
							this.formDetails.patchValue(res);
						}
					}else{
						this.formDetails.patchValue(res);
					}

				},
				err => {
					console.log(err.message)
				}
			);
		}
		else {
			this.formDetails.get('totalAmount').reset();
		}
	}

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
		this.resetsuggestedfields();
	}

	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {
		let step0 = 10;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step0) {
				this.fireFacilityConfig.currentTabIndex = 0;
				return false;
			}
			else {
				console.log("else condition");
			}

		}
	}

}
