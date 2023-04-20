import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { AnimalPondService } from '../common/services/animal-pond.service';
import { Location } from '@angular/common';
import { CommonService } from '../../.././../../shared/services/common.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-animal-pond-renew',
	templateUrl: './animal-pond-renew.component.html',
	styleUrls: ['./animal-pond-renew.component.scss']
})
export class AnimalPondRenewComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	animalPondRenewForm: FormGroup;
	translateKey: string = 'animalPondRenewScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();
	
	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	public showButtons: boolean = false;

	//Lookups Array
	ANIMAL_POND_STATUS_OF_BUSINESS: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	MF_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	ANIMAL_TYPE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;

	// required attachment array
	public uploadFilesArray: Array<any> = [];

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: ""
	}

	checkBox:boolean = false;

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		let obj = { refNumber: this.serachLicenceObj.searchLicenceNumber };
		this.animalPondService.searchLicence(obj).subscribe(
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
	 * @param animalPondService - Call only shop licence api.
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private animalPondService: AnimalPondService,
		private toastrService: ToastrService,
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
		});

		this.animalPondRenewFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getLookupData();
			this.getAnimalPondLicNewData();

			// this.animalPondRenewForm.disable();
			this.enableFielList();
		
		}
		this.disableField();
	}
	/**
 * Method is add required document  
 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.animalPondRenewForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
	}

	/**
	 * This Method for create attachment array in service detail
	 * @param data : value of array
	 */
	createDocumentsGrp(data?: any): FormGroup {
		return this.fb.group({
			dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
			documentIdentifier: [data.documentIdentifier ? data.documentIdentifier : null],
			documentKey: [data.documentKey ? data.documentKey : null],
			documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
			documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
			fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
			formPart: [data.formPart ? data.formPart : null],
			id: [data.id ? data.id : null],
			isActive: [data.isActive],
			mandatory: [data.mandatory ? data.mandatory : false],
			maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
			requiredOnAdminPortal: [data.requiredOnAdminPortal],
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
			dmsEnabled:[data.dmsEnabled],
			orderSequence:[data.orderSequence ? data.orderSequence : null]
			// version: [data.version ? data.version : null]
		});
	}
	/**
 	 * This method use for edit some fiels.
 	 */
	enableFielList() {
		this.animalPondRenewForm.get('relationshipList').enable();
		this.animalPondRenewForm.get('animalDetails').enable();
		this.animalPondRenewForm.get('totalAnimal').enable();
		this.animalPondRenewForm.get('temporaryAddress').enable();
	}

	/**
	 * This method is use to create new record for citizen.
	 * @param searchData: exciting licence number data
	 */
	createRecordPatchSerachData(searchData: any) {
		this.getLookupData();
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {
			this.formId = res.serviceFormId;
			this.animalPondRenewForm.patchValue(searchData);

			this.animalPondRenewForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
				serviceFormId: res.serviceFormId,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				fileStatus: res.fileStatus,
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

				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				// licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: [],

			});

			this.showButtons = true;
			// this.animalPondRenewForm.get('refNumber').patchValue(this.serachLicenceObj.searchLicenceNumber);


			(<FormArray>this.animalPondRenewForm.get('relationshipList')).controls = [];
			searchData.relationshipList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.animalPondRenewForm.get('relationshipList')).push(this.createArray(app));
			});
			(<FormArray>this.animalPondRenewForm.get('animalDetails')).controls = [];
			searchData.animalDetails.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.animalPondRenewForm.get('animalDetails')).push(this.createAnimalArray(app));
			});
			// this.animalPondRenewForm.disable();
			this.enableFielList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.animalPondRenewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
			});
			this.animalPondRenewForm.get('serviceDetail').get('serviceUploadDocuments').value.sort(
				(a,b) => a.orderSequence - b.orderSequence);
			// this.requiredDocumentList();
			this.onChangeStatusOfBusiness();
		});

	}


	/**
	 * Method is used to get form data
	 */
	getAnimalPondLicNewData() {
		
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.animalPondRenewForm.patchValue(res); 
				
				this.showButtons = true;
				this.onChangeZone(this.animalPondRenewForm.get('zoneNo').value.code);
				this.onChangeWard(this.animalPondRenewForm.get('wardNo').value.code);

				// deflate add one array in relationship grid
				if ((<FormArray>res.relationshipList).length == 0) {
					this.addItem('relationshipList').push(this.createArray());
					let newlyadded = this.addItem('relationshipList').controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
				res.relationshipList.forEach(app => {
					(<FormArray>this.animalPondRenewForm.get('relationshipList')).push(this.createArray(app));
				});
				
				// deflate add none array in animal grid
				if ((<FormArray>res.animalDetails).length == 0) {
					this.addItem('animalDetails').push(this.createAnimalArray());
					let newlyadded = this.addItem('animalDetails').controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}

				res.animalDetails.forEach(app => {
					(<FormArray>this.animalPondRenewForm.get('animalDetails')).push(this.createAnimalArray(app));
				});
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.animalPondRenewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
				});
				// this.requiredDocumentList();
				this.onChangeStatusOfBusiness();
				// selected animal filter
				this.getSelectedAnimal();

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
			this.ANIMAL_POND_STATUS_OF_BUSINESS = res.ANIMAL_POND_STATUS_OF_BUSINESS
			this.MF_RELATIONSHIP_OF_APPLICANT = res.MF_RELATIONSHIP_OF_APPLICANT;
			this.MF_STATUS_OF_BUSINESS = res.MF_STATUS_OF_BUSINESS;
			this.PERSON_TYPE = res.PERSON_TYPE;
			this.FIRM_ZONE = res.FIRM_ZONE;
			this.ANIMAL_TYPE = res.ANIMAL_TYPE;
			// selected animal filter
			this.getSelectedAnimal();
			this.onChangeZone(this.animalPondRenewForm.get('zoneNo').value.code);
			this.onChangeWard(this.animalPondRenewForm.get('wardNo').value.code);
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
	*  Method is used get selected data from lookup when change dropdown in grid.
	* @param lookups : Array
	* @param code : String
	* return object
	*/
	getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
		return lookups.find((obj: any) => obj.code === code)
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	animalPondRenewFormControls() {
		this.animalPondRenewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'APL-REN',
			refNumber: [null],
			personType: this.fb.group({
				code: [null, Validators.required]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null],
			holderMiddleNameGuj: [null,[Validators.maxLength(30)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
			holderPanNo: [null, [ValidationService.panValidator, Validators.maxLength(10)]],
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

			/* Step 3 controls start */
			animalDetails: this.fb.array([]),
			totalAnimal: [null, Validators.required],
			/* Step 3 controls end */

			applicationDate: [],
			licenseIssueDate: [null],
			licenseRenewalDate: [null],
			loinumber: [null],

			/* Step 4 controls start*/
			attachments: [],
			/* Step 4 controls end */
			businessType:this.fb.group({
				code: [null, Validators.required],
				
			}),
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
			mobileNo: [data.mobileNo ? data.mobileNo : null, [Validators.maxLength(10), Validators.minLength(10)]],
			personType: "APL_PERSON"
		})
	}

	/**
	 * Method is used to return array
	 * @param data : animal data array
	 */
	createAnimalArray(data: any = {}) {

		return this.fb.group({
			serviceFormId: this.formId,
			id: data.id ? data.id : null,
			animalType: this.fb.group({
				code: [data.animalType ? (data.animalType.code ? data.animalType.code : null) : null, Validators.required]
			}),
			animalCount: [data.animalCount ? data.animalCount : 0, [Validators.minLength(1), Validators.required]],
		})

	}

	/**
	 * This Method for count total animals (all type of animal)
	 */
	getTotalAnimal() {
		let totalAnimal = 0;
		let animalGrid = <FormArray>this.animalPondRenewForm.get('animalDetails');

		if (animalGrid.length) {
			animalGrid.controls.forEach(elementGrid => {
				let count = elementGrid.get('animalCount').value;
				if (count && !isNaN(parseInt(count))) {
					totalAnimal += parseInt(count);
				}
			});
		}
		this.animalPondRenewForm.get('totalAnimal').setValue(totalAnimal);
		return totalAnimal;
	}

	/**
	 * Method is used to add recode in array control
	 */
	addItem(controlName: string) {
		let returnArray: any;
		returnArray = this.animalPondRenewForm.get(controlName) as FormArray;
		return returnArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson(aplType?: any) {
		let relationshipIdValue = this.animalPondRenewForm.get('relationshipId').value.code;

		if (!relationshipIdValue) {
			this.toastrService.warning("Please select relationship of applicant first.");
			return false;
		}

		let isEditAnotherRow = this.isTableInEditMode('relationshipList');
		if (!isEditAnotherRow) {
			if (relationshipIdValue == "PROPRIETOR" && this.addItem('relationshipList').controls.length >= 1) {
				this.toastrService.warning("Person not allowed more than 1");
				return false;
			}
			if ((relationshipIdValue == "PARTNER" || relationshipIdValue == "DIRECTOR" || relationshipIdValue == "AUTHORIZEDSIGNATORY") && this.addItem('relationshipList').controls.length >= 10) {
				this.toastrService.warning("Person not allowed more than 10");
				return false;
			}
			this.addItem('relationshipList').push(this.createArray());
			// this.animalPondRenewForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = this.addItem('relationshipList').controls;
			if (newlyadded.length) {
				// (newlyadded[newlyadded.length - 1]).isEditMode = true;
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after saving existing record", "warning");
		}
	}

	/**
	 * Method is use for reset relationship 
	 */
	onChangeRelationWithOrg() {
		try {
			(<FormArray>this.animalPondRenewForm.get('relationshipList')).controls = [];
			this.animalPondRenewForm.get('relationshipList').setValue([]);
			let relationshipId = this.animalPondRenewForm.get('relationshipId').value.code;
			if (relationshipId == 'PROPRIETOR') {
				(<FormArray>this.animalPondRenewForm.get('relationshipList')).controls = [];
				this.animalPondRenewForm.get('relationshipList').setValue([]);
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	/**
	 * Method is used when user click for add person
	 */
	addMoreAnimal() {

		let isEditAnotherRow = this.isTableInEditMode('animalDetails');
		if (!isEditAnotherRow) {

			if (this.addItem('animalDetails').controls.length >= 10) {
				this.toastrService.warning("Person not allowed more than 10");
				return false;
			}
			this.addItem('animalDetails').push(this.createAnimalArray());
			// this.animalPondRenewForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = this.addItem('animalDetails').controls;
			if (newlyadded.length) {
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after saving existing record", "warning");
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
	isTableInEditMode(gridType: string) {
		return this.addItem(gridType).controls.find((obj: any) => obj.isEditMode === true);
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
	deleteRecord(index: any, gridType: string) {
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.addItem(gridType).controls.splice(index, 1);
			// This method for filter  selected animal type
			this.getSelectedAnimal();
			this.commonService.successAlert('Removed!', '', 'success');
		});
	}

	/**
	 *  Method is used save editable dataview.
	 * @param row: row index
	 */
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
			row.newRecordAdded = false;
		}
	}

	/**
	 * 	Method is used for filter animal lookup(remove selected animal type).
	 */
	getSelectedAnimal() {
		let animalData = this.ANIMAL_TYPE.map((mapDataObj: any) => {
			mapDataObj.selected = false;
			return mapDataObj
		});

		let animalGrid = <FormArray>this.animalPondRenewForm.get('animalDetails');

		animalGrid.controls.forEach(animalele => {
			let findRecord = animalData.find((obj: any) => obj.code == animalele.get('animalType').get('code').value)
			if (findRecord) {
				findRecord.selected = true;
			}
		});
		return animalData;
	}

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row index
	*/
	cancelRecord(row: any, index: number, controlName: string) {
		try {
			if (row.newRecordAdded) {
				this.addItem(controlName).removeAt(index);
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

		let step0 = 17;
		let step1 = 25;
		let step2 = 27;
		let step3 = 32;

		switch (true) {
			case flag <= step0:
				this.tabIndex = 0;
				break;
			case flag <= step1:
				this.tabIndex = 1;
				break;
			case flag <= step2:
				this.tabIndex = 2;
				break;
			case flag <= step3:
				this.tabIndex = 3;
				break;
			default:
				this.tabIndex = 0;

		}
		this.checkDynamicTableValidate();
	}
    /**
	 * this method is use for check validate dynamic attachment for employee family list , person occupying list and Partner list
	 */
	checkDynamicTableValidate(): void {
		
		try {
			this.addItem("animalDetails").controls.forEach(animalelement => {
				if (animalelement.invalid) {
					animalelement.isEditMode = true;
				}
			});

			this.addItem("relationshipList").controls.forEach(element => {
				if (element.invalid) {
					element.isEditMode = true;
				}
			});
		} catch (error) {
			console.error(error.message);
		}

	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	onChangeStatusOfBusiness(){
		const subject = this.animalPondRenewForm.get('businessType').get('code').value
		const documents = this.animalPondRenewForm.get('serviceDetail').get('serviceUploadDocuments').value;
		const renewalFormName =  this.animalPondRenewForm;
		this.animalPondService.changeStatusOfBusinessAccordingAtatchment(subject,documents,renewalFormName);
		this.requiredDocumentList();
	}

	onSameAddressChange(event){
		if(event.checked){
			this.animalPondRenewForm.get('temporaryAddress').patchValue(this.animalPondRenewForm.get('permanantAddress').value);
			this.animalPondRenewForm.get('temporaryAddress').disable();
			this.checkBox = true;
		}else{
			this.animalPondRenewForm.get('temporaryAddress').enable();
			this.animalPondRenewForm.get('temporaryAddress').reset();
			this.checkBox = false;
		}
	}

	valueChangeOnPermantAddress(){
		if(this.checkBox){
			this.animalPondRenewForm.get('temporaryAddress').patchValue(this.animalPondRenewForm.get('permanantAddress').value);	
		}
	}

	disableField(){
		this.animalPondRenewForm.get('refNumber').disable();
		this.animalPondRenewForm.get('licenseIssueDate').disable();
	}
}
