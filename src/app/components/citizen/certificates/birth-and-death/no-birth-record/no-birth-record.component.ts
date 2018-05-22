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
	showButtons: boolean = false;

	attachments: any = [];

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

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			regNumber: null,
			childName: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			birthDate: [null, Validators.required],
			birthPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			birthPlaceDetail: null,
			fatherName: [null, Validators.required],
			motherName: [null, Validators.required],
			reasonDetail: null,
			birthPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantName: [null, Validators.required],
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			applicantContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			applicantEmail: [null, [Validators.required, ValidationService.emailValidator]],
			attachments: []
			
		});
	}

	/**
	 * This method use for get the no record for birth data
	 */
	getNoRecordBirthData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordBirthForm.patchValue(res);
			this.attachments = res.attachments;
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
	handleErrorsOnSubmit(flag) {

		let step1 = 6;
		let step2 = 15;
		let step3 = 25;

		let count = 1;

		_.forEach(this.noRecordBirthForm.controls, (key) => {

			if (!key.valid) {
				if (count <= step1) {
					this.stepLable1 = this.stepLable1 + " is not completed";
					this.stepper.selectedIndex = 0;
					return false;
				} else if (count <= step2) {
					this.stepLable2 = this.stepLable2 +" is not completed";
					this.stepper.selectedIndex = 1;
					return false;
				} else if (count <= step3) {
					this.stepLable3 = this.stepLable3 +" is not completed";
					this.stepper.selectedIndex = 2;
					return false;
				}
			}
			count++;
		});

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
		});
	}

	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
	 */
	setDataValue(indentifier: number) {

		this.uploadModel = {
			fieldIdentifier: indentifier,
			labelName: 'NRCBirth',
			formPart: '3',
			variableName: 'test',
			serviceFormId: this.appId,
		}

		return this.uploadModel;
	}

	stepReset() {
		this.stepper.reset();
	}

}
