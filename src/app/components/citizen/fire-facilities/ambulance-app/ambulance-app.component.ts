import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-ambulance-app',
	templateUrl: './ambulance-app.component.html',
	styleUrls: ['./ambulance-app.component.scss']
})
export class AmbulanceAppComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	ambulanceAppForm: FormGroup;
	translateKey: string = 'AmbulanceAppScreen';

	appId: number;

	// Step Titles
	stepLable1: string = "Applicant Basic Details";

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService
	) {
		this.formService.apiType = 'FSAmbulance';
	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getambulanceAppFormData();
		this.getLookupData();
		this.ambulanceAppFormControls();
	}

	getambulanceAppFormData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.ambulanceAppForm.patchValue(res);
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

	ambulanceAppFormControls() {
		this.ambulanceAppForm = this.fb.group({
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
			agree: null,
			paymentStatus: [null, Validators.required],
			canEdit: null,
			canDelete: null,
			canSubmit: null,
			apiType: 'FSAmbulance'
		});
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
	}

}
