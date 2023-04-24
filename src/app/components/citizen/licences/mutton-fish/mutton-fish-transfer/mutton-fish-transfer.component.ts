import { LicenseConfiguration } from './../../license-configuration';
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
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import * as moment from 'moment';

@Component({
	selector: 'app-mutton-fish-transfer',
	templateUrl: './mutton-fish-transfer.component.html',
	styleUrls: ['./mutton-fish-transfer.component.scss']
})
export class MuttonFishTransferComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	muttonFishTransferForm: FormGroup;
	translateKey: string = 'muttonFishTransferScreen';

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
	wardZoneLevel1List = [];
	wardZoneLevel2List = [];
	isdisableMode :boolean =true;
	istable : boolean = true;
	//BLOCK: Array<any> = [];
	LOOKUP: any;
	
	// required attachment array
	public uploadFileArray: Array<any> = [];
	public mandatoryUploadFileArray: Array<any> = [];
	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber:""
	}
	checkboxValue:boolean = false;

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
    let obj = { refNumber: this.serachLicenceObj.searchLicenceNumber };
		this.MuttonFishService.searchLicence(obj).subscribe(
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
		private location: Location,
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
		this.muttonFishTransferFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getMuttonFishLicNewData();
			this.muttonFishTransferForm.get('licenseType').get('code').disable();

		}

		this.disableField();
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
			//	licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: []
			});

			this.licenseConfiguration.isAttachmentButtonsVisible = true;

			(<FormArray>this.muttonFishTransferForm.get('relationshipList')).controls = [];
			searchData.relationshipList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.muttonFishTransferForm.get('relationshipList')).push(this.createArray(app));
			});
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.muttonFishTransferForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
			});
			this.onChangeStatusOfBusiness(searchData.statusOfBusinessId.code,false)
			//this.uploadFileArray = res.serviceDetail.serviceUploadDocuments;
			//this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishTransferForm);

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}
    getAllZoneNos() {
		this.formService.getWardZoneFirstLevel(1, "PROPERTYTAX").subscribe(
		  (data) => {
			this.wardZoneLevel1List = data;
		  }
		)
	  }
	/**
	 * Method is used to get form data
	 */
	getMuttonFishLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.muttonFishTransferForm.patchValue(res);
				this.isdisableMode = res.canEdit;
				if(res.relationshipList.length == 0 && res.canEdit==false){
					this.istable = false;
				}else{
					this.istable = true;
				}
				this.licenseConfiguration.isAttachmentButtonsVisible = true;
				this.onChangeZone(this.muttonFishTransferForm.get('zoneNo').value);
			//	this.onChangeWard(this.muttonFishTransferForm.get('wardNo').value.code);
			if (this.muttonFishTransferForm.get('statusOfBusinessId').value.code) {
				this.onChangeStatusOfBusiness(this.muttonFishTransferForm.get('statusOfBusinessId').value.code,false)
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
					(<FormArray>this.muttonFishTransferForm.get('relationshipList')).push(this.createArray(app));
				});
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.muttonFishTransferForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				});
				this.uploadFileArray = res.serviceDetail.serviceUploadDocuments;
				//this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishTransferForm);
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

			this.onChangeZone(this.muttonFishTransferForm.get('zoneNo').value);
			//this.onChangeWard(this.muttonFishTransferForm.get('wardNo').value.code);
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
	// onChangeWard(event) {
	// 	this.BLOCK = [];
	// 	if (event && this.LOOKUP.hasOwnProperty(event)) {
	// 		this.BLOCK = this.LOOKUP[event];
	// 	}
	// }
	
	onChangeStatusOfBusiness(event,notFromInint?) {
		// let array = (<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		const localUploadArray = this.commonService.clone((<FormArray>this.muttonFishTransferForm.get('serviceDetail').get('serviceUploadDocuments')).value);
		// let array = (<FormArray>this.muttonFishNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		this.uploadFileArray = [];
		this.mandatoryUploadFileArray = [];

		
		if (event == 'PROPRIETORSHIPFIRM') {
			for (let file of localUploadArray) {
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') || (file['documentIdentifier'] == 'POLICE_VERIFICATION')) {
					file['mandatory'] = false;
				}else{
					this.uploadFileArray.push(file);
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
				if ((file['documentIdentifier'] == 'PARTNERSHIP_DEED') || (file['documentIdentifier'] == 'LAND_TERMS_CONDITION')) {
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
		}else {
			return this.uploadFileArray;
		}
		if(notFromInint){
			this.removeAddressDetail();
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
			refNumber: [null],
			/* Step 1 controls start */
			licenseType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			personType: this.fb.group({
				code: [null, [Validators.required]]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [ Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.maxLength(90)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required,Validators.maxLength(12)]],
			holderPanNo: [null, [Validators.required, ValidationService.panValidator,Validators.maxLength(10)]],
			/* Step 1 controls end */

			/* Step 2 controls start */
			zoneNo: [null,Validators.required],
			wardNo: [null,Validators.required],
		//	blockNo: this.fb.group({ code: [null, Validators.required] }),
			businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
		//	extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			// relationshipId: this.fb.group({
			// 	code: [null, Validators.required]
			// }),
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
		returnArray = this.muttonFishTransferForm.get('relationshipList') as FormArray;
		return returnArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson() {
		// let relationshipIdValue = this.muttonFishTransferForm.get('relationshipId').value.code;
		let relationshipIdValue = this.muttonFishTransferForm.get('statusOfBusinessId').value.code;

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
			let newlyadded = this.addItem().controls;
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
			(<FormArray>this.muttonFishTransferForm.get('relationshipList')).controls = [];
			this.muttonFishTransferForm.get('relationshipList').setValue([]);
		} catch (error) {
			console.log(error.message);
		}
	}

	/**
 * Method is use for change dynamic file attachment 
 */
	// onChangeStatusOfBusiness() {
	// 	this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishTransferForm);
	// }

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

		let step0 = 16;
		let step1 = 28;

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
   * This method is change date format.
   * @param date : selected date
   * @param controlType : form control name
   */
  dateFormat(date, controlType: string) {
    this.muttonFishTransferForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }

  removeAddressDetail(){
		this.muttonFishTransferForm.get('businessAddress').patchValue({
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
		this.muttonFishTransferForm.controls['relationshipList'] = this.fb.array([]);
	}

	onSameAddressChange(event){
		if(event.checked){
			this.muttonFishTransferForm.get('temporaryAddress').patchValue(this.muttonFishTransferForm.get('permanantAddress').value);
			this.muttonFishTransferForm.get('temporaryAddress').disable();
			this.checkboxValue = true;
		}else{
			this.checkboxValue = false;
			this.muttonFishTransferForm.get('temporaryAddress').enable();
			this.muttonFishTransferForm.get('temporaryAddress').reset();
		}
	}

	valueChangeOnPermantAddress(){
		if(this.checkboxValue){
			this.muttonFishTransferForm.get('temporaryAddress').patchValue(this.muttonFishTransferForm.get('permanantAddress').value);
		}
	}

	disableField(){
		this.muttonFishTransferForm.get('refNumber').disable();
		this.muttonFishTransferForm.get('licenseIssueDate').disable();
	}
	onChangedZone(event) {
		this.wardZoneLevel2List =[];
		if (event == undefined) {
		this.muttonFishTransferForm.get('wardNo').get('code').setValue(null);
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
