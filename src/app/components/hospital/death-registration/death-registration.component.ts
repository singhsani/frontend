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
	response:any;
	translateKey = "deathRegScreen";
	addressTranslateKey = "addressScreen";
	basicTranslateKey = "basicDetailsScreen";

	uploadFileArray: Array<any> =
		[{ labelName: 'Applicant Id Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Cremation Report', fieldIdentifier: '1.2' },
		{ labelName: 'Form 4A', fieldIdentifier: '1.3' },
		{ labelName: 'Deceased Id Proof', fieldIdentifier: '1.4' }]

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

	//LookUps
	deathPlaces: Array<any> = [];
	DeceasedEducations: Array<any> = [];
	DeceasedOccupation: Array<any> = [];
	RelationShip: Array<any> = [];
	MedicalTreatmentOptions: Array<any> = [];
	Religion: Array<any> = [];
	Gender: Array<any> = [];
	ISYESNO: Array<any> = [];

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
	constructor(
		private fb: FormBuilder,
		private router: Router,
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
			/**
		     * if appId not found navigate to dashboard
		     */
			if (!this.appId) {
				this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
			} else {
				this.createDeathCertificateForm();
				this.getDeathCertData();
				this.getLookUpsData();
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
			this.deathCertificateForm.patchValue(res);

			if (res.birthDate) {
				this.birthFormatChanger({ value: new Date(res.birthDate) })
			}

			if (res.delayedPeriod != null) {
				if (Number(res.delayedPeriod) > this.config.daysInThisYear()) {
					if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
						this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
					}
				} else if (Number(res.delayedPeriod) < this.config.daysInThisYear() && Number(res.delayedPeriod) > this.config.daysInThisMonth()) {
					if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
						this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
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

		});
	}


	/**
	 * Method is used to provide alert on delay registration.
	 * @param delay - delay period
	 */
	delayAlert(delay: number) {
		if (this.deathCertificateForm.get('unknownCategory').get('code').value == "YES") {
			this.uploadFileArray = [this.config.fileObjectCreater('Police Inquest', '1.5'), this.config.fileObjectCreater('Post Mortem Report', '1.6')];
		} else {
			if (delay > this.config.daysInThisMonth() && delay < this.config.daysInThisYear()) {
				if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
					if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
						this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					} else {
						this.uploadFileArray.pop();
						this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					}
				}
				this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.LESS_YEAR_AND_MORE_30_MESSAGE);
			} else if (delay > this.config.daysInThisYear()) {
				if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
					if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {

						this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
					} else {
						this.uploadFileArray.pop();
						this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
					}
				}
				this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.MORE_THAN_YEAR_MESSAGE);
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
			this.uploadFileArray = [this.config.fileObjectCreater('Police Inquest', '1.5'), this.config.fileObjectCreater('Post Mortem Report', '1.6')];
		} else if (event === "NO") {
			this.requiredFeild = true;
			this.deathCertificateForm.get('unknownDescription').reset();
			this.deathCertificateForm.get('unknownDescription').clearValidators();
			this.deathCertificateForm.get('gender').get('code').setValidators([Validators.required]);
			this.deathCertificateForm.get('religion').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('education').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('occupation').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('femaleDeathReason').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('deathPlace').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalTreatment').get('code').setValidators([Validators.required])
			this.deathCertificateForm.get('medicalReason').get('code').setValidators([Validators.required])
			this.upDateValidation()
			this.uploadFileArray = [this.config.fileObjectCreater('Applicant Id Proof', '1.1'), this.config.fileObjectCreater('Cremation Report', '1.2'), this.config.fileObjectCreater('Form 4A', '1.3'), this.config.fileObjectCreater('Deceased Id Proof', '1.4')];
			if (Number(this.getDelayPeriod()) > this.config.daysInThisYear()) {
				if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
					this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
				}
			} else if (Number(this.getDelayPeriod()) < this.config.daysInThisYear() && Number(this.getDelayPeriod()) > this.config.daysInThisMonth()) {
				if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
					this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
				}
			}
		}
	}

	/**
	 * Method is used to update validations of controls.
	 */
	upDateValidation() {
		this.deathCertificateForm.get('unknownDescription').updateValueAndValidity();
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

			//step1(19)
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
			deathReason: ['', [Validators.maxLength(100)]],
			smokingSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			tobaccoSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			sopariPanmasalaSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],
			alcoholSince: [null, [Validators.max(this.deceasedAge), Validators.min(this.minAge)]],

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
			relationOther: [null],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),

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
		let step1 = 19;
		let step2 = 28;
		let step3 = 31;
		let step4 = 34;
		let step5 = 35;
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
}