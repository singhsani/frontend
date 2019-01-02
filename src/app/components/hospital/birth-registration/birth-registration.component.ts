import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFileService } from '../../../shared/upload-file.service';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ManageRoutes } from '../../../config/routes-conf';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HospitalConfig } from '../hospital-config';

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
	private noOfChild = 0;
	private uploadFileArray: Array<any> =
		[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Doctors Certificate', fieldIdentifier: '1.2' },
		{ labelName: 'Kyc With Address Proof', fieldIdentifier: '1.3' },
		{ labelName: 'Aaya Id Proof', fieldIdentifier: '1.4' },
		{ labelName: 'Health Worker Report', fieldIdentifier: '1.5' },
		{ labelName: 'Applicant Id Kyc Proof', fieldIdentifier: '1.6' }]
	//private uploadFileArray: Array<any> = ['residentProof', 'doctorsCertificate', 'kycWithAddressProof', 'aayaIdProof', 'healthWorkerReport', 'applicantIdKycProof']

	/**
	 * form related helping data.
	 */
	appId: number;
	apiCode: string;
	private translateKey = "birthRegScreen";

	public birthCertificateForm: FormGroup;
	private minBirthDate: any;
	private maxBirthDate = new Date();

	private showButtons: boolean = false;
	private showChildAddButton: boolean = false;
	private submit: boolean = false;
	private childs: FormArray;
	showChildData: boolean = false;
	selectedTime: any;
	tabIndex: number = 0;

	//Birth Data LookUps
	private BirthPlaces: object[];
	private Gender: Object[];
	private FatherEducations: any[];
	private FatherOccupation: any[];
	private MotherEducations: any[];
	private MotherOccupation: any[];
	private DeliveryTreatmentOptions: object[];
	private TypeOfDelivery: object[];
	private Religion: object[];
	private ChildWeights: object[];
	private ISYESNO: object[];

	/**
	 * step labels
	 */
	private stepLabel1 = 'child_details';
	private stepLabel2 = 'fathers_details';
	private stepLabel3 = 'mothers_details';
	private stepLabel4 = 'family_details';
	private stepLabel5 = 'upload_documents';


	/**
	 * Using Common Configuration utilities.
	 */
	config: HospitalConfig = new HospitalConfig();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: HosFormActionsService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private atp: AmazingTimePickerService,
		private toastrService: ToastrService
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
				code: [null, [Validators.required]],
				name: null
			}),
			otherPlace: [null, [Validators.maxLength(500)]],
			isOrphan: this.fb.group({
				id: null,
				code: ["NO", Validators.required],
				name: null
			}),
			totalAliveChild: [null, [Validators.required, Validators.maxLength(2)]],

			childs: this.fb.array([this.createChildArray({
				birthDate: null,
				birthTime: new Date().getTime(),
				childName: null,
				id: null,
				sex: {
					code: null
				},
				uniqueId: null,
				version: null,
				weightGram: null,
				weightKg: {
					code: null
				}
			})]),
			noOfChilds: null,
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
			motherPrevRegNumber: [null, [Validators.minLength(20), Validators.maxLength(50)]],
			petaKendraNumber: [null, [Validators.minLength(10), Validators.maxLength(10), ValidationService.petaKendraNumber]],
			motherMarriageAge: [null, [Validators.required, Validators.min(18), Validators.minLength(2), Validators.maxLength(2)]],
			motherDeliveryAge: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
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
			totalBoyChildsBeforePregnancy: null,
			totalGirlChildsBeforePregnancy: null,
			totalChildsBeforePregnancy: null,


			//step 4(3)
			parentDeliveryAddress: this.fb.group(this.addressComp.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				id: null,
				code: null,
				name: null
			}),

			parentPermanentAddress: this.fb.group(this.addressComp.addressControls()),
			familyReligion: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			familyReligionOther: null,

			//step 5
			attachments: [null],
			delayPeriod: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * This method use for get the birth-certificate data.
	 */
	getBirthCertData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			//this.attachments = res.attachments;
			this.birthCertificateForm.patchValue(res);

			if (res.delayPeriod != null) {
				if (Number(res.delayPeriod) > this.config.daysInThisYear()) {
					if (!this.getFileObjectContained('1.8')) {
						this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
					}
				} else if (Number(res.delayPeriod) < this.config.daysInThisYear() && Number(res.delayPeriod) > this.config.daysInThisMonth()) {
					if (!this.getFileObjectContained('1.7')) {
						this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
					}
				}
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

			this.showButtons = true;

			/**
		     * Update Permanent Address If 'isPermanentPresentAddressSame' is checked.
		     */
			this.birthCertificateForm.controls.parentDeliveryAddress.valueChanges.subscribe(data => {
				if (this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == "YES") {
					this.check({ checked: true });
					return;
				}
			})
		});
	}

	/**
	 * Used to caplture Change in birth place.
	 * @param ev - birth place
	 */
	changeBirthPlace(birthPlace: string) {
		if (birthPlace != 'OTHER_PLACE') {
			this.birthCertificateForm.get('otherPlace').clearValidators();
			this.birthCertificateForm.get('otherPlace').updateValueAndValidity();
		}
	}

	/**
	 * Used to capture change in family religion.
	 * @param ev - religion
	 */
	changeFamilyReligion(religion: string) {
		if (religion != 'OTHER_RELIGION') {
			this.birthCertificateForm.get('familyReligionOther').clearValidators();
			this.birthCertificateForm.get('familyReligionOther').updateValueAndValidity();
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
	}

	/**
	 * Method Is used to reset other child birth date.
	 */
	resetOtherChildDates():void{
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
			let html = this.config.LESS_30_AND_MORE_21_MESSAGE;
			this.commonService.openAlert(this.config.DELAYED_BIRTH_REGISTRATION_TITLE, "", "warning", html);
			return;
		}
		else if (delay > this.config.daysInThisMonth() && delay < this.config.daysInThisYear()) {
			if (!this.getFileObjectContained('1.7')) {
				if (!this.getFileObjectContained('1.8')) {
					this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
				} else {
					this.uploadFileArray.pop();
					this.uploadFileArray.push(this.fileObjectCreater('Affidavit Or Health Order', '1.7'));
				}
			}
			let html = this.config.LESS_YEAR_AND_MORE_30_MESSAGE
			this.commonService.openAlert(this.config.DELAYED_BIRTH_REGISTRATION_TITLE, "", "warning", html);
			return;
		} else if (delay > this.config.daysInThisYear()) {
			if (!this.getFileObjectContained('1.8')) {
				if (!this.getFileObjectContained('1.7')) {
					this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
				} else {
					this.uploadFileArray.pop();
					this.uploadFileArray.push(this.fileObjectCreater('Court Order', '1.8'));
				}
			}
			let html = this.config.MORE_THAN_YEAR_MESSAGE;
			this.commonService.openAlert(this.config.DELAYED_BIRTH_REGISTRATION_TITLE, "", "warning", html);
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
		let step1 = 6;
		let step2 = 16;
		let step3 = 36;
		let step4 = 41;
		let step5 = 42;

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
	 * Gujarati Look Up Converter.
	 * @param event - selected event
	 * @param controlName - control name
	 * @param arr - passed lookup array
	 */
	gujNameFinder(event, controlName, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].code === event) {
				if (arr[i].gujName === undefined) {
					this.birthCertificateForm.get(controlName).get('gujName').setValue('');
					return;
				} else {
					this.birthCertificateForm.get(controlName).get('gujName').setValue(arr[i].gujName);
					return;
				}
			}
		}
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
				childName: null,
				id: null,
				sex: this.fb.group({
					code: null
				}),
				uniqueId: null,
				version: null,
				weightGram: null,
				weightKg: this.fb.group({
					code: null
				})
			}
		}
		return this.fb.group({
			birthDate: [child.birthDate, Validators.required],
			birthTime: [child.birthTime, Validators.required],
			childName: [child.childName, [ValidationService.nameValidator]],
			id: child.id,
			sex: this.fb.group({
				code: [child.sex.code, [Validators.required]]
			}),
			uniqueId: child.uniqueId,
			version: child.version,
			weightGram: child.weightGram,
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
		}
		);
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}
}


