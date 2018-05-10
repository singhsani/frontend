import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-shop-lic-duplicate',
	templateUrl: './shop-lic-duplicate.component.html',
	styleUrls: ['./shop-lic-duplicate.component.scss']
})
export class ShopLicDuplicateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	shopLicDuplicateForm: FormGroup;
	translateKey: string = 'shopLicDuplicateScreen';

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

		this.getShopDuplicateData();
		this.getLookupData();
		this.shopLicDuplicateFormControls();
	}

	getShopDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.shopLicDuplicateForm.patchValue(res);
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

	shopLicDuplicateFormControls() {
		this.shopLicDuplicateForm = this.fb.group({
			id: 1,
			uniqueId: null,
			version: 0,
			serviceFormId: null,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			firstName: null,
			lastName: null,
			middleName: null,
			contactNo: null,
			email: null,
			aadhaarNo: null,
			agree: false,
			paymentStatus: null,
			canEdit: true,
			canDelete: true,
			canSubmit: true,
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
