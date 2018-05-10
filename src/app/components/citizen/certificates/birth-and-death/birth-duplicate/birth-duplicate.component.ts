import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-birth-duplicate',
	templateUrl: './birth-duplicate.component.html',
	styleUrls: ['./birth-duplicate.component.scss']
})
export class BirthDuplicateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	birthDuplicateForm: FormGroup;
	translateKey: string = 'BirthDuplicateScreen';

	appId: number;
	apiCode: string;

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

		this.getBirthDuplicateData();
		this.getLookupData();
		this.birthDuplicateFormControls();
	}

	getBirthDuplicateData(){
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

	birthDuplicateFormControls(){
		this.birthDuplicateForm = this.fb.group({
			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: null,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
			serviceName: [null, Validators.required],
			fileNumber: [null, Validators.required],
			pid: [null, Validators.required],
			outwardNo: [null, Validators.required],
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			middleName: [null, Validators.required],
			contactNo: [null, Validators.required],
			email: [null, Validators.required],
			aadhaarNo: [null, Validators.required],
			agree: false,
			paymentStatus: [null, Validators.required],
			canEdit: true,
			canDelete: true,
			canSubmit: true,
			birthRegNumber: [null, Validators.required],
			birthRegYear: [null, Validators.required],
			birthDate: [null, Validators.required],
			birthRegDate: [null, Validators.required],
			childName: [null, Validators.required],
			duplicateCopies: {},
			duplicateCopyMode: {},
			totalCopies: [null, Validators.required],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
	}

}
