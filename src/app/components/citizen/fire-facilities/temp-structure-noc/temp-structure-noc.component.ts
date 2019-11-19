import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
	selector: 'app-temp-structure-noc',
	templateUrl: './temp-structure-noc.component.html',
	styleUrls: ['./temp-structure-noc.component.scss']
})
export class TempStructureNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	tempStructureNocForm: FormGroup;
	translateKey: string = 'temporaryStuctureFireNocScreen';

	formId: number;
	apiCode: string;

	// required attachment array
	uploadFilesArray: Array<any> = [];
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	//Lookups Array
	FS_COMMUNICATION_ARRANGEMENT: Array<any> = [];
	FS_SITTING_ARRANGEMENT: Array<any> = [];
	FS_WIRING_TYPE: Array<any> = [];

	/**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
	 * @param atp - Time Picker
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		public TranslateService: TranslateService,
		private atp: AmazingTimePickerService
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
			this.gettempStructureNocNewData();
			this.tempStructureNocFormControls();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.tempStructureNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		// this.dependentAttachment(this.tempStructureNocForm.get('policeCommisionerLetterNo').value, 'POLICE_COMMISIONER_LETTER');
		this.dependentAttachment(this.tempStructureNocForm.get('layoutPlanIncluded').value, 'LAY_OUT_PLAN');
		this.dependentAttachment(this.tempStructureNocForm.get('securityArrangement').value, 'SECURITY_ARRANGEMENT');
		this.dependentAttachment(this.tempStructureNocForm.get('landOwnerConsentIncluded').value, 'LAND_OWNER_CONCERN_LETTER');

	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.tempStructureNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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
		this.tempStructureNocForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to get form data
	 */
	gettempStructureNocNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.tempStructureNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;
				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.tempStructureNocForm.get('applicantNameGuj');
				let applicantNameValue = this.tempStructureNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.tempStructureNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
			this.FS_COMMUNICATION_ARRANGEMENT = res.FS_COMMUNICATION_ARRANGEMENT;
			this.FS_SITTING_ARRANGEMENT = res.FS_SITTING_ARRANGEMENT;
			this.FS_WIRING_TYPE = res.FS_WIRING_TYPE;
		});
	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	tempStructureNocFormControls() {
		this.tempStructureNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-TEMPSTRUCT',
			/* Step 1 controls start */
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],
			oldReferenceNumber: [{ value: null, disabled: true }],
			applicationDate: [{ value: null, disabled: true }],//not now
			officeContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			officeEmailId: [null, [Validators.required, Validators.maxLength(50)]],

			/* Step 2 controls start */
			fromDate: [null, [Validators.required, Validators.maxLength(10)]],
			toDate: [null, [Validators.required, Validators.maxLength(10)]],
			fromTime: [null, [Validators.required, Validators.maxLength(10)]],
			toTime: [null, [Validators.required, Validators.maxLength(10)]],
			forProgram: [null, [Validators.required, Validators.maxLength(50)]],
			forProgramGuj: [null, [Validators.required, Validators.maxLength(150)]],
			venue: [null, [Validators.required, Validators.maxLength(150)]],
			policeCommisionerLetterDate: [null],
			policeCommisionerLetterNo: [null, [Validators.required, Validators.maxLength(10)]],
			landOwnerConsentIncluded: [false, [Validators.required]],//true/false
			landOwnerConsentDescription: [null, [Validators.required, Validators.maxLength(200)]],
			organizeName: [null, [Validators.required, Validators.maxLength(150)]],
			organizeNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			organizerAddress: [null, [Validators.required, Validators.maxLength(200)]],
			organizerAddressGuj: [null, [Validators.required, Validators.maxLength(400)]],
			organizerContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			temporaryStructureAddress: [null, [Validators.required, Validators.maxLength(500)]],
			temporaryStructureAddressGuj: [null, [Validators.required, Validators.maxLength(1500)]],

			/* Step 3 controls start */
			fpNo: [null, [Validators.required, Validators.maxLength(8)]],
			rsNo: [null, [Validators.required, Validators.maxLength(8)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(8)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
			tpNo: [null, [Validators.required, Validators.maxLength(8)]],
			blockNo: [null, [Validators.required, Validators.maxLength(8)]],
			structurePurpose: [null, [Validators.required, Validators.maxLength(200)]],
			opNo: [null, [Validators.required, Validators.maxLength(5)]],
			noOfGatheringPersons: [null, [Validators.required, Validators.maxLength(10)]],
			noOfExits: [null, [Validators.required, Validators.maxLength(3)]],
			layoutPlanIncluded: [null, [Validators.required]],//true/false
			requiredNOCForArea: [null, [Validators.required, Validators.maxLength(10)]],

			/* Step 4 controls start */
			hazardousPerformanceDetail: [null, [Validators.required, Validators.maxLength(200)]],
			shamiyanaLength: [null, [Validators.required, Validators.maxLength(5)]],
			shamiyanaWidth: [null, [Validators.required, Validators.maxLength(5)]],
			archGateHeight: [null, [Validators.required, Validators.maxLength(5)]],
			archGateWidth: [null, [Validators.required, Validators.maxLength(5)]],
			approachedWayToVenue: [null, [Validators.required, Validators.maxLength(200)]],
			internalRoadWidth: [null, [Validators.required, Validators.maxLength(5)]],
			noOfFirefightingEquipment: [null, [Validators.required, Validators.maxLength(5)]],
			refillingCertificateAttached: [null, [Validators.required]],//true/false
			stageHeight: [null, [Validators.required, Validators.maxLength(3)]],
			stageWidth: [null, [Validators.required, Validators.maxLength(3)]],
			usageOfInflammable: [null, [Validators.required, Validators.maxLength(500)]],
			securityArrangement: [null, [Validators.required]],//true/false
			parkingArrangement: [null, [Validators.required]],//true/false
			exitNoSmokingSignboard: [null, [Validators.required]],//true/false
			preciseProgramPlaceHFL: [null, [Validators.required, Validators.maxLength(150)]],
			lightningArresterArrangement: [null, [Validators.required]],//true/false
			standbyFireEngineDemanded: [null, [Validators.required]],//true/false
			sittingArrangement: this.fb.group({
				code: [null, Validators.required]
			}),
			wiringType: this.fb.group({
				code: [null, Validators.required]
			}),
			communicationArrangementType: this.fb.group({
				code: [null, Validators.required]
			}),

			/* Step 5 controls start*/
			attachments: [],
			fileStatus:null
			/* Step 5 controls end */
		});
	}


	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 11;
		let step1 = 29;
		let step2 = 41;
		let step3 = 62;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			// console.log(flag);
			if (count <= step0) {
				this.fireFacilityConfig.currentTabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.fireFacilityConfig.currentTabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.fireFacilityConfig.currentTabIndex = 2;
				return false;
			} else if (count <= step3) {
				this.fireFacilityConfig.currentTabIndex = 3;
				return false;
			}
			else {
				console.log("else condition");
			}

		}
	}

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param ev - event
	 * @param index - index of child
	 */
	changeTimeFormat(ev: string, controlName: string) {
		if (ev && ev.length < 8) {
			ev = ev.concat(":00");
		}
		this.tempStructureNocForm.get(controlName).setValue(ev);
	}

	/**
	 * Method is used to open time picker.
	 * @param controlName - control name.
	 */
	openTimePicker(controlName: string) {
		const amazingTimePicker = this.atp.open({
			changeToMinutes: true,
			theme: 'material-purple',
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if (time.length == 5) {
				this.tempStructureNocForm.get(controlName).setValue(time + ":00");
			}
		});
	}

}

