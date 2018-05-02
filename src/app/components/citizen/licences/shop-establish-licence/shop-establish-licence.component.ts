import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ValidationService } from '../../../../shared/services/validation.service';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-shop-establish-licence',
	templateUrl: './shop-establish-licence.component.html',
	styleUrls: ['./shop-establish-licence.component.scss']
})
export class ShopEstablishLicenceComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	shopEstablishLicenceForm: FormGroup;

	appId: number;
	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "Establishment Details";
	stepLable2: string = "Employer's Datails";
	stepLable3: string = "Related Documents";

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private toastr: ToastrService
	) {
		this.formService.apiType = 'shopLicense';
	 }

	ngOnInit() {
		
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getShopEstablishLicenceData();
		this.shopEstablishLicenceFormControls();
	}

	shopEstablishLicenceFormControls(){

		this.shopEstablishLicenceForm = this.fb.group({
			"establishmentName": [null, Validators.required],
			"postalAddress": this.fb.group({
				"id": null,
				"uniqueId": null,
				"version": null,
				"addressType": "SHOP_POSTAL_ADDRESS",
				"houseNo": null,
				"tenamentNo": null,
				"buildingName": null,
				"state": null,
				"district": null,
				"talukaName": null,
				"pincode": null,
				"addressLine1": null,
				"addressLine2": null,
				"addressLine3": null,
				"village": null
			}),
			"shopDetails": [null, Validators.required],
			"employeerName": [null, Validators.required],
			"residentialAddressOfEmployer": this.fb.group({
				"id": null,
				"uniqueId": null,
				"version": null,
				"addressType": "SHOP_EMPLOYER_ADDRESS",
				"houseNo": null,
				"tenamentNo": null,
				"buildingName": null,
				"state": null,
				"district": null,
				"talukaName": null,
				"pincode": null,
				"addressLine1": null,
				"addressLine2": null,
				"addressLine3": null,
				"village": null
			}),
			"managerName": [null, Validators.required],
			"managerAddress": this.fb.group({
				"id": null,
				"uniqueId": null,
				"version": null,
				"addressType": "SHOP_MANAGER_ADDRESS",
				"houseNo": null,
				"tenamentNo": null,
				"buildingName": null,
				"state": null,
				"district": null,
				"talukaName": null,
				"pincode": null,
				"addressLine1": null,
				"addressLine2": null,
				"addressLine3": null,
				"village": null
			}),
			"establishmentCategory": [null, Validators.required],
			"businessName": [null, Validators.required],
			"businessCommencementDate": [null, Validators.required],
			"empFamilyMemName": [null, Validators.required],
			"apiType": 'shopLicense',
			"serviceFormId": [null]
		});

	}

	/**
	 * This method use for get the no record for birth data
	 */
	getShopEstablishLicenceData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.shopEstablishLicenceForm.patchValue(res);
		});
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(flag) {

		//this.clicksubmit = true;

		let step1 = 8;
		let step2 = 9;
		let step3 = 13;

		let count = 1;

		_.forEach(this.shopEstablishLicenceForm.controls, (key) => {

			if (!key.valid) {
				if (count <= step1) {
					this.stepLable1 = "Establishment Details is not complete";
					this.stepper.selectedIndex = 0;
					return false;
				} else if (count <= step2) {
					this.stepLable2 = "Employer's Datails is not complete";
					this.stepper.selectedIndex = 1;
					return false;
				} else if (count <= step3) {
					this.stepLable3 = "Related Documents is not complete";
					this.stepper.selectedIndex = 2;
					return false;
				}
			}
			count++;
		});

	}

	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
	 */
	setDataValue(indentifier: number) {

		this.uploadModel = {
			fieldIdentifier: indentifier,
			labelName: 'shopLicence',
			formPart: '4',
			variableName: 'test',
			serviceFormId: this.appId,
		}

		return this.uploadModel;
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get seected date
	 */
	onDateChange(date) {
		this.shopEstablishLicenceForm.get('businessCommencementDate').setValue(moment(date).format("YYYY-DD-MM"));
	}

}
