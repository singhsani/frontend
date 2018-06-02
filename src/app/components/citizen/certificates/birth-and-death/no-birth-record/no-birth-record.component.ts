import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-no-birth-record',
	templateUrl: './no-birth-record.component.html',
	styleUrls: ['./no-birth-record.component.scss']
})
export class NoBirthRecordComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	@ViewChild('address') addrComponent: any;

	noRecordBirthForm: FormGroup;
	translateKey: string = 'nrcBirthScreen';

	appId: number;
	apiCode: string;

	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];
	reasonArray: any = [];
	showButtons: boolean = false;

	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "no_record_certificate_detail";
	stepLable2: string = "birth_blace_address_detail";
	stepLable3: string = "applicant_detail";

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

		this.nrcBirthCertFormControls();
		this.getNoRecordBirthData();
		this.getLookupData();
	}

	nrcBirthCertFormControls() {

		this.noRecordBirthForm = this.fb.group({

			childName: [null, [Validators.required, ValidationService.nameValidator]],
			fatherName: [null, [Validators.required, ValidationService.nameValidator]],
			motherName: [null, [Validators.required, ValidationService.nameValidator]],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			birthPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			birthPlaceDetail: null,
			birthDate: [null, Validators.required],

			birthPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			reasonDetail: this.fb.group({
				code: [null, Validators.required]
			}),
			attachments: [],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			regNumber: null,

		});
	}

	/**
	 * This method use for get the no record for birth data
	 */
	getNoRecordBirthData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordBirthForm.patchValue(res);
			this.showButtons = true;
		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.noRecordBirthForm.get('birthDate').setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(count) {

		let step1 = 7;
		let step2 = 8;
		let step3 = 9;

		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		} else if (count <= step2) {
			this.stepper.selectedIndex = 1;
			return false;
		} else if (count <= step3) {
			this.stepper.selectedIndex = 2;
			return false;
		} else if (count >= 32 && count <= 40) {
			this.stepper.selectedIndex = 2;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
			this.reasonArray = res.NRC_BIRTH_OR_DEATH_REASON;
		});
	}

	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
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

	/**
	 * This method is use for reset stepper and redirect to 1st step
	 */
	stepReset() {
		this.stepper.reset();
	}


	/**
	 * This method is use for get the value of birth place change
	 * @param event - radio button change value
	 */
	birthPlaceChange(event) {
		if (event.value !== 'OTHER_PLACE') {
			this.noRecordBirthForm.get('birthPlaceDetail').setValue('');
		}
	}

	/**
	 * This method is use for get the value of applicant relation change
	 * @param event - select box change value
	 */
	applicantRelChange(value) {
		if (value !== 'OTHER_RELATIONSHIP') {
			this.noRecordBirthForm.get('applicantRelationDetail').setValue('');
		}
	}

}
