import { LicenseConfiguration } from './../../license-configuration';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { MuttonFishService } from '../common/services/mutton-fish.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
	selector: 'app-mutton-fish-cancellation',
	templateUrl: './mutton-fish-cancellation.component.html',
	styleUrls: ['./mutton-fish-cancellation.component.scss']
})
export class MuttonFishCancellationComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishCancellationForm: FormGroup;
	translateKey: string = 'muttonFishCancellationScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;

	//Lookups Array
	MF_LICENSE_TYPE: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	MEATFISH_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;
	businessCategory: Array<any> = [];
	businessSubCategory: Array<any> = [];

	// required attachment array
	public uploadFileArray: Array<any> = [];


	// serach api variable
	serachLicenceObj = {
		isDisplayCancellationLicenceForm: <boolean>false,
		searchLicenceNumber: ""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		let obj = { refNumber: this.serachLicenceObj.searchLicenceNumber };
		this.MuttonFishService.searchLicence(obj).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayCancellationLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayCancellationLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayCancellationLicenceForm = false;
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			})
	}

	/**
	 * @param fb - Declare FormBuilder property.
	 * @param validationError - Declare validation service property
	 * @param formService - Declare form service property 
	 * @param uploadFileService - Declare upload file service property.
	 * @param commonService - Declare sweet alert.
	 * @param toastrService - Show massage with timer.
	 */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private toastrService: ToastrService,
		private MuttonFishService: MuttonFishService,
		private location: Location
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
		this.muttonFishCancellationFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayCancellationLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayCancellationLicenceForm = true;
			this.getMuttonFishLicCancellationData();
		}
	}

	/**
	 * This method is use to create new record for citizen.
	 * @param searchData: exciting licence number data
	 */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.muttonFishCancellationForm.patchValue(searchData);

			this.muttonFishCancellationForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				paymentStatus: res.paymentStatus,
				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode,
				applicationNo: res.applicationNo,

				periodFrom: res.periodFrom,
				periodTo: res.periodTo,
				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				//licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: [],
				wardNo:searchData.wardNo,
				zoneNo:searchData.zoneNo
			});
			this.muttonFishCancellationForm.disable();
			this.enableFielList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * This method use for edit some fiels.
	 */
	enableFielList() {
		this.muttonFishCancellationForm.get('reason').enable();
	}

	/**
	 * Method is used to get form data
	 */
	getMuttonFishLicCancellationData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.muttonFishCancellationForm.patchValue(res);
				this.muttonFishCancellationForm.disable();
				//this.enableFielList();
			} catch (error) {
				console.log(error.message);
			}
		});
	}

	/**
	* Method is used to get lookup data
	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.LOOKUP = res;
			this.MF_LICENSE_TYPE = res.MF_LICENSE_TYPE;
			this.MF_RELATIONSHIP_OF_APPLICANT = res.MF_RELATIONSHIP_OF_APPLICANT;
			this.MEATFISH_STATUS_OF_BUSINESS = res.MEATFISH_STATUS_OF_BUSINESS;
			this.PERSON_TYPE = res.PERSON_TYPE;
			this.FIRM_ZONE = res.FIRM_ZONE;
		});
	}

	/**
	* Method is used for get block as per zone selection
	* @param event : selected ward code
	*/
	onChangeWard(event) {
		this.BLOCK = [];
		if (event && this.LOOKUP.hasOwnProperty(event)) {
			this.BLOCK = this.LOOKUP[event];
		}
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	muttonFishCancellationFormControls() {
		this.muttonFishCancellationForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'MF-DUP',
			refNumber: [null],
			/* Step 1 controls start */
			licenseType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			personType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.maxLength(90)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12)]],
			holderPanNo: [null, [Validators.required, Validators.maxLength(10)]],
			/* Step 1 controls end */

			/* Step 2 controls start */
			// zoneNo: this.fb.group({ code: [null, Validators.required] }),
			// wardNo: this.fb.group({ code: [null, Validators.required] }),
			// blockNo: this.fb.group({ code: [null, Validators.required] }),
			// businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			// extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			// relationshipId: this.fb.group({
			// 	code: [null, Validators.required]
			// }),
			// statusOfBusinessId: this.fb.group({
			// 	code: [null, Validators.required]
			// }),
			// relationshipList: this.fb.array([]),
			/* Step 3 controls end */

			applicationDate: [],
			licenseIssueDate: [null],
			licenseCancellationalDate: [null],
			loinumber: [null],
			zoneNo: [null,Validators.required],
			wardNo: [null,Validators.required],
			reason: [],
			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
		});
	}


	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 23;

		if (flag != null) {
			//Check validation for step by step
			if (flag <= step0) {
				this.licenseConfiguration.currentTabIndex = 0;
				return false;
			} else {
				console.log("else condition");
			}

		}
	}


	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date, controlType: string) {
		this.muttonFishCancellationForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

}
