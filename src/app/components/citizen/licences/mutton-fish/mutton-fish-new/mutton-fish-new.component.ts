import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-mutton-fish-new',
	templateUrl: './mutton-fish-new.component.html',
	styleUrls: ['./mutton-fish-new.component.scss']
})

export class MuttonFishNewComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishNewForm: FormGroup;
	translateKey: string = 'muttonFishNewScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;

	//Lookups Array
	MF_LICENSE_TYPE: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	MF_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;

	// required attachment array
	private uploadFileArray: Array<any> = [];


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
		public TranslateService: TranslateService
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
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getMuttonFishLicNewData();
			this.muttonFishNewFormControls();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getMuttonFishLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.muttonFishNewForm.patchValue(res);
				this.licenseConfiguration.isAttachmentButtonsVisible = true;
				this.onChangeZone(this.muttonFishNewForm.get('zoneNo').value.code);
				this.onChangeWard(this.muttonFishNewForm.get('wardNo').value.code);

				// deflate add one array in relationship grid
				if ((<FormArray>res.relationshipList).length == 0) {
					this.addItem().push(this.createArray());
					let newlyadded = <any>this.addItem().controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
				res.relationshipList.forEach(app => {
					(<FormArray>this.muttonFishNewForm.get('relationshipList')).push(this.createArray(app));
				});
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				});
				this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishNewForm);
			} catch (error) {
				console.log(error.message)
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

			this.onChangeZone(this.muttonFishNewForm.get('zoneNo').value.code);
			this.onChangeWard(this.muttonFishNewForm.get('wardNo').value.code);
		});
	}

	/**
	 * Method is used for get WARD as per zone selection
	 * @param event : selected zone code
	 */
	onChangeZone(event) {
		this.WARD = [];
		if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
			this.WARD = this.LOOKUP[event];
		}
	}

	/**
	 * Method is used for get block as per zone selection
	 * @param event : selected ward code
	 */
	onChangeWard(event) {
		this.BLOCK = [];
		if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
			this.BLOCK = this.LOOKUP[event];
		}
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	muttonFishNewFormControls() {
		this.muttonFishNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'MF-LIC',
			applicationDate: [],
			licenseIssueDate: [null],
			licenseRenewalDate: [null],
			loinumber: [null],
			/* Step 1 controls start */
			licenseType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			personType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30), ValidationService.nameValidator]],
			holderMiddleName: [null, [Validators.required, Validators.maxLength(30), ValidationService.nameValidator]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30), ValidationService.nameValidator]],
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
			zoneNo: this.fb.group({ code: [null, Validators.required] }),
			wardNo: this.fb.group({ code: [null, Validators.required] }),
			blockNo: this.fb.group({ code: [null, Validators.required] }),
			businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			relationshipId: this.fb.group({
				code: [null, Validators.required]
			}),
			statusOfBusinessId: this.fb.group({
				code: [null, Validators.required]
			}),
			relationshipList: this.fb.array([]),
			/* Step 2 controls end */

			/* Step 3 controls start*/
			attachments: []
			/* Step 3 controls end */
		});
	}

	/**
	 * Method is used to return array
	 * @param data : person data array
	 */
	createArray(data: any = {}) {
		return this.fb.group({
			serviceFormId: this.formId,
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(200)]],
			mobileNo: [data.mobileNo ? data.mobileNo : null, [Validators.maxLength(11), Validators.minLength(10)]],
			personType: "MF_PERSON"
		})
	}

	/**
	 * Method is used to add array in form
	 */
	addItem() {
		let returnArray: any;
		returnArray = this.muttonFishNewForm.get('relationshipList') as FormArray;
		return returnArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson() {
		let relationshipIdValue = this.muttonFishNewForm.get('relationshipId').value.code;

		if (!relationshipIdValue) {
			this.toastrService.warning("Please select relationship of applicant first.");
			return false;
		}

		let isEditAnotherRow = this.isTableInEditMode();
		if (!isEditAnotherRow) {
			if (relationshipIdValue == "PROPRIETOR" && this.addItem().controls.length >= 1) {
				this.toastrService.warning("Person not allowed more than 1");
				return false;
			}
			if ((relationshipIdValue == "PARTNER" || relationshipIdValue == "DIRECTOR" || relationshipIdValue == "AUTHORIZEDSIGNATORY") && this.addItem().controls.length >= 10) {
				this.toastrService.warning("Person not allowed more than 10");
				return false;
			}
			this.addItem().push(this.createArray());
			// this.muttonFishNewForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = <any>this.addItem().controls;
			if (newlyadded.length) {
				// (newlyadded[newlyadded.length - 1]).isEditMode = true;
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new recode after save existing recode.", "warning");
		}
	}

	/**
	 * Method is use for reset relationship 
	 */
	onChangeRelationWithOrg() {
		try {
			(<FormArray>this.muttonFishNewForm.get('relationshipList')).controls = [];
			this.muttonFishNewForm.get('relationshipList').setValue([]);

			if ((<FormArray>this.muttonFishNewForm.get('relationshipList')).length == 0) {
				this.addItem().push(this.createArray());
				let newlyadded = <any>this.addItem().controls;
				if (newlyadded.length) {
					this.editRecord((newlyadded[newlyadded.length - 1]));
					(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	/**
	 * Method is use for change dynamic file attachment 
	 */
	onChangeStatusOfBusiness() {
		this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishNewForm);
	}

	/**
	*  Method is used check table is in edit mode
	*/
	isTableInEditMode() {
		return this.addItem().controls.find((obj: any) => obj.isEditMode === true);
	}

	/**
	*  Method is used edit editable data view.
	* @param row: table row id
	*/
	editRecord(row: any) {
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value);
	}

	/**
	 * Method is used when user click for remove person
	 * @param index : table index
	 */
	deleteRecord(index: any) {
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.addItem().controls.splice(index, 1);
			this.commonService.successAlert('Removed!', '', 'success');
		});
	}

	/**
	*  Method is used save editable dataview.
	* @param row: table row index
	*/
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
			row.newRecordAdded = false;
		}
	}

	
	/**
	*  Method is used cancel editable dataview.
	* @param row: table row index
	*/
	cancelRecord(row: any, index: number) {
		try {
			if (row.newRecordAdded) {
				this.addItem().removeAt(index);
			} else {
				if (row.deepCopyInEditMode) {
					row.patchValue(row.deepCopyInEditMode);
				}
				row.isEditMode = false;
				row.newRecordAdded = false;
			}
		} catch (error) {

		}
	}

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {
		let step0 = 21;
		let step1 = 29;

		switch (true) {
			case flag <= step0:
			this.licenseConfiguration.currentTabIndex = 0;
				break;
			case flag <= step1:
			this.licenseConfiguration.currentTabIndex = 1;
				break;
			
			default:
			this.licenseConfiguration.currentTabIndex = 0;

		}
		this.checkDynamicTableValidate();
	}

	/**
	 * this method is use for check validate dynamic grid (relationshipList)
	 */
	checkDynamicTableValidate(): void {
		try {
			this.addItem().controls.forEach(element => {
				if (element.invalid) {
					element.isEditMode = true;
				}
			});
		} catch (error) {
			console.error(error.message);
		}

	}
}

