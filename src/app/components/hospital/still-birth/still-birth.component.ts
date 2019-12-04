
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ManageRoutes } from '../../../config/routes-conf';


import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Observable } from 'rxjs';
import { HospitalConfig } from '../hospital-config';
import { TranslateService } from '../../../shared/modules/translate/translate.service';

@Component({
	selector: 'app-still-birth',
	templateUrl: './still-birth.component.html',
	styleUrls: ['./still-birth.component.scss']
})

export class StillBirthComponent implements OnInit {


	@ViewChild('stepper') stepper: MatStepper;
	@ViewChild('address') addressComp: any;

	translateKey: string = 'stillBirthScreen';
	// uploadFileArray: Array<any> = [] =
	// 	[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
	// 	{ labelName: 'Doctors Certificate', fieldIdentifier: '1.2' }];

	uploadFileArray: Array<any> = [];

	/**
	 * file upload related declaration
	 */
	uploadModel: any = {};
	/**
	 * form related helping data.
	 */
	appId: number;
	tabIndex: number = 0;
	stillBirthCertificateForm: FormGroup;
	minBirthDate: any;
	maxBirthDate = new Date();
	showButtons: boolean = false;
	showChildAddButton: boolean = false;
	submit: boolean = false;
	apiCode: string;
	/**
	 * Still Birth Data LookUps.
	 */
	BirthPlaces: Array<any> = [];
	Gender: Array<any> = [];
	FatherEducations: Array<any> = [];
	FatherOccupation: Array<any> = [];
	MotherEducations: Array<any> = [];
	MotherOccupation: Array<any> = [];
	DeliveryTreatmentOptions: Array<any> = [];
	TypeOfDelivery: Array<any> = [];
	childs: FormArray;
	Religion: Array<any> = [];
	ChildWeights: Array<any> = [];
	ISYESNO: Array<any> = [];
	wardNoData: Array<any> = [];
	IMMEDIATE_COD_Data: Array<any> = [];
	CHILD_WEIGHT_GM: Array<any> = [];
	URBAN_PRIMARY_HEALTH_CENTER: Array<any> = [];
	MOTHER_DELIVERY_AGE: Array<any> = [];
	MOTHER_MARRIAGE_AGE: Array<any> = [];
	BIRTH_CERTI_MAILING_ADDRESS_TYPE: Array<any> = [];

	checked: boolean;
	/**
	 * step labels
	 */
	stepLabel1 = 'child_details';
	stepLabel2 = 'fathers_details';
	stepLabel3 = 'mothers_details';
	stepLabel4 = 'family_details';
	stepLabel5 = 'upload_documents';
	config: HospitalConfig = new HospitalConfig('still birth');
	isFormSaved: boolean = false;

	/**
	 * common guide line
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
		"Pregnancy Duration ",
		"Parent Delivery Address is Mandatory",
		"Ward Number is Mandatory",
		"Parent Permanent Address is Mandatory",
		"Family Religion is Mandatory",
		"Relation With Applicant is Mandatory",
		"Given Attachemnt is Mandatory.",
	];

	message: string = `VMC - ERP Hospital Portal provides facility to registered hospital of Vadodara city to register birth
				and death record which are occurred in their hospital. Those registered records will be used to generate the Birth and
				Death certificate for the citizens of Vadodara City. Online Birth & Death Registration is the convenient and easy
				way to issue Birth & death Certificate for citizen of Vadodara City`



	constructor(
		public route: ActivatedRoute,
		public formService: HosFormActionsService,
		public commonService: CommonService,
		public fb: FormBuilder,
		public toastrService: ToastrService,
		public translateService: TranslateService,
		public atp: AmazingTimePickerService) {
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

		// this.BIRTH_CERTI_MAILING_ADDRESS_TYPE //NOSONAR
	}

	/**
	 * Method is used to ensure form saved or not on user navigation.
	 */
	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isFormSaved && this.stillBirthCertificateForm.touched) {
			return confirm(this.config.CONFIRM_UNSAVE_SAVE_MESSAGE);
		}
		return true;
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
	 * Method is used to create still birth certificate form.
	 */
	createStillBirthForm() {
		this.stillBirthCertificateForm = this.fb.group({

			//step 1 controls
			birthPlace: this.fb.group({
				id: null,
				code: ['HOSPITAL', [Validators.required]],
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
				childNameGuj: null,
				id: null,
				sex: {
					code: null
				},
				prematureInfantReason: null,
				uniqueId: null,
				version: null,
				weightGram: {
					code: null
				},
				weightKg: {
					code: null
				},
				immediateCOD1: this.fb.group({
					code: null
				}),
				immediateCOD2: this.fb.group({
					code: null
				}),
				immediateCOD3: this.fb.group({
					code: null
				})
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
			motherPrevRegNumber: [null, [Validators.maxLength(20)]],
			mamtaRegNumber: [null, [Validators.maxLength(4)]],
			petaKendraNumber: this.fb.group({
				id: null,
				code: [null, [Validators.required]],
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
				code: [null, [Validators.required]],
			}),
			deliveryType: this.fb.group({
				code: [null, Validators.required],
			}),
			delayPeriod: null,
			pregnancyDuration: ['', [Validators.required, ValidationService.pregnancyDurationValidation]],

			//step 4
			parentDeliveryAddress: this.fb.group(this.addressComp.addressControls()),
			isPermanentPresentAddressSame: this.fb.group({
				code: null
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
			// birthCertiMailingAddressType: this.fb.group({
			// 	id: null,
			// 	code: [null, [Validators.required]],
			// 	name: null
			// }),
			parentPermanentAddress: this.fb.group(this.addressComp.addressControls()),
			familyReligion: this.fb.group({
				code: null
			}),
			familyReligionOther: null,

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
 * Used to caplture Change in birth place.
 * @param birthPlace - event
 */
	changeBirthPlace(birthPlace: string) {
		if (birthPlace != 'OTHER_PLACE') {
			this.stillBirthCertificateForm.get('otherPlace').clearValidators();
			this.stillBirthCertificateForm.get('otherPlace').updateValueAndValidity();
		}
	}

	/**
	 * Used to capture change in family religion.
	 * @param relogion - event
	 */
	changeFamilyReligion(relogion: string) {
		if (relogion != 'OTHER_RELIGION') {
			this.stillBirthCertificateForm.get('familyReligionOther').clearValidators();
			this.stillBirthCertificateForm.get('familyReligionOther').updateValueAndValidity();
		}
	}

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param time - event
	 * @param index - index of child
	 */
	changeBirthTime(time: string, index: number) {
		if (time && time.length < 8) {
			time = time.concat(":00");
		}
		this.getChildData().at(index).get('birthTime').setValue(time);
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
				childNameGuj: null,
				id: null,
				sex: this.fb.group({
					code: null
				}),
				prematureInfantReason: null,
				uniqueId: null,
				version: null,
				weightGram: this.fb.group({
					code: null
				}),
				weightKg: this.fb.group({
					code: null
				}),
				immediateCOD1: this.fb.group({
					code: null
				}),
				immediateCOD2: this.fb.group({
					code: null
				}),
				immediateCOD3: this.fb.group({
					code: null
				})
			}
		}
		return this.fb.group({
			birthDate: [child.birthDate, Validators.required],
			birthTime: [child.birthTime, Validators.required],
			childName: [child.childName, [ValidationService.nameValidator]],
			childNameGuj: child.childNameGuj,
			id: child.id,
			sex: this.fb.group({
				code: [child.sex.code, [Validators.required]]
			}),
			prematureInfantReason: child.prematureInfantReason,
			uniqueId: child.uniqueId,
			version: child.version,
			weightGram: this.fb.group({
				code: [child.weightGram.code, [Validators.required]]
			}),
			weightKg: this.fb.group({
				code: [child.weightKg.code, [Validators.required]]
			}),
			immediateCOD1: this.fb.group({
				code: [child.immediateCOD1.code, [Validators.required]]
			}),
			immediateCOD2: this.fb.group({
				code: [child.immediateCOD2.code]
			}),
			immediateCOD3: this.fb.group({
				code: [child.immediateCOD3.code]
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
			if (!res.canEdit) {
				this.isGuideLineActive = false;
			} else {
				this.isGuideLineActive = true;
			}
			this.stillBirthCertificateForm.patchValue(res);
			this.config.documentList(res, this.uploadFileArray);
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
			/**
			 * Call multiple child adder.
			 */
			if (res.childs.length > 1) {
				this.multipleChildAdder(true);
			}

			/**
			 * Catch Changes in form to make status updated.
			 */
			this.stillBirthCertificateForm.valueChanges.subscribe(changeINForm => {
				this.isFormSaved = false;
				return;
			})
		});
	}

	/**
	 * Method is used to get LookUps related to still birth certificate form.
	 */
	getLookUpData() {
		this.formService.getDataFromLookups().subscribe((respData) => {
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
			this.IMMEDIATE_COD_Data = respData.IMMEDIATE_COD;
			this.CHILD_WEIGHT_GM = respData.CHILD_WEIGHT_GM;
			this.URBAN_PRIMARY_HEALTH_CENTER = respData.URBAN_PRIMARY_HEALTH_CENTER;
			this.MOTHER_DELIVERY_AGE = respData.MOTHER_DELIVERY_AGE.sort((a, b) => {
				if (a.code >= b.code) {
					return 1;
				}
				return -1;
			});
			this.MOTHER_MARRIAGE_AGE = respData.MOTHER_MARRIAGE_AGE.sort((x, y) => {
				if (x.code >= y.code) {
					return 1;
				}
				return -1;
			});
			this.BIRTH_CERTI_MAILING_ADDRESS_TYPE = respData.BIRTH_CERTI_MAILING_ADDRESS_TYPE
		});


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

	changeTime(i: number, timeEvent) {
		let time = moment(timeEvent).format("hh:mm:ss");
		this.getChildData().at(i).get('birthTime').setValue(time);
	}

	setTime(i: number) {
		let date = this.getChildData().at(i).get('birthTime').value;
		if (date) {
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
}
