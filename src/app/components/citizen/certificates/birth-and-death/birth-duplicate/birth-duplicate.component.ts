import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
	DuplicateCopyMode: Array<any> = [];

	/**
	 * Yes/no type lookup
	 */
	ISYESNO: Array<any> = [];

	/**
	 * validate max date.
	 */
	maxBirthDate = new Date();

	/**
	 * validate minimm date.
	 */
	minBirthDate;

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
	public NBCtoDuplicateBirth: any = {};
	tempObj: any = {};

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
		private router: Router,
		private location: Location,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private CD: ChangeDetectorRef,
	) {

	}

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
			this.formService.getNBCtoDuplicateBirth().subscribe(data => { this.NBCtoDuplicateBirth = data });
			this.getBirthDuplicateData();
			this.getLookupData();
		} else {
			this.showSearchForm = true;
		}
	}

	/**
	 * Method is used to create death record after search data found.
	 */
	createDuplicateBirthRecord() {
		this.formService.createFormData().subscribe(res => {

			this.birthDuplicateForm.patchValue(res);

			this.appId = res.serviceFormId;

			let cururl = this.location.path().replace('false', this.appId.toString());
			this.location.go(cururl);

			if (Object.keys(this.tempObj).length) {
				this.birthDuplicateForm.patchValue(this.tempObj);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.tempObj.certificateno);
				this.newgnDateconvert('birthDate', this.tempObj.birthDate);
			}
			if (Object.keys(this.NBCtoDuplicateBirth).length) {
				this.birthDuplicateForm.patchValue(this.NBCtoDuplicateBirth);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.NBCtoDuplicateBirth.certificateno);
				this.newgnDateconvert('birthDate', this.NBCtoDuplicateBirth.birthDate);
			}

		}, err => {
			this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
		});
	}


	/**
	 * Method is used to get duplicate birth data.
	 */
	getBirthDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.birthDuplicateForm.patchValue(res);
			if (Object.keys(this.NBCtoDuplicateBirth).length) {
				this.birthDuplicateForm.patchValue(this.NBCtoDuplicateBirth);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.NBCtoDuplicateBirth.certificateno);
				this.newgnDateconvert('birthDate', this.NBCtoDuplicateBirth.birthDate);
			}
			if (Object.keys(this.tempObj).length) {
				this.birthDuplicateForm.patchValue(this.tempObj);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.tempObj.certificateno);
				this.newgnDateconvert('birthDate', this.tempObj.birthDate);
			}
		}, err => { });
	}

	/**
	 * This method for convert newgn response date to yyyy-mm-dd formate
	 */
	newgnDateconvert(controlName: any, date) {
		let dateString = date;
		let dateParts = dateString.split("-");
		let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
		// let dateObject = new Date(+dateParts[0], dateParts[1] - 1,+dateParts[2]);
		this.birthDuplicateForm.get(controlName).setValue(moment(dateObject).format("DD-MM-YYYY"));
	}

	/**
	 * show duplicate birth certificate form.
	 * @param event - data or false.
	 */
	showDuplicateForm(event) {
		if (event) {
			this.createDuplicateBirthRecord();
			this.tempObj = event;
			this.getLookupData();

			this.isVisibeDuplicateForm = false;
			this.showSearchForm = false;
			// this.formService.getNBCtoDuplicateBirth().subscribe(data => { this.NBCtoDuplicateBirth = data });

			if (Object.keys(this.tempObj).length) {
				this.birthDuplicateForm.patchValue(this.tempObj);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.tempObj.certificateno);
				this.newgnDateconvert('birthDate', this.tempObj.birthDate);
			}
			if (Object.keys(this.NBCtoDuplicateBirth).length) {
				this.birthDuplicateForm.patchValue(this.NBCtoDuplicateBirth);
				this.birthDuplicateForm.get('birthRegNumber').setValue(this.NBCtoDuplicateBirth.certificateno);
				this.newgnDateconvert('birthDate', this.NBCtoDuplicateBirth.birthDate);
			}
		}
		else {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode('HEL-NRCBR');
			this.formService.createFormData().subscribe(res => {
				let redirectUrl = ManageRoutes.getFullRoute('HEL-NRCBR');
				this.router.navigate([redirectUrl, res.serviceFormId, 'HEL-NRCBR']);
			});
		}
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
			birthDate: [moment(new Date()).format("DD-MM-YYYY"), Validators.required],
			birthdateguj: [null],
			birthRegDate: [null],
			registrationDate:[null, Validators.required],
			childName: [null, Validators.required],
			childNameGuj: [null],
			gender: [null, Validators.required],
			birthtime:[null, Validators.required],
			birthtimeguj:[null],
			placeofbirth: [null],
			motherFirstName: [null, Validators.required],
			motherFirstNameGuj: [null],
			fatherFirstName: [null, Validators.required],
			fatherFirstNameGuj: [null],
			birthaddress:[null, Validators.required],
			birthaddressguj:[null],
			genderguj:[null],
			placeofbirthguj:[null],
			permanentadd:[null, Validators.required],
			permanentaddguj:[null],
			// duplicateCopies: this.fb.group({
			// 	code: [null, [Validators.required]],
			// 	id: null,
			// 	name: null,
			// }),
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
	getlength(event){
		return false
	}

}
