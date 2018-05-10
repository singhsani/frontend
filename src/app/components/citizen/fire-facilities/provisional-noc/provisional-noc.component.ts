import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from '../../../../config/routes-conf';

import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-provisional-noc',
	templateUrl: './provisional-noc.component.html',
	styleUrls: ['./provisional-noc.component.scss']
})
export class ProvisionalNocComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	provisionalNocForm: FormGroup;
	translateKey: string = 'provisionaNocScreen';

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

		this.getProvisionaNocData();
		this.getLookupData();
		this.provisionalNocFormControls();
	}

	getProvisionaNocData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.provisionalNocForm.patchValue(res);
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

	provisionalNocFormControls() {
		this.provisionalNocForm = this.fb.group({
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
			outwardNo: null,
			firstName: null,
			lastName: null,
			middleName: null,
			contactNo: null,
			email: null,
			aadhaarNo: null,
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
			canSubmit: null,
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
