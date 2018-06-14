import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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

	private deathDuplicateForm: FormGroup;
	private translateKey: string = 'DeathDuplicateScreen';

	appId: number;
	apiCode: string;
	private DeathRegYears: Number[] = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
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
