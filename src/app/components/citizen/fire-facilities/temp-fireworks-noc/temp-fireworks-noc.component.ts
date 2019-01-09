import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import * as moment from 'moment';

@Component({
	selector: 'app-temp-fireworks-noc',
	templateUrl: './temp-fireworks-noc.component.html',
	styleUrls: ['./temp-fireworks-noc.component.scss']
})
export class TempFireworksNocComponent implements OnInit {

	tempFireworksNocForm: FormGroup;
	translateKey: string = 'tempFireworksFireNocScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	// required attachment array
	private uploadFilesArray: Array<any> = [];
	private showButtons: boolean = false;

	//Lookups Array
	FS_WIRING_TYPE: Array<any> = [];

	/**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private TranslateService: TranslateService
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
			this.gettempFireworksNocNewData();
			this.tempFireworksNocFormControls();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		
		// this.dependentAttachment(this.tempFireworksNocForm.get('applicationThroughPolice').value, 'LETTER_TO_APPLICANT');
		this.dependentAttachment(this.tempFireworksNocForm.get('securityArrangement').value, 'SECURITY_ARRANGEMENT');
		// this.dependentAttachment(this.tempFireworksNocForm.get('layoutPlanIncluded').value, 'LOCATION_MAP');
		this.dependentAttachment(this.tempFireworksNocForm.get('ownerConsentLetterIncluded').value, 'CONSENT_LETTER');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
		var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

		if (eventValue && fields) {
			fields.get('mandatory').setValue(true);
			if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
				this.uploadFilesArray.push({
					'labelName': fields.get('documentLabelEn').value,
					'fieldIdentifier': fields.get('fieldIdentifier').value,
					'documentIdentifier': dependedKey
				})
			}
		} else {
			if (fields) {
				fields.get('mandatory').setValue(false);
				var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
				if (indewx != -1) {
					this.uploadFilesArray.splice(indewx, 1);
				}
			}
		}

	}

    /**
     * This method is change date formate.
     * @param date : Input date(any format).
     * @param controlType : Input From Control.
     */
	dateFormate(date, controlType: string) {
		this.tempFireworksNocForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to get form data
	 */
	gettempFireworksNocNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.tempFireworksNocForm.patchValue(res);
				this.showButtons = true;

				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.tempFireworksNocForm.get('applicantNameGuj');
				let applicantNameValue = this.tempFireworksNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
				});
				this.requiredDocumentList();

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
			this.FS_WIRING_TYPE = res.FS_WIRING_TYPE;
		});
	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	tempFireworksNocFormControls() {
		this.tempFireworksNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-FIREWORKSHOP',
			/* Step 1 controls start */
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(10)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],
			oldReferenceNumber: [null, [Validators.maxLength(10)]],//not now
			applicationDate: [null],//not now

			/* Step 2 controls start */
			applicationThroughPolice: [false, [Validators.required]],//true/false
			temporaryShopAddress: [null, [Validators.required, Validators.maxLength(200)]],
			fromDate: [null, [Validators.required, Validators.maxLength(10)]],
			toDate: [null, [Validators.required, Validators.maxLength(10)]],
			noOfShops: [null, [Validators.required, Validators.maxLength(10)]],
			shopInVMCBoundry: [false, [Validators.required]],//true/false
			// requiredNOCForArea: [null, [Validators.required, Validators.maxLength(3)]],
			shopInOpenSpace: [null, [Validators.required, Validators.maxLength(150)]],
			ownerIsVMC: [false, [Validators.required]],//true/false
			ownerConsentLetterIncluded: [false, [Validators.required]],//true/false
			consentLetterDate: [null, [Validators.maxLength(100)]],//date
			propertyNo: [null, [Validators.required, Validators.maxLength(15)]],
			layoutPlanIncluded: [null, [Validators.required]],//true/false
			weatherExitShownInMap: [null, [Validators.required]],//true/false
			noOfExits: [null, [Validators.required, Validators.maxLength(3)]],
			usageOfInflammable: [null, [Validators.required, Validators.maxLength(500)]],

			/* Step 3 controls start */
			securityArrangement: [null, [Validators.required]],//true/false
			parkingArrangement: [null, [Validators.required]],//true/false
			exitNoSmokingSignboardProvision: [null, [Validators.required]],//true/false
			standbyFireEngineDemanded: [null, [Validators.required]],//true/false
			lastYearLicenceReceived: [null, [Validators.required]],//true/false
			vmcFeeReceiptNo: [null, [Validators.required, Validators.maxLength(12)]],
			wiringType: this.fb.group({
				code: [null, Validators.required]
			}),

			/* Step 4 controls start */
			attachments: []
			/* Attachment Step end */
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
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 8;
		let step1 = 30;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			// console.log(flag);
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

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}
}

