import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';
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

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;
	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicRenewalForm: FormGroup;
	translateKey: string = 'shopRenewalScreen';

	formId: number;
	apiCode: string;
	private showButtons: boolean = false;
	//File and image upload
	uploadModel: any = {};

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
			{ labelName: 'Professional Tax PEC No Receipt', fieldIdentifier: '1' },
			{ labelName: 'Professional Tax PRC No Receipt', fieldIdentifier: '2' },
			{ labelName: 'Property Tax / Water Tax paid Receipt', fieldIdentifier: '3' },
			{ labelName: 'aadhar_number', fieldIdentifier: '4' },
			{ labelName: 'PAN_card', fieldIdentifier: '5' },

		];

	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

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
	 * This method is use to create new record for citizen
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
	 * This method use for edit some fiels
	 */
	enableFielList() {
		this.shopLicRenewalForm.get('enterHoliday').enable();
		this.shopLicRenewalForm.get('totalAdultEmployee').enable();
		this.shopLicRenewalForm.get('totalYoungEmployee').enable();
		this.shopLicRenewalForm.get('totalManEmployee').enable();
		this.shopLicRenewalForm.get('totalWomenEmployee').enable();
		this.shopLicRenewalForm.get('totalEmployee').enable();
	}

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
	* @lookups : Array
	* @code : String
	* return object
	*/
	getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
		return lookups.find((obj: any) => obj.code === code);
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;
		if (count <= step1) {
			this.stepper.selectedIndex = 0;
			return false;
		}
	}

	/**
	 * This method is use for get lookup data
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

	shopLicRenewalFormControls() {
		this.shopLicRenewalForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-REN',

			/* Step 1 controls start */
			establishmentName: [null, [Validators.required, Validators.maxLength(30)]],//count=4
			establishmentNameGuj: [null, Validators.required],
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),
			noOfHumanWorking: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			assessmentDoneByVMC: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			propertyTaxNo: [null, [Validators.required, Validators.maxLength(15)]],
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
			number: ['', Validators.maxLength(15)],
			situationOfOffice: [null, [Validators.required, Validators.maxLength(100)]],
			/* Step 1 controls end */

			/* Step 2 controls start */
			nameOfEmployer: [null, [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
			nameOfEmployerGuj: [null, Validators.required],
			residentialAddressOfEmployer: [null, [Validators.required, Validators.maxLength(100)]],
			residentialAddressOfEmployerGuj: [null, Validators.required],
			nameOfManager: [null, [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
			residentialAddressOfManager: [null, [Validators.required, Validators.maxLength(100)]],
			categoryOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			subCategoryOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: [null],
			}),
			nameOfBusiness: [null, [Validators.required, Validators.maxLength(50)]],
			nameOfBusinessGuj: [null, Validators.required],
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
			totalFamilyMembers: [null],

			occupancyList: this.fb.array([]),
			totalAdultOccupancy: [null],
			totalYoungOccupancy: [null],
			totalManOccupancy: [null],
			totalWomenOccupancy: [null],
			totalOccupancy: [null],

			partnerList: this.fb.array([]),

			totalAdultPartner: [null],
			totalYoungPartner: [null],
			totalManPartner: [null],
			totalWomenPartner: [null],
			totalPartner: [null],

			//employeeList: this.fb.array([]),
			totalAdultEmployee: [null, Validators.required],
			totalYoungEmployee: [null, Validators.required],
			totalManEmployee: [null, Validators.required],
			totalWomenEmployee: [null, Validators.required],
			totalEmployee: [null, Validators.required],

			typeOfOrganisation: this.fb.group({
				code: [null, Validators.required]
			}),
			attachments: [],

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
			this.shopLicRenewalForm.get(fieldsType).setValue(countNumber.length);
			return countNumber.length;
		}
	}


	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
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
			//serviceFormId: this.formId,
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, Validators.required],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
			address: [data.address ? data.address : null, Validators.required],
			serviceCode: 'SHOP-REN',
			relationship: this.fb.group({
				code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null, Validators.required]//
			}),
			gender: this.fb.group({
				code: [data.gender ? (data.gender.code ? data.gender.code : null) : null, Validators.required]
			}),
			age: [data.age ? data.age : null, [Validators.required, ValidationService.employeeAgeValidate]],
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


}
