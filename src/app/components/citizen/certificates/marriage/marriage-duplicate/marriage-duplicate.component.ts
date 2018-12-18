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
	selector: 'app-marriage-duplicate',
	templateUrl: './marriage-duplicate.component.html',
	styleUrls: ['./marriage-duplicate.component.scss']
})
export class MarriageDuplicateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	marriageDuplicateForm: FormGroup;
	translateKey: string = 'duplicateMarriageRegScreen';

	appId: number;
	apiCode: string;
	tabIndex: number = 0;

	// Marriage date 
	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	// Step Titles
	stepLable1: string = "applicant_basic_details";
	stepLable2: string = "marriage_details";

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     */
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
		if (!this.appId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getMarriageDuplicateData();
			this.getLookupData();
			this.marriageDuplicateFormControls();
		}
	}

	getMarriageDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.marriageDuplicateForm.patchValue(res);
		});
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {

		});
	}

    /**
	 * This method is change date formate
	 */
	dateFormate(date, controlType) {
		this.marriageDuplicateForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	marriageDuplicateFormControls() {
		this.marriageDuplicateForm = this.fb.group({

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),

			deptFileStatus: null,
			serviceCode: "HEL-DUPMR",

			marriageRegNumber: ['', Validators.required],
			marriageDate: ['', Validators.required],
			marriageRegDate: [new Date(), Validators.required],
			marriageRegYear: ['', Validators.required],
			groomName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
			brideName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]]
		});
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;
		let step2 = 6;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step2) {
			this.tabIndex = 1;
			return false;
		}
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		console.log(evt);
		this.tabIndex = evt;
	}

}
