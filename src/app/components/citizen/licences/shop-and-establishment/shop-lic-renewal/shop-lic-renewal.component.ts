import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';
import { Location } from '@angular/common';
import { CommonService } from '../../.././../../shared/services/common.service';

@Component({
	selector: 'app-shop-lic-renewal',
	templateUrl: './shop-lic-renewal.component.html',
	styleUrls: ['./shop-lic-renewal.component.scss']
})
export class ShopLicRenewalComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicRenewalForm: FormGroup;
	translateKey: string = 'shopRenewalScreen';

	formId: number;
	apiCode: string;
	private showButtons: boolean = false;
	//File and image upload
	uploadModel: any = {};
	tabIndex: number = 0;

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
	private uploadFileArray: Array<any> =
		[
			{ labelName: 'Upload photo of License Holder (2MB Only)', fieldIdentifier: '1', category: 'SHOP_LIC_SELF_OWNERSHIP' },
			{ labelName: 'Organizational ownership agreement copy', fieldIdentifier: '2', category: 'SHOP_LIC_SELF_OWNERSHIP' },

			{ labelName: 'Organization Rental Agreement', fieldIdentifier: '12', category: "SHOP_LIC_PARTNERSHIP" },
			{ labelName: 'Sale / Purchase Deed', fieldIdentifier: '13', category: "SHOP_LIC_PARTNERSHIP" },
			{ labelName: 'Prescribed certificate', fieldIdentifier: '14', category: "SHOP_LIC_PARTNERSHIP" },
			{ labelName: 'Partnership Deed Copy Of Partner If There Is A Partner', fieldIdentifier: '6', category: "SHOP_LIC_PARTNERSHIP" },

			{ labelName: 'Organization Rental Agreement', fieldIdentifier: '12', category: "SHOP_LIC_COMPANY" },
			{ labelName: 'List of Directors and Nomination of Directors (Resolution)', fieldIdentifier: '16', category: "SHOP_LIC_COMPANY" },
			{ labelName: 'Sale / Purchase Deed', fieldIdentifier: '13', category: "SHOP_LIC_COMPANY" },
			{ labelName: 'Partnership Deed Copy Of Partner If There Is A Partner', fieldIdentifier: '6', category: "SHOP_LIC_COMPANY" },
			{ labelName: 'Prescribed certificate', fieldIdentifier: '14', category: "SHOP_LIC_COMPANY" },
			{ labelName: 'Partnership Deed (Upload Deed pages which have name of partners, signature of partners,Business / Company Name, percentage of partnership )', fieldIdentifier: '19', category: "SHOP_LIC_COMPANY" },

			{ labelName: 'List of the Trustees/Member of Trust', fieldIdentifier: '15', category: "SHOP_LIC_TRUST" },
			{ labelName: 'List of the Chairman and Member of co-operative society', fieldIdentifier: '17', category: "SHOP_LIC_TRUST" },
			{ labelName: 'Registered Address and proof thereof', fieldIdentifier: '18', category: "SHOP_LIC_TRUST" },
			{ labelName: 'Partnership Deed Copy Of Partner If There Is A Partner', fieldIdentifier: '6', category: "SHOP_LIC_TRUST" },
			{ labelName: 'Prescribed certificate', fieldIdentifier: '14', category: "SHOP_LIC_TRUST" },
			{ labelName: 'Partnership Deed (Upload Deed pages which have name of partners, signature of partners,Business / Company Name, percentage of partnership )', fieldIdentifier: '19', category: "SHOP_LIC_TRUST" },

			{ labelName: 'Property Tax Current Year Receipt Of Organization', fieldIdentifier: '3', category: 'common' },
			{ labelName: 'Organization Business Tax Current Year Receipt', fieldIdentifier: '4', category: 'common' },
			{ labelName: 'Workers Professional Tax Receipt', fieldIdentifier: '5', category: "common" },
			// { labelName: 'Partnership Deed Copy Of Partner If There Is A Partner', fieldIdentifier: '6', required: false, category: "common" },
			{ labelName: 'If there are more then 10 or more workers,  Receipt of Gujarat Labor welfare fund Commercial basis in the concept', fieldIdentifier: '7', category: "common" },
			// { labelName: 'Aadhar Card No', fieldIdentifier: '8', required: false, category: "common" },
			// { labelName: 'Election/ Voters ID', fieldIdentifier: '9', required: false, category: "common" },
			// { labelName: 'PAN Card No', fieldIdentifier: '10', required: false, category: "common" },


		];

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
		private commonService: CommonService
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
				attachments: [],

			});

			this.showButtons = true;

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
			this.showButtons = true;
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
			professionalTaxPECNo: ['', [Validators.required, Validators.maxLength(20)]],
			prcNo: ['', [Validators.required, Validators.maxLength(20)]],
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
			attachments: [''],
			/*  */


		});
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
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "UNIDENTIFIED" && obj.get('age').value >= 14)

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
			name: [data.name ? data.name : null, [Validators.maxLength(100)]],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
			address: [data.address ? data.address : null, [Validators.maxLength(150)]],
			serviceCode: "SHOP-REN",
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
