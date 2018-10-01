import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { MuttonFishService } from '../common/services/mutton-fish.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-mutton-fish-transfer',
	templateUrl: './mutton-fish-transfer.component.html',
	styleUrls: ['./mutton-fish-transfer.component.scss']
})
export class MuttonFishTransferComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishTransferForm: FormGroup;
	translateKey: string = 'muttonFishTransferScreen';

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

	// required attachment array
	private uploadFileArray: Array<any> =
		[
			{ labelName: 'Photo of License Holder', fieldIdentifier: '1', category: 'common' },
			{ labelName: 'One Copy of each site plan and key plan', fieldIdentifier: '2', category: 'common' },
			{ labelName: 'Aadhar Card Scan Copy', fieldIdentifier: '3', category: "common" },
			{ labelName: 'Pan Card Copy of Owner / Propwriter', fieldIdentifier: '4', category: "common" },
			// { labelName: 'Constitution copy of Firm', fieldIdentifier: '5', category: "common" },
			{ labelName: 'Proof of Ownership / tenancy / Legal Occupancy', fieldIdentifier: '6', category: "common" },
			{ labelName: 'Copy of Lease Deed If not Executed, Copy of Auction Letter, Possession Letter', fieldIdentifier: '7', category: "common" },
			// { labelName: 'Copy of Term & conditions for allotment of Premises by the  Land owning Agency ', fieldIdentifier: '8', category: "common" },
			{ labelName: 'Additional Document if Any', fieldIdentifier: '9', category: "common" },
			{ labelName: 'Property Tax Bill paid Receipt', fieldIdentifier: '10', category: "common" },
			{ labelName: 'Shop & Establishment Certificate', fieldIdentifier: '11', category: "common" },

			{ labelName: 'Occupation Certificate', fieldIdentifier: '12', category: "rent" },
			{ labelName: 'Rent Agreement', fieldIdentifier: '13', category: "rent" }
		];

	//upload file as per status of business
	get uploadFileArrayData() {
		let data = this.uploadFileArray;
		if (this.muttonFishTransferForm.get('statusOfBusinessId').value.code != 'RENT') {
			data = this.uploadFileArray.filter((obj) => obj.category != 'rent');
		}
		return data
	}

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.MuttonFishService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayRenewLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayRenewLicenceForm = false;
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
		private commonService: CommonService,
		private formService: FormsActionsService,
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
		this.muttonFishTransferFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getMuttonFishLicNewData();
			this.muttonFishTransferForm.get('licenseType').get('code').disable();

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
			this.muttonFishTransferForm.patchValue(searchData);

			this.muttonFishTransferForm.patchValue({
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
				licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: []
			});

			this.showButtons = true;

			(<FormArray>this.muttonFishTransferForm.get('relationshipList')).controls = [];
			searchData.relationshipList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.muttonFishTransferForm.get('relationshipList')).push(this.createArray(app));
			});
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * Method is used to get form data
	 */
	getMuttonFishLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.muttonFishTransferForm.patchValue(res);
				this.showButtons = true;
				this.onChangeZone(this.muttonFishTransferForm.get('zoneNo').value.code);
				this.onChangeWard(this.muttonFishTransferForm.get('wardNo').value.code);
				res.relationshipList.forEach(app => {
					(<FormArray>this.muttonFishTransferForm.get('relationshipList')).push(this.createArray(app));
				});
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

			this.onChangeZone(this.muttonFishTransferForm.get('zoneNo').value.code);
			this.onChangeWard(this.muttonFishTransferForm.get('wardNo').value.code);
		});
	}

	/**
	 * Method is used for get WARD as per zone selection
	 * @param event : selected zone code
	 */
	onChangeZone(event) {
		this.WARD = [];
		if (event && this.LOOKUP.hasOwnProperty(event)) {
			this.WARD = this.LOOKUP[event];
		}
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
	muttonFishTransferFormControls() {
		this.muttonFishTransferForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'MF-LIC',
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
			/* Step 2 controls end */

			/* Step 3 controls start */
			relationshipList: this.fb.array([]),
			/* Step 3 controls end */

			applicationDate: [],
			licenseIssueDate: [null],
			licenseRenewalDate: [null],
			loinumber: [null],

			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
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
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
			mobileNo: [data.mobileNo ? data.mobileNo : null, [Validators.maxLength(11), Validators.minLength(10)]],
			personType: "MF_PERSON"
		})

	}

	/**
	 * Method is used to add array in form
	 */
	addItem() {
		return this.muttonFishTransferForm.get('relationshipList') as FormArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson() {
		let relationshipIdValue = this.muttonFishTransferForm.get('relationshipId').value.code;

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
			// this.muttonFishTransferForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = <any>this.addItem().controls;
			if (newlyadded.length) {
				(newlyadded[newlyadded.length - 1]).isEditMode = true;
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
			(<FormArray>this.muttonFishTransferForm.get('relationshipList')).controls = [];
			this.muttonFishTransferForm.get('relationshipList').setValue([]);
		} catch (error) {
			console.log(error.message);
		}
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
	*  Method is used check table is in edit mode
	*/
	isTableInEditMode() {
		return this.addItem().controls.find((obj: any) => obj.isEditMode === true);
	}

	/**
	*  Method is used edit editable data view.
	* @param row: table row index
	*/
	editRecord(row: any) {
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value)
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
		}
	}

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row index
	*/
	cancelRecord(row: any) {
		if (row.deepCopyInEditMode) {
			row.patchValue(row.deepCopyInEditMode);
		}
		row.isEditMode = false;
	}

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 16;
		let step1 = 28;
		let step2 = 36;
		let step3 = 42;
		let step4 = 49;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step0) {
				this.tabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.tabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.tabIndex = 2;
				return false;
			} else if (count <= step3) {
				this.tabIndex = 3;
				return false;
			} else if (count <= step4) {
				this.tabIndex = 4;
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
