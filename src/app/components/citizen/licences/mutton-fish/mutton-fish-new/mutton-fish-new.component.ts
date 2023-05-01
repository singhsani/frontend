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
	applicantDetials : FormGroup;
	businessDetail :FormGroup;
	attachmentDetails : FormGroup;
	translateKey: string = 'muttonFishNewScreen';
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
	LOOKUP: any;
	wardZoneLevel = [];
	wardZoneLevel1List = [];
	wardZoneLevel2List = [];
	isLandDetailsAllow: boolean = false;
	isPartnershipDeedAllow: boolean = false;
	isPoliceVerificationAllow: boolean = false;
	isdisableMode :boolean =true;
	istable : boolean = true;
	// required attachment array

	public uploadFileArray: Array<any> = [];
	public mandatoryUploadFileArray: Array<any> = [];
	public serverUploadFilesArray: Array<any> = [];

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
			this.getAllZoneNos();
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
	 getAllZoneNos() {
		this.formService.getWardZoneFirstLevel(1, "PROPERTYTAX").subscribe(
		  (data) => {
			this.wardZoneLevel1List = data;
		  }
		)
	  }
	getMuttonFishLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.muttonFishNewForm.patchValue(res);
				this.applicantDetials.patchValue(res);
				this.businessDetail.patchValue(res);
				// when form open in perview node
				if(res.canEdit == false){
					this.applicantDetials.disable()
					this.businessDetail.disable()
				}
				else{
					this.applicantDetials.enable()
					this.businessDetail.enable()
				}
				this.isdisableMode = res.canEdit;
				this.licenseConfiguration.isAttachmentButtonsVisible = true;
				if(res.relationshipList.length == 0 && res.canEdit==false){
					this.istable = false;
				}else{
					this.istable = true;
				}
				this.onChangeZone(this.businessDetail.get('zoneNo').value);
				//this.onChangeWard(this.muttonFishNewForm.get('wardNo').value.code);
				//this.onChangeStatusOfBusiness(this.muttonFishNewForm.get('statusOfBusinessId').value.code);
				if (this.businessDetail.get('statusOfBusinessId').value.code) {
					this.onChangeStatusOfBusiness(this.businessDetail.get('statusOfBusinessId').value.code)
				} else {
					this.uploadFileArray = res.serviceDetail.serviceUploadDocuments;
					this.uploadFileArray.sort((a, b) =>
							a.orderSequence - b.orderSequence);

				}
				// deflate add one array in relationship grid
				if ((<FormArray>res.relationshipList).length == 0) {
					this.addItem().push(this.createArray());
					let newlyadded = this.addItem().controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
				res.relationshipList.forEach(app => {
					(<FormArray>this.businessDetail.get('relationshipList')).push(this.createArray(app));
				});

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				});

				//this.serverUploadFilesArray = res.serviceDetail.serviceUploadDocuments;
				this.uploadFileArray = res.serviceDetail.serviceUploadDocuments;
				this.uploadFileArrayOnBusinessType(res);
				//this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishNewForm);
				this.muttonFishNewForm.get('personTypeGuj').setValue(res.personType.gujName);
				this.muttonFishNewForm.controls.permanantAddress.valueChanges.subscribe(data => {
					if (this.muttonFishNewForm.get('isSameAsPermanantAddress').get('code').value == "YES") {
						this.onSameAddressChange({ checked: true });
					}
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
			this.MEATFISH_STATUS_OF_BUSINESS = res.MEATFISH_STATUS_OF_BUSINESS;
			this.PERSON_TYPE = res.PERSON_TYPE;
			this.FIRM_ZONE = res.FIRM_ZONE;

			this.onChangeZone(this.muttonFishNewForm.get('zoneNo').value);
			//this.onChangeWard(this.muttonFishNewForm.get('wardNo').value.code);
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
			this.WARD = this.WARD.sort((a, b) => {
			var itemA = a.name.split("-");
			var itemB = b.name.split("-");
				return itemA[1] - itemB[1];
			  });
		}
	}

	onChangeStatusOfBusiness(event) {
		// let array = (<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		const localUploadArray = this.commonService.clone((<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments')).value);
		// let array = (<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		this.uploadFileArray = [];
		this.mandatoryUploadFileArray = [];
		
		if (event == 'PROPRIETORSHIPFIRM') {
			for (let file of localUploadArray) {
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') || (file['documentIdentifier'] == 'POLICE_VERIFICATION') || (file['documentIdentifier'] == 'RENT_AGREEMENT')) {
						file['mandatory'] = false;
				}else{
					this.uploadFileArray.push(file);
				}
				if(file['documentIdentifier'] == 'PROOF_OF_OWNERSHIP'){
					file['mandatory'] = false;
				}
				 if(file['documentIdentifier'] == 'PROPERTY_BILL_RECEIPT'){
					// file['isActive'] = true;
					file['mandatory'] = true;
				}
				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
			}
		} else if (event == 'PARTNERSHIPFIRM') {
			for (let file of localUploadArray) {
				if ((file['documentIdentifier'] == 'POLICE_VERIFICATION') || (file['documentIdentifier'] == 'LAND_TERMS_CONDITION')) {
						file['mandatory'] = false;
				}else{
					this.uploadFileArray.push(file);
				}

				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
			}
		} else if (event == 'TENANT') {
			for (let file of localUploadArray) {
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') ||  (file['documentIdentifier'] == 'LAND_TERMS_CONDITION')) {
					file['mandatory'] = false;
				}else if(file['documentIdentifier'] == 'RENT_AGREEMENT'){
					file['mandatory'] = true;
					this.uploadFileArray.push(file);
				}
				else{
					this.uploadFileArray.push(file);
				}

				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
		}
		} else {
			return this.uploadFileArray;
		}
			//this.removeAddressDetail();
	}

	

	/**
	 * Method is used for get block as per zone selection
	 * @param event : selected ward code
	 * @param formType : form vontrol name
	 */
	//	onChangeWard(event) {
	//		this.BLOCK = [];
	//		if (event && this.LOOKUP && this.LOOKUP.hasOwnProperty(event)) {
	//			this.BLOCK = this.LOOKUP[event];
	//		}
	//	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	muttonFishNewFormControls() {
		/* Step 1 controls start */
		this.applicantDetials  = this.fb.group({
			licenseType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			personType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			personTypeGuj: [null, [Validators.required]],
			holderFirstName: [null, [Validators.required, Validators.maxLength(30), ValidationService.nameValidator]],

			holderMiddleName: [null, [ Validators.maxLength(30), ValidationService.nameValidator]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30), ValidationService.nameValidator]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.maxLength(90)]],

			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12)]],
			holderPanNo: [null, [Validators.required, ValidationService.panValidator, Validators.maxLength(10)]],
			isSameAsPermanantAddress: this.fb.group({
				code: null
			}),
		})
        /* Step 1 controls end */

		/* Step 2 controls start */
		this.businessDetail = this.fb.group({
             // zoneNo: this.fb.group({code: null}, Validators.required),
			// wardNo: this.fb.group({code: null}, Validators.required),
			zoneNo: [null,Validators.required] ,
			wardNo: [null,Validators.required],
			//businessAddressType: this.fb.group({ code: [null, Validators.required] }),
			businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			// extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			// relationshipId: this.fb.group({
			// 	code: [null, Validators.required]
			// }),
			statusOfBusinessId: this.fb.group({
				code: [null, Validators.required]
			}),
			relationshipList: this.fb.array([]),
		})
            /* Step 2 controls start */
		this.attachmentDetails = this.fb.group({
			attachments: [],
		})
		this.muttonFishNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'MF-LIC',
			applicationDate: [],
			licenseIssueDate: [null],
			licenseRenewalDate: [null],
			loinumber: [null],
			attachments: [],
		});
		/** Method is used to copy local contoller to Main contoller **/
		this.commonService.createCloneAbstractControl(this.applicantDetials,this.muttonFishNewForm);
		this.commonService.createCloneAbstractControl(this.businessDetail,this.muttonFishNewForm);
		this.commonService.createCloneAbstractControl(this.attachmentDetails,this.muttonFishNewForm);
		
	}

	/**
	 * Method is used to return array
	 * @param data : person data array
	 */
	createArray(data: any = {}) {
		return this.fb.group({
			serviceFormId: this.formId,
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(50)]],
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(100)]],
			mobileNo: [data.mobileNo ? data.mobileNo : null, [Validators.maxLength(10), Validators.minLength(10)]],
			personType: "MF_PERSON"
		})
	}

	/**
	 * Method is used to add array in form
	 */
	addItem() {
		let returnArray: any;
		returnArray = this.businessDetail.get('relationshipList') as FormArray;
		return returnArray;
	}

	onSameAddressChange(event) {

		if (event.checked) {

			this.applicantDetials.get('temporaryAddress').patchValue(this.applicantDetials.get('permanantAddress').value);
			this.applicantDetials.get('temporaryAddress.addressType').setValue('MF_TEMPORARY_ADDRESS');
			this.applicantDetials.get('isSameAsPermanantAddress').get('code').setValue("YES");
			this.applicantDetials.get('temporaryAddress').disable();
		} else {
			this.applicantDetials.get('temporaryAddress').enable();
			this.applicantDetials.get('temporaryAddress').reset();
			this.applicantDetials.get('isSameAsPermanantAddress').get('code').setValue("NO");
		}

	}


	/**
	 * Method is used when user click for add person
	 */
	addMorePerson() {
		// let relationshipIdValue = this.muttonFishNewForm.get('relationshipId').value.code;
		let relationshipIdValue = this.businessDetail.get('statusOfBusinessId').value.code;

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
			let newlyadded = this.addItem().controls;
			if (newlyadded.length) {
				// (newlyadded[newlyadded.length - 1]).isEditMode = true;
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new row after save existing row.", "warning");
		}
	}

	/**
	 * Method is use for reset relationship
	 */
	 onChangeRelationWithOrg() {
		try {
			(<FormArray>this.businessDetail.get('relationshipList')).controls = [];
			this.businessDetail.get('relationshipList').setValue([]);

			if ((<FormArray>this.businessDetail.get('relationshipList')).length == 0) {
				this.addItem().push(this.createArray());
				let newlyadded = this.addItem().controls;
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
	// onChangeStatusOfBusiness() {
	// 	this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishNewForm);
	// }

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


	/**
	 * Gujarati Look Up Converter.
	 * @param selectedValue - selected value from dropdown
	 * @param controlName - control name of form
	 * @param lookupName - passed lookup array
	 */
	getGujNameFromLookup(selectedValue: string, controlName: string, lookupName: Array<any>) {

		if (lookupName && lookupName.length) {
			let dataObj = lookupName.find((obj) => obj.code === selectedValue);
			if (dataObj && dataObj.gujName) {
				this.applicantDetials.get(controlName).setValue(dataObj.gujName);
			} else {
				this.applicantDetials.get(controlName).setValue('');
			}
		}

	}

	onCardChange(event, cardName) {
		if (event.target.value === "" || this.muttonFishNewForm.get(cardName).invalid) {
			this.muttonFishNewForm.get(cardName).setValue(null);
		}
	}

	uploadFileArrayOnBusinessType(res: any) {
		const localUploadDocument = res.serviceDetail.serviceUploadDocuments;
		this.uploadFileArray = [];
		if (res.statusOfBusinessId.code == "PROPRIETORSHIPFIRM") {
			for (let file of localUploadDocument) {
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') || (file['documentIdentifier'] == 'POLICE_VERIFICATION')) {
					file['mandatory'] = false;
				} else {
					this.uploadFileArray.push(file);
				}

				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
			}
		} else if (res.statusOfBusinessId.code == 'PARTNERSHIPFIRM') {
			for (let file of localUploadDocument) {
				if ((file['documentIdentifier'] == 'POLICE_VERIFICATION') || (file['documentIdentifier'] == 'LAND_TERMS_CONDITION')) {
					file['mandatory'] = false;
				} else {
					this.uploadFileArray.push(file);
					console.log(this.uploadFileArray);
				}

				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
			}
		} else if (res.statusOfBusinessId.code == 'TENANT') {
			for (let file of localUploadDocument) {
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') || (file['documentIdentifier'] == 'LAND_TERMS_CONDITION')) {
					file['mandatory'] = false;
				} else {
					this.uploadFileArray.push(file);

				}

				if (file['mandatory'] == true) {
					this.mandatoryUploadFileArray.push(file);
				}
			}
		} else {
			return this.uploadFileArray;
		}
	}

	removeAddressDetail(){
		this.muttonFishNewForm.get('businessAddress').patchValue({
			"buildingName": null,
			"buildingNameGuj": null,
			"streetName": null,
			"streetNameGuj": null,
			"landmark": null,
			"landmarkGuj": null,
			"area": null,
			"areaGuj": null,
			"state": "GUJARAT",
			"stateGuj": "ગુજરાત",
			"district": null,
			"districtGuj": null,
			"city": "Vadodara",
			"cityGuj": "વડોદરા",
			"pincode": null,
			"country": "INDIA",
			"countryGuj": "ભારત"
		  });
		this.muttonFishNewForm.controls['relationshipList'] = this.fb.array([]);
	}

	patchValue() {
		this.muttonFishNewForm.patchValue(this.dummyJSON);
	}

	dummyJSON: any = {
		"licenseIssueDate": null,
		"licenseRenewalDate": null,
		"loinumber": null,
		"licenseType": {
			"code": "MEAT"
		},
		"personType": {
			"code": "MR"
		},
		"holderFirstName": "sadfsdf",
		"holderMiddleName": "dsfsdfsdf",
		"holderLastName": "sdfdsfsdf",
		"holderFirstNameGuj": "સદ્ફ્સ્દ્ફ",
		"holderMiddleNameGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
		"holderLastNameGuj": "સ્દ્ફ્દ્સ્ફ્સ્દ્ફ",
		"permanantAddress": {
			"addressType": "MF_PERMANENT_ADDRESS",
			"buildingName": "dsfsdf",
			"streetName": "sdfsdfsdf",
			"landmark": "sdfdsfdsf",
			"area": "sdfsdfsdf",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "234234",
			"buildingNameGuj": "દ્સ્ફ્સ્દ્ફ",
			"streetNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"landmarkGuj": "સ્દ્ફ્દ્સ્ફ્દ્સ્ફ",
			"areaGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"temporaryAddress": {
			"addressType": "MF_TEMPORARY_ADDRESS",
			"buildingName": "fsdfsdfsdf",
			"streetName": "sdfdsfsd",
			"landmark": "dsfsdfsd",
			"area": "dsfsdfsdf",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "234243",
			"buildingNameGuj": "ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"streetNameGuj": "સ્દ્ફ્દ્સ્ફ્સ્દ",
			"landmarkGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ",
			"areaGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"holderTelephoneNo": "08962749073",
		"holderMobileNo": "8962749073",
		"holderFaxNo": "435435435435",
		"holderAadharNo": "435435435435",
		"holderPanNo": "ABCDE1234T",
		"zoneNo": {
			"code": "NORTH_ZONE"
		},
		"wardNo": {
			"code": "WARD_7"
		},
		"businessAddress": {
			"addressType": "MF_BUSINESS_ADDRESS",
			"buildingName": "sdfsdfsdf",
			"streetName": "sdfsdfsdf",
			"landmark": null,
			"area": "sdfsdfsd",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "234234",
			"buildingNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"streetNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"landmarkGuj": null,
			"areaGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"extraDetailsOfBusiness": "agfdgfdgfdg",
		"relationshipId": {
			"code": "PROPRIETOR"
		},
		// "statusOfBusinessId": {
		// 	"code": "PARTNERSHIPFIRM"
		// },
		"relationshipList": [
			{
				"name": "gfdg",
				"address": "fdgfdgfdg",
				"mobileNo": "4545435435",
				"personType": "MF_PERSON"
			}
		],
		"fileStatus": "DRAFT",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"agree": false,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"serviceDetail": {
			"code": "MF-LIC",
			"name": "Meat And Fish shop license",
			"gujName": "મીટ એન્ડ ફિશ શોપ લાઇસન્સ",
			"feesOnScrutiny": true,
			"appointmentRequired": false
		}
	};

	onChangedZone(event) {
		this.wardZoneLevel2List =[];
		if (event == undefined) {
		this.businessDetail.get('wardNo').get('code').setValue(null);
		  return false
		}
		else {
		  let postData = {};
		  postData = { parentId: event };
		  this.formService.getWardZone(postData).subscribe(res => {
			this.wardZoneLevel2List = res.body;
		  })

		}
	  }
	}

