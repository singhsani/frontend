import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManageRoutes } from '../../../../../config/routes-conf';
import { PftConfig } from '../pftConfig';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ProfessionalTaxService } from '../../../../../core/services/citizen/data-services/professional-tax.service';

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
	public config = new PftConfig;

	translateKey: string = 'pecRegistrationScreen';
	prcTranslateKey: string = 'prcRegistrationScreen';
	actionBarKey: string = 'adminActionBar';
	proTranslateKey: string = 'provisionalFireNocScreen';

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
	attachmentList: any = [];
	tabIndex: number = 0;
	serviceFormId: number;
	apiCode: string = '';
	showButtons: boolean = false;

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
		private formService: FormsActionsService,
		private profeService: ProfessionalTaxService,
		private commonService: CommonService
	) {

		this.profeService.apiType = "pecForm";
		this.formService.apiType = "pecForm";
	}

	ngOnInit() {

		this.pecRegistrationFormControls();

		this.route.paramMap.subscribe(param => {
			this.isQryParamExist = false;
			this.apiCode = param.get('apiCode');

			if (this.apiCode === 'fromPRC') {
				this.isQryParamExist = true;
				let pecNoTextBox = <HTMLInputElement>document.getElementById('pecNoTextBox');
				pecNoTextBox.value = param.get('id');
				this.searchPecRegByECRCNo(null, param.get('id'), true);
			} else {
				this.serviceFormId = Number(param.get('id'));
				this.searchPecRegByECRCNo(null, '', false);
				this.getAllDocumentLists(this.serviceFormId);
			}
		});

		this.addMoreCenus();

		this.getDataFromLookups();
		this.getAllEntries();
		this.getAllConstitution();
		this.getAllProfessionConst();
		this.getAllWardNos();
		this.getBankNames();

		/**
		     * Update Permanent Address If 'officeResidentialAddressSame' is checked.
		     */
		this.pecRegForm.controls.officeAddress.valueChanges.subscribe(data => {
			if (this.pecRegForm.get('officeResidentialAddressSame').value) {
				this.onSameAddressChange({ checked: true });
				return;
			}
		});

	}

	/**
	 * this method is used to initialize the form control for pec registration form
	 */
	pecRegistrationFormControls() {

		this.pecRegForm = this.fb.group({

			id: null,
			taxFormId: null,
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
			shopAndLicenseNo: [null, Validators.required],
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
			applicableRate: [{ value: 0, disabled: true }],
			otherProfession: null,
			attachments: [],
			formStatus: null,
			officeResidentialAddressSame: null
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

	getAllDocumentLists(taxFormId) {
		this.profeService.getAllDocuments().subscribe(res => {
			if (res && res.length > 0) {
				_.forEach(res, (element) => {
					element['serviceFormId'] = taxFormId;
				});

				this.attachmentList = _.cloneDeep(res);
			}
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
		let isValid = true;
		for (let i = 0; i < this.pecRegForm.get('censusNo')['controls'].length; i++) {
			if (this.pecRegForm.get('censusNo')['controls'][i].invalid) {
				isValid = false;
				this.config.getAllErrors(this.pecRegForm.get('censusNo')['controls'][i]);
				break;
			}
		}

		if (isValid) {
			this.censusCollection.push(this.createCensus());
		}
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
			let count = this.config.getAllErrors(this.pecRegForm);
			this.commonService.openAlert("Warning", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning", "", cb => {
				if (count >= 1 && count <= 29)
					this.tabIndex = 0;
				else if (count >= 30 && count <= 32)
					this.tabIndex = 1;
				else if (count >= 33 && count <= 37)
					this.tabIndex = 2;
				else if (count >= 38 && count <= 43)
					this.tabIndex = 3;
			});
			return;
		}

		/* This is logic for check whether census repeated or not */
		var hasDuplicate = false;
		this.pecRegForm.get('censusNo').value.map(v => v.census).sort().sort((a, b) => {
			if (a === b) hasDuplicate = true;
		});

		if (hasDuplicate) {
			this.commonService.openAlert("Census/Property number should not be repeated", "", "warning");
			return;
		}
		/* This is logic for check whether census repeated or not */

		this.pecRegForm.get('formStatus').setValue('SUBMITTED');

		this.mandatoryFileCheck().then(data => {
			if (data.status) {
				this.profeService.pftSaveFormData(this.pecRegForm.getRawValue()).subscribe(res => {
					if (Object.keys(res).length) {
						// if (this.pecRegForm.get('pecNo').value) {
						// 	this.commonService.openAlert("PEC Information Updated Successful", "", "success", `PEC number is ${res.pecNo}`, cb => {
						// 		this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
						// 	});
						// } else {
						this.commonService.openAlert("PEC Registration Successful", "", "success", `Your Application Number is<br> <b>${res.uniqueId}</b> <br> Visit the department with original document`, cb => {
							this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
						});
						// }
						//this.pecRegForm.patchValue(res);
					}
				});
			} else {
				this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
				return
			}
		});

	}

	/**
	 * Method is responsible to check required file upload.
	 */
	mandatoryFileCheck() {
		return new Promise<any>((resolve, reject) => {
			this.formService.getFormData(this.serviceFormId).subscribe(respData => {
				if (respData.attachments) {
					let tempArray = [];
					respData.attachments.forEach(element => {
						tempArray.push(element.fieldIdentifier);
					});
					this.attachmentList.forEach(el => {
						if (tempArray.indexOf(el.fieldIdentifier) === -1 && el.mandatory) {
							resolve({ fileName: el.documentLabelEn, status: false });
							return;
						}
					});
					resolve({ fileName: "", status: true });
				} else {
					resolve({ fileName: "", status: true })
				}
			})
		})
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
	searchPecRegByECRCNo(event, pecNo, fromPRC) {

		if (event)
			event.stopPropagation();

		if (fromPRC && pecNo == '') {
			this.commonService.openAlert("Warning", "Enter PEC/PRC Number", "warning");
			return;
		}

		if (fromPRC) {
			this.profeService.getSearchDetails(pecNo).subscribe(res => {
				this.setValuesInForm(res.data, fromPRC);
			});
		} else {
			this.formService.getFormData(this.serviceFormId).subscribe(res => {
				this.setValuesInForm(res, fromPRC);
			});
		}

	}

	setValuesInForm(res, fromPRC) {
		if (res && Object.keys(res).length) {

			this.pecRegForm.patchValue(res);

			this.showButtons = true;

			if (this.apiCode === 'fromPRC') {
				this.serviceFormId = res.serviceFormId;
				this.getAllDocumentLists(this.serviceFormId);
			}

			/* set the census numbers */
			if (res.censusNo && res.censusNo.length > 0) {
				this.censusCollection.controls.splice(0);
				_.forEach(res.censusNo, (element) => {
					this.censusCollection.push(this.fb.group(element));
				});
			}

			if (!this.isQryParamExist && fromPRC) {
				this.pecRegForm.disable();
				this.isDeleteBtnShow = false;
				this.censusCollection.controls.forEach(control => {
					if (control instanceof FormGroup) {
						control.get('census').disable();
					}
				});
			} else if (this.isQryParamExist && fromPRC) {
				this.pecRegForm.get('pecNo').disable();
				this.pecRegForm.get('rcDate').disable();
				this.pecRegForm.get('registrationDate').disable();
				this.pecRegForm.get('commencementDate').disable();
				this.pecRegForm.get('entry').disable();
				this.pecRegForm.get('subEntry').disable();
				this.pecRegForm.get('professionConstitution').disable();
				this.pecRegForm.get('constitution').disable();
				this.pecRegForm.get('otherProfession').disable();
			}

			/* call subentry service on entry basis */
			if (res.entry.code) {
				this.getAllSubEntries(res.entry.code);
			}
			/* call state service on country basis */
			if (this.pecRegForm.get('officeAddress').get('country').value)
				this.officeAddrComponent.getStateLists(this.pecRegForm.get('officeAddress').get('country').value);
			if (this.pecRegForm.get('residentialAddress').get('country').value)
				this.resAddrComponent.getStateLists(this.pecRegForm.get('residentialAddress').get('country').value);
		} else {
			this.toastr.warning('No record found!');
			this.resetForm();
			this.pecRegForm.get('commencementDate').enable();
			this.isDeleteBtnShow = true;
			this.pecRegForm.enable();
			this.setDefaultFeilds();
			this.defaultDisabledField();
		}
	}


	/**
	 * This method is use for set default disable field
	 */
	defaultDisabledField() {
		this.pecRegForm.get('pecNo').disable();
		this.pecRegForm.get('prcNo').disable();
		this.pecRegForm.get('applicableRate').disable();
		this.pecRegForm.get('registrationDate').disable();
		this.pecRegForm.get('rcDate').disable();

		this.censusCollection.controls.splice(0);
		this.addMoreCenus();

		this.pecRegForm.get('commencementDate').enable();
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
		this.pecRegForm.get('registrationDate').disable();
		this.pecRegForm.get('commencementDate').disable();

		this.pecRegForm.get('applicableRate').disable();
		this.pecRegForm.get('entry').disable();
		this.pecRegForm.get('subEntry').disable();
		this.pecRegForm.get('professionConstitution').disable();
		this.pecRegForm.get('constitution').disable();
		this.pecRegForm.get('otherProfession').disable();

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

			if (entryCode == 'ENTRY_008' || entryCode == 'ENTRY_009' || entryCode == 'ENTRY_010') {
				let code = '';
				if (entryCode == 'ENTRY_008') code = '008_A';
				if (entryCode == 'ENTRY_009') code = '009_A';
				if (entryCode == 'ENTRY_010') code = '010_A';

				this.pecRegForm.get('subEntry.code').setValue(code);
				this.pecRegForm.get('applicableRate').setValue(this.subEntryNoArray[0].taxRate);
				this.pecRegForm.get('professionConstitution.code').setValue('OTHER');

				this.pecRegForm.get('subEntry').disable();
				this.pecRegForm.get('professionConstitution').disable();
				this.pecRegForm.get('otherProfession').setValidators([Validators.required]);
				this.pecRegForm.get('otherProfession').updateValueAndValidity();
			} else {
				this.pecRegForm.get('otherProfession').setValue(null);
				this.pecRegForm.get('otherProfession').clearValidators();
				this.pecRegForm.get('otherProfession').updateValueAndValidity();

				if (!this.pecRegForm.get('pecNo').value) {
					this.pecRegForm.get('subEntry').enable();
					this.pecRegForm.get('professionConstitution').enable();
				}
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
			this.wardNoArray = res.WARD;
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

	onSameAddressChange(event) {
		let id = this.pecRegForm.get('residentialAddress.id').value;
		if (event.checked) {
			this.pecRegForm.get('residentialAddress').patchValue(this.pecRegForm.get('officeAddress').value);
			if (this.pecRegForm.get('officeAddress').get('country').value) {
				this.resAddrComponent.getStateLists(this.pecRegForm.get('officeAddress').get('country').value);
			}
		} else {
			this.pecRegForm.get('residentialAddress').reset();
		}
		this.pecRegForm.get('residentialAddress.addressType').setValue('PF_PEC_RESIDENTIAL_ADDRESS');
		this.pecRegForm.get('residentialAddress.id').setValue(id);
	}

}
