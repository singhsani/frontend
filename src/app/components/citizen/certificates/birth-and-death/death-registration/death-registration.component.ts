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
	uploadModel: any = {};
	private response;
	private createForm: boolean = false;
	translateKey = "deathRegScreen";

	//form related data.
	private appId: number;
	apiCode: string;

	private isLinear: boolean = false;
	private deathCertificateForm: FormGroup;
	private submit: boolean = false;
	private minBirthDate;
	private maxBirthDate: any;
	private maxDeathDate = new Date();

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
			console.log(res.unknownCategory);
			if (res.unknownCategory.code == undefined) {
				this.decider("NO");
			} else if (res.unknownCategory == {}) {
				this.decider("NO");
			} else {
				this.decider(res.unknownCategory.code);
			}

			this.attachments = res.attachments;
			this.showButtons = true;
			this.createForm = true;
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

		//this.deathCertificateForm = this.createDeathCertificateForm();
		this.getDeathCertData();
		this.getLookUpsData();
	}

	/**
	 * Method is used to decide the deceased is known or unknown.
	 * @param event - Yes or No.
	 */
	decider(event) {
		console.log(event);
		if (event === "YES") {
			this.deathCertificateForm = this.createDeathCertificateFormUnknown();
		} else if (event === "NO") {
			this.deathCertificateForm = this.createDeathCertificateForm();
		}
		this.deathCertificateForm.patchValue(this.response);
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
			fatherOrHusbandName: [null, [ValidationService.nameValidator]],
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
			delayedPeriod: ['', Validators.required],
			femaleDeathReason: this.fb.group({
				code: ['', Validators.required]
			}),

			//step 2
			deathPlace: this.fb.group({
				code: ['', Validators.required],
				name: null
			}),
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
			presentAddress: this.fb.group({
				id: 3,
				uniqueId: null,
				version: null,
				addressType: "DR_PRESENT_ADDRESS",
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: ['Gujarat', [Validators.required]],
				district: ['Vadodara', [Validators.required]],
				talukaName: null,
				pincode: [null, [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group({
				id: 2,
				uniqueId: null,
				version: null,
				addressType: "DR_PERMANENT_ADDRESS",
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: ['Gujarat', [Validators.required]],
				district: ['Vadodara', [Validators.required]],
				talukaName: null,
				pincode: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			//step 4
			//Applicant Data
			applicantAddress: this.fb.group({
				id: 1,
				uniqueId: null,
				version: null,
				addressType: "DR_APPLICANT_ADDRESS",
				houseNo: '',
				tenamentNo: '',
				buildingName: '',
				state: ['Gujarat', Validators.required],
				district: ['Vadodara', Validators.required],
				talukaName: null,
				pincode: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),

			relationOther: [''],
			aadhaarNo: ['', [ValidationService.aadharValidation]],
			appHospitalName: ['', Validators.required],
			mobileNumber: ['', [Validators.required, ValidationService.mobileNumberValidation]],
			email: ['', [ValidationService.emailValidator]],

			//Attachments Data step 5
			attachments: [],
			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: 1,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: false,
			paymentStatus: null,
			canEdit: true,
			canDelete: true,
			canSubmit: true,
			createdDate: null,
			updatedDate: null,
			unknownCategory: this.fb.group({
				id: null,
				code: null,
				name: null
			}),
			unknownDescription: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceDetail: this.fb.group({
				code: null,
				feesOnScrutiny: null,
				gujName: null,
				name: null
			})
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
			lastName: ['', [ValidationService.nameValidator,]],
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
				code: ['',]
			}),

			//step 2
			deathPlace: this.fb.group({
				code: ['',],
				name: null
			}),
			medicalTreatment: this.fb.group({
				code: null
			}),
			medicalReason: this.fb.group({
				code: ['', []]
			}),
			deathReason: ['', [, Validators.maxLength(100)]],
			smokingSince: null,
			tobaccoSince: null,
			sopariPanmasalaSince: null,
			alcoholSince: null,

			//step 3
			//Present Address
			presentAddress: this.fb.group({
				id: 3,
				uniqueId: null,
				version: null,
				addressType: "DR_PRESENT_ADDRESS",
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: ['Gujarat', []],
				district: ['Vadodara', []],
				talukaName: null,
				pincode: [null, [, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group({
				id: 2,
				uniqueId: null,
				version: null,
				addressType: "DR_PERMANENT_ADDRESS",
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: ['Gujarat', []],
				district: ['Vadodara', []],
				talukaName: null,
				pincode: ['', [, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			//step 4
			//Applicant Data
			applicantAddress: this.fb.group({
				id: 1,
				uniqueId: null,
				version: null,
				addressType: "DR_APPLICANT_ADDRESS",
				houseNo: '',
				tenamentNo: '',
				buildingName: '',
				state: ['Gujarat',],
				district: ['Vadodara',],
				talukaName: null,
				pincode: ['', [, Validators.pattern('[0-9]+'), Validators.maxLength(6), Validators.minLength(6)]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			applicantRelation: this.fb.group({
				code: [null,]
			}),

			relationOther: [''],
			aadhaarNo: ['', [ValidationService.aadharValidation]],
			appHospitalName: ['',],
			mobileNumber: ['', [, ValidationService.mobileNumberValidation]],
			email: ['', [ValidationService.emailValidator]],

			//Attachments Data step 5
			attachments: [],
			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: 1,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: false,
			paymentStatus: null,
			canEdit: true,
			canDelete: true,
			canSubmit: true,
			createdDate: null,
			updatedDate: null,
			unknownCategory: this.fb.group({
				id: null,
				code: null,
				name: null
			}),
			unknownDescription: null,

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to calculate the delay after date of death.
	 * @param event - pass date event.
	 */
	delayCalculator(event) {
		this.maxBirthDate = event.value;
		let now = moment(new Date());
		let diff = moment.duration(now.diff(event.value));
		this.deathCertificateForm.get('deathDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		let delay = diff.days() + diff.months() * 30 + diff.years() * 365;
		this.deathCertificateForm.get('delayedPeriod').setValue(delay);
	}

	/**
	 * Method to change birthdate into desired (YYYY-MM-DD) formet.
	 * @param event - date picker event.
	 */
	birthFormetChanger(event) {
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
		if (event.checked) {
			this.deathCertificateForm.get('permanentAddress').get('houseNo').setValue(this.deathCertificateForm.get('presentAddress').get('houseNo').value);
			this.deathCertificateForm.get('permanentAddress').get('tenamentNo').setValue(this.deathCertificateForm.get('presentAddress').get('tenamentNo').value);
			this.deathCertificateForm.get('permanentAddress').get('buildingName').setValue(this.deathCertificateForm.get('presentAddress').get('buildingName').value);
			this.deathCertificateForm.get('permanentAddress').get('state').setValue(this.deathCertificateForm.get('presentAddress').get('state').value);
			this.deathCertificateForm.get('permanentAddress').get('district').setValue(this.deathCertificateForm.get('presentAddress').get('district').value);
			this.deathCertificateForm.get('permanentAddress').get('talukaName').setValue(this.deathCertificateForm.get('presentAddress').get('talukaName').value);
			this.deathCertificateForm.get('permanentAddress').get('pincode').setValue(this.deathCertificateForm.get('presentAddress').get('pincode').value);
			this.deathCertificateForm.get('permanentAddress').get('addressLine1').setValue(this.deathCertificateForm.get('presentAddress').get('addressLine1').value);
			this.deathCertificateForm.get('permanentAddress').get('addressLine2').setValue(this.deathCertificateForm.get('presentAddress').get('addressLine2').value);
			this.deathCertificateForm.get('permanentAddress').get('addressLine3').setValue(this.deathCertificateForm.get('presentAddress').get('addressLine3').value);
			this.deathCertificateForm.get('permanentAddress').get('village').setValue(this.deathCertificateForm.get('presentAddress').get('village').value);
		} else if (!event.checked) {
			this.deathCertificateForm.get('permanentAddress').get('houseNo').reset();
			this.deathCertificateForm.get('permanentAddress').get('tenamentNo').reset();
			this.deathCertificateForm.get('permanentAddress').get('buildingName').reset();
			this.deathCertificateForm.get('permanentAddress').get('state').reset();
			this.deathCertificateForm.get('permanentAddress').get('district').reset();
			this.deathCertificateForm.get('permanentAddress').get('talukaName').reset();
			this.deathCertificateForm.get('permanentAddress').get('pincode').reset();
			this.deathCertificateForm.get('permanentAddress').get('addressLine1').reset();
			this.deathCertificateForm.get('permanentAddress').get('addressLine2').reset();
			this.deathCertificateForm.get('permanentAddress').get('addressLine3').reset();
			this.deathCertificateForm.get('permanentAddress').get('village').reset();
		}
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