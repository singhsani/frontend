
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { UploadFileService } from '../../../shared/upload-file.service';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ManageRoutes } from '../../../config/routes-conf';


import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
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
	private uploadFileArray: Array<any> =
		[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Doctors Certificate', fieldIdentifier: '1.2' }];


	/**
	 * file upload related declaration
	 */
	uploadModel: any = {};

	/**
	 * form related helping data.
	 */
	appId: number;

	tabIndex: number = 0;

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
	private childs: FormArray;
	private Religion: object[];
	private ChildWeights: object[];
	private ISYESNO: object[];
	private checked: boolean;

	/**
	 * step labels
	 */
	private stepLabel1 = 'child_details';
	private stepLabel2 = 'fathers_details';
	private stepLabel3 = 'mothers_details';
	private stepLabel4 = 'family_details';
	private stepLabel5 = 'upload_documents';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formService: HosFormActionsService,
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private validationService: ValidationService,
		private fb: FormBuilder,
		private toastrService: ToastrService,
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
			birthPlace: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
				name: null
			}),
			otherPlace: null,
			isOrphan: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null
			}),
			childs: this.fb.array([this.createChildArray({
				birthDate: null,
				birthTime: null,
				childName: null,
				id: null,
				sex: {
					code: null
				},
				prematureInfantReason: null,
				uniqueId: null,
				version: null,
				weightGram: null,
				weightKg: {
					code: null
				}
			})]),
			noOfChilds: null,

			//step 2
			fatherFirstName: [null, [ValidationService.nameValidator, Validators.required]],
			fatherMiddleName: [null, [Validators.nullValidator]],
			fatherLastName: [null, [ValidationService.nameValidator, Validators.required]],
			fatherFirstNameGuj: [null],
			fatherMiddleNameGuj: [null],
			fatherLastNameGuj: [null],
			fatherEducation: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),
			fatherOtherEducation: null,
			fatherOccupations: this.fb.group({
				id: null,
				code: [null, Validators.required],
				name: null,
				gujName: null
			}),
			fatherAadharNumber: [null, [Validators.minLength(12), Validators.maxLength(12), ValidationService.aadharValidation]],

			//step 3
			motherFirstName: [null, [ValidationService.nameValidator, Validators.required]],
			motherMiddleName: [null, ValidationService.nameValidator],
			motherLastName: [null, [ValidationService.nameValidator, Validators.required]],
			motherFirstNameGuj: [null],
			motherMiddleNameGuj: [null],
			motherLastNameGuj: [null],
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
			motherPrevRegNumber: [null, [Validators.minLength(10), Validators.maxLength(10)]],
			petaKendraNumber: [null, [Validators.minLength(10), Validators.maxLength(10)]],
			motherMarriageAge: [null, [Validators.minLength(2), Validators.maxLength(2), Validators.required]],
			motherDeliveryAge: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],

			deliveryTreatment: this.fb.group({
				code: [null, [Validators.required]],
			}),
			deliveryType: this.fb.group({
				code: [null, Validators.required],
			}),
			delayPeriod: null,
			pregnancyDuration: ['', [Validators.required, ValidationService.stillPregnancyDurationValidation]],

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

			//step 5
			attachments: [null],

			//applicant details
			applicantHospitalName: [null, [ValidationService.nameValidator]],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
		})
	}

	/**
	 * Method is used to get child array.
	 */
	getChildData() {
		return this.stillBirthCertificateForm.get('childs') as FormArray;
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
				prematureInfantReason: null,
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
			prematureInfantReason: child.prematureInfantReason,
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
		if (this.getChildData().length >= 6) {
			this.commonService.openAlert("Warning", "Maximum Child Limit 6.", "warning");
		} else {
			this.getChildData().push(this.createChildArray(child));
			this.stillBirthCertificateForm.get('noOfChilds').setValue(this.getChildData().length);
		}
	}

	/**
	 * Method is used to delete child information from child array.
	 * @param childData - child data.
	 * @param index - index of child array
	 */
	deleteChild(childData: any, index: number) {
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.stillBirthCertificateForm.get('noOfChilds').value <= 1) {
				this.commonService.openAlert("Warning", "Atleast One Child Info Mandatory", "warning");
			} else {
				if (childData.id == null) {
					this.getChildData().removeAt(index);
					this.stillBirthCertificateForm.get('noOfChilds').setValue(this.stillBirthCertificateForm.get('noOfChilds').value - 1);
					this.toastrService.success('Child details has been removed.')
				} else {
					//call api get response than delete
					this.formService.deleteChildData(this.stillBirthCertificateForm.get('id').value, childData.id).subscribe(respData => {
						if (respData.success) {
							this.getChildData().removeAt(index);
							this.stillBirthCertificateForm.get('noOfChilds').setValue(this.getChildData().length);
							this.toastrService.success('Child details has been removed.')
						}
					})
				}

			}
		}
		);
	}

	/**
	 * Method is used to get saved still birth certificate form.
	 */
	getStillBirthFormData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.stillBirthCertificateForm.patchValue(res);
			this.childs = this.getChildData();

			while (this.getChildData().length) {
				this.childs.removeAt(0)
			}

			this.childs = res.childs;
			for (let child of res.childs) {
				this.addMoreChild(child);
			}

			//common for all only change form name
			if (this.stillBirthCertificateForm.get('isPermanentPresentAddressSame').get('code').value == 'YES') {
				this.stillBirthCertificateForm.get('parentPermanentAddress').disable();
			} else {
				this.stillBirthCertificateForm.get('parentPermanentAddress').enable();
			}

			this.showButtons = true;
			if (!this.stillBirthCertificateForm.controls.canEdit.value) {
				this.stillBirthCertificateForm.disable();
			}
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
	delayCalculator(event, i: number) {
		this.getChildData().at(i).get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		let now = moment(new Date());
		let currentDelayDate = String(this.getChildData().at(0).get('birthDate').value)
		let diff = moment.duration(now.diff(new Date(Number(currentDelayDate.split('-')[0]), Number(currentDelayDate.split('-')[1]) - 1, Number(currentDelayDate.split('-')[2]))));
		this.stillBirthCertificateForm.get('delayPeriod').setValue(diff.days() + diff.years() * 365 + diff.months() * 30);
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
	 * Method is used to get Gujarati Name.
	 * @param event - Event
	 * @param controlName - Control Name To update 
	 * @param arr - Array
	 */
	gujNameFinder(event, controlName, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].code === event) {
				if (arr[i].gujName === undefined) {
					this.stillBirthCertificateForm.get(controlName).get('gujName').setValue('');
					return;
				} else {
					this.stillBirthCertificateForm.get(controlName).get('gujName').setValue(arr[i].gujName);
					return;
				}
			}
		}
	}

	/**
	 * Method is used to open time picker.
	 */
	openTimePicker(i: number) {
		const amazingTimePicker = this.atp.open({
			theme: 'material-purple',
			changeToMinutes: true
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if (time.length == 5) {
				this.getChildData().at(i).get('birthTime').setValue(time + ":00");
			}
		});
	}

	changeTime(i: number, timeEvent){
		let time = moment(timeEvent).format("hh:mm:ss");
		this.getChildData().at(i).get('birthTime').setValue(time);
	}
	
	setTime(i: number){
		let date = this.getChildData().at(i).get('birthTime').value;
		if(date){
			let hr = date.split(':')[0];
			let min = date.split(':')[1];
			return new Date(0, 0, 0, hr, min);
		} else {
			return null
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
		let step3 = 33;
		let step4 = 37;
		let step5 = 37;

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
		} else if (count >= 59 && count <= 65) {
			this.tabIndex = 3;
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
	setDataValue(indentifier, labelName: string, formPart: string, variableName: string) {
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
