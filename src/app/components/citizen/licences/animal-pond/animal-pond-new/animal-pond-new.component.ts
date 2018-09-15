import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-animal-pond-new',
	templateUrl: './animal-pond-new.component.html',
	styleUrls: ['./animal-pond-new.component.scss']
})
export class AnimalPondNewComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	animalPondNewForm: FormGroup;
	translateKey: string = 'animalPondScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

	//Lookups Array
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	MF_STATUS_OF_BUSINESS: Array<any> = [];
	PERSON_TYPE: Array<any> = [];
	FIRM_ZONE: Array<any> = [];
	ANIMAL_TYPE: Array<any> = [];
	WARD: Array<any> = [];
	BLOCK: Array<any> = [];
	LOOKUP: any;

	// required attachment array
	private uploadFileArray: Array<any> =
		[
			// { labelName: 'Photo of License Holder', fieldIdentifier: '1'},
			// { labelName: 'One Copy of each site plan and key plan', fieldIdentifier: '2', category: 'common' },
			{ labelName: 'Aadhar Card Scan Copy', fieldIdentifier: '3'},
			// { labelName: 'Pan Card Copy of Owner / Propwriter', fieldIdentifier: '4', category: "common" },
			// { labelName: 'Constitution copy of Firm', fieldIdentifier: '5', category: "common" },
			{ labelName: 'Proof of Ownership / tenancy / Legal Occupancy', fieldIdentifier: '6' },
			// { labelName: 'Copy of Lease Deed If not Executed, Copy of Auction Letter, Possession Letter', fieldIdentifier: '7'},
			{ labelName: 'Copy of Term & conditions for allotment of Premises by the  Land owning Agency ', fieldIdentifier: '8', category: "common" },
			// { labelName: 'Additional Document if Any', fieldIdentifier: '9'},
			{ labelName: 'Property Tax Bill paid Receipt', fieldIdentifier: '10' },
			{ labelName: 'Shop & Establishment Certificate', fieldIdentifier: '11'},

			{ labelName: 'Occupation Certificate', fieldIdentifier: '12'},
			{ labelName: 'Rent Agreement', fieldIdentifier: '13' }
		];

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
		private toastrService: ToastrService
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

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getAnimalPondLicNewData();
			this.getLookupData();
			this.animalPondNewFormControls();
		}		 
	}

	/**
	 * Method is used to get form data
	 */
	getAnimalPondLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.animalPondNewForm.patchValue(res);
				this.showButtons = true;
				this.onChangeZone(this.animalPondNewForm.get('zoneNo').value.code);
				this.onChangeWard(this.animalPondNewForm.get('wardNo').value.code);
				res.relationshipList.forEach(app => {
					(<FormArray>this.animalPondNewForm.get('relationshipList')).push(this.createArray(app));
				});
				res.animalDetails.forEach(app => {
					(<FormArray>this.animalPondNewForm.get('animalDetails')).push(this.createAnimalArray(app));
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
	animalPondNewFormControls() {
		this.animalPondNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'APL-LIC',
			/* Step 1 controls start */
			// licenseType: this.fb.group({
			// 	code: [null]
			// }),
			personType: this.fb.group({
				code: [null, Validators.required]
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
			relationshipList: this.fb.array([]),
			/* Step 2 controls end */

			/* Step 3 controls start */
			animalDetails: this.fb.array([]),
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
			animalCount: [data.animalCount ? data.animalCount : null, [Validators.minLength(1)]],
		})

	}

	/**
	 * Method is used to add recode in array control
	 */
	addItem(controlName: any) {
		return this.animalPondNewForm.get(controlName) as FormArray;
	}

	/**
	 * Method is used when user click for add person
	 */
	addMorePerson() {
		let relationshipIdValue = this.animalPondNewForm.get('relationshipId').value.code;

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
			let newlyadded = <any>this.addItem('relationshipList').controls;
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
			(<FormArray>this.animalPondNewForm.get('relationshipList')).controls = [];
			this.animalPondNewForm.get('relationshipList').setValue([]);
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
			// this.animalPondNewForm.get('relationshipList').setValidators([Validators.required]);
			let newlyadded = <any>this.addItem('animalDetails').controls;
			if (newlyadded.length) {
				(newlyadded[newlyadded.length - 1]).isEditMode = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new recode after save existing recode.", "warning");
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

		let animalGrid = <FormArray>this.animalPondNewForm.get('animalDetails');

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

		let step0 = 15;
		let step1 = 27;
		let step2 = 35;
		let step3 = 41;
		let step4 = 48;

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
