import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { CommonService } from '../../.././../../shared/services/common.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-shop-lic-duplicate',
	templateUrl: './shop-lic-duplicate.component.html',
	styleUrls: ['./shop-lic-duplicate.component.scss']
})
export class ShopLicDuplicateComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;
	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicDuplicateForm: FormGroup;
	translateKey: string = 'shopLicDuplicateScreen';

	formId: number;
	apiCode: string;
	private showButtons: boolean = false;
	//File and image upload
	uploadModel: any = {};
	tabIndex: number = 0;

	//lookup array
	wardNo: Array<any> = [];

	// serach api variable
	serachLicenceObj = {
		isDisplayDuplicateLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {

		this.shopAndEstablishmentService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
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
		private commonService: CommonService,
		private location: Location,
		private shopAndEstablishmentService: ShopAndEstablishmentService,
	) { }


	/**
	 * This method call initially required methods.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getLookupData();
		this.shopLicDuplicateFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = true;
			this.getShopDuplicateData();

			this.shopLicDuplicateForm.disable();
			this.enableFielList();
		}

	}


	/**
	 * This method create form controls.
	 */
	shopLicDuplicateFormControls() {
		this.shopLicDuplicateForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-DUP',

			//licence number 
			refNumber: this.serachLicenceObj.searchLicenceNumber,

			/* Step 1 controls start */
			establishmentName: [null, [Validators.required, Validators.maxLength(150)]],
			// establishmentNameGuj: [null, Validators.required],
			wardNo: this.fb.group({
				code: [null, [Validators.required]],
				name: [null],
			}),
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),
			nameOfEmployer: [null, [Validators.required, Validators.maxLength(100)]],
			// nameOfEmployerGuj:[null],
			propertyTaxNo: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],

			noOfCopies: [null, [Validators.required]],
			/* Step 1 controls end */
		});
	}


	/**
	 * This method use for edit some fiels.
	 */
	enableFielList() {
		this.shopLicDuplicateForm.get('noOfCopies').enable();
	}

	/**
 	 * This method is use to create new record for citizen.
 	 * @param searchData: exciting licence number data
 	 */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.shopLicDuplicateForm.patchValue(searchData);

			this.shopLicDuplicateForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				// paymentStatus: res.paymentStatus,
				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode
			});

			this.showButtons = true;

			this.shopLicDuplicateForm.disable();
			this.enableFielList();
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * This method patch form data.
	 */
	getShopDuplicateData() {
		this.formService.getFormData(this.formId).subscribe(res => {
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
			this.tabIndex = 0;
			return false;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.wardNo = res.SHOP_LIC_WARD_NO;
		});
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}


}
