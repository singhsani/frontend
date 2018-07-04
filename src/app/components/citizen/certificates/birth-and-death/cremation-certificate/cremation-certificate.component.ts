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
	selector: 'app-cremation-certificate',
	templateUrl: './cremation-certificate.component.html',
	styleUrls: ['./cremation-certificate.component.scss']
})
export class CremationCertificateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	@ViewChild('address') addrComponent: any;

	private uploadFileArray: Array<any> = [
		{ labelName: 'Address Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Unique Id', fieldIdentifier: '1.2' }
	]

	cremationForm: FormGroup;
	translateKey: string = 'cremationScreen';

	appId: number;
	apiCode: string;

	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];

	uploadModel: any = {};
	showButtons: boolean = false;

	// Step Titles
	stepLable1: string = "deceased_details";
	stepLable2: string = "applicants_detail";
	stepLable3: string = "upload_document";

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

		this.getCremationData();
		this.getLookupData();
		this.cremationCertFormControls();

	}

	/**
	 * This method use for initialise form controls
	 */
	cremationCertFormControls() {

		this.cremationForm = this.fb.group({

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),

			deceasedFirstName: [null, Validators.required],
			deceasedMiddleName: [null],
			deceasedLastName: [null, Validators.required],
			
			deceasedFirstNameGuj: [null, Validators.required],
			deceasedMiddleNameGuj: [null],
			deceasedLastNameGuj: [null, Validators.required],

			deathDate: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required]
			}),

			deathPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			cremationAddress: this.fb.group(this.addrComponent.addressControls()),

			applicantAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			
			attachments: [],

		});

	}

	/**
	 * This method use for get the no record for birth data
	 */
	getCremationData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.cremationForm.patchValue(res);
			this.showButtons = true;
		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.cremationForm.get('deathDate').setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(count) {

		let step1 = 11;
		let step2 = 14;

		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		} else if (count >= 33 && count <= 38) {
			this.stepper.selectedIndex = 1;
			return false;
		} else if (count <= step2) {
			this.stepper.selectedIndex = 1;
			return false;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.relationshipArray = res.RELATIONSHIP;
		});
	}


	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
	 */
	setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {

		this.uploadModel = {
			fieldIdentifier: indentifier.toString(),
			labelName: labelName.toString(),
			formPart: formPart.toString(),
			variableName: variableName.toString(),
			serviceFormId: this.appId,
		}

		return this.uploadModel;
	}

	/**
	 * Method is used to get file status.
	 * @param fieldIdentifier - file identifier.
	 */

	getFileObjectContained(fieldIdentifier: string) {
		let found: boolean = false;
		for (let i = 0; i < this.uploadFileArray.length; i++) {
			if (this.uploadFileArray[i].fieldIdentifier == fieldIdentifier) {
				found = true;
				break;
			}
		}
		return found;
	}

	/**
	 * This method use for reset steps
	 */
	stepReset() {
		this.stepper.reset();
	}

	/**
	 * This method is use for get the value of applicant relation change
	 * @param event - select box change value
	 */
	applicantRelChange(value) {
		if (value !== 'OTHER_RELATIONSHIP') {
			this.cremationForm.get('applicantRelationDetail').setValue('');
			this.cremationForm.get('applicantRelationDetail').clearValidators();
		} else {
			this.cremationForm.get('applicantRelationDetail').setValidators([Validators.required]);
		}
		this.cremationForm.controls['applicantRelationDetail'].updateValueAndValidity();

	}
}
