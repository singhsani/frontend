import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-birth-duplicate',
	templateUrl: './birth-duplicate.component.html',
	styleUrls: ['./birth-duplicate.component.scss']
})
export class BirthDuplicateComponent implements OnInit {



	birthDuplicateForm: FormGroup;
	translateKey: string = 'BirthDuplicateScreen';

	appId: number;
	apiCode: string;
	BirthRegYears = [
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
			code: "2011",
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
	private DuplicateCopyMode: object[];
	private ISYESNO: object[];


	private maxBirthDate = new Date();
	private minBirthDate;

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

		this.getBirthDuplicateData();
		this.getLookupData();
		this.birthDuplicateFormControls();
	}

	/**
	 * Method is used to get duplicate birth data.
	 */
	getBirthDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.birthDuplicateForm.patchValue(res);
		});
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
			this.DuplicateCopyMode = res.DUPLICATE_COPY_MODE;
			this.ISYESNO = res.YES_NO;
		});
	}

	/**
	 * Method is used to create duplicate birth certificate.
	 */
	birthDuplicateFormControls() {
		this.birthDuplicateForm = this.fb.group({
			birthRegNumber: [null, [Validators.required, ValidationService.birthRegNumber]],
			birthRegYear: [null, Validators.required],
			birthDate: [null, [Validators.required]],
			birthRegDate: [null, Validators.required],
			childName: [null, [Validators.required, ValidationService.nameValidator]],
			duplicateCopies: this.fb.group({
				code: [null, [Validators.required]],
				id: null,
				name: null,
			}),
			duplicateCopyMode: this.fb.group({
				code: [null, [Validators.required]],
				gujName: null,
				id: null,
				name: null,
				orderSequence: null,
				type: null,
				uniqueId: null,
				version: null

			}),
			totalCopies: [null, Validators.required],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to calculate birth date.
	 * @param event - date event.
	 */
	birthDateCalculator(event) {
		this.birthDuplicateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		this.minBirthDate = event.value;
	}

	/**
	 * Method is used to calculate birth Registration date.
	 * @param event - date event.
	 */
	birthRegCalculator(event) {
		this.birthDuplicateForm.get('birthRegDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		//this.stepper.reset();
	}

	/**
	 * Methid is used to get duplicate death certficate data.
	 */
	getRegistrationNumberStatus(){
		console.log(this.birthDuplicateForm.value);
	}

}
