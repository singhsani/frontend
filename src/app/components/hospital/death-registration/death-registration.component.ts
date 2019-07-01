import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper'
import { ValidationService } from '../../../shared/services/validation.service';
import { CommonService } from '../../../shared/services/common.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { ManageRoutes } from '../../../config/routes-conf';

import * as moment from 'moment';
import { HospitalConfig } from '../hospital-config';
import { Observable } from 'rxjs';
import { TranslateService } from '../../../shared/modules/translate/translate.service';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
	selector: 'app-death-registration',
	templateUrl: './death-registration.component.html',
	styleUrls: ['./death-registration.component.scss']
})
export class DeathRegistrationComponent implements OnInit {

	@ViewChild('stepper') stepper: MatStepper;
	@ViewChild('address') addressComp: any;



	requiredFeild: boolean;;
	/**
	   * file upload related declaration
	   */
	//private attachments: Array<any> = [];
	showButtons: boolean = false;
	uploadModel: any = {};
	response: any;
	translateKey = "deathRegScreen";
	addressTranslateKey = "addressScreen";
	basicTranslateKey = "basicDetailsScreen";
	uploadFileArray: Array<any> = [];
	//form related data.
	appId: number;
	apiCode: string;
	tabIndex: number = 0;


	isLinear: boolean = false;
	deathCertificateForm: FormGroup;
	submit: boolean = false;
	minBirthDate;
	minDeathDate;
	maxBirthDate = new Date();
	maxDeathDate = new Date();

	minTreatmentDate: any;

	maxTreatmentDate = new Date();

	//LookUps
	deathPlaces: Array<any> = [];
	DeceasedEducations: Array<any> = [];
	DeceasedOccupation: Array<any> = [];
	RelationShip: Array<any> = [];
	MedicalTreatmentOptions: Array<any> = [];
	Religion: Array<any> = [];
	Gender: Array<any> = [];
	ISYESNO: Array<any> = [];
	wardNoData: Array<any> = [];
	MaritalStatusData: Array<any> = [];
	IMMEDIATE_COD_Data: Array<any> = [];
	DEATH_REPORT_CORONER_Data: Array<any> = [];

	/**
	 * step labels
	 */
	stepLabel1 = 'deceased_details';
	stepLabel2 = 'death_details';
	stepLabel3 = 'address_details';
	stepLabel4 = 'applicant_details';
	stepLabel5 = 'upload_documents';

	/**
	 * deceasedAge for max vildation.
	 */
	deceasedAge: number = 100;
	minAge: number = 0;
	isFormSaved: boolean = false;

	config: HospitalConfig = new HospitalConfig('death');


	/**
	 * for guideline
	 */
	isGuideLineActive: boolean;

	listMessage: Array<string> = [
		"Unknown Category (whether deceased is unknown) is Mandatory",
		"Unknown Description (if deaceased is unknown)  is Mandatory",
		"Deceased First Name is Mandatory",
		"Deceased LastName is Mandatory",
		"Deceased First Name in Gujarati is Mandatory",
		"Deceased Last Name in Gujarati is Mandatory",
		"Gender Type is Mandatory",
		"Death Date is Mandatory",
		"Birth Date is Mandatory",
		"Death Time is Mandatory",
		"Marital Status is Mandatory",
		"Spouse First Name is Mandatory",
		"Spouse First Name in Gujarati is Mandatory",
		"Spouse Last Name is Mandatory",
		"Spouse Last Name in Gujarati is Mandatory",
		"Father Or Husband Name is Mandatory",
		"Mother Name is Mandatory",
		"Religion is Mandatory",
		"Education is Mandatory",
		"Occupation is Mandatory",
		"Female Death Reason (in case of female deceased) is Mandatory",
		"Death Place is Mandatory",
		"Medical Treatment is Mandatory",
		"Medical Reason is Mandatory",
		"Treatment Duration From is Mandatory",
		"Treatment Duration To is Mandatory",
		"Smoking Addiction is Mandatory",
		"Tobacco Addiction is Mandatory",
		"Sopari Addiction is Mandatory",
		"Alcohol Addiction is Mandatory",
		"Present Address is Mandatory",
		"Ward No is Mandatory",
		"Permanent Address is Mandatory",
		"Applicant Relation is Mandatory",
		"Given Attachemnt is Mandatory.",
	];

	message: string = `VMC - ERP Hospital Portal provides facility to registered hospital of Vadodara city to register birth
				and death record which are occurred in their hospital. Those registered records will be used to generate the Birth and
				Death certificate for the citizens of Vadodara City. Online Birth & Death Registration is the convenient and easy
				way to issue Birth & death Certificate for citizen of Vadodara City`

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private formService: HosFormActionsService,
		public translateService: TranslateService,
		private atp: AmazingTimePickerService
	) {
	}

	/**
	 * get form lookups data form api.
	 */
	getLookUpsData() {
		this.formService.getDataFromLookups().subscribe(respData => {
			this.deathPlaces = respData.PLACE;
			this.DeceasedEducations = respData.EDUCATION;
			this.DeceasedOccupation = respData.OCCUPATIONS;
			this.Gender = respData.GENDER;
			this.MedicalTreatmentOptions = respData.MEDICAL_TREATMENT;
			this.RelationShip = respData.RELATIONSHIP;
			this.Religion = respData.RELIGION;
			this.ISYESNO = respData.YES_NO;
			this.wardNoData = respData.WARD;
			this.MaritalStatusData = respData.MARITAL_STATUS_DEATH;
			this.IMMEDIATE_COD_Data = respData.IMMEDIATE_COD;
			this.DEATH_REPORT_CORONER_Data = respData.DEATH_REPORT_TO_CORONER;
		});
	}

	/**
	 * This method runs when page initialize first time.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
			/**
		     * if appId not found navigate to dashboard
		     */
			if (!this.appId) {
				this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
			} else {
				this.createDeathCertificateForm();
				this.getLookUpsData();
				this.getDeathCertData();
			}
		});
	}

	/**
     * Method is used to ensure form saved or not on user navigation.
     */
	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isFormSaved && this.deathCertificateForm.touched) {
			return confirm(this.config.CONFIRM_UNSAVE_SAVE_MESSAGE);
		}
		return true;
	}

	/**
	 * Method is used to get all data after form created or saved.
	 */
	getDeathCertData() {
		this.formService.getFormData(this.appId).subscribe((res) => {
			if (!res.canEdit) {
				this.isGuideLineActive = false;
			} else {
				this.isGuideLineActive = true;
			}
			this.deathCertificateForm.patchValue(res);
			this.config.documentList(res, this.uploadFileArray);
			if (res.birthDate) {
				this.birthFormatChanger({ value: new Date(res.birthDate) })
			}

			if (res.delayedPeriod != null) {
				if (Number(res.delayedPeriod) > this.config.daysInThisYear()) {
					this.mandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
					this.removeMandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
				} else if (Number(res.delayedPeriod) < this.config.daysInThisYear() && Number(res.delayedPeriod) > this.config.daysInThisMonth()) {
					this.mandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
					this.removeMandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
				}
			}
			else{
				this.removeMandatoryAttachment(["POLICE_INQUEST", "PM_REPORT","AFFIDAVIT_HEALTH_OFFICER_ORDER", "ORDER_EXECUTIVE_MAGISTRATE"]);
			}

			this.showButtons = true;

			//for unknown condition
			if (res.unknownCategory.code === undefined) {
				this.decider("NO")
			} else if (res.unknownCategory === {}) {
				this.decider("NO")
			} else {
				this.decider(res.unknownCategory.code);
			}

			if (this.deathCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
				this.deathCertificateForm.get('permanentAddress').disable();
			} else {
				this.deathCertificateForm.get('permanentAddress').enable();
			}

			if (!this.deathCertificateForm.controls.canEdit.value) {
				this.deathCertificateForm.disable();
			}

			/**
	         * Update Permanent Address If 'isPermanentPresentAddressSame' is checked.
	         */
			this.deathCertificateForm.controls.presentAddress.valueChanges.subscribe(data => {
				if (this.deathCertificateForm.get('isPermanentPresentAddressSame').get('code').value == "YES") {
					this.check({ checked: true });
				}
			});

			/**
			 * Catch Changes in form to make status updated.
			 */
			this.deathCertificateForm.valueChanges.subscribe(changeINForm => {
				this.isFormSaved = false;
				return;
			})

			this.deathCertificateForm.get('gender').valueChanges.subscribe(gender => {
				if (gender.code == 'FEMALE') {
					this.deathCertificateForm.get('femaleDeathReason').get('code').setValidators([Validators.required]);
					this.deathCertificateForm.get('femaleDeathReason').get('code').updateValueAndValidity();
					return;
				} else {
					this.deathCertificateForm.get('femaleDeathReason').get('code').reset();
					this.deathCertificateForm.get('femaleDeathReason').get('code').clearValidators();
					this.deathCertificateForm.get('femaleDeathReason').get('code').updateValueAndValidity();
				}
			})

		});
	}


	/**
	 * Method is used to provide alert on delay registration.
	 * @param delay - delay period
	 */
	delayAlert(delay: number) {
		console.log(delay)
		if (this.deathCertificateForm.get('unknownCategory').get('code').value == "YES") {
			this.mandatoryAttachment(["POLICE_INQUEST", "PM_REPORT"]);
			this.removeMandatoryAttachment(["ID_PROOF_DECEASED", "CREMATION_REPORT", "APPLICANT_ID_PROOF", "FORM_4A"]);
		} else {
			if (delay > this.config.daysInThisMonth() && delay < this.config.daysInThisYear()) {
				this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.LESS_YEAR_AND_MORE_30_MESSAGE);
				this.mandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
				this.removeMandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
			} else if (delay > this.config.daysInThisYear()) {
				this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.MORE_THAN_YEAR_MESSAGE);
				this.mandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
				this.removeMandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
			}
		}
	}


	/**
	 * Method is used to decide the deceased is known or unknown.
	 * @param event - Yes or No.
	 */
	decider(event) {
		if (event === "YES") {
			this.requiredFeild = false
			this.deathCertificateForm.get('unknownDescription').setValidators([Validators.required]);
			this.deathCertificateForm.get('gender').get('code').clearValidators();
			this.deathCertificateForm.get('religion').get('code').clearValidators()
			this.deathCertificateForm.get('maritalStatus').get('code').clearValidators();
			this.deathCertificateForm.get('education').get('code').clearValidators()
			this.deathCertificateForm.get('occupation').get('code').clearValidators()
			this.deathCertificateForm.get('deathPlace').get('code').clearValidators()
			this.deathCertificateForm.get('medicalTreatment').get('code').clearValidators()
			this.deathCertificateForm.get('medicalReason').get('code').clearValidators()
		} else if (event === "NO") {
			this.requiredFeild = true;
			this.deathCertificateForm.get('unknownDescription').reset();
			this.deathCertificateForm.get('unknownDescription').clearValidators();
			this.deathCertificateForm.get('gender').get('code').setValidators([Validators.required]);
			this.deathCertificateForm.get('religion').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('education').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('occupation').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('deathPlace').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalTreatment').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalReason').get('code').setValidators([Validators.required])
			if (Number(this.getDelayPeriod()) > this.config.daysInThisYear()) {
				this.mandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
				this.removeMandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
			} else if (Number(this.getDelayPeriod()) < this.config.daysInThisYear() && Number(this.getDelayPeriod()) > this.config.daysInThisMonth()) {
				this.mandatoryAttachment(["AFFIDAVIT_HEALTH_OFFICER_ORDER"]);
				this.removeMandatoryAttachment(["ORDER_EXECUTIVE_MAGISTRATE"]);
			}
		}

		this.upDateValidation(event);
	}

	/**
	 * Method is used to update validations of controls.
	 */
	upDateValidation(event: string) {
		this.deathCertificateForm.get('unknownDescription').updateValueAndValidity();
		this.deathCertificateForm.get('gender').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('maritalStatus').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('religion').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('education').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('occupation').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('deathPlace').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('medicalTreatment').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('medicalReason').get('code').updateValueAndValidity();
		if (event == "YES") {
			this.mandatoryAttachment(["POLICE_INQUEST", "PM_REPORT"]);
			this.removeMandatoryAttachment(["ID_PROOF_DECEASED", "CREMATION_REPORT", "APPLICANT_ID_PROOF", "FORM_4A"]);
		} else {
			this.mandatoryAttachment(["ID_PROOF_DECEASED", "CREMATION_REPORT", "APPLICANT_ID_PROOF", "FORM_4A"]);
			this.removeMandatoryAttachment(["POLICE_INQUEST", "PM_REPORT"]);
		}
	}

	mandatoryAttachment(arr: Array<any>) {
		arr.forEach(f => {
			this.uploadFileArray.find(d => d.documentIdentifier == f).mandatory = true;
		});
	}

	removeMandatoryAttachment(arr: Array<any>) {
		arr.forEach(f => {
			this.uploadFileArray.find(d => d.documentIdentifier == f).mandatory = false;
		});
	}


	/**
	 * Method is used to create death certificate form for known deceased.
	 */
	createDeathCertificateForm() {
		this.deathCertificateForm = this.fb.group({

			//step1(19)
			unknownCategory: this.fb.group({
				code: ["NO", [Validators.required]],
			}),
			unknownDescription: [null, [Validators.maxLength(100)]],
			deceasedFirstName: ['', [ValidationService.nameValidator]],
			deceasedMiddleName: ['', [ValidationService.nameValidator]],
			deceasedLastName: ['', [ValidationService.nameValidator]],
			deceasedFirstNameGuj: [''],
			deceasedMiddleNameGuj: [''],
			deceasedLastNameGuj: [''],
			gender: this.fb.group({
				code: [null],
			}),
			deathDate: [null],
			birthDate: [null],
			deathTime: [null, [Validators.required]],
			maritalStatus: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),

			spouseFirstName: null,
			spouseFirstNameGuj: null,
			spouseMiddleName: null,
			spouseMiddleNameGuj: null,
			spouseLastName: null,
			spouseLastNameGuj: null,

			fatherOrHusbandName: ['', [ValidationService.nameValidator]],
			motherName: ['', [ValidationService.nameValidator]],
			religion: this.fb.group({
				code: [null]
			}),
			religionOther: [null, [Validators.maxLength(500)]],
			education: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			deceasedOtherEducation: null,
			occupation: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			delayedPeriod: null,

			femaleDeathReason: this.fb.group({
				code: [null]
			}),

			//step 2(8)
			deathPlace: this.fb.group({
				code: [null],
				name: null
			}),
			otherPlace: [null, [Validators.maxLength(500)]],
			medicalTreatment: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			medicalReason: this.fb.group({
				code: [null]
			}),
			treatmentDurationFrom: null,
			treatmentDurationTo: null,
			//deathReason: ['', [Validators.maxLength(100)]],

			reportedToCoronor: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			immediateCOD1: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
			immediateCOD2: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			immediateCOD3: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			smokingAddiction: this.fb.group({
				code: ['NO', [Validators.required]],
				name: null
			}),
			smokingSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			tobaccoAddiction: this.fb.group({
				code: ['NO', [Validators.required]],
				name: null
			}),
			tobaccoSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			sopariAddiction: this.fb.group({
				code: ['NO', [Validators.required]],
				name: null
			}),
			sopariPanmasalaSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			alcoholAddiction: this.fb.group({
				code: ['NO', [Validators.required]],
				name: null
			}),
			alcoholSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],

			//step 3(3)
			//Present Address
			presentAddress: this.fb.group(this.addressComp.addressControls()),

			isPermanentPresentAddressSame: this.fb.group({
				code: null
			}),
			withinCityLimits: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null
			}),
			wardNo: this.fb.group({
				id: null,
				code: [null],
				name: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group(this.addressComp.addressControls()),

			//step 4
			//Applicant Data
			//Basic Details Component
			applicantRelation: this.fb.group({
				code: [null, [Validators.required]]
			}),
			relationOther: [null],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),

			//Attachments Data step 5
			attachments: [],

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
		});

	}

	/**
	 * Get Delay Period
	 */
	getDelayPeriod() {
		return this.deathCertificateForm.get('delayedPeriod').value;
	}


	/**
	 * Method is used to calculate the delay after date of death.
	 * @param event - pass date event.
	 */
	delayCalculator(event) {
		if (event) {
			this.deathCertificateForm.get('delayedPeriod').setValue(moment(new Date()).diff(event.value, 'days', false));
			this.delayAlert(this.deathCertificateForm.get('delayedPeriod').value);
		}
	}

	/**
	 * Method to change birthdate into desired (YYYY-MM-DD) format.
	 * @param event - date picker event.
	 */
	deathFormatChanger(event) {
		this.deathCertificateForm.get('deathDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * Method to change birthdate into desired (YYYY-MM-DD) format.
	 * @param event - date picker event.
	 */
	birthFormatChanger(event) {
		this.minDeathDate = event.value;
		//this.deathCertificateForm.get('deathDate').setValue(null);
		this.deathCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		this.deceasedAge = moment(new Date()).diff(event.value, 'years', false);

		//UPDATE VALUE AND VALIDITY OF SOME CONTROLS
		['smokingSince', 'tobaccoSince', 'sopariPanmasalaSince', 'alcoholSince'].forEach(control => {
			this.config.updateValueAndValidity(this.deathCertificateForm, control, [Validators.min(this.minAge), Validators.max(this.deceasedAge)])
		});
	}

	/**
	 * This method used to submit deceased data completely with valiation.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 28;
		let step2 = 46;
		let step3 = 51;
		let step4 = 54;
		let step5 = 58;
		//Check form validation.
		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step2) {
			this.tabIndex = 1;
			return false;
		} else if (count <= step3) {
			this.tabIndex = 2;
			return false;
		} else if (count <= step4) {
			this.tabIndex = 3;
			return false;
		} else if (count <= step5) {
			this.tabIndex = 4;
			return false;
		} else if (count >= 54 && count <= 60) {
			this.tabIndex = 3;
		}
	}

	/**
	 * Method is used to make permanent and delivery address similar if user check it.
	 * @param event - checkbox event.
	 */
	check(event) {
		let parentPermanentAddressType = this.deathCertificateForm.get('permanentAddress').get('addressType').value;
		if (event.checked) {
			this.deathCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("YES");
			this.deathCertificateForm.get('permanentAddress').setValue(this.deathCertificateForm.get('presentAddress').value);
			this.deathCertificateForm.get('permanentAddress').disable();
		} else if (!event.checked) {
			this.deathCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("NO");
			this.deathCertificateForm.get('permanentAddress').reset();
			this.deathCertificateForm.get('permanentAddress').enable();
		}
		this.deathCertificateForm.get('permanentAddress').get('addressType').setValue(parentPermanentAddressType);
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
			serviceFormId: this.appId,
		}
		return this.uploadModel;
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
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
				this.deathCertificateForm.get(controlName).setValue(time + ":00");
			}
		});
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
		this.deathCertificateForm.get(controlName).setValue(ev);
	}

	/**
	 * reset all spouse controlls
	 */
	resetSpouseCntrl(event: string) {
		let spouseDetails: Array<any> = ['spouseFirstName', 'spouseFirstNameGuj', 'spouseLastName', 'spouseLastNameGuj', 'spouseMiddleName', 'spouseMiddleNameGuj']
		if (event != "MARRIED" && event != "MARRIED_SEPERATE") {
			spouseDetails.forEach(d => {
				this.deathCertificateForm.get(d).reset();
				this.deathCertificateForm.get(d).clearValidators();
				this.deathCertificateForm.get(d).updateValueAndValidity();
			});
		} else {
			spouseDetails.forEach(d => {
				if (!['spouseMiddleName', 'spouseMiddleNameGuj'].includes(d))
					this.deathCertificateForm.get(d).setValidators([Validators.required]);
				this.deathCertificateForm.get(d).updateValueAndValidity();
			});
		}
	}

	/**
	 * reset 
	 * @param event 
	 */
	changeMedicalTreatment(event: string) {
		if (event == 'NO_MED_HELP_ATT') {
			this.deathCertificateForm.get('treatmentDurationFrom').reset();
			this.deathCertificateForm.get('treatmentDurationFrom').clearValidators();
			this.deathCertificateForm.get('treatmentDurationFrom').updateValueAndValidity();
			this.deathCertificateForm.get('treatmentDurationTo').reset();
			this.deathCertificateForm.get('treatmentDurationTo').clearValidators();
			this.deathCertificateForm.get('treatmentDurationTo').updateValueAndValidity();
		} else {
			this.deathCertificateForm.get('treatmentDurationFrom').setValidators([Validators.required]);
			this.deathCertificateForm.get('treatmentDurationTo').setValidators([Validators.required]);
			this.deathCertificateForm.get('treatmentDurationFrom').updateValueAndValidity();
			this.deathCertificateForm.get('treatmentDurationTo').updateValueAndValidity();
		}
	}
	/**
	 * change date format
	 * @param date 
	 * @param controlType 
	 */
	dateFormat(date, controlType: string) {
		this.deathCertificateForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}
}