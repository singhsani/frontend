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
	selector: 'app-no-death-record',
	templateUrl: './no-death-record.component.html',
	styleUrls: ['./no-death-record.component.scss']
})
export class NoDeathRecordComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	@ViewChild('address') addrComponent: any;

	noRecordDeathForm: FormGroup;
	translateKey: string = 'nrcDeathScreen';

	appId: number;
	apiCode: string;

	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];
	attachments: any = [];
	showButtons: boolean = false;
	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "no_record_certificate_detail";
	stepLable2: string = "death_place_address_detail";
	stepLable3: string = "applicant_detail";

	constructor(private fb: FormBuilder, private validationService: ValidationService,
		private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getNoRecordDeathData();
		this.getLookupData();
		this.nrcDeathCertFormControls();
	}

	nrcDeathCertFormControls() {

		this.noRecordDeathForm = this.fb.group({

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			regNumber: null,
			deceasedName: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			deathDate: [null, Validators.required],
			deathPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			deathPlaceDetail: null,
			fatherOrHusbandName: [null, Validators.required],
			age: [null, Validators.required],
			deathPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantName: [null, Validators.required],
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			applicantContactNo: [null, Validators.maxLength(10)],
			applicantEmail: [null, [Validators.required, ValidationService.emailValidator]],
			reasonDetail: null,
			attachments: []

		});
	}

	/**
	 * This method use for get the no record for death data
	 */
	getNoRecordDeathData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordDeathForm.patchValue(res);
			this.attachments = res.attachments;
			this.showButtons = true;
		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.noRecordDeathForm.get('deathDate').setValue(moment(date).format("YYYY-DD-MM"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(flag) {

		let step1 = 6;
		let step2 = 15;
		let step3 = 25;

		let count = 1;

		_.forEach(this.noRecordDeathForm.controls, (key) => {

			if (!key.valid) {
				if (count <= step1) {
					this.stepLable1 = this.stepLable1 +" is not completed";
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
			labelName: 'NRCDeath',
			formPart: '6',
			variableName: 'test',
			serviceFormId: this.appId,
		}

		return this.uploadModel;
	}

}
