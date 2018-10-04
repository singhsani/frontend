import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../../../shared/services/common.service';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-birth-duplicate',
	templateUrl: './birth-duplicate.component.html',
	styleUrls: ['./birth-duplicate.component.scss']
})

export class BirthDuplicateComponent implements OnInit {

	/**
	 * duplicate birth form.
	 */
	birthDuplicateForm: FormGroup;

	/**
	 * search application form
	 */
	searchForm: FormGroup;

	/**
	 * applicatio id or service form id.
	 */
	appId: number;

	/**
	 * api code
	 */
	apiCode: string;

	/**
	 * Duplicate copy mode lookup.
	 */
	private DuplicateCopyMode: object[];

	/**
	 * Yes/no type lookup
	 */
	private ISYESNO: object[];

	/**
	 * validate max date.
	 */
	private maxBirthDate = new Date();

	/**
	 * validate minimm date.
	 */
	private minBirthDate;

	/**
	 * common routing configuration
	 */
	manageRoutes: any = ManageRoutes;

	/**
	 * show search form.
	 */
	showSearchForm: boolean = false;

	/**
	 * show hide duplicate form.
	 */
	isVisibeDuplicateForm: boolean = true;

	/**
	 * language translate key
	 */
	translateKey: string = 'BirthDuplicateScreen';

	/**
	 * Constructor
	 * @param commonService - common service for alert.
	 * @param fb - form builder.
	 * @param location - location class to update url.
	 * @param validationService - common validation  service.
	 * @param router - common router.
	 * @param route - activate route.
	 * @param formService - common form service.
	 */
	constructor(
		private commonService: CommonService,
		private fb: FormBuilder,
		private location: Location,
		private route: ActivatedRoute,
		private formService: FormsActionsService
	) { }

	/**
	 * Method initializes first.
	 */
	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.birthDuplicateFormControls();


		if (this.appId) {
			this.isVisibeDuplicateForm = false;
			this.getBirthDuplicateData();
			this.getLookupData();
		} else {
			this.showSearchForm = true;
		}
	}

	/**
	 * Method is used to create death record after search data found.
	 * @param data - original json.
	 */
	createDuplicateBirthRecord(data) {
		this.formService.createFormData().subscribe(res => {

			this.birthDuplicateForm.patchValue(res);

			this.updateDuplicateRecordValue(data);

			this.appId = res.serviceFormId;

			let cururl = this.location.path().replace('false', this.appId.toString());

			this.location.go(cururl);
		}, err => {
			this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
		});
	}

	/**
	 * Method is used to update duplicate form data with original json.
	 * @param data - original json.
	 */
	updateDuplicateRecordValue(data) {
		this.birthDuplicateForm.get('birthDate').setValue(data.childs[0].birthDate);
		this.birthDuplicateForm.get('childName').setValue(data.childs[0].childName);
	}

	/**
	 * Method is used to get duplicate birth data.
	 */
	getBirthDuplicateData() {
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
			//this.stepper.selectedIndex = 0;
			return false;
		}
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.DuplicateCopyMode = res.DUPLICATE_COPY_MODE;
			this.ISYESNO = res.YES_NO;
		});
	}

	/**
	 * Method is used to create duplicate birth certificate.
	 */
	birthDuplicateFormControls() {
		this.birthDuplicateForm = this.fb.group({
			birthRegNumber: [null],
			birthRegYear: [null],
			birthDate: [null],
			birthRegDate: [null],
			childName: [null],
			duplicateCopies: this.fb.group({
				code: [null, [Validators.required]],
				id: null,
				name: null,
			}),
			duplicateCopyMode: this.fb.group({
				code: [null, [Validators.required]],
				gujName: null,
				id: null,
				name: null,
				orderSequence: null,
				type: null,
				uniqueId: null,
				version: null
			}),
			totalCopies: [null, Validators.required],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
		});
	}

	/**
	 * Method is used to calculate birth date.
	 * @param event - date event.
	 */
	birthDateCalculator(event) {
		this.birthDuplicateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
		this.minBirthDate = event.value;
	}

	/**
	 * Method is used to calculate birth Registration date.
	 * @param event - date event.
	 */
	birthRegCalculator(event) {
		this.birthDuplicateForm.get('birthRegDate').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

	/**
	 * show duplicate birth certificate form.
	 * @param event - data or false.
	 */
	showDuplicateForm(event) {
		if (event) {
			this.getLookupData();
			this.createDuplicateBirthRecord(event);
			this.isVisibeDuplicateForm = false;
			this.showSearchForm = false;
		}
	}
}
