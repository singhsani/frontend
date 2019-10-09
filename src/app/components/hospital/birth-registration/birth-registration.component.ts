import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ManageRoutes } from '../../../config/routes-conf';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HospitalConfig } from '../hospital-config';
import { Observable } from 'rxjs';
import { TranslateService } from '../../../shared/modules/translate/translate.service';

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
	uploadModel: any = {};
	noOfChild = 0;
	// uploadFileArray: Array<any> =
	// 	[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
	// 	{ labelName: 'Doctors Certificate', fieldIdentifier: '1.2' },
	// 	{ labelName: 'Kyc With Address Proof', fieldIdentifier: '1.3' },
	// 	{ labelName: 'Aaya Id Proof', fieldIdentifier: '1.4' },
	// 	{ labelName: 'Health Worker Report', fieldIdentifier: '1.5' },
	// 	{ labelName: 'Applicant Id Kyc Proof', fieldIdentifier: '1.6' }]

	uploadFileArray: Array<any> = [];

	//private uploadFileArray: Array<any> = ['residentProof', 'doctorsCertificate', 'kycWithAddressProof', 'aayaIdProof', 'healthWorkerReport', 'applicantIdKycProof']

	/**
	 * form related helping data.
	 */
	appId: number;
	apiCode: string;
	translateKey = "birthRegScreen";

	birthCertificateForm: FormGroup;
	minBirthDate: any;
	maxBirthDate = new Date();

	showButtons: boolean = false;
	showChildAddButton: boolean = false;
	submit: boolean = false;
	childs: FormArray;
	showChildData: boolean = false;
	selectedTime: any;
	tabIndex: number = 0;

	//Birth Data LookUps
	BirthPlaces: Array<any> = [];
	Gender: Array<any> = [];
	FatherEducations: Array<any> = [];
	FatherOccupation: Array<any> = [];
	MotherEducations: Array<any> = [];
	MotherOccupation: Array<any> = [];
	DeliveryTreatmentOptions: Array<any> = [];
	TypeOfDelivery: Array<any> = [];
	Religion: Array<any> = [];
	ChildWeights: Array<any> = [];
	CHILD_WEIGHT_GM: Array<any> = [];
	URBAN_PRIMARY_HEALTH_CENTER: Array<any> = [];
	ISYESNO: Array<any> = [];
	wardNoData: Array<any> = [];
	MOTHER_DELIVERY_AGE: Array<any> = [];
	MOTHER_MARRIAGE_AGE: Array<any> = [];
	BIRTH_CERTI_MAILING_ADDRESS_TYPE: Array<any> = [];


	/**
	 * step labels
	 */
	stepLabel1 = 'child_details';
	stepLabel2 = 'fathers_details';
	stepLabel3 = 'mothers_details';
	stepLabel4 = 'family_details';
	stepLabel5 = 'upload_documents';

	/**
	 * Regarding Form Save
	 */

	isFormSaved: boolean = false;


	/**
	 * Using Common Configuration utilities.
	 */
	config: HospitalConfig = new HospitalConfig('birth');

	/**
	 * for guideline
	 */

	isGuideLineActive: boolean;

	listMessage: Array<string> = [
		"Birth Place is Mandatory",
		"Birth Date is Mandatory.",
		"Birth Time is Mandatory.",
		"Child Weight is Mandatory.",
		"Gender type is Mandatory.",
		"Father’s First Name is Mandatory Father’s Last Name is Mandatory.",
		"Father’s Education Is mandatory Father’s Occupation is Mandatory.",
		"Mother’s First Name is Mandatory Mother’s Last Name is Mandatory.",
		"Mother’s Education Is mandatory Mother’s Occupation is Mandatory.",
		"Mamta Card no is mandatory Mother’s age at the time of delivery is mandatory.",
		"Mother’s age at time of said delivery is mandatory.",
		"Treatment taken during delivery is mandatory.",
		"Delivery Type is Mandatory.",
		"Duration of Pregnancy (in weeks) is Mandatory.",
		"Religion is Mandatory Both address is Mandatory.",
		"Given Attachemnt is Mandatory."
	];

	message: string = `VMC - ERP Hospital Portal provides facility to registered hospital of Vadodara city to register birth
				and death record which are occurred in their hospital. Those registered records will be used to generate the Birth and
				Death certificate for the citizens of Vadodara City. Online Birth & Death Registration is the convenient and easy
				way to issue Birth & death Certificate for citizen of Vadodara City`

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: HosFormActionsService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private atp: AmazingTimePickerService,
		private toastrService: ToastrService,
		private CD: ChangeDetectorRef,
		public translateService: TranslateService
	) {
	}

	/**
	 * Method Is Initialized First
	 */
	ngOnInit() {

		/**
		 * Getting route parameters from url.
		 */
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		/**
		 * if appId not found navigate to dashboard
		 */
		if (!this.appId) {
			this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
		} else {
			this.getLookUpsData();
			this.createBirthCertForm();
			this.getBirthCertData();
		}
	}

	/**
     * Method is used to ensure form saved or not on user navigation.
    */
	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isFormSaved && this.birthCertificateForm.touched) {
			return confirm(this.config.CONFIRM_UNSAVE_SAVE_MESSAGE);
		}
		return true;
	}

	/**
	 * Method is used to open time picker for birth registration.
	 * @param i - index of child.
	 */
	openTimePicker(i: number) {
		const amazingTimePicker = this.atp.open({
			changeToMinutes: true,
			theme: 'material-purple',
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if (time.length == 5) {
				this.getChildData().at(i).get('birthTime').setValue(time + ":00");
			}
		});
	}

	/**
	 * Method is used to create birth certificate form.
	 */
	createBirthCertForm() {
		this.birthCertificateForm = this.fb.group({

			//step 1(6)
			birthPlace: this.fb.group({
				id: 1,
				code: ['HOSPITAL', [Validators.required]],
				name: null
			}),
			otherPlace: [null, [Validators.maxLength(500)]],
			isOrphan: this.fb.group({
				id: null,
				code: ["NO", Validators.required],
				name: null
			}),
			noOfChilds: null,

			childs: this.fb.array([this.createChildArray({
				birthDate: null,
				birthTime: new Date().getTime(),
				certificateNumber :null,
				childName: null,
				childNameGuj : null,
				id: null,
				sex: {
					code: null
				},
				uniqueId: null,
				version: null,
				weightGram: {
					code: null
				},
				weightKg: {
					code: null
				}
			})]),
			//step 2(10)
			fatherFirstName: ['', [Validators.required, ValidationService.nameValidator]],
			fatherMiddleName: ['', [ValidationService.nameValidator]],
			fatherLastName: ['', [ValidationService.nameValidator, Validators.required]],
			fatherFirstNameGuj: ['', [Validators.required]],
			fatherMiddleNameGuj: [''],
			fatherLastNameGuj: ['', [Validators.required]],
			fatherEducation: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
			fatherOtherEducation: [null, [Validators.maxLength(100)]],
			fatherOccupations: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
			fatherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],

			//step 3 (17)
			motherFirstName: ['', [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: ['', ValidationService.nameValidator],
			motherLastName: ['', [ValidationService.nameValidator, Validators.required]],
			motherFirstNameGuj: ['', [Validators.required]],
			motherMiddleNameGuj: [''],
			motherLastNameGuj: ['', [Validators.required]],

			motherEducation: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),
			motherOtherEducation: [null, [Validators.maxLength(100)]],

			motherOccupations: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),

			motherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],
			motherPrevRegNumber: [null, [Validators.maxLength(20)]],
			mamtaRegNumber: [null, [Validators.required, Validators.maxLength(4)]],
			petaKendraNumber: this.fb.group({
				id: null,
				code: null,
				name: null,
				gujName: null
			}),
			motherMarriageAge: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
			motherDeliveryAge: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
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
			totalBoyChildsBeforePregnancy: null,
			totalGirlChildsBeforePregnancy: null,
			totalChildsBeforePregnancy: null,
			pregnancyDuration: ['', [Validators.required, ValidationService.pregnancyDurationValidation]],
			


			//step 4(3)
			familyReligion: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			familyReligionOther: null,
			parentDeliveryAddress: this.fb.group(this.addressComp.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				id: null,
				code: null,
				name: null
			}),
			withinCityLimits: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			wardNo: this.fb.group({
				id: null,
				code: [null],
				name: null
			}),

			birthCertiMailingAddressType: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			parentPermanentAddress: this.fb.group(this.addressComp.addressControls()),
			

			//step 5
			attachments: [null],
			delayPeriod: null,
			totalAliveChild: [null, [Validators.required, Validators.maxLength(2)]],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * This method use for get the birth-certificate data.
	 */
	getBirthCertData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			if (!res.canEdit) {
				this.isGuideLineActive = false;
			} else {
				this.isGuideLineActive = true;
			}
			this.birthCertificateForm.patchValue(res);

			//this.attachments = res.attachments;
			// res.serviceDetail.serviceUploadDocuments.forEach(app => {
			// 	(<FormArray>this.birthCertificateForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
			// });
			this.config.documentList(res, this.uploadFileArray);

			/**
			 * Change in mandatory documents.
			 */
			if (res.delayPeriod != null) {
				if (parseInt(res.delayPeriod) > this.config.daysInThisYear()) {
					this.uploadFileArray.find(d => d.documentIdentifier == "AFFIDAVIT_HEALTH_OFFICER_ORDER").mandatory = false;
					this.uploadFileArray.find(d => d.documentIdentifier == "ORDER_EXECUTIVE_MAGISTRATE").mandatory = true;

					// if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
					// 	this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
					// }
				} else if (Number(res.delayPeriod) < this.config.daysInThisYear() && Number(res.delayPeriod) > this.config.daysInThisMonth()) {
					this.uploadFileArray.find(d => d.documentIdentifier == "ORDER_EXECUTIVE_MAGISTRATE").mandatory = false;
					this.uploadFileArray.find(d => d.documentIdentifier == "AFFIDAVIT_HEALTH_OFFICER_ORDER").mandatory = true;

					// if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
					// 	this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					// }
				}
			} else {
				this.uploadFileArray.find(d => d.documentIdentifier == "AFFIDAVIT_HEALTH_OFFICER_ORDER").mandatory = false;
				this.uploadFileArray.find(d => d.documentIdentifier == "ORDER_EXECUTIVE_MAGISTRATE").mandatory = false;
			}


			//for Child Form Array.
			this.childs = this.getChildData();

			/**
			 * Make Child array empty
			 */
			while (this.getChildData().length) {
				this.childs.removeAt(0)
			}

			/**
			 * Update Child Array
			 */
			this.childs = res.childs;
			for (let child of res.childs) {
				this.addMoreChild(child);
			}

			/**
			 * Call multiple child adder.
			 */
			if (res.childs.length > 1) {
				this.multipleChildAdder(true);
			}

			//common for all only change form name
			if (this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
				this.birthCertificateForm.get('parentPermanentAddress').disable();
			} else {
				this.birthCertificateForm.get('parentPermanentAddress').enable();
			}

			/**
			 * disable form id does not have edit permission
			 */
			if (!this.birthCertificateForm.controls.canEdit.value) {
				this.birthCertificateForm.disable();
			}

			this.changeInBirthPlace(res.birthPlace.code);
			this.showButtons = true;


			/**
		     * Update Permanent Address If 'isPermanentPresentAddressSame' is checked.
		     */
			this.birthCertificateForm.controls.parentDeliveryAddress.valueChanges.subscribe(data => {
				if (this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == "YES") {
					this.check({ checked: true });
					return;
				}
			});

			//change ayaa's id proof.

			this.birthCertificateForm.controls.birthPlace.valueChanges.subscribe(birthPlace => {
				this.changeInBirthPlace(birthPlace.code);
				return;
			});

			/**
			 * form change subscriber
			 */
			this.birthCertificateForm.valueChanges.subscribe((changeINForm) => {
				if (this.birthCertificateForm.get('canEdit').value) {
					this.isFormSaved = false;
					return;
				}
			});
		});
	}



	/**
	 * Update birth place regarding changes.
	 * @param val - birth place type.
	 */
	changeInBirthPlace(val: string) {
		if (val == 'HOME') {
			this.uploadFileArray.find(f => f.documentIdentifier == 'AAYAS_REPORT_OR_DOCTOR_CERTIFICATE').mandatory = true;
		} else {
			this.uploadFileArray.find(f => f.documentIdentifier == 'AAYAS_REPORT_OR_DOCTOR_CERTIFICATE').mandatory = false;
		}
	}

	/**
	 * Method Is used to get proper child weight.
	 * @param index - child index
	 * @param evKg - child weight control in kgs.
	 * @param evGrm - child weight control in grams.
	 */
	calculateChildWeight(index: number, evKg: string, evGrm: string) {
		let ctrl = this.getChildData().at(index);
		if (parseInt(ctrl.get(evKg).get('code').value) == 0 && parseInt(ctrl.get(evGrm).get('code').value) < 300) {
			this.commonService.openAlert(this.config.Child_Weight_Error, this.config.MIN_CHILD_WEIGHT, "warning");
			ctrl.get(evKg).reset();
			ctrl.get(evGrm).reset();
			this.config
			return;
		}
	}

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param ev - event
	 * @param index - index of child
	 */
	changeBirthTime(ev: string, index: number) {
		if (ev && ev.length < 8) {
			ev = ev.concat(":00");
		}
		this.getChildData().at(index).get('birthTime').setValue(ev);
	}

	/**
	 * Method is used to calculate the delay between current date and birth date.
	 * @param event - date event.
	 */
	delayCalculator(event, i: number) {
		this.getChildData().at(i).get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		//delay period calculation on the basis of first child birth date.
		let now = moment(new Date());
		if (event.value) {
			let currentDelayDate = this.getChildData().at(0).get('birthDate').value;
			let diff = moment.duration(now.diff(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))));
			this.birthCertificateForm.get('delayPeriod').setValue(diff.days() + diff.years() * 365 + diff.months() * 30);
			if (i == 0) {
				this.resetOtherChildDates();
				this.maxBirthDate = moment(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))).add(+1, 'days').toDate();
				this.minBirthDate = moment(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))).add(-1, 'days').toDate();
				this.delayAlert(this.birthCertificateForm.get('delayPeriod').value);
			}
		} else {
			this.resetOtherChildDates();
		}
	}

	/**
	 * Method Is used to change the validation for first child birth date.
	 * @param index - index (trying to catch 0)
	 */
	resetDateValidation(index) {
		if (index == 0) {
			this.minBirthDate = null;
			this.maxBirthDate = new Date();
		} else {
			let currentDelayDate = this.getChildData().at(0).get('birthDate').value;
			this.maxBirthDate = moment(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))).add(+1, 'days').toDate();
			this.minBirthDate = moment(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))).add(-1, 'days').toDate();
		}
		this.CD.detectChanges();
	}

	/**
	 * Method Is used to reset other child birth date.
	 */
	resetOtherChildDates(): void {
		for (let k = 1; k < this.getChildData().length; k++) {
			let initForm = this.getChildData().at(k);
			initForm.get("birthDate").reset();
		}
	}


	/**
	 * Method To get delay period.
	 */
	getDelayPeriod() {
		return this.birthCertificateForm.get('delayPeriod').value;
	}

	/**
	 * Method is used to provide alert on delay registration.
	 * @param delay - delay period.
	 */
	delayAlert(delay: number) {
		if (delay > this.config.MIN_BIRTH_DATE_VALIDATION && delay < this.config.daysInThisMonth()) {
			this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.LESS_30_AND_MORE_21_MESSAGE);
			return;
		}
		else if (delay > this.config.daysInThisMonth() && delay < this.config.daysInThisYear()) {
			this.uploadFileArray.find(d => d.documentIdentifier == "AFFIDAVIT_HEALTH_OFFICER_ORDER").mandatory = true;
			this.uploadFileArray.find(d => d.documentIdentifier == "ORDER_EXECUTIVE_MAGISTRATE").mandatory = false;

			// if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
			// 	if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
			// 		this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
			// 	} else {
			// 		this.uploadFileArray.pop();
			// 		this.uploadFileArray.push(this.config.fileObjectCreater('Affidavit Or Health Order', '1.7'));
			// 	}
			// }
			this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.LESS_YEAR_AND_MORE_30_MESSAGE);
			return;
		} else if (delay > this.config.daysInThisYear()) {
			this.uploadFileArray.find(d => d.documentIdentifier == "ORDER_EXECUTIVE_MAGISTRATE").mandatory = true;
			this.uploadFileArray.find(d => d.documentIdentifier == "AFFIDAVIT_HEALTH_OFFICER_ORDER").mandatory = false;
			// if (!this.config.getFileObjectContained(this.uploadFileArray, '1.8')) {
			// 	if (!this.config.getFileObjectContained(this.uploadFileArray, '1.7')) {
			// 		this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
			// 	} else {
			// 		this.uploadFileArray.pop();
			// 		this.uploadFileArray.push(this.config.fileObjectCreater('Court Order', '1.8'));
			// 	}
			// }
			this.commonService.openAlert(this.config.DELAYED_REGISTRATION_TITLE, "", "warning", this.config.MORE_THAN_YEAR_MESSAGE);
			return;
		}
	}

	/**
	 * Method is used to calculate total child.
	 */
	totalChildCalculate() {
		let girlChild = this.birthCertificateForm.get('totalGirlChildsBeforePregnancy').value;
		let boyChild = this.birthCertificateForm.get('totalBoyChildsBeforePregnancy').value;
		if (girlChild && boyChild) {
			this.birthCertificateForm.get('totalChildsBeforePregnancy').setValue(parseInt(girlChild) + parseInt(boyChild))
		} else {
			this.birthCertificateForm.get('totalChildsBeforePregnancy').setValue(null);
		}
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 5;
		let step2 = 15;
		let step3 = 36;
		let step4 = 44;
		let step5 = 48;

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
		} else if (count >= 58 && count <= 64) {
			this.tabIndex = 3;
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
			this.wardNoData = respData.WARD;
			this.CHILD_WEIGHT_GM = respData.CHILD_WEIGHT_GM;
			this.URBAN_PRIMARY_HEALTH_CENTER = respData.URBAN_PRIMARY_HEALTH_CENTER;
			this.MOTHER_DELIVERY_AGE = respData.MOTHER_DELIVERY_AGE.sort((a, b) => {
				if (a.code >= b.code) {
					return 1;
				}
				return -1;
			});;
			this.MOTHER_MARRIAGE_AGE = respData.MOTHER_MARRIAGE_AGE.sort((a, b) => {
				if (a.code >= b.code) {
					return 1;
				}
				return -1;
			});
			this.BIRTH_CERTI_MAILING_ADDRESS_TYPE = respData.BIRTH_CERTI_MAILING_ADDRESS_TYPE;
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
			this.birthCertificateForm.get('parentPermanentAddress').disable();
			this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("YES");
			this.birthCertificateForm.get('parentPermanentAddress').setValue(this.birthCertificateForm.get('parentDeliveryAddress').value);
		} else if (!event.checked) {
			this.birthCertificateForm.get('parentPermanentAddress').enable();
			this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').setValue("NO");
			this.birthCertificateForm.get('parentPermanentAddress').reset();
		}
		this.birthCertificateForm.get('parentPermanentAddress').get('addressType').setValue(parentPermanentAddressType);
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
	 * Method is used to get child array.
	 */
	getChildData() {
		return this.birthCertificateForm.get('childs') as FormArray;
	}

	/**
	 * method is used to show and hide multiple child add button.
	 * @param event - boolean.
	 */
	multipleChildAdder(event) {
		if (event) {
			this.showChildAddButton = true
		} else {
			this.showChildAddButton = false
		}
	}

	/**
	 * Method is used to create child array.
	 * @param child - pass child object.
	 */
	createChildArray(child) {
		if (!child) {
			child = {
				birthDate: null,
				birthTime: null,
				certificateNumber: null,
				childName: null,
				childNameGuj: null,
				id: null,
				sex: this.fb.group({
					code: null
				}),
				uniqueId: null,
				version: null,
				weightGram: this.fb.group({
					code: null
				}),
				weightKg: this.fb.group({
					code: null
				})
			}
		}
		return this.fb.group({
			birthDate: [child.birthDate, Validators.required],
			birthTime: [child.birthTime, Validators.required],
			certificateNumber: child.certificateNumber,
			childName: [child.childName, [ValidationService.nameValidator]],
			childNameGuj: child.childNameGuj,
			id: child.id,
			sex: this.fb.group({
				code: [child.sex.code, [Validators.required]]
			}),
			uniqueId: child.uniqueId,
			version: child.version,
			weightGram: this.fb.group({
				code: [child.weightGram.code, [Validators.required]]
			}),
			weightKg: this.fb.group({
				code: [child.weightKg.code, [Validators.required]]
			})
		})
	}

	/**
	 * Method is used to add more child in array.
	 * @param child - Add child object.
	 */
	addMoreChild(child) {
		if (child) {
			this.updateMoreChild(child);
		} else {
			for (let k = 0; k < this.getChildData().length; k++) {
				let initForm = this.getChildData().at(k);
				if (initForm.invalid) {
					this.config.getAllErrors(initForm);
					this.commonService.openAlert("Child Details Error", this.config.ALL_FEILD_REQUIRED_MESSAGE + " of child " + (k + 1), "warning");
					return;
				}
			}
			this.updateMoreChild(child);
		}
	}

	/**
	 * Method Is used to update more child.
	 * @param child - child details
	 */
	protected updateMoreChild(child) {
		if (this.getChildData().length >= 6) {
			this.commonService.openAlert("Warning", "Maximum Child Limit 6.", "warning");
		} else {
			this.getChildData().push(this.createChildArray(child));
			this.birthCertificateForm.get('noOfChilds').setValue(this.getChildData().length);
			this.setTotalChildAlive();
		}
	}


	/**
	 * Mehtod is used to set total alive child and populated automatically.
	 */
	setTotalChildAlive() {
		this.birthCertificateForm.get('totalAliveChild').setValue(this.birthCertificateForm.get('noOfChilds').value);
	}

	/**
	 * Method is used to delete child information from child array.
	 * @param childData - child data.
	 * @param index - index of child array
	 */
	deleteChild(childData: any, index: number) {
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.birthCertificateForm.get('noOfChilds').value <= 1) {
				this.commonService.openAlert("Warning", "Atleast One Child Info Mandatory", "warning");
			} else {
				if (childData.id == null) {
					this.getChildData().removeAt(index);
					this.birthCertificateForm.get('noOfChilds').setValue(this.birthCertificateForm.get('noOfChilds').value - 1);
					this.setTotalChildAlive();
					this.toastrService.success('Child details has been removed.')
				} else {
					//call api get response than delete
					this.formService.deleteChildData(this.birthCertificateForm.get('id').value, childData.id).subscribe(respData => {
						if (respData.success) {
							this.getChildData().removeAt(index);
							this.birthCertificateForm.get('noOfChilds').setValue(this.getChildData().length);
							this.setTotalChildAlive();
							this.toastrService.success('Child details has been removed.')
						}
					})
				}

			}
		});
	}

	changeInCityLimits(ev : any){
		if(ev.value == 'YES'){
			this.birthCertificateForm.get('wardNo').get('code').setValidators([Validators.required])
			this.birthCertificateForm.get('wardNo').get('code').updateValueAndValidity()
		} else {
			this.birthCertificateForm.get('wardNo').get('code').reset()
			this.birthCertificateForm.get('wardNo').get('code').clearValidators()
			this.birthCertificateForm.get('wardNo').get('code').updateValueAndValidity()
		}
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}
}


