import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroupDirective, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-death-duplicate',
	templateUrl: './death-duplicate.component.html',
	styleUrls: ['./death-duplicate.component.scss']
})
export class DeathDuplicateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;
	@ViewChild(FormGroupDirective) f;

	deathDuplicateForm: FormGroup;
	translateKey: string = 'DeathDuplicateScreen';

	appId: number;
	apiCode: string;
	DeathRegYears = [
		{
			id: "2008",
			code: 2008,
			name: "2008"

		},
		{
			id: "2009",
			code: 2009,
			name: "2009"

		},
		{
			id: "2010",
			code: 2010,
			name: "2010"

		},
		{
			id: "2011",
			code: 2011,
			name: "2011"

		},
		{
			id: "2012",
			code: 2012,
			name: "2012"

		}, {
			id: "2013",
			code: 2013,
			name: "2013"

		},
		{
			id: "2014",
			code: 2014,
			name: "2014"

		},
		{
			id: "2015",
			code: 2015,
			name: "2015"

		},
		{
			id: "2016",
			code: 2016,
			name: "2016"

		},
		{
			id: "2017",
			code: 2017,
			name: "2017"

		},
		{
			id: "2018",
			code: 2018,
			name: "2018"

		}

	];
	private ISYESNO: object[];
	private maxDeathDate = new Date();
	private minDeathDate;

	// Step Titles
	stepLable1: string = "Applicant Basic Details";

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

		this.getDeathDuplicateData();
		this.getLookupData();
		this.DeathDuplicateFormControls();
	}

	getDeathDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			console.log(res);
			this.deathDuplicateForm.patchValue(res);
		});
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;

		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			console.log(res);
		});
	}

	DeathDuplicateFormControls() {
		this.deathDuplicateForm = this.fb.group({
			deathRegNumber: [null, Validators.required],
			deathRegYear: [null, Validators.required],
			deathDate: [null, Validators.required],
			deathRegDate: [null, Validators.required],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to calculate death date.
	 * @param event - date event.
	 */
	deathDateCalculator(event) {
		this.deathDuplicateForm.get('deathDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		this.minDeathDate = event.value;
	}

	/**
	 * Method is used to calculate death Registration date.
	 * @param event - date event.
	 */
	deathRegCalculator(event) {
		this.deathDuplicateForm.get('deathRegDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
	}
}
