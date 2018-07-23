import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper'

import { ValidationService } from '../../../shared/services/validation.service';
import { UploadFileService } from '../../../shared/upload-file.service';
import { CommonService } from '../../../shared/services/common.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { ManageRoutes } from '../../../config/routes-conf';

import * as moment from 'moment';

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
	//private attachments: any[];
	private showButtons: boolean = false;
	private uploadModel: any = {};
	private response;
	private translateKey = "deathRegScreen";
	private addressTranslateKey = "addressScreen";
	private basicTranslateKey = "basicDetailsScreen";
	private uploadFileArray: Array<any> =
		[{ labelName: 'Applicant Id Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Cremation Report', fieldIdentifier: '1.2' },
		{ labelName: 'Form 4A', fieldIdentifier: '1.3' },
		{ labelName: 'Deceased Id Proof', fieldIdentifier: '1.4' }]

	//form related data.
	private appId: number;
	apiCode: string;
	tabIndex: number = 0;	


	private isLinear: boolean = false;
	private deathCertificateForm: FormGroup;
	private submit: boolean = false;
	private minBirthDate;
	private minDeathDate;
	private maxBirthDate = new Date();
	private maxDeathDate = new Date();

	//LookUps
	private deathPlaces: object[];
	private DeceasedEducations: Object[];
	private DeceasedOccupation: Object[];
	private RelationShip: object[];
	private MedicalTreatmentOptions: object[];
	private Religion: Object[];
	private Gender: Object[];
	private ISYESNO: object[];

	/**
	 * step labels
	 */
	private stepLabel1 = 'deceased_details';
	private stepLabel2 = 'death_details';
	private stepLabel3 = 'address_details';
	private stepLabel4 = 'applicant_details';
	private stepLabel5 = 'upload_documents';

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private uploadFileService: UploadFileService,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private formService: HosFormActionsService
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
	 * This method runs when page initialize first time.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});
		this.createDeathCertificateForm();
		this.getDeathCertData();
		this.getLookUpsData();
	}

	/**
	 * Method is used to get all data after form created or saved.
	 */
	getDeathCertData() {
		this.formService.getFormData(this.appId).subscribe((res) => {
			this.deathCertificateForm.patchValue(res);

			if (res.delayedPeriod != null) {
				if (Number(res.delayedPeriod) > this.daysInThisYear()) {
					if (!this.getFileObjectContained('1.8')) {
						this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
					}
				} else if (Number(res.delayedPeriod) < this.daysInThisYear() && Number(res.delayedPeriod) > this.daysInThisMonth()) {
					if (!this.getFileObjectContained('1.7')) {
						this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					}
				}
			}

			//this.attachments = res.attachments;
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
		});
	}
	/**
	 * Method is used to get file status.
	 * @param fieldIdentifier - file identifier.
	 */

	getFileObjectContained(fieldIdentifier: string) {
		let found: boolean = false;
		for (let i = 0; i < this.uploadFileArray.length; i++) {
			if (this.uploadFileArray[i].fieldIdentifier == fieldIdentifier) {
				found = true;
				break;
			}
		}
		return found;
	}

	/**
	 * Method is used to create file object.
	 * @param labelName - file labelName
	 * @param fieldIdentifier - file identifier
	 */
	fileObjectCreater(labelName, fieldIdentifier): any {
		return { labelName: labelName, fieldIdentifier: fieldIdentifier }
	}

	/**
	 * Method is used to get no of days in current month.
	 */
	daysInThisMonth() {
		var now = new Date();
		return (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
	}

	/**
	 * Method is used to get no of days in current year.
	 */
	daysInThisYear() {
		var now = new Date();
		if (now.getFullYear() % 4 === 0) {
			return 366;
		} else {
			return 365;
		}
	}

	/**
	 * Method is used to provide alert on delay registration.
	 * @param delay - delay period
	 */
	delayAlert(delay: number) {
		if (this.deathCertificateForm.get('unknownCategory').get('code').value == "YES"){
			this.uploadFileArray = [this.fileObjectCreater('Police Inquest', '1.5'), this.fileObjectCreater('Post Mortem Report', '1.6')];
		} else {
			if (delay > this.daysInThisMonth() && delay < this.daysInThisYear()) {
				if (!this.getFileObjectContained('1.7')) {
					if (!this.getFileObjectContained('1.8')) {
						this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					} else {
						this.uploadFileArray.pop();
						this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					}
				}
				let html = `<p>It will considered as delayed Death Registration because
			 registration date is more than 30 days and there will be extra attachment (Affidavit Or health Order) as well as fees.`
				this.commonService.openAlert("Delayed Registration", "", "", html);
			} else if (delay > this.daysInThisYear()) {
				if (!this.getFileObjectContained('1.8')) {
					if (!this.getFileObjectContained('1.7')) {

						this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
					} else {
						this.uploadFileArray.pop();
						this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
					}
				}
				let html = `<p>It will considered as delayed Death Registration because
			 registration date is more than 1 year and there will be extra attachment (Court Order) as well as fees.`
				this.commonService.openAlert("Delayed Registration", "", "", html);
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
			this.deathCertificateForm.get('education').get('code').clearValidators()
			this.deathCertificateForm.get('occupation').get('code').clearValidators()
			this.deathCertificateForm.get('femaleDeathReason').get('code').clearValidators()
			this.deathCertificateForm.get('deathPlace').get('code').clearValidators()
			this.deathCertificateForm.get('medicalTreatment').get('code').clearValidators()
			this.deathCertificateForm.get('medicalReason').get('code').clearValidators()
			this.upDateValidation();
			this.uploadFileArray = [this.fileObjectCreater('Police Inquest', '1.5'), this.fileObjectCreater('Post Mortem Report', '1.6')];
		} else if (event === "NO") {
			this.requiredFeild = true;
			this.deathCertificateForm.get('gender').get('code').setValidators(Validators.required);
			this.deathCertificateForm.get('religion').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('education').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('occupation').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('femaleDeathReason').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('deathPlace').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalTreatment').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalReason').get('code').setValidators([Validators.required])
			this.upDateValidation()
			this.uploadFileArray = [this.fileObjectCreater('Applicant Id Proof', '1.1'), this.fileObjectCreater('Cremation Report', '1.2'), this.fileObjectCreater('Form 4A', '1.3'), this.fileObjectCreater('Deceased Id Proof', '1.4')];
			if (Number(this.getDelayPeriod()) > this.daysInThisYear()) {
				if (!this.getFileObjectContained('1.7')) {
					this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
				}
			} else if (Number(this.getDelayPeriod()) < this.daysInThisYear() && Number(this.getDelayPeriod()) > this.daysInThisMonth()) {
				if (!this.getFileObjectContained('1.8')) {
					this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
				}
			}
		}
	}

	/**
	 * Method is used to update validations of controls.
	 */
	upDateValidation() {
		this.deathCertificateForm.get('gender').get('code').updateValueAndValidity();
		this.deathCertificateForm.get('religion').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('education').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('occupation').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('femaleDeathReason').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('deathPlace').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('medicalTreatment').get('code').updateValueAndValidity()
		this.deathCertificateForm.get('medicalReason').get('code').updateValueAndValidity()
	}

	/**
	 * Method is used to create death certificate form for known deceased.
	 */
	createDeathCertificateForm() {
		this.deathCertificateForm = this.fb.group({

			//step1(18)
			unknownDescription: [null, [Validators.maxLength(500)]],
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
			fatherOrHusbandName: ['', [ValidationService.nameValidator]],
			motherName: ['', [ValidationService.nameValidator]],
			religion: this.fb.group({
				code: [null]
			}),
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
			otherPlace: null,
			medicalTreatment: this.fb.group({
				id: null,
				code: [null],
				name: null,
				gujName: null
			}),
			medicalReason: this.fb.group({
				code: [null]
			}),
			deathReason: ['', [Validators.maxLength(100)]],
			smokingSince: null,
			tobaccoSince: null,
			sopariPanmasalaSince: null,
			alcoholSince: null,

			//step 3(3)
			//Present Address
			presentAddress: this.fb.group(this.addressComp.addressControls()),

			isPermanentPresentAddressSame: this.fb.group({
				code: null
			}),

			//Permanent Address
			permanentAddress: this.fb.group(this.addressComp.addressControls()),

			//step 4
			//Applicant Data
			//Basic Details Component
			applicantRelation: this.fb.group({
				code: [null, [Validators.required]]
			}),
			relationOther: [''],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),

			// aadhaarNo: ['', [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],
			// appHospitalName: null,
			// email: ['', [ValidationService.emailValidator]],
			// contactNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],

			//Attachments Data step 5
			attachments: [],
			unknownCategory: this.fb.group({
				code: ["NO", [Validators.required]],
			}),


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
	 * Gujarati Look Up Converter.
	 * @param event - selected event
	 * @param controlName - control name
	 * @param arr - passed lookup array
	 */
	gujNameFinder(event, controlName, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].code === event) {
				if (arr[i].gujName === undefined) {
					this.deathCertificateForm.get(controlName).get('gujName').setValue('');
					return;
				} else {
					this.deathCertificateForm.get(controlName).get('gujName').setValue(arr[i].gujName);
					return;
				}
			}
		}
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
		this.delayAlert(this.deathCertificateForm.get('delayedPeriod').value);
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
		this.deathCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * This method used to submit deceased data completely with valiation.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 18;
		let step2 = 27;
		let step3 = 30;
		let step4 = 33;
		let step5 = 34;
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
}