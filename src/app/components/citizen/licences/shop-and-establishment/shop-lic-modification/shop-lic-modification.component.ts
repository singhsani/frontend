import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-shop-lic-modification',
	templateUrl: './shop-lic-modification.component.html',
	styleUrls: ['./shop-lic-modification.component.scss']
})
export class ShopLicModificationComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	shopLicModificationForm: FormGroup;
	translateKey: string = 'shopModificationScreen';

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

		this.getShopModificationData();
		this.getLookupData();
		this.shopLicModificationFormControls();
	}

	getShopModificationData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.shopLicModificationForm.patchValue(res);
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

	shopLicModificationFormControls() {
		this.shopLicModificationForm = this.fb.group({
			deceasedFullName: null,
			deathDate: null,
			registrationDate: null,
			fatherFirstName: null,
			typeOfCorrection: {},
			registrationNumber: null,
			correspondenceAddress: {
				id: null,
				uniqueId: null,
				version: null,
				addressType: null,
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: null,
				district: null,
				talukaName: null,
				pincode: null,
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			},
			relationWithApplicant: {},
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
