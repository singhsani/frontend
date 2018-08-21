import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { MuttonFishService } from '../common/services/mutton-fish.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-mutton-fish-duplicate',
	templateUrl: './mutton-fish-duplicate.component.html',
	styleUrls: ['./mutton-fish-duplicate.component.scss']
})
export class MuttonFishDuplicateComponent implements OnInit {


	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishDuplicateForm: FormGroup;
	translateKey: string = 'muttonFishDuplicateScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//Lookups Array
	MF_LICENSE_TYPE: Array<any> = [];
	PERSON_TYPE: Array<any> = [];

	// serach api variable
	serachLicenceObj = {
		isDisplayDuplicateLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}
	/**
	 * 
	 * @param fb - Declare FormBuilder property.
	 * @param validationService - Declare validation service property.
	 * @param router - Declare router. 
	 * @param route -  Declare url route.
	 * @param formService - Declare form service property .
	 * @param commonService - Declare sweet alert.
	 * @param location - Declare for current URL.
	 * @param shopAndEstablishmentService - Call only shop licence api.
	 */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private muttonFishService: MuttonFishService,
		private commonService: CommonService,
		private location: Location
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});


		this.getLookupData();
		this.muttonFishDuplicateFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = true;
			this.getMuttonFishDuplicateData();
			this.muttonFishDuplicateForm.disable();
		}
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.muttonFishService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayDuplicateLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			})
	}
	
	getMuttonFishDuplicateData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			this.muttonFishDuplicateForm.patchValue(res);
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
			this.MF_LICENSE_TYPE = res.MF_LICENSE_TYPE;
			this.PERSON_TYPE = res.PERSON_TYPE;
		});
	}
	
	/**
	 * 
	 create form control
	 */
	muttonFishDuplicateFormControls() {
		this.muttonFishDuplicateForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'MF-DUP',
			/* Step 1 controls start */
			licenseType: this.fb.group({
				code: [null]
			}),
			personType: this.fb.group({
				code: [null]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [Validators.required, Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			holderTelephoneNo: [null, [Validators.maxLength(12), Validators.minLength(10)]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12)]],
			holderPanNo: [null, [Validators.required, Validators.maxLength(10)]],
			/* Step 1 controls end */
		});
	}


	/**
     * This method is use to create new record for citizen.
     * @param searchData: exciting licence number data
     */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {
			this.formId = res.serviceFormId;
			this.muttonFishDuplicateForm.patchValue(searchData);

			this.muttonFishDuplicateForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode
			});

			this.muttonFishDuplicateForm.disable();
			//this.enableFielList();
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
	}


}
