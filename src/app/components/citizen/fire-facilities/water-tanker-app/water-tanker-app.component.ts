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

@Component({
	selector: 'app-water-tanker-app',
	templateUrl: './water-tanker-app.component.html',
	styleUrls: ['./water-tanker-app.component.scss']
})
export class WaterTankerAppComponent implements OnInit {

	waterTankerAppForm: FormGroup;
	translateKey: string = 'waterSupplyScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	private showButtons: boolean = false;

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

	// required attachment array
	private uploadFilesArray: Array<any> = [];

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
		private TranslateService: TranslateService,
		public fireFacilitiesService: FireFacilitiesService

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

				this.showButtons = true;
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.waterTankerAppForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
				});
				this.requiredDocumentList();
				this.resetsuggestedfields();
			} catch (error) {
				console.log(error.message)
			}
		});
	}

	/**
     * This Method for create attachment array in service detail
     * @param data : value of array
     */
	createDocumentsGrp(data?: any): FormGroup {
		return this.fb.group({
			// dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
			documentIdentifier: [data.documentIdentifier ? data.documentIdentifier : null],
			documentKey: [data.documentKey ? data.documentKey : null],
			documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
			documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
			fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
			formPart: [data.formPart ? data.formPart : null],
			id: [data.id ? data.id : null],
			isActive: [data.isActive],
			mandatory: [data.mandatory ? data.mandatory : false],
			maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
			requiredOnAdminPortal: [data.requiredOnAdminPortal],
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
			// version: [data.version ? data.version : null]
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
			this.onChangeTime(this.waterTankerAppForm.get('requireIn').value.code);
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
		// this.dependentAttachment(this.provisionalHospitalNocForm.get('trainedFiremanStaffKept').value, 'TRAIN_FIRE_PERSON_LIST');
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
		this.waterTankerAppForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-WATER',
			/* Step 1 controls start */
			oldReferenceNumber: [null],
			requiredOnFloor: this.fb.group({
				"code": [null, Validators.required]
			}),
			purpose: this.fb.group({
				"code": [null, Validators.required]
			}),
			whoSuggested: [null, [Validators.required, Validators.maxLength(150)]],
			withinVMCBoundary: [null, [Validators.required]],
			requiredOnDate: [null, Validators.required],
			requireIn: this.fb.group({
				"code": [null, Validators.required]
			}),
			requireAtTime: this.fb.group({
				"code": [null, Validators.required]
			}),
			totalTankRequired: [null, [Validators.required, Validators.maxLength(1)]],
			totalAmount: [null, [Validators.maxLength(5)]],
			tankDeliveryAddress: [null, [Validators.required, Validators.maxLength(200)]],

			// loinumber: [null]

			/* Step 4 controls start*/
			attachments: [],
			serviceDetail: this.fb.group({
				code: [null],
				name: [null],
				gujName: [null],
				feesOnScrutiny: [null],
				appointmentRequired: [null],
				serviceUploadDocuments: this.fb.array([])
			})
			/* Step 4 controls end */
		});
	}

	/**
	 * This method for reset purpose.
	 */
	resetsuggestedfields() {
	
		if (this.waterTankerAppForm.get('purpose').get('code').value != 'FS_SUGGESTED') {
			this.waterTankerAppForm.get('attachments').reset();
			this.waterTankerAppForm.controls.whoSuggested.reset();
		}
	}

	/**
	 * This method required for calculation of total tanks fee.
	 */
	calculateTotalAmount() {
		if (this.waterTankerAppForm.get('totalTankRequired').value && this.waterTankerAppForm.controls.requiredOnFloor.get('code')) {
			this.fireFacilitiesService.getWaterTankersFee(this.waterTankerAppForm.value).subscribe(
				res => {
					this.waterTankerAppForm.patchValue(res);
				},
				err => {
					console.log(err.message)
				}
			);
		}
		else {
			this.waterTankerAppForm.get('totalAmount').reset();
		}
	}

	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 13;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step0) {
				this.tabIndex = 0;
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
