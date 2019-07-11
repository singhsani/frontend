import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';
import { Location } from '@angular/common';
import { CommonService } from '../../.././../../shared/services/common.service';

import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import * as _ from 'lodash';
import { LicenseConfiguration } from '../../license-configuration';

@Component({
	selector: 'app-shop-lic-renewal',
	templateUrl: './shop-lic-renewal.component.html',
	styleUrls: ['./shop-lic-renewal.component.scss']
})
export class ShopLicRenewalComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicRenewalForm: FormGroup;
	translateKey: string = 'shopRenewalScreen';
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
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private shopAndEstablishmentService: ShopAndEstablishmentService,
		private location: Location,
		private commonService: CommonService,
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
		this.shopLicRenewalFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getShopRenewalData();
			this.shopLicRenewalForm.disable();
			this.enableFielList();
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
			this.shopLicRenewalForm.patchValue(searchData);

			this.shopLicRenewalForm.patchValue({
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

			(<FormArray>this.shopLicRenewalForm.get('employerFamilyList')).controls = [];
			searchData.employerFamilyList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicRenewalForm.get('employerFamilyList')).push(this.createArray(app));
			});
			(<FormArray>this.shopLicRenewalForm.get('occupancyList')).controls = [];
			searchData.occupancyList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicRenewalForm.get('occupancyList')).push(this.createArray(app));
			});
			(<FormArray>this.shopLicRenewalForm.get('partnerList')).controls = [];
			searchData.partnerList.forEach(app => {
				app.id = null;
				app.serviceFormId = null;
				(<FormArray>this.shopLicRenewalForm.get('partnerList')).push(this.createArray(app));
			});
			/* searchData.employeeList.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('employeeList')).push(this.createArray(app));
			}); */
			this.shopLicRenewalForm.disable();
			this.enableFielList();

			this.getCategoryDropdownData(this.shopLicRenewalForm.get('noOfHumanWorking').value.code);
			this.getSubCategoryDropdownData(this.shopLicRenewalForm.get('categoryOfBusiness').value.code);
			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
		});

	}

	/**
	 * This method use for edit some fiels.
	 */
	enableFielList() {
		this.shopLicRenewalForm.get('noOfHumanWorking').enable();
		this.shopLicRenewalForm.get('aadharNumber').enable();
		this.shopLicRenewalForm.get('professionalTaxPECNo').enable();
		this.shopLicRenewalForm.get('prcNo').enable();
		this.shopLicRenewalForm.get('categoryOfBusiness').enable();
		this.shopLicRenewalForm.get('subCategoryOfBusiness').enable();

		this.shopLicRenewalForm.get('totalAdultEmployee').enable();
		this.shopLicRenewalForm.get('totalYoungEmployee').enable();
		this.shopLicRenewalForm.get('totalManEmployee').enable();
		this.shopLicRenewalForm.get('totalWomenEmployee').enable();
		this.shopLicRenewalForm.get('totalUnidentified').enable();
		this.shopLicRenewalForm.get('totalEmployee').enable();
	}

	/**
	 * This method patch form data.
	 */
	getShopRenewalData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			this.shopLicRenewalForm.patchValue(res);
			this.licenseConfiguration.isAttachmentButtonsVisible = true;
			res.employerFamilyList.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('employerFamilyList')).push(this.createArray(app));
			});
			res.occupancyList.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('occupancyList')).push(this.createArray(app));
			});
			res.partnerList.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('partnerList')).push(this.createArray(app));
			});
			/* res.employeeList.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('employeeList')).push(this.createArray(app));
			}); */
			this.getCategoryDropdownData(this.shopLicRenewalForm.get('noOfHumanWorking').value.code);
			this.getSubCategoryDropdownData(this.shopLicRenewalForm.get('categoryOfBusiness').value.code);

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.shopLicRenewalForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
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
	 * This method set total employee.
	 */
	getTotalEmployeePerson() {
		let totalAdultEmployee = this.shopLicRenewalForm.get('totalAdultEmployee').value || 0;
		let totalYoungEmployee = this.shopLicRenewalForm.get('totalYoungEmployee').value || 0;
		let totalManEmployee = this.shopLicRenewalForm.get('totalManEmployee').value || 0;
		let totalWomenEmployee = this.shopLicRenewalForm.get('totalWomenEmployee').value || 0;
		let totalUnidentified = this.shopLicRenewalForm.get('totalUnidentified').value || 0;

		let totalcount = parseInt(totalAdultEmployee) + parseInt(totalYoungEmployee) + parseInt(totalManEmployee) + parseInt(totalWomenEmployee) + parseInt(totalUnidentified);

		this.shopLicRenewalForm.get('totalEmployee').setValue(totalcount);
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
			this.gender = res.GENDER
			this.SHOP_LIC_HOLIDAY = res.SHOP_LIC_HOLIDAY
		});
	}

	/**
	 * This method create form controls.
	 */
	shopLicRenewalFormControls() {
		this.shopLicRenewalForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-LIC',
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
			professionalTaxPECNo: ['', [Validators.required, Validators.maxLength(20)]],
			prcNo: ['', [Validators.required, Validators.maxLength(20)]],
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

			periodFrom: null,
			periodTo: null,
			newRegistration: null,
			renewal: null,
			adminCharges: null,
			netAmount: null,

			employerFamilyList: this.fb.array([]),

			totalAdultEmployerFamily: null,
			totalYoungEmployerFamily: null,
			totalManEmployerFamily: null,
			totalWomenEmployerFamily: null,
			totalUnidentifiedEmployerFamily: null,
			totalFamilyMembers: null,

			occupancyList: this.fb.array([]),
			totalAdultOccupancy: null,
			totalYoungOccupancy: null,
			totalManOccupancy: null,
			totalWomenOccupancy: null,
			totalUnidentifiedOccupancy: null,
			totalOccupancy: null,

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

			//employeeList: this.fb.array([]),
			totalAdultEmployee: [null, Validators.required],
			totalYoungEmployee: [null, Validators.required],
			totalManEmployee: [null, Validators.required],
			totalWomenEmployee: [null, Validators.required],
			totalUnidentified: null,
			totalEmployee: [null, Validators.required],

			// situationOfOfficeGuj: null,
			// nameOfManagerGuj: null,
			// residentialAddressOfManagerGuj: null,
			//enterHolidayGuj: null,
			licenseIssueDate: null,
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
		let organizationCategory = this.shopLicRenewalForm.get('typeOfOrganisation').value.code;
		if (organizationCategory) {
			_.forEach(this.shopLicRenewalForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {


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
		let data = (<FormArray>this.shopLicRenewalForm.get(formType)).controls;
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
			this.shopLicRenewalForm.get(fieldsType).setValue(countNumber.length);
			return countNumber.length;
		}
	}


	/**
	 * Method is used when change data of NoOfHumanWorking dropdown
	 * @event is value of NoOfHumanWorking dropdown
	 */
	onChangeNoOfHumanWorking(event) {
		try {
			this.shopLicRenewalForm.get('categoryOfBusiness').reset();
			this.shopLicRenewalForm.get('subCategoryOfBusiness').reset();
			this.getCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
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
	 * Method is invoked when change dropdown of Type of Organization
	 * @event is value of Type of Organization dropdown
	 */
	onChangeTypeOfOrganization(event) {

		try {
			(<FormArray>this.shopLicRenewalForm.get('partnerList')).controls = [];
			this.shopLicRenewalForm.get('attachments').setValue([]);
			if (event == "SHOP_LIC_SELF_OWNERSHIP") {
				// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
				// this.addMorePerson('PARTNER');
			}
			this.requiredDocumentList();
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
			this.shopLicRenewalForm.get('subCategoryOfBusiness').reset();
			this.getSubCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
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
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
			serviceCode: "SHOP-REN",
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
 * This method required for final form submition.
 * @param flag - flag of invalid control.
 */
	handleErrorsOnSubmit(flag) {
		switch (true) {
			case flag <= 16:
				this.licenseConfiguration.currentTabIndex = 0;
				break;
			case flag <= 28:
				this.licenseConfiguration.currentTabIndex = 1;
				break;
			case flag <= 36:
				this.licenseConfiguration.currentTabIndex = 2;
				break;
			case flag <= 42:
				this.licenseConfiguration.currentTabIndex = 3;
				break;
			case flag <= 49:
				this.licenseConfiguration.currentTabIndex = 4;
				break;
			case flag <= 57:
				this.licenseConfiguration.currentTabIndex = 5;
				break;
			case flag <= 61:
				this.licenseConfiguration.currentTabIndex = 6;
				break;
			default:
				this.licenseConfiguration.currentTabIndex = 0;
		}
	}

	/**
	 * Set validation as per dependent field value
	 */
	setValidationReq(formControlName: string) {
		if (this.shopLicRenewalForm.get('applicantVimaAmountPaid').get('code').value == 'YES') {
			this.shopLicRenewalForm.get(formControlName).setValidators([Validators.required, Validators.maxLength(20)]);
		}
		else {
			this.shopLicRenewalForm.get(formControlName).clearValidators();
		}
		this.shopLicRenewalForm.get(formControlName).updateValueAndValidity();
	}
}
