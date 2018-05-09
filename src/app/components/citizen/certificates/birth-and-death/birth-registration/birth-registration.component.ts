import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper'
import * as moment from 'moment';
import * as _ from 'lodash';
import { CommonService } from '../../.././../../shared/services/common.service'
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../../config/routes-conf';

@Component({
	selector: 'app-birth-registration-app',
	templateUrl: './birth-registration.component.html',
	styleUrls: ['./birth-registration.component.scss']
})
export class BirthRegistrationComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	/**
	 * file upload related declaration
	 */
	uploadModel: any = {};
	private attachments:any[]=[];

	/**
	 * form related helping data.
	 */
	appId: number;
	public birthCertificateForm: FormGroup;
	private minBirthDate: any;
	private maxBirthDate = new Date();

	private showButtons: boolean = false;
	private submit: boolean = false;

	//Address LookUps
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
		//'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat','Haryana',
		//'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur','Meghalaya',
		//'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand','West Bengal'
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

	//Birth Data LookUps
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


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private validationService: ValidationService,
		private fb: FormBuilder
	) {
		this.formService.apiType = 'birthReg';
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		if (!this.appId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		} else {
			this.createBirthCertForm();
			this.getBirthCertData();
			this.getLookUpsData();
		}

	}

	/**
	 * Method Is Initialized First
	 */
	ngOnInit() {
	}

	/**
	 * Method is used to create birth certificate form.
	 */
	createBirthCertForm() {
		this.birthCertificateForm = this.fb.group({

			birthDate: [null, Validators.required],
			birthTime: [null, [Validators.required, Validators.pattern('[0-2][0-4]:[0-5][0-9]:[0-5][0-9]')]],
			childName: ['', [ValidationService.nameValidator, Validators.required]],
			birthPlace: this.fb.group({
				id: 1,
				code: ['', Validators.required],
				name: ''
			}),
			weightKg: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			weightGram: [null, [Validators.pattern('[0-9][0-9][0-9]')]],
			sex: this.fb.group({
				id: null,
				code: [null, Validators.required],
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
			fatherFirstName: ['', [Validators.required, ValidationService.nameValidator]],
			fatherMiddleName: ['', [ValidationService.nameValidator]],
			fatherLastName: ['', [ValidationService.nameValidator, Validators.required]],

			fatherEducation: this.fb.group({
				id: null,
				code: [null,[Validators.required]],
				name: null
			}),

			fatherOccupations: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null
			}),
			fatherAadharNumber: [null, [ValidationService.aadharValidation]],

			//step 3
			motherFirstName: ['', [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: ['', [ValidationService.nameValidator]],
			motherLastName: ['', [ValidationService.nameValidator, Validators.required]],

			motherEducation: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),

			motherOccupations: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),

			motherAadharNumber: [null, [ValidationService.aadharValidation]],
			motherPrevRegNumber: ['', [Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')]],
			petaKendraNumber: ['', [Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')]],
			motherMarriageAge: null,
			motherDeliveryAge: null,
			totalAliveChild: null,
			deliveryTreatment: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			deliveryType: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),

			pregnancyDuration: ['', [Validators.required, ValidationService.pregnancyDurationValidation]],
			isPermanentPresentAddressSame: this.fb.group({
				id: null,
				code: null,
				name: null
			}),

			familyReligion: this.fb.group({
				id: null,
				code: null,
				name: null
			}),
			mobileNumber: null,
			aadharNumber: null,
			parentDeliveryAddress: this.fb.group({
				id: 1,
				uniqueId: null,
				version: null,
				addressType: null,
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: ['Vadodara', Validators.required],
				district: ['Gujarat', Validators.required],
				talukaName: ['',[Validators.required]],
				pincode: ['', [ValidationService.pinCodeValidation, Validators.required]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),
			parentPermanentAddress: this.fb.group({
				id: 2,
				uniqueId: null,
				version: null,
				addressType: null,
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: null,
				district: null,
				talukaName: null,
				pincode: ['', [ValidationService.pinCodeValidation, Validators.required]],
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),
			attachments: [],
			emailID: null,
			delayedPeriod: null,
			id: null,
			uniqueId: null,
			version: 0,
			serviceFormId: this.appId,
			createdDate: null,
			updatedDate: null,
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
			apiType: "birthReg"
		});
	}

	/**
	 * This method use for get the citizen data
	 */
	getBirthCertData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			if (res.isPermanentPresentAddressSame.code == "YES") {
				this.checked = true;
			} else {
				this.checked = false;
			}
			this.attachments = res.attachments;
			this.birthCertificateForm.patchValue(res);
			this.showButtons = true;
		});
	}

	/**
	 * Method is used to calculate the delay between current date and birth date.
	 * @param event - date event.
	 */
	delayCalculator(event) {
		let now = moment(new Date());
		let diff = moment.duration(now.diff(event.value));
		this.birthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
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
	 * Method is used to get all lookups from api. 
	 */
	getLookUpsData() {
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
	 * Method to change birthdate into desired (YYYY-MM-DD) formet.
	 * @param event - date picker event.
	 */
	birthFormetChanger(event) {
		this.birthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to make permanent and delivery address similar if user check it.
	 * @param event - checkbox event.
	 */
	check(event) {

		let parentPermanentAddressType = this.birthCertificateForm.get('parentPermanentAddress').get('addressType').value
		if (event.checked) {
			this.birthCertificateForm.value.isPermanentPresentAddressSame.code = "YES";
			this.birthCertificateForm.get('parentPermanentAddress').get('houseNo').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('houseNo').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('tenamentNo').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('tenamentNo').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('buildingName').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('buildingName').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('state').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('state').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('district').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('district').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('talukaName').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('talukaName').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('pincode').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('pincode').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine1').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('addressLine1').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine2').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('addressLine2').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine3').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('addressLine3').value);
			this.birthCertificateForm.get('parentPermanentAddress').get('village').setValue(this.birthCertificateForm.get('parentDeliveryAddress').get('village').value);
		} else if (!event.checked) {
			this.birthCertificateForm.value.isPermanentPresentAddressSame.code = "NO";
			this.birthCertificateForm.get('parentPermanentAddress').get('houseNo').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('tenamentNo').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('buildingName').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('state').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('district').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('talukaName').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('pincode').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine1').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine2').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('addressLine3').reset();
			this.birthCertificateForm.get('parentPermanentAddress').get('village').reset();
		}
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset(){
		this.stepper.reset();
	}

	/**
	 * Method is used to set data value to upload method.
	 * @param indentifier - file identifier
	 * @param labelName - file label name.
	 * @param formPart - file form part
	 * @param variableName - file variable name.
	 */
	setDataValue(indentifier: number,labelName:string,formPart:string,variableName:string) {

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
