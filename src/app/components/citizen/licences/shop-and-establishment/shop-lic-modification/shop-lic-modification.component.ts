import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {  ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';
import { Location } from '@angular/common';
import { CommonService } from '../../.././../../shared/services/common.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-shop-lic-modification',
	templateUrl: './shop-lic-modification.component.html',
	styleUrls: ['./shop-lic-modification.component.scss']
})
export class ShopLicModificationComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicModificationForm: FormGroup;
	translateKey: string = 'shopModificationScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;

	//lookup array list
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
	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.shopAndEstablishmentService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
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
	* @param shopAndEstablishmentService - Call only shop licence api.
	* @param toastrService - Show massage with timer.
	*/
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		// private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private shopAndEstablishmentService: ShopAndEstablishmentService,
		private location: Location,
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
		this.shopLicModificationFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getShopRenewalData();
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
			this.shopLicModificationForm.patchValue(searchData);

			this.shopLicModificationForm.patchValue({
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
				licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: [],

			});

			this.licenseConfiguration.isAttachmentButtonsVisible = true;

			(<FormArray>this.shopLicModificationForm.get('employerFamilyList')).controls = [];
			searchData.employerFamilyList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicModificationForm.get('employerFamilyList')).push(this.createArray(app));
			});
			(<FormArray>this.shopLicModificationForm.get('occupancyList')).controls = [];
			searchData.occupancyList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicModificationForm.get('occupancyList')).push(this.createArray(app));
			});
			(<FormArray>this.shopLicModificationForm.get('partnerList')).controls = [];
			searchData.partnerList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicModificationForm.get('partnerList')).push(this.createArray(app));
			});
			/* searchData.employeeList.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('employeeList')).push(this.createArray(app));
			}); */

			this.getCategoryDropdownData(this.shopLicModificationForm.get('noOfHumanWorking').value.code);
			this.getSubCategoryDropdownData(this.shopLicModificationForm.get('categoryOfBusiness').value.code);
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
		});

	}

	/**
	 * This method patch form data.
	 */
	getShopRenewalData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			this.shopLicModificationForm.patchValue(res);
			this.licenseConfiguration.isAttachmentButtonsVisible = true;
			res.employerFamilyList.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('employerFamilyList')).push(this.createArray(app));
			});
			res.occupancyList.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('occupancyList')).push(this.createArray(app));
			});
			res.partnerList.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('partnerList')).push(this.createArray(app));
			});
			/* res.employeeList.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('employeeList')).push(this.createArray(app));
			}); */
			this.getCategoryDropdownData(this.shopLicModificationForm.get('noOfHumanWorking').value.code);
			this.getSubCategoryDropdownData(this.shopLicModificationForm.get('categoryOfBusiness').value.code);
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.shopLicModificationForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
		});
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
	* Method is invoked when change dropdown of Type of Organization
	* @event is value of Type of Organization dropdown
	*/
	onChangeTypeOfOrganization(event) {
		try {
			(<FormArray>this.shopLicModificationForm.get('partnerList')).controls = [];
			this.shopLicModificationForm.get('attachments').setValue([]);
			if (event == "SHOP_LIC_SELF_OWNERSHIP") {
				// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
				this.addMorePerson('PARTNER');
			}
			this.requiredDocumentList();
		} catch (error) {
			console.log(error.message)
		}
	}

	/**
	 * This method set total employee.
	 */
	getTotalEmployeePerson() {
		let totalAdultEmployee = this.shopLicModificationForm.get('totalAdultEmployee').value || 0;
		let totalYoungEmployee = this.shopLicModificationForm.get('totalYoungEmployee').value || 0;
		let totalManEmployee = this.shopLicModificationForm.get('totalManEmployee').value || 0;
		let totalWomenEmployee = this.shopLicModificationForm.get('totalWomenEmployee').value || 0;
		let totalUnidentified = this.shopLicModificationForm.get('totalUnidentified').value || 0;

		let totalcount = parseInt(totalAdultEmployee) + parseInt(totalYoungEmployee) + parseInt(totalManEmployee) + parseInt(totalWomenEmployee) + parseInt(totalUnidentified);

		this.shopLicModificationForm.get('totalEmployee').setValue(totalcount);
		return totalcount;
	}


	/**
	 * This method is use for get lookup data.
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
	 * This method create form controls.
	 */
	shopLicModificationFormControls() {
		this.shopLicModificationForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-LIC',
			periodFrom: null,
			periodTo: null,
			newRegistration: null,
			renewal: null,
			adminCharges: null,
			netAmount: null,
			licenseIssueDate: null,

			refNumber: [null, Validators.required],
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
			number: [''],
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
			attachments: ['']
			/*  */


		});
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		let organizationCategory = this.shopLicModificationForm.get('typeOfOrganisation').value.code;
		if (organizationCategory) {
			_.forEach(this.shopLicModificationForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {


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
 	 * Method is used to count person
 	 * @param formType : form vontrol name
 	 * @param fieldsType : set value in this from control
 	 * @param filterType : filter type
 	 */
	calulateNumberOfPerson(formType: string, fieldsType: string, filterType: string) {
		let countNumber = [];
		let data = (<FormArray>this.shopLicModificationForm.get(formType)).controls;
		if (data.length) {
			switch (filterType) {
				case 'young': // age is 14 -18 for young person
					countNumber = data.filter((obj: any) => obj.get('age').value >= 14 && obj.get('age').value <= 18)
					break;

				case 'adult':// age is above 60 for adult person
					countNumber = data.filter((obj: any) => obj.get('age').value > 60)
					break;

				case 'men':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "MALE" && obj.get('age').value >= 19 && obj.get('age').value <= 60)
					break;
				case 'women':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "FEMALE" && obj.get('age').value >= 19 && obj.get('age').value <= 60)

					break;
				case 'total':
					countNumber = data;
					break;
			}
			this.shopLicModificationForm.get(fieldsType).setValue(countNumber.length);
			return countNumber.length;
		}
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
	 * Method is used to return array
	 * @param data : person data array 
	 * @param persontype : person array type 
	 */
	createArray(data?: any, persontype?: string) {
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
				returnArray = this.shopLicModificationForm.get('employerFamilyList') as FormArray;
				break;
			case 'OCCUPANCY':
				returnArray = this.shopLicModificationForm.get('occupancyList') as FormArray;
				break;
			case 'PARTNER':
				returnArray = this.shopLicModificationForm.get('partnerList') as FormArray;
				break;
			/* case 'EMPLOYEES':
				returnArray= this.shopLicModificationForm.get('employeeList') as FormArray;
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
				if (this.shopLicModificationForm.get('typeOfOrganisation').value.code === 'SHOP_LIC_SELF_OWNERSHIP' && this.addItem(persontype).controls.length >= 1) {
					this.toastrService.warning("You can add only one partner becouse you are self ownership");
					return false;
				}
				if (this.shopLicModificationForm.get('typeOfOrganisation').value.code != 'SHOP_LIC_SELF_OWNERSHIP' && this.addItem(persontype).controls.length >= 10) {
					this.toastrService.warning("Parners not allowed more than 10");
					return false;
				}
			}

			this.addItem(persontype).push(this.createArray({
				personType: persontype
			}));
			// this.shopLicModificationForm.get('employerFamilyList').setValidators([Validators.required]);
			let newlyadded = this.addItem(persontype).controls;
			if (newlyadded.length) {
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
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
		this.shopLicModificationForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
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
	 *  Method is used check table is in edit mode
	 * @param persontype: person type 
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
	 * @param persontype : person type
	 * @param index : list index
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
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
	onChangeNoOfHumanWorking(event) {
		try {
			this.shopLicModificationForm.get('categoryOfBusiness').reset();
			this.shopLicModificationForm.get('subCategoryOfBusiness').reset();
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
			this.shopLicModificationForm.get('subCategoryOfBusiness').reset();
			this.getSubCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
		}
	}

	 /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {
		switch (true) {
			case flag <= 23:
				this.licenseConfiguration.currentTabIndex = 0;
				break;
			case flag <= 35:
				this.licenseConfiguration.currentTabIndex = 1;
				break;
			case flag <= 42:
				this.licenseConfiguration.currentTabIndex = 2;
				break;
			case flag <= 49:
				this.licenseConfiguration.currentTabIndex = 3;
				break;
			case flag <= 57:
				this.licenseConfiguration.currentTabIndex = 4;
				break;
			case flag <= 62:
				this.licenseConfiguration.currentTabIndex = 5;
				break;
			case flag <= 63:
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
			this.addItem("PARTNER").controls.forEach(element => {
				if (element.invalid) {
					element.isEditMode = true;
				}
			});

			this.addItem("EMPLOYER_FAMILY").controls.forEach(element => {
				if (element.invalid) {
					element.isEditMode = true;
				}
			});

			this.addItem("OCCUPANCY").controls.forEach(element => {
				if (element.invalid) {
					element.isEditMode = true;
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
		if (this.shopLicModificationForm.get('applicantVimaAmountPaid').get('code').value == 'YES') {
			this.shopLicModificationForm.get(formControlName).setValidators([Validators.required, Validators.maxLength(20)]);
		}
		else {
			this.shopLicModificationForm.get(formControlName).clearValidators();
		}
		this.shopLicModificationForm.get(formControlName).updateValueAndValidity();
	}

}
