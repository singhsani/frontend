import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

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

	cremationForm: FormGroup;
	translateKey: string = 'CremationScreen';

	appId: number;
	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];
	applicantProof: any = [];

	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "Cremation Certificate Detail";
	stepLable2: string = "Applicant Detail";

	constructor(private fb: FormBuilder, private validationService: ValidationService,
		private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService) {

		this.formService.apiType = 'cremationReg';
	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getCremationData();
		this.getLookupData();
		this.cremationCertFormControls();

	}


	cremationCertFormControls() {

		this.cremationForm = this.fb.group({

			// step 1 form controls starts 
			applicantFirstName: [null, Validators.required],
			applicantMiddleName: null,
			applicantLastName: [null, Validators.required],
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: [null, Validators.required],
			applicantProof: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantAddress: this.fb.group(this.addrComponent.addressControls()),
			// step 1 form controls ends 

			// step 2 form controls starts 
			cremationAddress: this.fb.group(this.addrComponent.addressControls()),
			deathDate: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required]
			}),

			deceasedName: [null, Validators.required],
			deathPlace: this.fb.group({
				code: [null, Validators.required]
			}),
			deathPlaceDetail: [null, Validators.required],
			applicantContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			applicantEmail: [null, [Validators.required, ValidationService.emailValidator]],
			// step 2 form controls ends 

			// etxtra's important controls
			apiType: 'cremationReg',
			serviceFormId: null,
			id: null,
			uniqueId: null,
			version: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
			canSubmit: null,
			regNumber: null
		});

	}

	/**
	 * This method use for get the no record for birth data
	 */
	getCremationData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.cremationForm.patchValue(res);

		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.cremationForm.get('deathDate').setValue(moment(date).format("YYYY-DD-MM"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(flag) {

		let step1 = 7;
		let step2 = 14;

		let count = 1;

		_.forEach(this.cremationForm.controls, (key) => {
			if (!key.valid) {
				if (count <= step1) {
					this.stepLable1 = "Cremation Certificate Detail is not completed";
					this.stepper.selectedIndex = 0;
					return false;
				} else if (count <= step2) {
					this.stepLable2 = "Applicant Details is not completed";
					this.stepper.selectedIndex = 1;
					return false;
				}
			}
			count++;
		});

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
			this.applicantProof = res.APPLICANT_PROOF;
		});
	}

	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
	 */
	setDataValue(indentifier: number) {

		this.uploadModel = {
			fieldIdentifier: indentifier,
			labelName: 'cremationReg',
			formPart: '3',
			variableName: 'test',
			serviceFormId: this.appId,
		}

		return this.uploadModel;
	}
}
