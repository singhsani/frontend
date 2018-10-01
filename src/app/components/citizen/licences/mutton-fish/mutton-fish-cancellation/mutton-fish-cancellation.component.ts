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

@Component({
	selector: 'app-mutton-fish-cancellation',
	templateUrl: './mutton-fish-cancellation.component.html',
	styleUrls: ['./mutton-fish-cancellation.component.scss']
})
export class MuttonFishCancellationComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishCancellationForm: FormGroup;
	translateKey: string = 'muttonFishCancellationScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

	//Lookups Array
	MF_LICENSE_TYPE: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	MF_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;
	businessCategory: Array<any> = [];
	businessSubCategory: Array<any> = [];

	// required attachment array
	private uploadFileArray: Array<any> = [];


	// serach api variable
	serachLicenceObj = {
		isDisplayCancellationLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.MuttonFishService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
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
			this.muttonFishCancellationForm.disable();
			this.enableFielList();
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
				attachments: []
			});

			this.showButtons = true;

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
				this.showButtons = true;

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
			this.MF_STATUS_OF_BUSINESS = res.MF_STATUS_OF_BUSINESS;
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
			refNumber:[null],
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

			reason: [],
			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
		});
	}

	/**
     * Method is used to set data value to upload method.
     * @param indentifier - file identifier
     * @param labelName - file label name.
     * @param formPart - file form part
     * @param variableName - file variable name.
     */
	setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {
		this.uploadModel = {
			fieldIdentifier: indentifier.toString(),
			labelName: labelName,
			formPart: formPart,
			variableName: variableName,
			serviceFormId: this.formId,
		}
		return this.uploadModel;
	}

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 23;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step0) {
				this.tabIndex = 0;
				return false;
			}
			// else if (count == 67) {
			// 	this.checkReligion();
			// 	return false;
			// }
			else {
				console.log("else condition");
			}

		}
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}



}
