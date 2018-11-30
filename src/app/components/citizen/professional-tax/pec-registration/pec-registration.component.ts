import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManageRoutes } from './../../../../config/routes-conf';
import { ValidationService } from './../../../../shared/services/validation.service';
import { CommonService } from './../../../../shared/services/common.service';
import { ProfessionalTaxService } from './../../../../core/services/citizen/data-services/professional-tax.service';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
	selector: 'app-pec-registration',
	templateUrl: './pec-registration.component.html',
	styleUrls: ['./pec-registration.component.scss']
})
export class PecRegistrationComponent implements OnInit {

	@ViewChild('officeAddr') officeAddrComponent: any;
	@ViewChild('resAddr') resAddrComponent: any;

	translateKey: string = 'pecRegistrationScreen';
	prcTranslateKey: string = 'prcRegistrationScreen';
	actionBarKey: string = 'adminActionBar';

	// mat steps title
	stepLable1: string = "employer_detail";
	stepLable2: string = "bank_detail";
	stepLable3: string = "registration_detail";
	stepLable4: string = "act_detail";

	genderArray: any = [];
	professionArray: any = [];
	wardNoArray: any = [];
	constitutionArray: any = [];
	bankNameArray: any = [];
	entryNoArray: any = [];
	subEntryNoArray: any = [];
	tabIndex: number = 0;

	maxDate: Date = new Date();
	maxCommDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');// maxt Date for commencement
	pecRegForm: FormGroup;
	isDeleteBtnShow: boolean = true;
	isQryParamExist: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private profeService: ProfessionalTaxService,
		private commonService: CommonService
	) {

		this.profeService.apiType = "pecForm";
	}

	ngOnInit() {
		this.pecRegistrationFormControls();
		this.addMoreCenus();

		this.getDataFromLookups();
		this.getAllEntries();
		this.getAllConstitution();
		this.getAllProfessionConst();
		this.getAllWardNos();
		this.getBankNames();

		this.route.queryParams.subscribe(param => {
			this.isQryParamExist = false;
			if (param && param.regNo) {
				this.isQryParamExist = true;
				let pecNoTextBox = <HTMLInputElement>document.getElementById('pecNoTextBox');
				pecNoTextBox.value = param.regNo;
				this.searchPecRegByECRCNo(null, param.regNo);
			}
		});
	}

	/**
	 * this method is used to initialize the form control for pec registration form
	 */
	pecRegistrationFormControls() {

		this.pecRegForm = this.fb.group({

			id: null,
			serviceFormId: null,
			uniqueId: null,
			version: null,
			code: null,
			fieldView: null,
			fieldList: null,
			creditAmount: 0,
			totalTaxAmount: 0,
			lastPaid: null,
			timeInterval: null,
			demands: [],
			defaultDemandGenerated: false,

			// first step controls
			pecNo: [{ value: null, disabled: true }],
			prcNo: [{ value: null, disabled: true }],
			registrationDate: [{ value: null, disabled: true }],
			applicantFullNameGuj: null,
			applicantFullName: null,
			gender: this.fb.group({
				code: ['MALE', Validators.required], name: null,
			}),
			establishmentName: null,
			contactNo: null,
			email: [null, ValidationService.emailValidator],
			ward: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			applicantDob: null,
			rcDate: [{ value: null, disabled: true }],
			commencementDate: null,
			vatNo: null,
			aadharNo: null,
			officeAddress: this.fb.group(this.officeAddrComponent.addressControls()),
			residentialAddress: this.fb.group(this.resAddrComponent.addressControls()),

			// second step controls
			bankAccountNo: null,
			bank: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			branchName: null,

			// third step controls
			pancardNo: [null, ValidationService.panValidator],
			centralSalesTax: null,
			shopAndLicenseNo: null,
			gujaratSalesTax: null,
			professionalTax: null,
			companyRegNo: null,
			gstNo: null,
			censusNo: this.fb.array([]),

			// fourth step controls
			entry: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			subEntry: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			constitution: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			professionConstitution: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			applicableRate: [{ value: 0, disabled: true }]

		});

		/** set default addressType */
		this.setDefaultFeilds();

	}

	setDefaultFeilds() {
		this.pecRegForm.patchValue({
			officeAddress: {
				addressType: "PF_PEC_OFFICE_ADDRESS",
			},
			residentialAddress: {
				addressType: "PF_PEC_RESIDENTIAL_ADDRESS",
			},
			gender: this.fb.group({
				code: ['MALE', Validators.required],
			}),
			registrationDate: moment(new Date()).format('YYYY-MM-DD'),
			creditAmount: 0,
			totalTaxAmount: 0,
			applicableRate: 0
		});
	}

	/**
	 * Declared census formArray property
	 */
	get censusCollection(): FormArray {
		return this.pecRegForm.get('censusNo') as FormArray;
	};

	/**
	 * This method is use to initialise formGroup for census array
	 */
	createCensus(): FormGroup {
		return this.fb.group({
			census: [null, Validators.required]
		});
	}

	/**
	 * This method use to add more census number
	 */
	addMoreCenus() {
		this.censusCollection.push(this.createCensus());
	}

	/**
	 * This method use for remove perticular census
	 * @param idx - Census number index
	 */
	removeCensus(idx: number) {
		this.censusCollection.removeAt(idx);
	}

	/**
	 * This method is used to get all lookups
	 */
	getDataFromLookups() {

		this.profeService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
		});
	}

	/**
	 * This method is used to get the current entry dropdown value
	 * @param code - Entry dropdown code value
	 */
	onEntryChange(event) {

		this.pecRegForm.get('subEntry').get('code').setValue(null);
		this.pecRegForm.get('applicableRate').setValue(0);
		this.pecRegForm.get('professionConstitution').get('code').setValue(null);
		this.pecRegForm.get('constitution').get('code').setValue(null);

		this.getAllSubEntries(event);
	}

	/**
	 * This method is use for set applicable rate from subEnry
	 * @param event - selected value of subEntry
	 */
	onSubEntryChange(event) {
		if (event)
			this.pecRegForm.get('applicableRate').setValue(event.taxRate);
		else
			this.pecRegForm.get('applicableRate').setValue(null);
	}

	/**
	 * This method use for set the date in form controls
	 * @param fieldName - get the selected field's name
	 * @param date get the selected date value
	 */
	onDateChange(fieldName, date) {
		this.pecRegForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method is used to submit the PEC registration data
	 */
	onSubmit() {

		if (this.pecRegForm.invalid) {
			this.markFormGroupTouched(this.pecRegForm);
			this.commonService.openAlert("Warning", "Enter all the required information", "warning");
			return;
		}

		this.pecRegForm.get('censusNo').value.map(v => v.census).sort().sort((a, b) => {
			if (a === b) {
				this.commonService.openAlert("Census number should not be repeated", "", "warning");
			}
		});

		this.profeService.pftSaveFormData(this.pecRegForm.getRawValue()).subscribe(res => {
			if (Object.keys(res).length) {
				if (this.pecRegForm.get('pecNo').value) {
					this.commonService.openAlert("PEC Information Updated Successful", "", "success", `PEC number is ${res.pecNo}`, cb =>{
						this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
					});
				} else {
					this.commonService.openAlert("PEC Registration Successful", "", "success", `PEC number is ${res.pecNo}`, cb =>{
						this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
					});
				}
				this.pecRegForm.patchValue(res);
			}
		});
	}

	/**
	 * This method is used to reset the entire form
	 */
	resetForm() {
		this.pecRegForm.reset();
	}

	/**
	 * This method is used to search the business registration info by ECRC no.
	 * @param ecrcNo - business registartion ecrc no.
	 */
	searchPecRegByECRCNo(event, pecNo) {

		if (event)
			event.stopPropagation();

		if (pecNo == '') {
			this.commonService.openAlert("Warning", "Enter PEC/PRC Number", "warning");
			return;
		}

		this.profeService.getSearchDetails(pecNo).subscribe(res => {
			if (res.data && Object.keys(res.data).length) {

				this.pecRegForm.patchValue(res.data);

				/* set the census numbers */
				if (res.data.censusNo && res.data.censusNo.length > 0) {
					this.censusCollection.controls.splice(0);
					_.forEach(res.data.censusNo, (element) => {
						this.censusCollection.push(this.fb.group(element));
					});
				}

				if (!this.isQryParamExist) {
					this.pecRegForm.disable();
					this.isDeleteBtnShow = false;
					this.censusCollection.controls.forEach(control => {
						if (control instanceof FormGroup) {
							control.get('census').disable();
						}
					});
				} else {
					this.pecRegForm.get('pecNo').disable();
					this.pecRegForm.get('rcDate').disable();
					this.pecRegForm.get('registrationDate').disable();
					this.pecRegForm.get('commencementDate').disable();
					this.pecRegForm.get('entry').disable();
					this.pecRegForm.get('subEntry').disable();
					this.pecRegForm.get('professionConstitution').disable();
					this.pecRegForm.get('constitution').disable();
				}

				/* call subentry service on entry basis */
				if (res.data.entry.code) {
					this.getAllSubEntries(res.data.entry.code);
				}
				/* call state service on country basis */
				if (this.pecRegForm.get('officeAddress').get('country').value)
					this.officeAddrComponent.getStateLists(this.pecRegForm.get('officeAddress').get('country').value);
				if (this.pecRegForm.get('residentialAddress').get('country').value)
					this.resAddrComponent.getStateLists(this.pecRegForm.get('residentialAddress').get('country').value);
			} else {
				this.toastr.warning('No record found!');
				this.resetForm();
				this.setDefaultFeilds();
				this.pecRegForm.get('commencementDate').enable();
			}
		});
	}

	/**
	 * This method use for edit pec information
	 */
	editPECDetail() {
		this.isDeleteBtnShow = true;
		this.pecRegForm.enable();
		this.pecRegForm.get('pecNo').disable();
		this.pecRegForm.get('prcNo').disable();
		this.pecRegForm.get('rcDate').disable();
		this.pecRegForm.get('applicableRate').disable();
		this.pecRegForm.get('registrationDate').disable();
		this.pecRegForm.get('commencementDate').disable();
		this.pecRegForm.get('entry').disable();
		this.pecRegForm.get('subEntry').disable();
		this.pecRegForm.get('professionConstitution').disable();
		this.pecRegForm.get('constitution').disable();
	}

	/**
	 * This method is use for get all entries using API
	*/
	getAllEntries() {
		this.profeService.getAllEntries().subscribe(res => {
			this.entryNoArray = res.data;
		});
	}

	/**
	 * This method is use for get all sub entries using API
	 * @param entryCode -Selected entry code
	*/
	getAllSubEntries(entryCode) {
		this.profeService.getAllSubEntries(entryCode).subscribe(res => {
			this.subEntryNoArray = [];
			this.subEntryNoArray = res.data;

			if (entryCode == 'ENTRY_008') {
				this.pecRegForm.get('subEntry').get('code').setValue('008_A');
				this.pecRegForm.get('applicableRate').setValue(this.subEntryNoArray[0].taxRate);
			} else if (entryCode == 'ENTRY_009') {
				this.pecRegForm.get('subEntry').get('code').setValue('009_A');
				this.pecRegForm.get('applicableRate').setValue(this.subEntryNoArray[0].taxRate);
			} else if (entryCode == 'ENTRY_010') {
				this.pecRegForm.get('subEntry').get('code').setValue('010_A');
				this.pecRegForm.get('applicableRate').setValue(this.subEntryNoArray[0].taxRate);
			}
		});
	}

	/**
	 * This method is use for get all constitution using API
	*/
	getAllConstitution() {
		this.profeService.getAllConstitution().subscribe(res => {
			this.constitutionArray = res.data;
		});
	}

	/**
	 * This method is use for get all profession const using API
	*/
	getAllProfessionConst() {
		this.profeService.getAllProfessionConst().subscribe(res => {
			this.professionArray = res.data;
		});
	}

	/**
	 * This method is use for get all ward numbers using API
	*/
	getAllWardNos() {
		this.profeService.getAllWardNos().subscribe(res => {
			this.wardNoArray = res.data;
		});
	}

	/**
	 * This method is use for get all bank names using API
	*/
	getBankNames() {
		this.profeService.getBankNames().subscribe(res => {
			this.bankNameArray = res.data;
		});
	}

	/**
	 * This method return the title of selected subEntry
	 */
	findSubEntryName() {
		if (this.subEntryNoArray.length > 0 && this.pecRegForm.get('subEntry').get('code').value) {
			for (let i = 0; i < this.subEntryNoArray.length; i++) {
				if (this.subEntryNoArray[i].code == this.pecRegForm.get('subEntry').get('code').value) {
					return this.subEntryNoArray[i].name;
				}
			}
		}
	}

	/**
	 * This method return the title of selected subEntry
	 */
	findProfConstitution() {
		if (this.professionArray.length > 0 && this.pecRegForm.get('professionConstitution').get('code').value) {
			for (let i = 0; i < this.professionArray.length; i++) {
				if (this.professionArray[i].code == this.pecRegForm.get('professionConstitution').get('code').value) {
					return this.professionArray[i].name;
				}
			}
		}
	}


	/**
	 * Marks all controls in a form group as touched
	 * @param formGroup - The group to caress
	*/
	markFormGroupTouched(formGroup: FormGroup) {
		if (Reflect.getOwnPropertyDescriptor(formGroup, 'controls')) {
			(<any>Object).values(formGroup.controls).forEach(control => {
				if (control instanceof FormGroup) {
					// FormGroup
					this.markFormGroupTouched(control);
				} else if (control instanceof FormArray) {
					control.controls.forEach(c => {
						if (c instanceof FormGroup)
							this.markFormGroupTouched(c);
					});
				}
				// FormControl
				control.markAsTouched();
			});
		}
	}


}
