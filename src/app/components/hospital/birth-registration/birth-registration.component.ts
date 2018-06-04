import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
import { Time } from '@angular/common';

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
	private disableONSubmit: boolean = false;
	private noOfChild = 0;
	private oldval;
	private newValue;

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
	private submit: boolean = false;
	private childs: FormArray;
	showChildData: boolean = false;
	selectedTime: any

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


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: HosFormActionsService,
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private validationService: ValidationService,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private atp: AmazingTimePickerService,
		private toastrService: ToastrService
	) {
	}

	/**
	 * Method Is Initialized First
	 */
	ngOnInit() {
		this.oldval = {
			code: "0"
		}
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		if (!this.appId) {
			this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
		} else {
			this.getLookUpsData();
			this.createBirthCertForm();
			this.getBirthCertData();
		}
	}

	openTimePicker(i: number) {
		const amazingTimePicker = this.atp.open({
			changeToMinutes: true,
			time: (new Date()).toTimeString().split(' ')[0],
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
			otherPlace: null,
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
			fatherOtherEducation:null,
			fatherOccupations: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null,
				gujName: null
			}),
			fatherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],

			//step 3 (17)
			motherFirstName: ['', [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: ['',  ValidationService.nameValidator],
			motherLastName: ['', [ValidationService.nameValidator, Validators.required]],
			motherFirstNameGuj: ['', [ Validators.required]],
			motherMiddleNameGuj: [''],
			motherLastNameGuj: ['', [Validators.required]],

			motherEducation: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),
			motherOtherEducation: null,

			motherOccupations: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),
			motherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],
			motherPrevRegNumber: ['', [Validators.minLength(20), Validators.maxLength(20)]],
			petaKendraNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
			motherMarriageAge: [null, [Validators.minLength(2), Validators.maxLength(2), Validators.required]],
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

			//step 5
			attachments: [null, [Validators.required]],
			delayedPeriod: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * This method use for get the citizen data
	 */
	getBirthCertData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			//this.attachments = res.attachments;
			this.birthCertificateForm.patchValue(res);
			this.childs = this.getChildData();

			while (this.getChildData().length) {
				this.childs.removeAt(0)
			}

			this.childs = res.childs;
			for (let child of res.childs) {
				this.addMoreChild(child);
			}

			//common for all only change form name
			if (this.birthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
				this.birthCertificateForm.get('parentPermanentAddress').disable();
			} else {
				this.birthCertificateForm.get('parentPermanentAddress').enable();
			}

			if (!this.birthCertificateForm.controls.canEdit.value){
				this.birthCertificateForm.disable();
			}

			this.showButtons = true;
		});
	}


	timepick(i: number) {
		if (String(this.getChildData()[i].get('birthTime').value).length == 5) {
			this.getChildData()[i].
				setValue(String(this.getChildData()[i].get('birthTime').value).concat(":00"));
		}
	}

	/**
	 * Method is used to calculate the delay between current date and birth date.
	 * @param event - date event.
	 */
	delayCalculator(event, i: number) {
		let now = moment(new Date());
		let diff = moment.duration(now.diff(event.value));
		this.getChildData().at(i).get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		if (this.birthCertificateForm.get('delayedPeriod').value === null){
			this.birthCertificateForm.get('delayedPeriod').setValue(diff.days() + diff.years() * 365 + diff.months() * 30);
		}
	}

	/**
	 * Method To get delay period.
	 */
	getDelayPeriod() {
		return this.birthCertificateForm.get('delayedPeriod').value;
	}


	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		this.submit = true;
		let step1 = 6;
		let step2 = 16;
		let step3 = 33;
		let step4 = 37;
		let step5 = 38;

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
		} else if (count >= 58 && count <= 64) {
			this.stepper.selectedIndex = 3;
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
			fieldIdentifier: indentifier,
			labelName: labelName,
			formPart: formPart,
			variableName: variableName,
			serviceFormId: this.appId,
		}
		return this.uploadModel;
	}

	getChildData() {
		return this.birthCertificateForm.get('childs') as FormArray;
	}

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

	addMoreChild(child) {

		if (this.getChildData().length >= 6) {
			this.commonService.openAlert("Warning", "Maximum Child Limit 6.", "warning");
		} else {
			this.getChildData().push(this.createChildArray(child));
			this.birthCertificateForm.get('noOfChilds').setValue(this.getChildData().length);
			this.setTotalChildAlive();
			
		}

	}

	setTotalChildAlive(){
		this.birthCertificateForm.get('totalAliveChild').setValue(this.birthCertificateForm.get('noOfChilds').value);
	}

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
}
