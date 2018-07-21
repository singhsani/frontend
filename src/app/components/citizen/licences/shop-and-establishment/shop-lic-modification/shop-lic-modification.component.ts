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
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-shop-lic-modification',
	templateUrl: './shop-lic-modification.component.html',
	styleUrls: ['./shop-lic-modification.component.scss']
})
export class ShopLicModificationComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;
	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicModificationForm: FormGroup;
	translateKey: string = 'shopModificationScreen';

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
			{ lableName: 'Upload For "E" with Sign', fieldIdentifier: '1' },
			{ lableName: 'Hami patra "A" & "B"', fieldIdentifier: '2' },
			{ lableName: 'Name of Establishment Upload photo of Board or Place of Establishment', fieldIdentifier: '3' },
			{ lableName: 'A In case of change in partnership firm copy of partnership deed receipt', fieldIdentifier: '4' },
			{ lableName: 'B In case of change in company name Certificate of Incorporation', fieldIdentifier: '5' },

			{ lableName: 'C Incase of change of Directors (DIR-12)', fieldIdentifier: '6' },
			{ lableName: 'Authority letter in case of sign authority', fieldIdentifier: '7' },
			{ lableName: 'copy of resolution in one of director nominated 	', fieldIdentifier: '8' },
			{ lableName: 'Organization Rental Agreement', fieldIdentifier: '9' },
			{ lableName: 'Address Change', fieldIdentifier: '10' },

			{ lableName: 'Electricity bill', fieldIdentifier: '11' },
			{ lableName: 'Rent Receipt', fieldIdentifier: '12' },
			{ lableName: 'Maintenance Receipt', fieldIdentifier: '13' },
			{ labelName: 'aadhar_number', fieldIdentifier: '14' },
			{ labelName: 'PAN_card', fieldIdentifier: '15' },
			{ lableName: 'In Case of Change of employer or death of employer death certificate of employer. NOC form family member in case of new employer', fieldIdentifier: '16' },
			{ labelName: 'In case of sanstha trust society copy of register under the sanstha/trust/society Act before appropriate authority', fieldIdentifier: '17' },
			{ labelName: 'sale purchase deed', fieldIdentifier: '18' },
			{ labelName: 'Agreement copy', fieldIdentifier: '19' },
			{ labelName: 'worker professional tax receipt', fieldIdentifier: '20' },
			{ labelName: 'If there are more then 10 or more workers Receipt of Gujarat Labor welfare fund', fieldIdentifier: '21' },

			{ labelName: 'partnership deed copy of partner if there is a partner', fieldIdentifier: '22' },
			{ labelName: 'commercial basis in the concept', fieldIdentifier: '23' },
			{ labelName: 'prescribed certificate', fieldIdentifier: '24' },
			{ labelName: 'Managers Order copy of appointment Letter', fieldIdentifier: '25' },

			// { labelName: 'Professional Tax PEC No Receipt', fieldIdentifier: '1' },
			// { labelName: 'Professional Tax PRC No Receipt', fieldIdentifier: '2' },
			// { labelName: 'Property Tax / Water Tax paid Receipt', fieldIdentifier: '3' },

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
		});

	}

	/**
	 * This method patch form data.
	 */
	getShopRenewalData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			this.shopLicModificationForm.patchValue(res);
			this.showButtons = true;
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
			if (event === "SHOP_LIC_SELF_OWNERSHIP") {
				// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
				(<FormArray>this.shopLicModificationForm.get('partnerList')).controls = [];
				this.addMorePerson('PARTNER');
			} else {
				(<FormArray>this.shopLicModificationForm.get('partnerList')).controls = [];
			}
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
			totalUnidentifiedEmployerFamily: [null],
			totalFamilyMembers: [null],

			occupancyList: this.fb.array([]),
			totalAdultOccupancy: [null],
			totalYoungOccupancy: [null],
			totalManOccupancy: [null],
			totalWomenOccupancy: [null],
			totalUnidentifiedOccupancy: [null],
			totalOccupancy: [null],

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
			totalUnidentified: [null, Validators.required],
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
	 * Method is used to reset form its a output event from action bar.
	 */
	// stepReset() {
	// 	this.stepper.reset();
	// 	this.shopLicModificationForm.get('postalAddress').get('addressType').setValue('SHOP_LIC_POSTAL_ADDRESS');
	// }

	/**
     * This method use to get output event of tab change
     * @param evt - Tab index
     */
	onTabChange(evt) {
		this.tabIndex = evt;
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
			let newlyadded = <any>this.addItem(persontype).controls;
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

		let step1 = 16;
		let step2 = 28;
		let step3 = 35;
		let step4 = 41;
		let step5 = 47;
		let step6 = 53;
		let step7 = 62;
		let step8 = 66;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step1) {
				this.tabIndex = 0;
				return false;
			} else if (count <= step2) {
				this.tabIndex = 1;
				return false;
			} else if (count <= step3) {
				this.tabIndex = 2;
				return false;
			} else if (count <= step4) {
				this.tabIndex = 3;
				return false;
			} else if (count <= step5) {
				this.tabIndex = 4;
				return false;
			} else if (count <= step6) {
				this.tabIndex = 5;
				return false;
			} else if (count <= step7) {
				this.tabIndex = 6;
				return false;
			} else if (count <= step8) {
				this.tabIndex = 7;
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
