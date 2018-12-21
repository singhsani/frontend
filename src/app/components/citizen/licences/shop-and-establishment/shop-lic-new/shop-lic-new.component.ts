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

@Component({
	selector: 'app-shop-lic-new',
	templateUrl: './shop-lic-new.component.html',
	styleUrls: ['./shop-lic-new.component.scss']
})
export class ShopLicNewComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicNewForm: FormGroup;
	translateKey: string = 'shopLicNewScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

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
	private uploadFilesArray: Array<any> = [];

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
		private TranslateService: TranslateService
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
				this.showButtons = true;
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


				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
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
			/* Step 1 controls start */
			establishmentName: [null, [Validators.required, Validators.maxLength(150)]],//count=4
			establishmentNameGuj: [null, [Validators.required, Validators.maxLength(450)]],
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),
			noOfHumanWorking: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			assessmentDoneByVMC: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			propertyTaxNo: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
			wardNo: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			aadharNumber: ['', Validators.maxLength(12)],
			professionalTaxPECNo: ['', Validators.maxLength(20)],
			prcNo: ['', Validators.maxLength(20)],
			applicantVimaAmountPaid: this.fb.group({
				code: [null],
				name: [null],
			}),
			number: ['', Validators.maxLength(20)],
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
				name: [null],
			}),
			subCategoryOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			nameOfBusiness: [null, [Validators.required, Validators.maxLength(200)]],
			nameOfBusinessGuj: [null, [Validators.required, Validators.maxLength(600)]],
			commencementOfBusinessDate: [null, Validators.required],
			enterHoliday: this.fb.group({
				code: [null, Validators.required]
			}),
			/* Step 2 controls end */

			periodFrom: [null],
			periodTo: [null],
			newRegistration: [null],
			renewal: [null],
			adminCharges: [null],
			netAmount: [null],

			employerFamilyList: this.fb.array([]),

			totalAdultEmployerFamily: [null],
			totalYoungEmployerFamily: [null],
			totalManEmployerFamily: [null],
			totalWomenEmployerFamily: [null],
			totalUnidentifiedEmployerFamily: [null],
			totalFamilyMembers: [null],

			occupancyList: this.fb.array([]),
			totalAdultOccupancy: [null],
			totalYoungOccupancy: [null],
			totalManOccupancy: [null],
			totalWomenOccupancy: [null],
			totalUnidentifiedOccupancy: [null],
			totalOccupancy: [null],

			typeOfOrganisation: this.fb.group({
				code: [null, Validators.required]
			}),
			partnerList: this.fb.array([]),

			totalAdultPartner: [null],
			totalYoungPartner: [null],
			totalManPartner: [null],
			totalWomenPartner: [null],
			totalUnidentifiedPartner: [null],
			totalPartner: [null],

			//employeeList: this.fb.array([]),
			totalAdultEmployee: [null, Validators.required],
			totalYoungEmployee: [null, Validators.required],
			totalManEmployee: [null, Validators.required],
			totalWomenEmployee: [null, Validators.required],
			totalUnidentified: [null],
			totalEmployee: [null, Validators.required],

			// situationOfOfficeGuj: [null],
			// nameOfManagerGuj: [null],
			// residentialAddressOfManagerGuj: [null],
			//enterHolidayGuj: [null],

			/*  */
			attachments: ['']
			/*  */

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
			code: [data.code ? data.code : null],
			isActive: [data.isActive],
			mandatory: [data.mandatory ? data.mandatory : false],
			maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
			requiredOnAdminPortal: [data.requiredOnAdminPortal],
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal]
		});
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
	createArray(data?: any, persontype?: string) {

		return this.fb.group({
			serviceFormId: this.formId,
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.maxLength(100)]],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
			address: [data.address ? data.address : null, [Validators.maxLength(150)]],
			serviceCode: "SHOP-LIC",
			relationship: this.fb.group({
				code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null]//
			}),
			gender: this.fb.group({
				code: [data.gender ? (data.gender.code ? data.gender.code : null) : null]
			}),
			age: [data.age ? data.age : null, [ValidationService.employeeAgeValidate]],
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
				(newlyadded[newlyadded.length - 1]).isEditMode = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new recode after save existing recode.", "warning");
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
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "UNIDENTIFIED" && obj.get('age').value >= 14)

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
		row.deepCopyInEditMode = Object.assign({}, row.value)
	}

	/**
	* Method is used when user click for remove person
	*/
	deleteRecord(persontype: string, index: any) {
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.addItem(persontype).controls.splice(index, 1);
			this.commonService.successAlert('Removed!', '', 'success');
		});
	}

	/**
	*  Method is used save editable dataview.
	* @param row: table row id
	*/
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
		}
	}

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row id
	*/
	cancelRecord(row: any) {
		if (row.deepCopyInEditMode) {
			row.patchValue(row.deepCopyInEditMode);
		}
		row.isEditMode = false;
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
			// debugger;
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

		let step0 = 15;
		let step1 = 27;
		let step2 = 35;
		let step3 = 41;
		let step4 = 48;
		let step5 = 56;
		let step6 = 60;

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
			} else if (count <= step5) {
				this.tabIndex = 5;
				return false;
			} else if (count <= step6) {
				this.tabIndex = 6;
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
