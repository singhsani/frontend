import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';
import { FileDetector } from 'selenium-webdriver';
import { AnimalPondService } from '../common/services/animal-pond.service';

@Component({
	selector: 'app-animal-pond-new',
	templateUrl: './animal-pond-new.component.html',
	styleUrls: ['./animal-pond-new.component.scss']
})
export class AnimalPondNewComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	animalPondNewForm: FormGroup;
	licenseHolderDetail:FormGroup;
	businessDetail: FormGroup;
	insertAnimalDetail: FormGroup;
	attachmentDetail: FormGroup;
	translateKey: string = 'animalPondScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	public showButtons: boolean = false;

	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	//Lookups Array
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	ANIMAL_POND_STATUS_OF_BUSINESS: Array<any> = [];
	MF_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	ANIMAL_TYPE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;
	isEditMode = true
	wardZoneLevel = [];
	wardZoneLevel1List = [];
	wardZoneLevel2List = [];
	wardZoneLevel3List = [];
	wardNo: [null];
	zoneNo: [null];

	// required attachment array
	public uploadFilesArray: Array<any> = [];

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
		public TranslateService: TranslateService,
		public animalPondService: AnimalPondService
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
			this.getAnimalPondLicNewData();
			this.animalPondNewFormControls();
		}
		this.onActivate()
	}

	/**
	* Method is add required document  
	*/
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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
			dmsEnabled: [data.dmsEnabled],
			orderSequence: [data.orderSequence ? data.orderSequence : null]
			// version: [data.version ? data.version : null]
		});
	}

	onSameAddressChange(event) {

		if (event.checked) {

			this.licenseHolderDetail.get('temporaryAddress').patchValue(this.licenseHolderDetail.get('permanantAddress').value);
			this.licenseHolderDetail.get('temporaryAddress.addressType').setValue('APL_TEMPORARY_ADDRESS');
			this.licenseHolderDetail.get('isSameAsPermanantAddress').get('code').setValue("YES");
			this.licenseHolderDetail.get('temporaryAddress').disable();
		} else {
			this.licenseHolderDetail.get('temporaryAddress').enable();
			this.licenseHolderDetail.get('temporaryAddress').reset();
			this.licenseHolderDetail.get('isSameAsPermanantAddress').get('code').setValue("NO");
		}

	}

	/**
	 * Method is used to get form data
	 */
	getAnimalPondLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.animalPondNewForm.patchValue(res);
				this.licenseHolderDetail.patchValue(res);
				this.businessDetail.patchValue(res);
				this.insertAnimalDetail.patchValue(res);
				this.attachmentDetail.patchValue(res);
				this.showButtons = true;
				this.isEditMode = res.canEdit;
				this.onChangeZone(this.animalPondNewForm.get('zoneNo').value.code);
				this.onChangeWard(this.animalPondNewForm.get('wardNo').value.code);

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
					(<FormArray>this.animalPondNewForm.get('relationshipList')).push(this.createArray(app));
				});

				// deflate add one array in animal grid
				if ((<FormArray>res.animalDetails).length == 0) {
					this.addItemanimal('animalDetails').push(this.createAnimalArray());
					let newlyadded = this.addItemanimal('animalDetails').controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
				res.animalDetails.forEach(app => {
					(<FormArray>this.animalPondNewForm.get('animalDetails')).push(this.createAnimalArray(app));
				});
				this.serverUploadFilesArray = res.serviceDetail.serviceUploadDocuments;
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
				});
				this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments').value.sort(
					(a, b) => a.orderSequence - b.orderSequence);
				// this.requiredDocumentList();
				// selected animal filter
				this.onChangeStatusOfBusiness();
				this.getSelectedAnimal();

				this.licenseHolderDetail.get('personTypeGuj').setValue(res.personType.gujName);
				this.licenseHolderDetail.controls.permanantAddress.valueChanges.subscribe(data => {
					if (this.animalPondNewForm.get('isSameAsPermanantAddress').get('code').value == "YES") {
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
			this.ANIMAL_POND_STATUS_OF_BUSINESS = res.ANIMAL_POND_STATUS_OF_BUSINESS
			this.MF_RELATIONSHIP_OF_APPLICANT = res.MF_RELATIONSHIP_OF_APPLICANT;
			this.MF_STATUS_OF_BUSINESS = res.MF_STATUS_OF_BUSINESS;
			this.PERSON_TYPE = res.PERSON_TYPE;
			this.FIRM_ZONE = res.FIRM_ZONE;
			this.ANIMAL_TYPE = res.ANIMAL_TYPE;
			// selected animal filter
			this.getSelectedAnimal();

			this.onChangeZone(this.animalPondNewForm.get('zoneNo').value.code);
			this.onChangeWard(this.animalPondNewForm.get('wardNo').value.code);
		});
	}
	getAllZoneNos() {
		this.animalPondService.getWardZoneFirstLevel(1, "PROPERTYTAX").subscribe(
		  (data) => {
			this.wardZoneLevel1List = data;
		  }
		)
	  }
	onChangedZone(event) {
		this.wardZoneLevel2List =[];
		this.wardZoneLevel3List =[];
		if (event == undefined) {
			this.animalPondNewForm.get('wardNo').get('code').setValue(null);
			this.animalPondNewForm.get('blockNo').get('code').setValue(null);
			return false
			}
			else {
				let postData = {};
				postData = { parentId: event };
				this.animalPondService.getWardZone(postData).subscribe(res => {	
	      		this.wardZoneLevel2List = res.body;
				})
			}
	  }
	  onChangedWard(event){
		this.wardZoneLevel3List =[];
		if (event == undefined) {
			this.animalPondNewForm.get('blockNo').get('code').setValue(null);
			return false
		  }
		  else {
			let postData = {};
			postData = { parentId: event };
			this.animalPondService.getWardZone(postData).subscribe(res => {	
			  this.wardZoneLevel3List = res.body;
			})
		  }
	  }
	updateServiceUploadDocument(event) {

		let array = (<FormArray>this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		for (let i = array.length - 1; i >= 0; i--) {
			array.removeAt(i)
		}

		switch (event) {

			case 'RENT':
				const localUploadArray = [...this.serverUploadFilesArray]
				for (let file of localUploadArray) {
					if (file['documentIdentifier'] === 'RENT_AGREEMENT') {
						file['mandatory'] = true;

					}
					(<FormArray>this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
				}
				break;
			default:
				for (let file of this.serverUploadFilesArray) {
					if (file['documentIdentifier'] === 'RENT_AGREEMENT') {
						file['mandatory'] = false;
					}
					(<FormArray>this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
				}
				break;
		}



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
   * Gujarati Look Up Converter.
   * @param selectedValue - selected value from dropdown
   * @param controlName - control name of form
   * @param lookupName - passed lookup array
   */
	getGujNameFromLookup(selectedValue: string, controlName: string, lookupName: Array<any>) {

		if (lookupName && lookupName.length) {
			let dataObj = lookupName.find((obj) => obj.code === selectedValue);
			if (dataObj && dataObj.gujName) {
				this.licenseHolderDetail.get(controlName).setValue(dataObj.gujName);
			} else {
				this.licenseHolderDetail.get(controlName).setValue('');
			}
		}

	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	animalPondNewFormControls() {
		// this.animalPondNewForm = this.fb.group({
		// 	apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
		// 	serviceCode: 'APL-LIC',
			/* Step 1 controls start */
			this.licenseHolderDetail = this.fb.group({
			personType: this.fb.group({
				code: [null, Validators.required]
			}),
			businessType: this.fb.group({
				code: [null, Validators.required]
			}),
			personTypeGuj: [null, [Validators.required]],
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.maxLength(30)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(10), Validators.minLength(10)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
			holderPanNo: [null, [Validators.required, ValidationService.panValidator, Validators.maxLength(10)]],
			isSameAsPermanantAddress: this.fb.group({
				code: null
			})
			/* Step 1 controls end */
		})
			/* Step 2 controls start */
			// zoneNo: this.fb.group({ code: [null, Validators.required] }),
			// wardNo: this.fb.group({ code: [null, Validators.required] }),
			// blockNo: this.fb.group({ code: [null, Validators.required] }),
			this.businessDetail = this.fb.group({
			zoneNo: this.fb.group({code: null, name:null}, Validators.required),
			wardNo: this.fb.group({code: null , name:null}, Validators.required),
			blockNo: this.fb.group({code: null, name:null}, Validators.required),
			businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			relationshipId: this.fb.group({
				code: [null, Validators.required]
			}),
			statusOfBusinessId: this.fb.group({
				code: [null, Validators.required]
			}),
			isSameAsPermanantAddress: this.fb.group({
				code: null
			}),
			relationshipList: this.fb.array([
				// 0: {
				// 	id: 18,
				// 	serviceFormId: 52,
				// 	fieldView: "ALL",
				// 	address: "bbb",
				// 	gender: {},
				// 	mobileNo: "6555555555",
				// 	name: "bhumi",
				// 	personType: "APL_PERSON",
				// 	relationship: {}
				// }
			]),
		})
			/* Step 2 controls end */

			/* Step 3 controls start */
			this.insertAnimalDetail = this.fb.group({
			animalDetails: this.fb.array([]),
			totalAnimal: [null, Validators.required],
			/* Step 3 controls end */			
		})
			/* Step 4 controls start*/
			this.attachmentDetail = this.fb.group({
				attachments: [],		
			})
			/* Step 4 controls end */
			this.animalPondNewForm = this.fb.group({
					apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
					serviceCode: 'APL-LIC',
					applicationDate: [],
					licenseIssueDate: [null],
					licenseRenewalDate: [null],
					loinumber: [null],
			})
			this.commonService.createCloneAbstractControl(this.licenseHolderDetail,this.animalPondNewForm);
			this.commonService.createCloneAbstractControl(this.businessDetail,this.animalPondNewForm);	
			this.commonService.createCloneAbstractControl(this.insertAnimalDetail,this.animalPondNewForm);	
			this.commonService.createCloneAbstractControl(this.attachmentDetail,this.animalPondNewForm);	
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
			animalCount: [data.animalCount ? data.animalCount : 1, [Validators.minLength(1), Validators.required]],
		})
	}

	/**
	 * This Method for count total animals (all type of animal)
	 */
	getTotalAnimal() {
		let totalAnimal = 0;
		let animalGrid = <FormArray>this.insertAnimalDetail.get('animalDetails');

		if (animalGrid.length) {
			animalGrid.controls.forEach(ele => {
				let count = ele.get('animalCount').value;
				if (count && !isNaN(parseInt(count))) {
					totalAnimal += parseInt(count);
				}
			});
		}
		this.insertAnimalDetail.get('totalAnimal').setValue(totalAnimal);
		return totalAnimal;
	}

	/**
	 * Method is used to add recode in array control
	 */
	addItem(controlName: string) {
		let returnArray: any;
		returnArray = this.businessDetail.get(controlName) as FormArray;
		return returnArray;
	}	

	/**
	 * Method is used to add recode in array control
	 */
	 addItemanimal(controlName: string) {
		let returnArray: any;
		returnArray = this.insertAnimalDetail.get(controlName) as FormArray;
		return returnArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson(aplType?: any) {
		let relationshipIdValue = this.businessDetail.get('relationshipId').value.code;

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
			// this.animalPondNewForm.get('relationshipList').setValidators([Validators.required]);
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
			(<FormArray>this.businessDetail.get('relationshipList')).controls = [];
			this.businessDetail.get('relationshipList').setValue([]);
			let relationshipId = this.businessDetail.get('relationshipId').value.code;
			if (relationshipId == 'PROPRIETOR') {
				if ((<FormArray>this.businessDetail.get('relationshipList')).length == 0) {
					this.addItem('relationshipList').push(this.createArray());
					let newlyadded = this.addItem('relationshipList').controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
			}
			else if (relationshipId == 'PARTNER') {
				if ((<FormArray>this.businessDetail.get('relationshipList')).length == 0) {
					this.addItem('relationshipList').push(this.createArray());
					let newlyadded = this.addItem('relationshipList').controls;
					if (newlyadded.length) {
						this.editRecord((newlyadded[newlyadded.length - 1]));
						(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
					}
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	}


	/**
	 * Method is used when user click for add person
	 */
	addMoreAnimal() {

		let isEditAnotherRow = this.isTableInEditableMode('animalDetails');
		if (!isEditAnotherRow) {

			if (this.addItemanimal('animalDetails').controls.length >= 10) {
				this.toastrService.warning("Person not allowed more than 10");
				return false;
			}
			this.addItemanimal('animalDetails').push(this.createAnimalArray());
			// this.animalPondNewForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = this.addItemanimal('animalDetails').controls;
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
	isTableInEditableMode(gridType: string) {
		return this.addItemanimal(gridType).controls.find((obj: any) => obj.isEditMode === true);
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
	deleteAnimalRecord(index: any, gridType: string) {
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.addItemanimal(gridType).controls.splice(index, 1);
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

		let animalGrid = <FormArray>this.insertAnimalDetail.get('animalDetails');

		animalGrid.controls.forEach(element => {		
			let findRecord = animalData.find((obj: any) => obj.code == element.get('animalType').get('code').value)
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
	cancelAnimalRecord(row: any, index: number, controlName: string) {
		try {
			if (row.newRecordAdded) {
				this.addItemanimal(controlName).removeAt(index);
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
		let step0 = 18;
		let step1 = 27;
		let step2 = 28;
		let step3 = 30;
		let step4 = 31;

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
			case flag <= step4:
				this.tabIndex = 4;
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
			this.addItem("animalDetails").controls.forEach(animalele => {
				if (animalele.invalid) {
					animalele.isEditMode = true;
				}
			});

			this.addItem("relationshipList").controls.forEach(listele => {
				if (listele.invalid) {
					listele.isEditMode = true;
				}
			});
		} catch (error) {
			console.error(error.message);
		}

	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	//  */
	onFormTabChange(evt) {
		this.tabIndex = evt;
	}

	patchValue() {
		this.animalPondNewForm.patchValue(this.dummyJSON);
	}

	onCardChange(event, cardName) {
		if (event.target.value === "" || this.animalPondNewForm.get(cardName).invalid) {
			this.animalPondNewForm.get(cardName).setValue(null);
		}
	}

	onChangeStatusOfBusiness() {
		const subject = this.animalPondNewForm.get('businessType').get('code').value
		const documents = this.animalPondNewForm.get('serviceDetail').get('serviceUploadDocuments').value;
		const formName = this.animalPondNewForm;
		this.animalPondService.changeStatusOfBusinessAccordingAtatchment(subject, documents, formName);
		this.requiredDocumentList();
	}

	handleOnSaveAndNext(res) {
		this.onChangeStatusOfBusiness();
	}

	validateNo(e) {
		if (e.charCode < 49 || e.charCode > 57) {
			return true;
		}
		return false
	}

	onActivate() {
		window.scroll(0,0);
	}

	onTabChange(index: number, controlName, mainControl) {
		if (index > this.tabIndex) {
			if (controlName.invalid) {
				this.commonService.markFormGroupTouched(controlName)
			} else {
				const organizationalAry = Object.keys(controlName.getRawValue());
				organizationalAry.forEach((element: any) => {
					// push form Array data into main Controller
					if (controlName.get(element) instanceof FormArray) {
						const formGroupAry = this.licenseConfiguration.createArray(controlName.get(element));
						mainControl.get(element).value.push()
						for (let i = 0; i < controlName.get(element).controls.length; i++) {
							mainControl.get(element).value.push(formGroupAry.value[i]);
							mainControl.get(element).controls.push(formGroupAry.controls[i]);
						}
					}
					else {
						mainControl.get(element).setValue(controlName.get(element).value);
					}
				});
				this.tabIndex = index;
			}
		}
		else {
			this.tabIndex = index;
		}


	}



	dummyJSON: any = {

		"personType": {
			"code": "MR"
		},
		"holderFirstName": "sdfsdf",
		"holderMiddleName": "sdfsdfsdf",
		"holderLastName": "dsfsdfsdf",
		"holderFirstNameGuj": "સ્દ્ફ્સ્દ્ફ",
		"holderMiddleNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"holderLastNameGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
		"permanantAddress": {
			"addressType": "APL_PERMANENT_ADDRESS",
			"buildingName": "sdfsdf",
			"streetName": "sdfsdfsdf",
			"landmark": "sdfsdfsdf",
			"area": "dsfsdfsdfsdf",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "242342",
			"buildingNameGuj": "સ્દ્ફ્સ્દ્ફ",
			"streetNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"landmarkGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"areaGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"temporaryAddress": {
			"addressType": "APL_TEMPORARY_ADDRESS",
			"buildingName": "dsf",
			"streetName": "sdfsdfdsf",
			"landmark": "fsdfsdfsdfsdf",
			"area": "sdfsdfsd",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "234234",
			"buildingNameGuj": "દ્સ્ફ",
			"streetNameGuj": "સ્દ્ફ્સ્દ્ફ્દ્સ્ફ",
			"landmarkGuj": "ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
			"areaGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"holderTelephoneNo": "43543543541",
		"holderMobileNo": "4354354354",
		"holderFaxNo": null,
		"holderAadharNo": "435443543543",
		"holderPanNo": "ABCDE1234T",
		"zoneNo": {
			"code": "NORTH_ZONE"
		},
		"wardNo": {
			"code": "WARD_7"
		},
		"blockNo": {
			"code": "BLOCK_9"
		},
		"businessAddress": {
			"addressType": "APL_BUSINESS_ADDRESS",
			"buildingName": "dfgfdg",
			"streetName": "fdgfd",
			"landmark": "fdgfdg",
			"area": "fdgfdgfdg",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "435435",
			"buildingNameGuj": "દ્ફ્ગ્ફ્દ્ગ",
			"streetNameGuj": "ફ્દ્ગ્ફ્દ",
			"landmarkGuj": "ફ્દ્ગ્ફ્દ્ગ",
			"areaGuj": "ફ્દ્ગ્ફ્દ્ગ્ફ્દ્ગ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"extraDetailsOfBusiness": "fdgfdgfdgfdgfdg",
		"relationshipId": {
			"code": "PROPRIETOR"
		},
		"statusOfBusinessId": {
			"code": "PARTNERSHIPFIRM"
		},
		"relationshipList": [
			{
				"name": "sfdfsdfsdfsd",
				"address": "fsdfsdfsd",
				"mobileNo": "2423423423",
				"personType": "APL_PERSON"
			}
		],
		"animalDetails": [
			{
				"animalType": {
					"code": "COW"
				},
				"animalCount": "11"
			}
		],
		"totalAnimal": 11,
		"licenseIssueDate": null,
		"licenseRenewalDate": null,
		"loinumber": null,
		"serviceType": "APL_LICENCE",
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
			"code": "APL-LIC",
			"name": "Pond License",
			"gujName": "Pond License",
			"feesOnScrutiny": false,
			"appointmentRequired": false
		}
	};
}
