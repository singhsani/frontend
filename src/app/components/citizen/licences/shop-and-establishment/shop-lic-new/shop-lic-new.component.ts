import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ShopAndEstablishmentService } from './../common/services/shop-and-establishment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-shop-lic-new',
	templateUrl: './shop-lic-new.component.html',
	styleUrls: ['./shop-lic-new.component.scss']
})
export class ShopLicNewComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicNewForm: FormGroup;
	translateKey: string = 'shopLicNewScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	//Lookup Array
	gender: Array<any> = [];
	SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_PARTNER_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_TYPE_OF_ORGANIZATION: Array<any> = [];
	YES_NO: Array<any> = [];
	businessCategory: Array<any> = [];
	businessSubCategory: Array<any> = [];
	wardNo: Array<any> = [];
	SHOP_LIC_HOLIDAY: Array<any> = [];

	// required attachment array
	public uploadFilesArray: Array<any> = [];

	// attachment array from the server ;

	public serverUploadFilesArray : Array<any> = [];

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
	 * @param shopAndEstablishmentService - Call only shop licence api.
	 * @param toastrService - Show massage with timer.
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private shopAndEstablishmentService: ShopAndEstablishmentService,
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

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getShopLicNewData();
			this.getLookupData();
			this.shopLicNewFormControls();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getShopLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.shopLicNewForm.patchValue(res);
				this.licenseConfiguration.isAttachmentButtonsVisible = true;
				res.employerFamilyList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('employerFamilyList')).push(this.createArray(app));
				});
				res.occupancyList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('occupancyList')).push(this.createArray(app));
				});
				res.partnerList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('partnerList')).push(this.createArray(app));
				});
				/* res.employeeList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('employeeList')).push(this.createArray(app));
				}); */
				this.getCategoryDropdownData(this.shopLicNewForm.get('noOfHumanWorking').value.code);
				this.getSubCategoryDropdownData(this.shopLicNewForm.get('categoryOfBusiness').value.code);


                this.serverUploadFilesArray = res.serviceDetail.serviceUploadDocuments;
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				});
				this.requiredDocumentList();


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
			this.SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP = res.SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP;
			this.SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP = res.SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP;
			this.SHOP_LIC_PARTNER_PERSON_RELATIONSHIP = res.SHOP_LIC_PARTNER_PERSON_RELATIONSHIP;

			this.SHOP_LIC_TYPE_OF_ORGANIZATION = res.SHOP_LIC_TYPE_OF_ORGANIZATION;

			this.YES_NO = res.YES_NO;
			this.wardNo = res.SHOP_LIC_WARD_NO;
			this.gender = res.GENDER;
			this.SHOP_LIC_HOLIDAY = res.SHOP_LIC_HOLIDAY;
		});
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	shopLicNewFormControls() {
		this.shopLicNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-LIC',
			periodFrom: null,
			periodTo: null,
			newRegistration: null,
			renewal: null,
			adminCharges: null,
			netAmount: null,
			/* Step 1 controls start */
			establishmentName: [null, [Validators.required, Validators.maxLength(150)]],//count=4
			establishmentNameGuj: [null, [Validators.required, Validators.maxLength(450)]],
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),
			noOfHumanWorking: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			assessmentDoneByVMC: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			propertyTaxNo: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
			wardNo: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			aadharNumber: ['', Validators.maxLength(12)],
			professionalTaxPECNo: ['', Validators.maxLength(20)],
			prcNo: ['', Validators.maxLength(20)],
			applicantVimaAmountPaid: this.fb.group({
				code: null,
				name: null,
			}),
			number: null,
			situationOfOffice: [null, [Validators.required, Validators.maxLength(100)]],
			/* Step 1 controls end */

			/* Step 2 controls start */
			nameOfEmployer: [null, [Validators.required, Validators.maxLength(100)]],
			nameOfEmployerGuj: [null, [Validators.required, Validators.maxLength(300)]],
			residentialAddressOfEmployer: [null, [Validators.required, Validators.maxLength(500)]],
			residentialAddressOfEmployerGuj: [null, [Validators.required, Validators.maxLength(1500)]],
			nameOfManager: [null, [Validators.required, Validators.maxLength(60)]],
			residentialAddressOfManager: [null, [Validators.required, Validators.maxLength(500)]],
			categoryOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			subCategoryOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			nameOfBusiness: [null, [Validators.required, Validators.maxLength(200)]],
			nameOfBusinessGuj: [null, [Validators.required, Validators.maxLength(600)]],
			commencementOfBusinessDate: [null, Validators.required],
			enterHoliday: this.fb.group({
				code: [null, Validators.required]
			}),
			/* Step 2 controls end */


			/* Step 3 controls start */
			employerFamilyList: this.fb.array([]),

			totalAdultEmployerFamily: null,
			totalYoungEmployerFamily: null,
			totalManEmployerFamily: null,
			totalWomenEmployerFamily: null,
			totalUnidentifiedEmployerFamily: null,
			totalFamilyMembers: null,
			/* Step 3 controls end */


			/* Step 4 controls start */
			occupancyList: this.fb.array([]),
			totalAdultOccupancy: null,
			totalYoungOccupancy: null,
			totalManOccupancy: null,
			totalWomenOccupancy: null,
			totalUnidentifiedOccupancy: null,
			totalOccupancy: null,
			/* Step 4 controls end */


			/* Step 5 controls start */
			typeOfOrganisation: this.fb.group({
				code: [null, Validators.required]
			}),
			partnerList: this.fb.array([]),

			totalAdultPartner: null,
			totalYoungPartner: null,
			totalManPartner: null,
			totalWomenPartner: null,
			totalUnidentifiedPartner: null,
			totalPartner: null,

			/* Step 5 controls end */

			/* Step 6 controls start */
			//employeeList: this.fb.array([]),
			totalAdultEmployee: [null, Validators.required],
			totalYoungEmployee: [null, Validators.required],
			totalManEmployee: [null, Validators.required],
			totalWomenEmployee: [null, Validators.required],
			totalUnidentified: null,
			totalEmployee: [null, Validators.required],
			/* Step 6 controls end */

			// situationOfOfficeGuj: null,
			// nameOfManagerGuj: null,
			// residentialAddressOfManagerGuj: null,
			//enterHolidayGuj: null,

			/*  */
			attachments: [''],
			agree:[false]
			/*  */
		});
		this.addMorePerson('EMPLOYER_FAMILY');
		this.addMorePerson('OCCUPANCY');
	}


	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		let organizationCategory = this.shopLicNewForm.get('typeOfOrganisation').value.code;
		if (organizationCategory) {
			_.forEach(this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {

				if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
					this.uploadFilesArray.push({
						'labelName': value.documentLabelEn,
						'fieldIdentifier': value.fieldIdentifier,
						'documentIdentifier': value.documentIdentifier
					})
				}

				if (value.dependentFieldName) {
					let dependentFieldArray = value.dependentFieldName.split(",");
					if (dependentFieldArray.includes(organizationCategory) && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
						this.uploadFilesArray.push({
							'labelName': value.documentLabelEn,
							'fieldIdentifier': value.fieldIdentifier,
							'documentIdentifier': value.documentIdentifier
						})
					}
				}

			});
		}
	}


	/**
	 * Method is used to return array
	 * @param data : person data array 
	 * @param persontype : person array type 
	 */
	createArray(data?: any): FormGroup {

		return this.fb.group({
			serviceFormId: this.formId,
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
			serviceCode: "SHOP-LIC",
			relationship: this.fb.group({
				//code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null]//
				code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null, [Validators.required]],
			}),
			gender: this.fb.group({
				//code: [data.gender ? (data.gender.code ? data.gender.code : null) : null]
				code: [data.gender ? (data.gender.code ? data.gender.code : null) : null, [Validators.required]],
			}),
			age: [data.age ? data.age : null, [Validators.required, ValidationService.employeeAgeValidate]],
			// employee: [data.employee ? data.employee : null],
			personType: [data.personType ? data.personType : null]
		})

	}

	/**
	 * Method is used to add array in form
	 * @param persontype : person array type
	 */
	addItem(persontype: string) {
		let returnArray: any;
		switch (persontype) {
			case 'EMPLOYER_FAMILY':
				returnArray = this.shopLicNewForm.get('employerFamilyList') as FormArray;
				break;
			case 'OCCUPANCY':
				returnArray = this.shopLicNewForm.get('occupancyList') as FormArray;
				break;
			case 'PARTNER':
				returnArray = this.shopLicNewForm.get('partnerList') as FormArray;
				break;
			/* case 'EMPLOYEES':
				returnArray= this.shopLicNewForm.get('employeeList') as FormArray;
			break; */

		}
		return returnArray;
	}

	/**
	 * Method is used when user click for add person
	 * @param persontype : person array type
	 */
	addMorePerson(persontype: string) {

		let isEditAnotherRow = this.isTableInEditMode(persontype);
		if (!isEditAnotherRow) {
			if (persontype === "EMPLOYER_FAMILY" && this.addItem(persontype).controls.length >= 5) {
				this.toastrService.warning("Employer family not allowed more than 5");
				return false;
			}
			if (persontype === "OCCUPANCY" && this.addItem(persontype).controls.length >= 2) {
				this.toastrService.warning("Occuping Person not allowed more than 2");
				return false;
			}
			if (persontype === "PARTNER") {
				if (this.shopLicNewForm.get('typeOfOrganisation').value.code === 'SHOP_LIC_SELF_OWNERSHIP' && this.addItem(persontype).controls.length >= 1) {
					this.toastrService.warning("You can add only one partner becouse you are self ownership");
					return false;
				}
				if (this.shopLicNewForm.get('typeOfOrganisation').value.code != 'SHOP_LIC_SELF_OWNERSHIP' && this.addItem(persontype).controls.length >= 10) {
					this.toastrService.warning("Parners not allowed more than 10");
					return false;
				}
			}

			this.addItem(persontype).push(this.createArray({
				personType: persontype
			}));
			// this.shopLicNewForm.get('employerFamilyList').setValidators([Validators.required]);
			let newlyadded = this.addItem(persontype).controls;
			if (newlyadded.length) {
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after save existing record.", "warning");
		}
	}

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date, controlType: string) {
		this.shopLicNewForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method is set gujarati value in change event. 
	 * @param event : dropdown event
	 * @param lookupArray : item list
	 * @param varName : static varialbel
	 */
	onChangeDropdown(event: string, lookupArray: Array<any>, varName: string) {
		if (!_.isUndefined(this.getGujValue(lookupArray, event)))
			this[varName] = this.getGujValue(lookupArray, event);
	}

    /**
	 * This Method is set gujarati value in inputs (static).
	 * @param lookupArray : item list
	 * @param resCode : lookup code
	 */
	getGujValue(lookupArray: Array<any>, resCode: string) {
		return _.result(_.find(lookupArray, function (obj) {
			return obj.code === resCode;
		}), 'gujName');
	}

	/**
	 * Method is used to count person
	 * @param formType : form vontrol name
	 * @param fieldsType : set value in this from control
	 * @param filterType : filter type
	 */
	calulateNumberOfPerson(formType: string, fieldsType: string, filterType: string) {
		let countNumber = [];
		let data = (<FormArray>this.shopLicNewForm.get(formType)).controls;
		if (data.length) {
			switch (filterType) {
				case 'young': // age is 14 -18 for young person
					countNumber = data.filter((obj: any) => obj.get('age').value >= 14 && obj.get('age').value <= 18 && (obj.get('gender').value.code == "MALE" || obj.get('gender').value.code == "FEMALE"))
					break;

				case 'adult':// age is above 60 for adult person
					countNumber = data.filter((obj: any) => obj.get('age').value > 18 && (obj.get('gender').value.code == "MALE" || obj.get('gender').value.code == "FEMALE"))
					break;

				case 'men':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "MALE" && obj.get('age').value >= 14)
					break;
				case 'women':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "FEMALE" && obj.get('age').value >= 14)

					break;
				case 'unidentified':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "TRANSGENDER" && obj.get('age').value >= 14)

					break;

				case 'total':
					countNumber = data;
					break;
			}
			this.shopLicNewForm.get(fieldsType).setValue(countNumber.length);
			return countNumber.length;
		}
	}

	/**
	*  Method is used check table is in edit mode
	*/
	isTableInEditMode(persontype: string) {
		return this.addItem(persontype).controls.find((obj: any) => obj.isEditMode === true);
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
	*/
	deleteRecord(persontype: string, index: any) {
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.addItem(persontype).removeAt(index);
			this.toastrService.success("Succesfully deleted", "Deleted");
		});
	}

	/**
	*  Method is used save editable dataview.
	* @param row: table row id
	*/
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
			row.newRecordAdded = false;
		}
	}

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row id
	*/
	cancelRecord(row: any, index: number) {
		try {
			if (row.newRecordAdded) {
				this.addItem(row.get('personType').value).removeAt(index);
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
	*  Method is used get selected data from lookup when change.
	* @param lookups : Array
	* @param code : String
	* return object
	*/
	getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
		return lookups.find((obj: any) => obj.code === code);
	}

	/**
	* Method is used when get business category dropdown data
	* @event is value is "YES" , "NO" and null
	*/
	getCategoryDropdownData(event) {
		this.shopAndEstablishmentService.getCategoryByFilter(event).subscribe(res => {
			this.businessCategory = res;
		})
	}
	/**
	* Method is used when get business sub category dropdown data
	* @event is value fro category dropdown
	*/
	getSubCategoryDropdownData(event) {
		this.shopAndEstablishmentService.getSubCategory(event).subscribe(res => {
			this.businessSubCategory = res;
		})
	}

	/**
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
	onChangeNoOfHumanWorking(event) {
		try {
			this.shopLicNewForm.get('categoryOfBusiness').reset();
			this.shopLicNewForm.get('subCategoryOfBusiness').reset();
			this.getCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
		}
	}

	/**
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
	onChangeCategorySelect(event) {
		try {
			this.shopLicNewForm.get('subCategoryOfBusiness').reset();
			this.getSubCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
		}
	}

	/**
	* Method is invoked when change dropdown of Type of Organization
	* @event is value of Type of Organization dropdown
	*/
	onChangeTypeOfOrganization(event) {

		try {
			this.updateServiceUploadDocument(event);
			(<FormArray>this.shopLicNewForm.get('partnerList')).controls = [];
			this.shopLicNewForm.get('partnerList').setValue([]);
			this.shopLicNewForm.get('attachments').setValue([]);
			if (event == "SHOP_LIC_SELF_OWNERSHIP") {
				// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
				this.addMorePerson('PARTNER');
			}
			this.requiredDocumentList();
			/*let categoryAttachment = this.shopLicNewForm.get('attachments').value;
			switch (event) {
				case 'SHOP_LIC_SELF_OWNERSHIP':
					// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
					this.addMorePerson('PARTNER');
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "PhotoofLicenseHolder" && attachObj.labelName != "OrganizationalOwnershipAgreementCopy");
						this.shopLicNewForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SHOP_LIC_PARTNERSHIP':
				case 'SHOP_LIC_CO_OPERATIVE_SOCIETY':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "OrganizationRentalAgreement" && attachObj.labelName != "SaleOrPurchaseDeed");
						this.shopLicNewForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SHOP_LIC_COMPANY':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "OrganizationRentalAgreement" && attachObj.labelName != 'ListOfDirectors' && attachObj.labelName != "Prescribedcertificate" && attachObj.labelName != 'SaleOrPurchaseDeed' && attachObj.labelName != 'DeedPagesPartners');
						this.shopLicNewForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SHOP_LIC_TRUST':
				case 'SHOP_LIC_BOARD':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "Prescribedcertificate" && attachObj.labelName != "ChairmanMember" && attachObj.labelName != 'RegiAddressProof');
						this.shopLicNewForm.get('attachments').setValue(setNewAttachData);
					}
					break;
			}*/
		} catch (error) {
			console.log(error.message)
		}

	}

	/**
	 * This method set total employee.
	 */
	getTotalEmployeePerson() {
		let totalAdultEmployee = this.shopLicNewForm.get('totalAdultEmployee').value || 0;
		let totalYoungEmployee = this.shopLicNewForm.get('totalYoungEmployee').value || 0;
		let totalManEmployee = this.shopLicNewForm.get('totalManEmployee').value || 0;
		let totalWomenEmployee = this.shopLicNewForm.get('totalWomenEmployee').value || 0;
		let totalUnidentified = this.shopLicNewForm.get('totalUnidentified').value || 0;

		let totalcount = parseInt(totalAdultEmployee) + parseInt(totalYoungEmployee) + parseInt(totalManEmployee) + parseInt(totalWomenEmployee) + parseInt(totalUnidentified);

		this.shopLicNewForm.get('totalEmployee').setValue(totalcount);
		return totalcount;
	}

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {
		switch (true) {
			case flag <= 21:
				this.licenseConfiguration.currentTabIndex = 0;
				break;
			case flag <= 33:
				this.licenseConfiguration.currentTabIndex = 1;
				break;
			case flag <= 40:
				this.licenseConfiguration.currentTabIndex = 2;
				break;
			case flag <= 47:
				this.licenseConfiguration.currentTabIndex = 3;
				break;
			case flag <= 55:
				this.licenseConfiguration.currentTabIndex = 4;
				break;
			case flag <= 61:
				this.licenseConfiguration.currentTabIndex = 5;
				break;
			case flag <= 62:
				this.licenseConfiguration.currentTabIndex = 6;
				break;
			default:
				this.licenseConfiguration.currentTabIndex = 0;
		}
		this.checkDynamicTableValidate();
	}

	/**
	 * this method is use for check validate dynamic attachment for employee family list , person occupying list and Partner list
	 */
	checkDynamicTableValidate(): void {
		try {
			this.addItem("PARTNER").controls.forEach(ele => {
				if (ele.invalid) {
					ele.isEditMode = true;
				}
			});

			this.addItem("EMPLOYER_FAMILY").controls.forEach(familyEle => {
				if (familyEle.invalid) {
					familyEle.isEditMode = true;
				}
			});

			this.addItem("OCCUPANCY").controls.forEach(occupancy => {
				if (occupancy.invalid) {
					occupancy.isEditMode = true;
				}
			});
		} catch (error) {
			console.error(error.message);
		}

	}

	/**
	 * Set validation as per dependent field value
	 */
	setValidationReq(formControlName: string) {
		if (this.shopLicNewForm.get('applicantVimaAmountPaid').get('code').value == 'YES') {
			this.shopLicNewForm.get(formControlName).setValidators([Validators.required, Validators.maxLength(20)]);
		}
		else {
			this.shopLicNewForm.get(formControlName).clearValidators();
		}
		this.shopLicNewForm.get(formControlName).updateValueAndValidity();
	}

	patchValue(){
		this.shopLicNewForm.patchValue(this.dummyJSON);
	}

	dummyJSON:any= {
  
		"periodFrom": null,
		"periodTo": null,
		"newRegistration": null,
		"renewal": null,
		"adminCharges": null,
		"netAmount": null,
		"establishmentName": "dsfsdfsdfdsf",
		"establishmentNameGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ્દ્સ્ફ",
		"postalAddress": {
		  
		  "addressType": "SHOP_LIC_POSTAL_ADDRESS",
		  "buildingName": "sdfsdf",
		  "streetName": "sfdsf",
		  "landmark": "dsfdsf",
		  "area": "dsfsdf",
		  "state": "GUJARAT",
		  "district": null,
		  "city": "Vadodara",
		  "country": "INDIA",
		  "pincode": "234234",
		  "buildingNameGuj": "સ્દ્ફ્સ્દ્ફ",
		  "streetNameGuj": "સ્ફ્દ્સ્ફ",
		  "landmarkGuj": "દ્સ્ફ્દ્સ્ફ",
		  "areaGuj": "દ્સ્ફ્સ્દ્ફ",
		  "stateGuj": "ગુજરાત",
		  "districtGuj": null,
		  "cityGuj": "વડોદરા",
		  "countryGuj": "ભારત"
		},
		"noOfHumanWorking": {
		  "code": "YES",
		  "name": "Yes"
		},
		"assessmentDoneByVMC": {
		  "code": "YES",
		  "name": "Yes"
		},
		"propertyTaxNo": "4543543543543",
		"wardNo": {
		  "code": "CITY",
		  "name": "City"
		},
		"aadharNumber": null,
		"professionalTaxPECNo": "",
		"prcNo": null,
		"applicantVimaAmountPaid": {
		  "code": "YES",
		  "name": "Yes"
		},
		"number": '1111111111',
		"situationOfOffice": "fsdfsdfsdfsdf",
		"nameOfEmployer": "sdfsdfsdfsdf",
		"nameOfEmployerGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"residentialAddressOfEmployer": "dsfdsfsdf",
		"residentialAddressOfEmployerGuj": "દ્સ્ફ્દ્સ્ફ્સ્દ્ફ",
		"nameOfManager": "dsfsdfdsf",
		"residentialAddressOfManager": "dfdsfsdf",
		"categoryOfBusiness": {
		  "code": "COMMERCIAL_ESTABLISHMENT_MORE_THEN_TEN",
		  "name": "Commercial Establishment employing Ten or More Employees"
		},
		"subCategoryOfBusiness": {
		  "code": "SHOP_LIC_B_OFFICES_OTHERS",
		  "name": "Offices Others"
		},
		"nameOfBusiness": "sfddsfdsfsdfsdf",
		"nameOfBusinessGuj": "સ્ફ્દ્દ્સ્ફ્દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
		"commencementOfBusinessDate": "2019-12-01",
		"enterHoliday": {
		  "code": "SHOP_LIC_MONDAY"
		},
		"employerFamilyList": [
		  {
			
			"name": "sdfsdf",
			"address": "sdfsdfsdf",
			"serviceCode": "SHOP-LIC",
			"relationship": {
			  "code": "SHOP_LIC_PARTNER"
			},
			"gender": {
			  "code": "MALE"
			},
			"age": 33,
			"personType": "EMPLOYER_FAMILY"
		  }
		],
		"totalAdultEmployerFamily": 1,
		"totalYoungEmployerFamily": 0,
		"totalManEmployerFamily": 1,
		"totalWomenEmployerFamily": 0,
		"totalUnidentifiedEmployerFamily": 0,
		"totalFamilyMembers": 1,
		"occupancyList": [
		  {
		   
			"name": "fdsfsd",
			"address": "fdsfsdf",
			"serviceCode": "SHOP-LIC",
			"relationship": {
			  "code": "SHOP_LIC_EMPLOYEES_RESIDENT"
			},
			"gender": {
			  "code": "MALE"
			},
			"age": 23,
			"personType": "OCCUPANCY"
		  }
		],
		"totalAdultOccupancy": 1,
		"totalYoungOccupancy": 0,
		"totalManOccupancy": 1,
		"totalWomenOccupancy": 0,
		"totalUnidentifiedOccupancy": 0,
		"totalOccupancy": 1,
		"typeOfOrganisation": {
		  "code": "SHOP_LIC_SELF_OWNERSHIP"
		},
		"partnerList": [
		  {
			
			"name": "dsfsdfsdf",
			"address": "sdfsdfsdf",
			"serviceCode": "SHOP-LIC",
			"relationship": {
			  "code": "SHOP_LIC_COMPANY"
			},
			"gender": {
			  "code": "MALE"
			},
			"age": 33,
			"personType": "PARTNER"
		  }
		],
		"totalAdultPartner": 1,
		"totalYoungPartner": 0,
		"totalManPartner": 1,
		"totalWomenPartner": null,
		"totalUnidentifiedPartner": 0,
		"totalPartner": 1,
		"totalAdultEmployee": "1",
		"totalYoungEmployee": "1",
		"totalManEmployee": "1",
		"totalWomenEmployee": "1",
		"totalUnidentified": null,
		"totalEmployee": 4,
		"attachments": [],
		"agree": false,
	   
		
		"fileStatus": "DRAFT",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"firstName": "SHAN",
		"middleName": null,
		"lastName": "SANGEWAR",
		"aadhaarNo": null,
		"contactNo": "9673475273",
		"email": "shantanu.sangewar@nascentinfo.com",
		"serviceDetail": {
		  "code": "SHOP-LIC",
		  "name": "Issue of New License",
		  "gujName": "નવા લાયસન્સનો ઇશ્યૂ",
		  "feesOnScrutiny": true,
		  "appointmentRequired": false
		}
	  };

	  updateServiceUploadDocument(event){
		let array =  (<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')) ;
		for(let i = array.length-1; i >= 0; i--) {
            array.removeAt(i)
        }
		
		switch (event) {
            case 'SHOP_LIC_COMPANY':
			case 'SHOP_LIC_TRUST':
			case 'SHOP_LIC_PARTNERSHIP':
			case 'SHOP_LIC_BOARD':
				const localUploadArray = [...this.serverUploadFilesArray]
				for(let file of localUploadArray){
					if(file['documentIdentifier'] === 'PARTNERSHIP_DEED'){
					    file['mandatory'] = false;	
					}
					(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
				}
				break;
			default:
				for(let file of this.serverUploadFilesArray){
					if(file['documentIdentifier'] === 'PARTNERSHIP_DEED'){
					    file['mandatory'] = true;
					}
					(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
				}
				break;	
		}


		
	  }

}
