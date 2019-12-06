import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { CommonService } from '../../.././../../shared/services/common.service';
import { Location } from '@angular/common';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-shop-lic-cancellation',
	templateUrl: './shop-lic-cancellation.component.html',
	styleUrls: ['./shop-lic-cancellation.component.scss']
})
export class ShopLicCancellationComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopCancellationForm: FormGroup;
	translateKey: string = 'shopCancellationScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;
	//lookup array
	wardNo: Array<any> = [];
	uploadFileArray = [];
	// serach api variable
	serachLicenceObj = {
		isDisplayCancelLicenceForm: <boolean>false,
		searchLicenceNumber:""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {

		this.shopAndEstablishmentService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayCancelLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayCancelLicenceForm = false;
				}
			}, (err: any) => {

				this.serachLicenceObj.isDisplayCancelLicenceForm = false;
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
		this.cancelShopLicFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayCancelLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayCancelLicenceForm = true;
			this.getShopCancellationData();

			this.shopCancellationForm.disable();
			this.enableFielList();
		}

	}

    /**
	 * This method create form controls.
	 */
	cancelShopLicFormControls() {
		this.shopCancellationForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-CAN',
			refNumber:[null],
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

			remark: [null, [Validators.required, Validators.maxLength(100)]],
			/* Step 1 controls end */
			licenseIssueDate: [null],
			attachments: [],

		});
	}

	/**
	 * This method use for edit some fiels.
	 */
	enableFielList() {
		this.shopCancellationForm.get('remark').enable();
		this.shopCancellationForm.get('establishmentName').enable();
		this.shopCancellationForm.get('wardNo').enable();
		this.shopCancellationForm.get('nameOfEmployer').enable();
		this.shopCancellationForm.get('propertyTaxNo').enable();
		
	}

	/**
 	 * This method is use to create new record for citizen.
 	 * @param searchData: exciting licence number data
 	 */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.shopCancellationForm.patchValue(searchData);

			this.shopCancellationForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				refNumber:this.serachLicenceObj.searchLicenceNumber,
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
				serviceCode: res.serviceCode,
				// applicationNo: res.applicationNo,
				licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: [],

			});
			this.shopCancellationForm.disable();
			this.enableFielList();
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * This method patch form data.
	 */
	getShopCancellationData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			this.shopCancellationForm.patchValue(res);
		});
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;
		if (count <= step1) {
			this.licenseConfiguration.currentTabIndex = 0;
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



}
