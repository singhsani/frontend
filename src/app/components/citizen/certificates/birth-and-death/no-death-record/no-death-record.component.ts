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
	selector: 'app-no-death-record',
	templateUrl: './no-death-record.component.html',
	styleUrls: ['./no-death-record.component.scss']
})
export class NoDeathRecordComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	@ViewChild('address') addrComponent: any;

	private uploadFileArray: Array<any> = [
		{ labelName: 'Deceased', fieldIdentifier: '1.1' },
		{ labelName: 'BasicDetails', fieldIdentifier: '1.2' },
		{ labelName: 'Applicant Id', fieldIdentifier: '1.3' }
	]

	noRecordDeathForm: FormGroup;
	translateKey: string = 'nrcDeathScreen';

	appId: number;
	apiCode: string;

	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];
	reasonArray: any = [];
	showButtons: boolean = false;
	uploadModel: any = {};

	// Step Titles
	stepLable1: string = "no_record_certificate_detail";
	stepLable2: string = "death_place_address_detail";
	stepLable3: string = "applicant_detail";
	stepLable4: string = "Upload Document";

	constructor(private fb: FormBuilder, private validationService: ValidationService,
		private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getNoRecordDeathData();
		this.getLookupData();
		this.nrcDeathCertFormControls();
	}

	/**
	 * This method use for initialise form controls
	 */
	nrcDeathCertFormControls() {

		this.noRecordDeathForm = this.fb.group({

			deceasedName: [null, Validators.required],
			deathDate: [null, Validators.required],
			fatherOrHusbandName: [null, Validators.required],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			deathPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			deathPlaceDetail: null,
			age: [null, Validators.required],
			deathPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			reasonDetail: this.fb.group({
				code: [null, Validators.required]
			}),
			attachments: [],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			regNumber: null,

		});
	}

	/**
	 * This method use for get the no record for death data
	 */
	getNoRecordDeathData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordDeathForm.patchValue(res);
			this.showButtons = true;
		});
	}

	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.noRecordDeathForm.get('deathDate').setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(count) {

		let step1 = 7;
		let step2 = 8;
		let step3 = 9;

		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		} else if (count <= step2) {
			this.stepper.selectedIndex = 1;
			return false;
		} else if (count <= step3) {
			this.stepper.selectedIndex = 2;
			return false;
		} else if (count >= 32 && count <= 40) {
			this.stepper.selectedIndex = 2;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
			this.reasonArray = res.NRC_BIRTH_OR_DEATH_REASON;
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
	 * This method is use for get the value of death place change
	 * @param event - radio button change value
	 */
	deathPlaceChange(event) {
		if (event.value !== 'OTHER_PLACE') {
			this.noRecordDeathForm.get('deathPlaceDetail').setValue('');
			this.noRecordDeathForm.get('deathPlaceDetail').clearValidators();
		} else {
			this.noRecordDeathForm.get('deathPlaceDetail').setValidators([Validators.required]);
		}
		this.noRecordDeathForm.controls['deathPlaceDetail'].updateValueAndValidity();
	}

	/**
	 * This method is use for get the value of applicant relation change
	 * @param event - select box change value
	*/
	applicantRelChange(value) {
		if (value !== 'OTHER_RELATIONSHIP') {
			this.noRecordDeathForm.get('applicantRelationDetail').setValue('');
			this.noRecordDeathForm.get('applicantRelationDetail').clearValidators();
		} else {
			this.noRecordDeathForm.get('applicantRelationDetail').setValidators([Validators.required]);
		}
		this.noRecordDeathForm.controls['applicantRelationDetail'].updateValueAndValidity();
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
	 * Method is used to create file object.
	 * @param labelName - file labelName
	 * @param fieldIdentifier - file identifier
	 */
	fileObjectCreater(labelName, fieldIdentifier): any {
		return { labelName: labelName, fieldIdentifier: fieldIdentifier }
	}

}
