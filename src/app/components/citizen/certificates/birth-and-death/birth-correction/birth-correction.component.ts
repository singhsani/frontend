import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-birth-correction',
	templateUrl: './birth-correction.component.html',
	styleUrls: ['./birth-correction.component.scss']
})
export class BirthCorrectionComponent implements OnInit {

	// @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	// @ViewChild(MatStepLabel) steplable: MatStepLabel;
	//@ViewChild('address') addressComp: any;

	/**
	 * Birth correction form.
	 */
	birthCorrectionForm: FormGroup;

	/**
	 * check registration number status form.
	 */
	regStatusForm: FormGroup;

	/**
	 * language translation key.
	 */
	translateKey: string = 'birthCorrectionScreen';


	TypeOfCorrection: Array<any>;

	BIRTH_CORRECTION_TYPE: Array<any>;

	appId: number;
	apiCode: string;

	// Step Titles
	stepLable1: string = "Child Basic Details";
	stepLable2: string = "Applicant Basic Details";

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		/**
		 * calling registration number status form method.
		 */
		this.registrationNumberStatusForm();

		/**
		 * get birth correction data.
		 */
		this.getBirthCorrectionData();

		/**
		 * get look up data.
		 */
		this.getLookupData();

		/**
		 * create birth certificate form.
		 */
		this.birthCorrectionFormControls();
	}

	/**
	 * methid is used to get birth certificate data.
	 */
	getBirthCorrectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.birthCorrectionForm.patchValue(res);
		});
	}

	/**
	 * call API to get registration data and status.
	 */
	getRegistrationNumberStatus() {
		console.log(this.regStatusForm.value);

	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;

		if (count <= step1) {
			//this.stepper.selectedIndex = 0;
			return false;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			console.log(res);
			this.TypeOfCorrection = res.BIRTH_CORRECTION_TYPE;
		});
	}

	/**
	 * method is used to create registration status form.
	 */
	registrationNumberStatusForm() {
		this.regStatusForm = this.fb.group({
			typeOfCorrection: this.fb.group({
				code: [null, Validators.required]
			}),
			registrationNumber: null,
		});
	}

	/**
	 * method is used to create birth correctio form.
	 */
	birthCorrectionFormControls() {
		this.birthCorrectionForm = this.fb.group({
			fieldView: "ALL",
			fieldList: null,
			childName: null,
			birthDate: null,
			registrationDate: moment(new Date()).format("YYYY-MM-DD"),

			fatherFirstName: null,
			fatherMiddleName: null,
			fatherLastName: null,

			fatherFirstNameGuj: null,
			fatherMiddleNameGuj: null,
			fatherLastNameGuj: null,

			motherFirstName: null,
			motherMiddleName: null,
			motherLastName: null,

			motherFirstNameGuj: null,
			motherMiddleNameGuj: null,
			motherLastNameGuj: null,

			typeOfCorrection: this.fb.group({
				code: [null]
			}),
			registrationNumber: null,
			//correspondenceAddress: this.fb.group(this.addressComp.addressControls()),
			relationWithApplicant: this.fb.group({
				code: [null]
			}),
			relationOther: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		//this.stepper.reset();
	}

	/**
	 * conditionally show child name insertion.
	 */
	showInsertionForm(): boolean {
		if (this.regStatusForm.get('typeOfCorrection').get('code').value === "NAME_INSERTION") {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * conditionally show child details correction.
	 */
	showCorrectionForm(): boolean {
		if (this.regStatusForm.get('typeOfCorrection').get('code').value === "ONLY_CORRECTION") {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * update correction info
	 */
	updateCorrectionInfo() {
		console.log(this.birthCorrectionForm.value);
	}

}
