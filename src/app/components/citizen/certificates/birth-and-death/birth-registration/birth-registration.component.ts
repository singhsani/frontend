import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonService } from '../../.././../../shared/services/common.service'
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { AmazingTimePickerService } from 'amazing-time-picker';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
	selector: 'app-birth-registration-app',
	templateUrl: './birth-registration.component.html',
	styleUrls: ['./birth-registration.component.scss']
})
export class BirthRegistrationComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	@ViewChild('address') addressComp: any;

	/**
	 * file upload related declaration
	 */
	private checked: boolean;
	uploadModel: any = {};
	private attachments:any[]=[];
	private disableONSubmit: boolean = false;

	/**
	 * form related helping data.
	 */
	appId: number;
	apiCode: string;
	private translateKey = "birthRegScreen";
	private prevMode: boolean = false
	readOnly:boolean = false;

	public birthCertificateForm: FormGroup;
	private minBirthDate: any;
	private maxBirthDate = new Date();

	private showButtons: boolean = false;
	private submit: boolean = false;

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
	private NOOFCHILD = [
		{
			code:"2",
			name:"2",
			id: null

		},
		{
			code: "3",
			name: "3",
			id: null

		},
		{
			code: "4",
			name: "4",
			id: null

		},
		{
			code: "5",
			name: "5",
			id: null

		},
		{
			code: "6",
			name: "6",
			id: null
		}
	];


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private validationService: ValidationService,
		private fb: FormBuilder,
		private atp: AmazingTimePickerService
	) { 

		
	}

	/**
	 * Method Is Initialized First
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		if (!this.appId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		} else {
			this.createBirthCertForm();
			this.getBirthCertData();
			this.getLookUpsData();
		}
	}
	
	openTimePicker(){
		const amazingTimePicker = this.atp.open({
			theme: 'material-blue',
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if(time.length == 5){
				this.birthCertificateForm.get('birthTime').
					setValue(time.concat(":00"));
			}
		});
	}

	/**
	 * Method is used to create birth certificate form.
	 */
	createBirthCertForm() {
		this.birthCertificateForm = this.fb.group({

			birthDate: [null, Validators.required],
			birthTime: [null, [Validators.required]],
			childName: ['', [ValidationService.nameValidator]],
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
			weightGram: [null, [Validators.pattern('[0-9]+')]],
			sex: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			isOrphan: this.fb.group({
				id: null,
				code: ["NO", Validators.required],
				name: null
			}),
			isTwins: this.fb.group({
				id: null,
				code: ["NO", Validators.required],
				name: null
			}),
			//step 2
			fatherFirstName: ['', [Validators.required, ValidationService.nameValidator]],
			fatherMiddleName: ['', [Validators.required, ValidationService.nameValidator]],
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
			fatherAadharNumber: [null, [Validators.minLength(12),Validators.maxLength(12), ValidationService.aadharValidation]],

			//step 3
			motherFirstName: ['', [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: ['', [Validators.required, ValidationService.nameValidator]],
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
			motherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12),ValidationService.aadharValidation]],
			motherPrevRegNumber: ['', [Validators.minLength(20),Validators.maxLength(20)]],
			petaKendraNumber: ['', [Validators.minLength(10),Validators.maxLength(10)]],
			motherMarriageAge: [null, [Validators.minLength(2), Validators.maxLength(2),Validators.required]],
			motherDeliveryAge: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
			totalAliveChild: [null, [Validators.required, Validators.maxLength(2)]],

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
				code: [null, Validators.required],
				name: null
			}),
			parentDeliveryAddress: this.fb.group(this.addressComp.addressControls()),
			parentPermanentAddress: this.fb.group(this.addressComp.addressControls()),
			attachments: [null, [Validators.required]],
			delayedPeriod: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),

			
		});
	}

	/**
	 * This method use for get the citizen data
	 */
	getBirthCertData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			console.log(res);
			this.prevMode = !res.canEdit
			this.attachments = res.attachments;
			this.birthCertificateForm.patchValue(res);
			this.showButtons = true;
			
		});
	}

	timepick(){
		if (String(this.birthCertificateForm.get('birthTime').value).length == 5){
			this.birthCertificateForm.get('birthTime').
				setValue(String(this.birthCertificateForm.get('birthTime').value).concat(":00"));
		}
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
		console.log(count);
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
		} else if( count >=52 && count <= 58){
			this.stepper.selectedIndex = 3;
		}

	}

	/**
	 * Method is used to get all lookups from api. 
	 */
	getLookUpsData() {
		this.formService.getDataFromLookups().subscribe(respData => {
			console.log(respData);
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
		let parentPermanentAddressType = this.birthCertificateForm.get('parentPermanentAddress').get('addressType').value;
		if (event.checked) {
			this.readOnly = true;
			this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("YES");
			this.birthCertificateForm.get('parentPermanentAddress').setValue(this.birthCertificateForm.get('parentDeliveryAddress').value);
		} else if (!event.checked) {
			this.readOnly= false;
			this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("NO");
			this.birthCertificateForm.get('parentPermanentAddress').reset();
		}
		this.birthCertificateForm.get('parentPermanentAddress').get('addressType').setValue(parentPermanentAddressType);
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset(){
		this.stepper.reset();
	}

	// checkForm(){
	// 	console.log(this.birthCertificateForm.get('motherEducation').get('code').value);
	// }

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
