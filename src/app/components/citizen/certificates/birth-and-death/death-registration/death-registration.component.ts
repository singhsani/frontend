import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper'

import { ManageRoutes } from './../../../../../config/routes-conf';
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../../.././shared/services/common.service';

import * as moment from 'moment';

@Component({
	selector: 'app-death-registration',
	templateUrl: './death-registration.component.html',
	styleUrls: ['./death-registration.component.scss']
})
export class DeathRegistrationComponent implements OnInit {

	@ViewChild('stepper') stepper: MatStepper;

	/**
	   * file upload related declaration
	   */
	private attachments: any[];
	private showButtons: boolean = false;
	private uploadModel: any = {};
	private response;
	private translateKey = "deathRegScreen";
	private addressTranslateKey = "addressScreen";
	private basicTranslateKey = "basicDetailsScreen";

	private showCheck: boolean = false;
	createCompleteForm: boolean = false;

	//form related data.
	private appId: number;
	apiCode: string;


	private isLinear: boolean = false;
	private deathCertificateForm: FormGroup;
	private submit: boolean = false;
	private minBirthDate;
	private minDeathDate ;
	private maxBirthDate = new Date();
	private maxDeathDate = new Date();
	private GujMedicalTreatmentOptions = [
		{
			code: "ORGANIZATIONAL",
			name: "સંસ્થાકીય",
			id: null
		},
		{
			code: "OTH_TN_ORG",
			name: "સંસ્થાકીય સિવાયના અન્ય",
			id: null
		},
		{
			code: "NO_MED_HELP_ATT",
			name: "કોઈ તબીબી મદદ પ્રાપ્ત",
			id: null
		}
	]

	//LookUps
	private deathPlaces: object[];
	private DeceasedEducations: Object[];
	private DeceasedOccupation: Object[];
	private States: Object[] = [
		{ id: 1, name: 'Andhra Pradesh', code: 'AND' },
		{ id: 2, name: 'Assam', code: 'AS' },
		{ id: 3, name: 'Gujarat', code: 'GUJ' },
		{ id: 4, name: 'Chhattisgarh', code: 'CH' },
		{ id: 5, name: 'Kerala', code: 'KL' },
		{ id: 6, name: 'Rajasthan', code: 'RJ' }
	];
	private District: Object[] = [
		{ id: 1, name: 'Surat' },
		{ id: 2, name: 'Vadodara' },
		{ id: 3, name: 'Gandhinagar' },
		{ id: 4, name: 'Ahmedabad' },
		{ id: 5, name: 'Anand' },
		{ id: 6, name: 'Jamnagar' }
	];
	private RelationShip: object[];
	private MedicalTreatmentOptions: object[];
	private Religion: Object[];
	private Gender: Object[];
	private ISYESNO: object[];

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private uploadFileService: UploadFileService,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private formService: FormsActionsService
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
		});
	}


	/**
	 * Method is used to get all data after form created or saved.
	 */
	getDeathCertData() {
		this.formService.getFormData(this.appId).subscribe((res) => {
			this.response = res;

			//for unknown condition
			if (res.unknownCategory.code === undefined) {
				this.decider("NO");
			} else if (res.unknownCategory === {}) {
				this.decider("NO");
			} else {
				this.decider(res.unknownCategory.code);
			}

			this.attachments = this.response.attachments;
			this.showButtons = true;
			this.createCompleteForm = true;
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
		});
		this.deathCertificateForm = this.createDeathCertificateForm();
		this.getDeathCertData();
		this.getLookUpsData();
	}

	/**
	 * Method is used to decide the deceased is known or unknown.
	 * @param event - Yes or No.
	 */
	decider(event) {
		if (event === "YES") {
			this.deathCertificateForm = this.createDeathCertificateFormUnknown();
		} else if (event === "NO") {
			this.deathCertificateForm = this.createDeathCertificateForm();
		}
		
		this.deathCertificateForm.patchValue(this.response);

		if (this.deathCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
			this.deathCertificateForm.get('presentAddress').disable();
		} else {
			this.deathCertificateForm.get('presentAddress').enable();
		}

		this.deathCertificateForm.get('unknownCategory').get('code').setValue(event);	
	}

	/**
	 * Method is used to create death certificate form for known deceased.
	 */
	createDeathCertificateForm(): FormGroup {
		return this.fb.group({

			//step1
			firstName: ['', [ValidationService.nameValidator, Validators.required]],
			middleName: ['', [ValidationService.nameValidator]],
			lastName: ['', [ValidationService.nameValidator, Validators.required]],
			gender: this.fb.group({
				code: ['', [Validators.required]],
			}),
			deathDate: ['', Validators.required],
			birthDate: ['', Validators.required],
			fatherOrHusbandName: ['', [ValidationService.nameValidator, Validators.required]],
			motherName: ['', [ValidationService.nameValidator, Validators.required]],
			religion: this.fb.group({
				code: ['', Validators.required]
			}),
			education: this.fb.group({
				code: ['', Validators.required]
			}),
			occupation: this.fb.group({
				code: ['', Validators.required]
			}),
			delayedPeriod: [''],
			femaleDeathReason: this.fb.group({
				code: ['', Validators.required]
			}),

			//step 2
			deathPlace: this.fb.group({
				code: ['', Validators.required],
				name: null
			}),
			otherPlace: null,
			medicalTreatment: this.fb.group({
				code: null
			}),
			medicalReason: this.fb.group({
				code: ['', [Validators.required]]
			}),
			deathReason: ['', [Validators.required, Validators.maxLength(100)]],
			smokingSince: null,
			tobaccoSince: null,
			sopariPanmasalaSince: null,
			alcoholSince: null,

			//step 3
			//Present Address
			presentAddress: this.fb.group(this.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				code: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group(this.addressControls()),

			//step 4
			//Applicant Data
			applicantAddress: this.fb.group(this.addressControls()),

			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			relationOther: [''],
			aadhaarNo: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],
			appHospitalName: ['', Validators.required],
			email: ['', [Validators.required, ValidationService.emailValidator]],
			contactNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],

			//Attachments Data step 5
			unknownCategory: this.fb.group({
				code: [null, [Validators.required]],
			}),
			unknownDescription: null,

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			attachments: [null, Validators.required],

			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: null,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
			canSubmit: null,
			serviceDetail: this.fb.group({
				code: null,
				feesOnScrutiny: null,
				gujName: null,
				name: null
			}),
		});
	}

	/**
	 * Method is used to create death certificate form for unknown deceased.
	 */
	createDeathCertificateFormUnknown(): FormGroup {
		return this.fb.group({
			//step1
			firstName: ['', [ValidationService.nameValidator]],
			middleName: ['', [ValidationService.nameValidator]],
			lastName: ['', [ValidationService.nameValidator]],
			gender: this.fb.group({
				code: ['', []],
			}),
			deathDate: ['',],
			birthDate: ['',],
			fatherOrHusbandName: [null, [ValidationService.nameValidator]],
			motherName: ['', [ValidationService.nameValidator,]],
			religion: this.fb.group({
				code: ['',]
			}),
			education: this.fb.group({
				code: ['',]
			}),
			occupation: this.fb.group({
				code: ['',]
			}),
			delayedPeriod: ['',],
			femaleDeathReason: this.fb.group({
				code: null
			}),

			//step 2
			deathPlace: this.fb.group({
				code: null
			}),
			otherPlace: null,
			medicalTreatment: this.fb.group({
				code: null
			}),
			medicalReason: this.fb.group({
				code: null
			}),
			deathReason: ['', [Validators.maxLength(100)]],
			smokingSince: null,
			tobaccoSince: null,
			sopariPanmasalaSince: null,
			alcoholSince: null,

			//step 3
			//Present Address
			presentAddress: this.fb.group(this.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				code: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group(this.addressControls()),

			//step 4
			//Applicant Data
			applicantAddress: this.fb.group(this.addressControls()),

			applicantRelation: this.fb.group({
				code: [null,]
			}),
			relationOther: null,
			aadhaarNo: [null, [ValidationService.aadharValidation]],
			appHospitalName: [ValidationService.nameValidator],
			contactNo: [null, [ValidationService.mobileNumberValidation]],
			email: [null, [ValidationService.emailValidator]],

			//Attachments Data step 5

			unknownCategory: this.fb.group({
				code: [null, [Validators.required]],
			}),
			unknownDescription: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			attachments: [],

			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
			canSubmit: null,
			createdDate: null,
			updatedDate: null,
			serviceDetail: this.fb.group({
				code: null,
				feesOnScrutiny: null,
				gujName: null,
				name: null
			}),

		});
	}

	/**
	 * Address Controls.
	 */
	addressControls()  {
		return {
			id: null,
			uniqueId: null,
			version: null,
			addressType: [''],
			houseNo: ['', [Validators.required, Validators.maxLength(5)]],
			tenamentNo: ['', Validators.maxLength(60)],
			buildingName: ['', Validators.maxLength(60)],
			state: ['', [Validators.required, Validators.maxLength(60)]],
			district: ['', [Validators.required, Validators.maxLength(60)]],
			talukaName: ['', [Validators.required, Validators.maxLength(60)]],
			pincode: ['', [Validators.maxLength(6), Validators.minLength(6)]],
			addressLine1: ['', Validators.maxLength(60)],
			addressLine2: ['', Validators.maxLength(60)],
			addressLine3: ['', Validators.maxLength(60)],
			village: ['', Validators.maxLength(60)]
		};
	}

	/**
	 * Method is used to calculate the delay after date of death.
	 * @param event - pass date event.
	 */
	delayCalculator(event) {
		let now = moment(new Date());
		let diff = moment.duration(now.diff(event.value));
		let delay = diff.days() + diff.months() * 30 + diff.years() * 365;
		this.deathCertificateForm.get('delayedPeriod').setValue(delay);
	}

	/**
	 * Method to change birthdate into desired (YYYY-MM-DD) format.
	 * @param event - date picker event.
	 */
	deathFormatChanger(event){
		this.deathCertificateForm.get('deathDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * Method to change birthdate into desired (YYYY-MM-DD) format.
	 * @param event - date picker event.
	 */
	birthFormatChanger(event) {
		this.minDeathDate = event.value;
		this.deathCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * This method used to submit deceased data completely with valiation.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 13;
		let step2 = 21;
		let step3 = 23;
		let step4 = 28;
		let step5 = 46;
		//Check form validation.
		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		} else if (count <= step2) {
			this.stepper.selectedIndex = 1;
			return false;
		} else if (count <= step3) {
			this.stepper.selectedIndex = 2;
			return false;
		} else if (count <= step4) {
			this.stepper.selectedIndex = 3;
			return false;
		} else if (count <= step5) {
			this.stepper.selectedIndex = 4;
			return false;
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
	 * Method is used to reset form data.
	 */
	stepReset() {
		this.stepper.reset();
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
			fieldIdentifier: indentifier,
			labelName: labelName,
			formPart: formPart,
			variableName: variableName,
			serviceFormId: this.appId,
		}
		return this.uploadModel;
	}
}