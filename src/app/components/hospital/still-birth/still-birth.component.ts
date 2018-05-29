
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { UploadFileService } from '../../../shared/upload-file.service';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ManageRoutes } from '../../../config/routes-conf';

import * as moment from 'moment';
import * as _ from 'lodash';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
	selector: 'app-still-birth',
	templateUrl: './still-birth.component.html',
	styleUrls: ['./still-birth.component.scss']
})

export class StillBirthComponent implements OnInit {


	@ViewChild('stepper') stepper: MatStepper;
	@ViewChild('address') addressComp: any;

	translateKey: string = 'stillBirthScreen';

	/**
	 * file upload related declaration
	 */
	uploadModel: any = {};
	private attachments: any[] = [];

	/**
	 * form related helping data.
	 */
	appId: number;
	public stillBirthCertificateForm: FormGroup;
	private minBirthDate: any;
	private maxBirthDate = new Date();
	private showButtons: boolean = false;
	private submit: boolean = false;
	apiCode: string;

	/**
	 * Still Birth Data LookUps.
	 */
	private BirthPlaces: object[];
	private Gender: Object[];
	private FatherEducations: object[];
	private FatherOccupation: object[];
	private MotherEducations: object[];
	private MotherOccupation: object[];
	private DeliveryTreatmentOptions: object[];
	private TypeOfDelivery: object[];
	private Religion: object[];
	private ChildWeights: object[];
	private ISYESNO: object[];
	private checked: boolean;

	/**
	 * Address Look Ups.
	 */
	private States: Object[] = [
		{
			id: 1,
			name: 'Andhra Pradesh'
		},
		{
			id: 2,
			name: 'Assam'
		},
		{
			id: 3,
			name: 'Gujarat'
		},
		{
			id: 4,
			name: 'Chhattisgarh'
		},
		{
			id: 5,
			name: 'Kerala'
		},
		{
			id: 6,
			name: 'Rajasthan'
		}
	];
	private District: Object[] = [
		{
			id: 1,
			name: 'Surat'
		},
		{
			id: 2,
			name: 'Vadodara'
		},
		{
			id: 3,
			name: 'Gandhinagar'
		},
		{
			id: 4,
			name: 'Ahmedabad'
		},
		{
			id: 5,
			name: 'Anand'
		},
		{
			id: 6,
			name: 'Jamnagar'
		}
	];
	private City: Object[] = [
		{
			id: 1,
			name: 'Surat'
		},
		{
			id: 2,
			name: 'Vadodara'
		},
		{
			id: 3,
			name: 'Gandhinagar'
		},
		{
			id: 4,
			name: 'Ahmedabad'
		},
		{
			id: 5,
			name: 'Anand'
		},
		{
			id: 6,
			name: 'Jamnagar'
		}

	];
	private Country: Object[] = [
		{
			id: 1,
			name: 'UK',
			code: 'uk'
		},
		{
			id: 2,
			name: 'US',
			code: 'us'
		},
		{
			id: 3,
			name: 'India',
			code: 'in'
		},
		{
			id: 4,
			name: 'France',
			code: 'fr'
		},
		{
			id: 5,
			name: 'Brazil',
			code: 'br'
		},
		{
			id: 6,
			name: 'China',
			code: 'ch'
		}
	];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: HosFormActionsService,
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private validationService: ValidationService,
		private fb: FormBuilder,
		private atp: AmazingTimePickerService) {
	}

	/**
	 * Method initialized First.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});
		this.createStillBirthForm();
		this.getStillBirthFormData();
		this.getLookUpData();
	}

	/**
	 * Method is used to create still birth certificate form.
	 */
	createStillBirthForm() {
		this.stillBirthCertificateForm = this.fb.group({

			//step 1 controls
			birthDate: [null, [Validators.required]],
			birthTime: [null, [Validators.required]],
			childName: [null, [ValidationService.fullNameValidator]],
			birthPlace: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null
			}),
			weightKg: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			weightGram: [null, [Validators.pattern('[0-9]+')]],
			gender: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null
			}),
			isOrphan: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			isTwins: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),

			//step 2
			fatherFirstName: [null, [ValidationService.nameValidator, Validators.required]],
			fatherMiddleName: [null, [Validators.nullValidator]],
			fatherLastName: [null, [ValidationService.nameValidator, Validators.required]],
			fatherEducation: this.fb.group({
				code: [null, [Validators.required]],
			}),
			fatherOccupations: this.fb.group({
				code: [null, [Validators.required]],
			}),
			fatherAadharNumber: [null, [ValidationService.aadharValidation]],

			//step 3
			motherFirstName: [null, [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: [null, ValidationService.nameValidator],
			motherLastName: [null, [ValidationService.nameValidator, Validators.required]],
			motherEducation: this.fb.group({
				code: [null, Validators.required]
			}),
			motherOccupations: this.fb.group({
				code: [null, Validators.required],
			}),
			motherAadharNumber: [null, [ValidationService.aadharValidation]],
			motherPrevRegNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
			petaKendraNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
			motherMarriageAge: [null, [Validators.minLength(2), Validators.maxLength(2), Validators.required]],
			motherDeliveryAge: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],

			deliveryTreatment: this.fb.group({
				code: [null, [Validators.required]],
			}),
			deliveryType: this.fb.group({
				code: [null, Validators.required],
			}),
			pregnancyDuration: ['', [Validators.required, ValidationService.stillPregnancyDurationValidation]],
			prematureInfantReason: ['', [Validators.required, Validators.maxLength(500)]],

			//step 4
			parentDeliveryAddress: this.fb.group(this.addressComp.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				code: null
			}),
			parentPermanentAddress: this.fb.group(this.addressComp.addressControls()),
			familyReligion: this.fb.group({
				code: null
			}),

			relationWithApplicant: this.fb.group({
				code: null
			}),

			//applicant details
			applicantHospitalName: [null, [ValidationService.nameValidator]],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
		})
	}

	/**
	 * Method is used to get saved still birth certificate form.
	 */
	getStillBirthFormData() {
		this.formService.getFormData(this.appId).subscribe(res => {

			//common for all only change form name
			if (this.stillBirthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
				this.stillBirthCertificateForm.get('parentPermanentAddress').disable();
			} else {
				this.stillBirthCertificateForm.get('parentPermanentAddress').enable();
			}

			this.attachments = res.attachments;
			this.stillBirthCertificateForm.patchValue(res);
			this.showButtons = true;
		});
	}


	/**
	 * Method is used to get LookUps related to still birth certificate form.
	 */
	getLookUpData() {
		this.formService.getDataFromLookups().subscribe(respData => {
			this.ChildWeights = respData.CHILD_WEIGHT;
			this.DeliveryTreatmentOptions = respData.DELIVERY_TREATMENT;
			this.TypeOfDelivery = respData.DELIVERY_TYPE;
			this.FatherEducations = respData.EDUCATION;
			this.MotherEducations = respData.EDUCATION;
			this.FatherOccupation = respData.OCCUPATIONS;
			this.MotherOccupation = respData.OCCUPATIONS;
			this.Gender = respData.GENDER;
			this.BirthPlaces = respData.PLACE;
			this.Religion = respData.RELIGION;
			this.ISYESNO = respData.YES_NO;
		})
	}

	/**
	   * Method is used to calculate the delay between current date and birth date.
	   * @param event - date event.
	   */
	delayCalculator(event) {
		let now = moment(new Date());
		let diff = moment.duration(now.diff(event.value));
		this.stillBirthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * 
	 */
	timepick() {
		if (String(this.stillBirthCertificateForm.get('birthTime').value).length == 5) {
			this.stillBirthCertificateForm.get('birthTime').
				setValue(String(this.stillBirthCertificateForm.get('birthTime').value).concat(":00"));
		}
	}

	/**
	 * 
	 */
	openTimePicker() {
		const amazingTimePicker = this.atp.open({
			theme: 'material-green',
			changeToMinutes: true,
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if (time.length == 5) {
				this.stillBirthCertificateForm.get('birthTime').
					setValue(time.concat(":00"));
			}
		});
	}


	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 9;
		let step2 = 15;
		let step3 = 29;
		let step4 = 33;
		let step5 = 37;

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
	   * Method to change birthdate into desired (YYYY-MM-DD) formet.
	   * @param event - date picker event.
	   */
	birthFormetChanger(event) {
		this.stillBirthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	   * Method is used to make permanent and delivery address similar if user check it.
	   * @param event - checkbox event.
	   */
	check(event) {
		let parentPermanentAddressType = this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressType').value;
		if (event.checked) {
			this.stillBirthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("YES");
			this.stillBirthCertificateForm.get('parentPermanentAddress').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').value);
			this.stillBirthCertificateForm.get('parentPermanentAddress').disable();
		} else if (!event.checked) {
			this.stillBirthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("NO");
			this.stillBirthCertificateForm.get('parentPermanentAddress').reset();
			this.stillBirthCertificateForm.get('parentPermanentAddress').enable();
		}
		this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressType').setValue(parentPermanentAddressType);
	}


	/**
	 * Method is used to reset form its a output event from action bar.
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
