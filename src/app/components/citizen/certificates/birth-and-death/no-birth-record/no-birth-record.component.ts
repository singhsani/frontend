import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

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
	translateKey: string = 'NRCBirthScreen';

	appId: number;
	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];

	attachments: any = [];

	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "No Record Certificate Detail";
	stepLable2: string = "Birth Place Address Detail";
	stepLable3: string = "Applicant Detail";

	constructor(private fb: FormBuilder, private validationService: ValidationService,
		private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService) {

		this.formService.apiType = 'NRCBirth';
	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getNoRecordBirthData();
		this.getLookupData();
		this.nrcBirthCertFormControls();
	}

	nrcBirthCertFormControls() {

		this.noRecordBirthForm = this.fb.group({

			// step 1 form controls starts 
			applicationNo: [null, Validators.required],
			registrationNo: [null, Validators.required],
			childName: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			birthDate: [null, Validators.required],
			birthPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			fatherName: [null, Validators.required],
			motherName: [null, Validators.required],
			// step 1 form controls ends 

			// step 2 form controls starts 
			birthPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			// step 2 form controls ends 

			// step 3 form controls starts 
			applicantName: [null, Validators.required],
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),

			applicantContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			applicantEmail: [null, [Validators.required, ValidationService.emailValidator]],
			attachments: [],
			reasonDetail: null,
			// step 3 form controls ends 

			// extra's important controls
			apiType: 'NRCBirth',
			serviceFormId: null,
			id: null,
			uniqueId: null,
			version: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
			canSubmit: null,
			regNumber: null
		});
	}

	/**
	 * This method use for get the no record for birth data
	 */
	getNoRecordBirthData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordBirthForm.patchValue(res);
			this.attachments = res.attachments;
		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.noRecordBirthForm.get('birthDate').setValue(moment(date).format("YYYY-DD-MM"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(flag) {

		let step1 = 8;
		let step2 = 9;
		let step3 = 13;

		let count = 1;

		_.forEach(this.noRecordBirthForm.controls, (key) => {

			if (!key.valid) {
				if (count <= step1) {
					this.stepLable1 = "No Record Certificate Detail is not completed";
					this.stepper.selectedIndex = 0;
					return false;
				} else if (count <= step2) {
					this.stepLable2 = "Birth Place is not completed";
					this.stepper.selectedIndex = 1;
					return false;
				} else if (count <= step3) {
					this.stepLable3 = "Applicant detail is not completed";
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

}
