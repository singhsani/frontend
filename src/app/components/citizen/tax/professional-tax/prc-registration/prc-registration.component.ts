import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatInput } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { PftConfig } from '../pftConfig';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ProfessionalTaxService } from '../../../../../core/services/citizen/data-services/professional-tax.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { EngineeringService } from '../../../engineering/engineering.service';

declare var $: any;

@Component({
	selector: 'app-prc-registration',
	templateUrl: './prc-registration.component.html',
	styleUrls: ['./prc-registration.component.scss'],
})
export class PrcRegistrationComponent implements OnInit, OnDestroy {

	@ViewChild('officeAddr') officeAddrComponent: any;
	@ViewChild('resAddr') resAddrComponent: any;
	@ViewChild('searchInput') searchInput: MatInput;
	public config = new PftConfig();

	translateKey: string = 'prcRegistrationScreen';
	pecTranslateKey: string = 'pecRegistrationScreen';
	actionBarKey: string = 'adminActionBar';

	// mat steps title
	stepLable1: string = "employer_detail";
	stepLable2: string = "employee_detail";

	genderArray: any = [];
	professionArray: any = [];
	wardNoArray: any = [];
	blockNoArray: any = [];
	constitutionArray: any = [];

	maxDate: Date = new Date();
	maxRcDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');// maxt Date for RC Date

	prcRegForm: FormGroup;
	totalEmployees: number = 0;

	empDetailMonth: any = null;
	empDetailYear: any = null;
	empDetailsListArray: any = [];
	employeeSlabArr: any = [];
	empDetailObj: any;
	mode: string = 'add';
	apiType = 'prcForm';

	empSlabId: number = 1;
	yearArray: Array<any>;
	monthArray: any = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
		"JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
	];
	monthIdx: number = 0;
	currentMonthIdx: number = 12;
	isPRCExist: boolean = false;
	isEmpEditable: boolean = false;
	prcInitialDate: Date;
	tabIndex: number = 0;
	modalRef: BsModalRef;

	apiCode: string = '';
	serviceFormId: number;

	pecNumber: string = null;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private modalService: BsModalService,
		private profeService: ProfessionalTaxService,
		private commonService: CommonService,
		private formService: FormsActionsService,
		private engineer: EngineeringService
	) {
	}

	ngOnInit() {
		this.prcRegFormControls();
		this.route.paramMap.subscribe(param => {
			if (param.get('apiCode') != null && param.get('id')) {
				this.apiCode = param.get('apiCode');
				this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
				this.serviceFormId = Number(param.get('id'));
				this.forPreview();
			}
		});

		this.getDataFromLookups();
		this.getEmployeeSlabRate();
		this.getAllConstitution();
		this.getAllProfessionConst();
		this.getAllWardNos();

		this.searchInput.focus();
	}

	public onTabChange(index: number, controlName, mainControl) {
		if (controlName.invalid || this.pecNumber == null) {
			this.commonService.markFormGroupTouched(controlName);
			$('.pecNumber mat-form-field .displayNone').remove();
			$('.pecNumber mat-form-field').append("<span class='displayNone' style='color:#f44336;top: -15px !important;position: inherit;'>PEC Number is required</span>");
		} else {
			$('.pecNumber mat-form-field .displayNone').remove();
			const organizationalAry = Object.keys(controlName.getRawValue());
			organizationalAry.forEach((element:any) => {
				   // push form Array data into main Controller
				if (controlName.get(element) instanceof FormArray) {
					const formGroupAry = this.engineer.createArray(controlName.get(element));
					mainControl.get(element).value.push()
					for(let i = 0; i < controlName.get(element).controls.length; i++) {
						mainControl.get(element).value.push(formGroupAry.value[i]);
						mainControl.get(element).controls.push(formGroupAry.controls[i]);
					}   
				}
				else {
					mainControl.get(element).setValue(controlName.get(element).value);
				}
			});
			this.tabIndex = index;			
		}
	}

	forPreview() {
		this.formService.getFormData(this.serviceFormId).subscribe(res => {
			this.prcRegForm.patchValue(res);
			this.prcRegForm.get('rcDate').disable();
			this.empDetailsListArray = _.orderBy(res.employeeSalarySummary, ['year', (el) => (this.monthArray.indexOf(el.month))], ["asc", "asc"]);

			/* Set the slab name in outer object i.e slabDetails*/
			if (this.empDetailsListArray.length > 0) {
				for (let i = 0; i < this.empDetailsListArray.length; i++) {
					for (let k = 0; k < this.empDetailsListArray[i].slabDetails.length; k++) {
						this.empDetailsListArray[i].slabDetails[k].name = this.empDetailsListArray[i].slabDetails[k].slab.name;
					}
				}
			}
			this.isPRCExist = true;
			this.prcRegForm.disable();
		});
	}

	ngOnDestroy() {
		if (this.modalRef)
			this.modalRef.hide();
	}

	/**
	 * this method is used to initialize the form control for prc registration form
	 */
	prcRegFormControls() {

		this.prcRegForm = this.fb.group({

			id: null,
			uniqueId: null,
			version: null,
			code: null,
			taxFormId: null,
			defaultDemandGenerated: false,
			rcDateEditAble: false,
			canEditForm: true,

			prcNo: null,
			pecNo: null,
			registrationDate: null,
			applicantFullName: null,
			applicantFullNameGuj: null,
			status: null,

			gender: this.fb.group({
				code: null, name: null,
			}),
			establishmentName: null,
			establishmentNameGuj: null,

			constitution: this.fb.group({
				code: null, name: null,
			}),
			professionConstitution: this.fb.group({
				code: null, name: null,
			}),
			entry: this.fb.group({
				code: null, name: null,
			}),
			subEntry: this.fb.group({
				code: null, name: null,
			}),

			officeAddress: this.fb.group(this.officeAddrComponent.addressControls()),
			residentialAddress: this.fb.group(this.resAddrComponent.addressControls()),
			contactNo: null,
			email: ['', ValidationService.emailValidator],
			rcDate: null,
			ward: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
			}),
			block: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
			}),
			commencementDate: null,
			vatNo: null,
			aadharNo: null,

			applicantDob: null,
			pancardNo: null,
			gstNo: null,
			centralSalesTax: null,
			shopAndLicenseNo: null,
			gujaratSalesTax: null,
			professionalTax: null,
			companyRegNo: null,

			applicableRate: 0,

			bank: this.fb.group({
				code: null, name: null,
			}),
			bankAccountNo: null,
			branchName: null,
			censusNo: null,

			creditAmount: 0,
			totalTaxAmount: 0,
			lastPaid: null,
			timeInterval: null,
			demands: [],
			empCount: 0,
			employeeSalarySummary: null,
			formStatus: null

		});

		/** set default addressType */
		this.setDefaultFeilds();

		this.prcRegForm.disable();
		this.prcRegForm.get('rcDate').enable();
	}

	setDefaultFeilds() {
		this.prcRegForm.patchValue({
			officeAddress: {
				addressType: "PF_PRC_OFFICE_ADDRESS",
			},
			residentialAddress: {
				addressType: "PF_PRC_RESIDENTIAL_ADDRESS",
			},
			creditAmount: 0,
			totalTaxAmount: 0,
			applicableRate: 0
		});
	}

	/**
	 * This method is used to enable form control when click on edit button
	 */
	editPRCDetail() {
		//this.commonService.commonAlert('Are you sure', `You want to edit ${this.prcRegForm.get('pecNo').value ? this.prcRegForm.get('pecNo').value : this.prcRegForm.get('prcNo').value} details`, 'question', 'Yes', true, '', cb => {
		this.commonService.commonAlert('Are you sure', 'You will be redirecting to PEC', 'question', 'Yes', true, '', cb => {

			let redirectUrl = ManageRoutes.getFullRoute('PEC_REG');

			//if (this.prcRegForm.get('pecNo').value) {
			this.router.navigate([redirectUrl, this.prcRegForm.get('pecNo').value, 'fromPRC']);
			//} else {
			//	this.router.navigate([redirectUrl, this.prcRegForm.get('prcNo').value, 'fromPRC']);
			//}
		}, dis => {

		});
	}

	/**
	 * @param fieldName - get the selected field's name
	 * @param date get the selected date value
	 */
	onDateChange(fieldName, date) {

		if (this.prcInitialDate) {

			if (this.prcInitialDate != this.prcRegForm.get('rcDate').value && fieldName === 'rcDate') {

				/* If PRC is exist then show alert and clear emp details */
				if ((this.prcRegForm.get('prcNo').value || this.prcRegForm.get('formStatus').value == 'SUBMITTED') && this.empDetailsListArray.length > 0) {

					this.commonService.commonAlert('Are you sure', 'If RC Date changed then all the entries will be delete', 'question', 'Yes, submit it!', true, '', cb => {

						if (this.prcRegForm.get('rcDateEditAble').value && this.prcRegForm.get('employeeSalarySummary').value.length > 0) {
							this.profeService.updatePrcForm(this.prcRegForm.getRawValue().prcNo, moment(this.prcRegForm.get('rcDate').value).format("YYYY-MM-DD")).subscribe(res => {
								this.setValuesInForm(res, 'rcDateChanged');
								if (this.prcRegForm.get('formStatus').value != 'APPROVED') {
									this.addDefaultYearMonthWiseEmployeeSummaryData();
								}								
							});
						} else {
							this.empDetailsListArray = [];
						}
					}, dis => {
						/* If cancel the alert then store previous value */
						this.prcRegForm.get(fieldName).setValue(moment(this.prcInitialDate).format("YYYY-MM-DD"));
					});
				} else {
					/* If PRC not exist and change the date then clear emp detail array */
					this.empDetailsListArray = [];
					if (this.prcRegForm.get('formStatus').value != 'APPROVED') {
						this.addDefaultYearMonthWiseEmployeeSummaryData();
					}
				}
			}
		} else {
			/* If don't inital date then store into this variable */
			this.prcInitialDate = this.prcRegForm.get('rcDate').value;
			if (this.prcRegForm.get('formStatus').value != 'APPROVED') {
				this.addDefaultYearMonthWiseEmployeeSummaryData();
			}
		}
		this.prcRegForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
	}

	addDefaultYearMonthWiseEmployeeSummaryData() {
		this.empDetailsListArray = [];
		let rcDate = new Date(this.prcRegForm.get('rcDate').value);
		let currentDate = new Date();

		for (var year = rcDate.getFullYear(); year <= currentDate.getFullYear(); year++) {
			for (var month = (year == rcDate.getFullYear()? rcDate.getMonth():0); 
					month <= (year != currentDate.getFullYear()? 11:currentDate.getMonth()); month++) {
						
				for (let i = 0; i < this.employeeSlabArr.length; i++) {
					this.employeeSlabArr[i].empCount = 0;
					this.employeeSlabArr[i].slab = {
						id: null, code: this.employeeSlabArr[i].code, incomeRange: null, taxRate: this.employeeSlabArr[i].taxRate,
						isActive: true, validFrom: this.employeeSlabArr[i].validFrom, validTo: this.employeeSlabArr[i].validTo
					};
				}
				let obj = {
					id: null, tempId: this.empSlabId++, year: year, month: this.monthArray[month], totEmpCount: 0,
					formId: null, taxFee: null, slabDetails: _.cloneDeep(this.employeeSlabArr)
				};
				this.empDetailsListArray.push(obj);
			}
		}
	}

	/**
	 * This method is used to get Gender array from API
	 */
	getDataFromLookups() {
		this.profeService.apiType = 'pecForm';
		this.profeService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
		});
	}

	/**
	 * This method is used to submit the PRC registration data
	 */
	onSubmit() {

		if (this.prcRegForm.getRawValue().pecNo) {

			/*If rc date not selected */
			if (!this.prcRegForm.get('rcDate').value) {
				let count = this.config.getAllErrors(this.prcRegForm);
				this.commonService.openAlert("Warning", "RC date is required", "warning", "", cb => {
					if (count >= 1 && count <= 25) this.tabIndex = 0;
				});
				return;
			}

			/*If employee detail not entered */
			if (this.empDetailsListArray.length == 0) {
				this.commonService.openAlert("Warning", "Enter Employee Details", "warning");
				return;
			}

			/**If entries are ok according to RC Date then proceed for registration */
			if (this.findMissingEntries().flag) {

				this.profeService.apiType = this.apiType;

				this.prcRegForm.get('formStatus').setValue('SUBMITTED');

				/*employee details clone into control empsummary */
				this.prcRegForm.get('employeeSalarySummary').setValue(_.cloneDeep(this.empDetailsListArray));

				/*count the total employee */
				this.prcRegForm.get('empCount').setValue(0);
				_.forEach(this.empDetailsListArray, (element) => {
					let num = this.prcRegForm.get('empCount').value;
					num += element.totEmpCount;
					this.prcRegForm.get('empCount').setValue(num);
				});

				this.profeService.pftSaveFormData(this.prcRegForm.getRawValue()).subscribe(res => {
					/*If form not saved then display toaster */
					if (res.data && typeof (res.data) === 'string') {
						this.toastr.warning(res.data);
					} else {

						/*If form saved successfully */
						this.isPRCExist = true;
						this.empDetailsListArray = _.cloneDeep(_.orderBy(res.employeeSalarySummary, ['year', (el) => (this.monthArray.indexOf(el.month))], ["asc", "asc"]));
						/* Set the slab name in outer object i.e slabDetails*/
						if (this.empDetailsListArray.length > 0) {
							for (let i = 0; i < this.empDetailsListArray.length; i++) {
								for (let k = 0; k < this.empDetailsListArray[i].slabDetails.length; k++) {
									this.empDetailsListArray[i].slabDetails[k].name = this.empDetailsListArray[i].slabDetails[k].slab.name;
								}
							}
						}

						// if (this.prcRegForm.get('prcNo').value) {
						// 	this.commonService.openAlert("PRC Information Updated Successful", "", "success", `PRC number is ${res.prcNo}`, cb => {
						// 		this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
						// 	});
						// } else {
						this.prcRegForm.get('rcDate').disable();
						this.prcRegForm.get('prcNo').setValue(res.prcNo);

						this.commonService.openAlert("PRC Registration Successful", "", "success", `Your Application Number is<br> <b>${res.uniqueId}</b> <br> Your Application is valid for 3 working days only. Kindly visit respective ward office with all the valid documents for approval.`, cb => {
							this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
						});

						//}
					}
				});
			} else {
				/**If entries are not ok according to RC Date then show alert with missing entries*/
				let html1 = '<div class="row warningBox">';

				_.forEach(this.findMissingEntries().data, (value) => {
					html1 += '<div class="alert alert-danger" role="alert">';
					html1 += value.month + " - " + value.year;
					html1 += '</div>';
				});

				html1 += '</div>';

				this.commonService.openAlert("Warning", " ", "warning",
					`Following employee details are mandatory <p> ${html1}</p> `);
			}

		} else {
			// 	/*If form is not valid */
			this.commonService.openAlert("Warning", "PEC is required for PRC registration", "warning");
			return;
		}
	}

	/**
	 * This method is use to find the missing employee details
	 */
	findMissingEntries() {
		let rcDate = moment(this.prcRegForm.get('rcDate').value); // RC Date
		let currentDate = moment(new Date()); // current Date
		let monthLists: any = []; // save difference between months from rcDate and currentDate

		var date = moment("2008-04-01");
		if (rcDate < date) {
			rcDate = moment("2008-04-01");
		}

		/*Calculate the months between rcDate and currentDate */
		while (currentDate > rcDate || rcDate.format('M') === currentDate.format('M')) {
			if (rcDate.format('YYYY') != currentDate.format('YYYY') || ((this.monthArray.indexOf(_.toUpper(rcDate.format('MMMM'))) + 1) <= (this.monthArray.indexOf(_.toUpper(currentDate.format('MMMM'))) + 1))) {
				monthLists.push({ year: parseInt(rcDate.format('YYYY')), month: _.capitalize(rcDate.format('MMMM')) });
			}
			rcDate.add(1, 'month');
		}
		let difference = monthLists.filter(this.comparer(this.empDetailsListArray));

		return { flag: difference.length > 0 ? false : true, data: difference };// NOSONAR

	}

	/**
	 * This method is use to return the difference from emp details and till date months
	 * @param otherArray- empDetailsListArray
	 */
	comparer(otherArray) {
		return ((current) => {
			return otherArray.filter((other) => {
				return other.year == current.year && other.month.toLowerCase() == current.month.toLowerCase()
			}).length == 0;
		});
	}

	/**
	 * This method is used to search the employer registration info by PEC no.
	 * @param pecNo - employer registartion pec no.
	 */
	searchEmpRegByECRCNo(event, ecrcNo) {
		$('.pecNumber mat-form-field .displayNone').remove();
		event.stopPropagation();

		if (ecrcNo == '') {
			this.commonService.openAlert("Warning", "Enter PEC Number", "warning");
			return;
		}

		let isMatch = ecrcNo.match(/PEC/g);
		ecrcNo = ecrcNo.toUpperCase();

		if (!isMatch) {
			this.commonService.openAlert("Warning", "Only can be search with PEC number", "warning");
			return;
		}

		this.profeService.getSearchDetails(ecrcNo).subscribe(res => {
			this.setValuesInForm(res, null);
		});
		this.pecNumber = ecrcNo;
	}

	/**
	 * This method is used to set defaul values and set API response to form  
	 * @param res - API Response
	 */
	setValuesInForm(res, flag) {
		$('.invalidFields').remove();
		/*reset fields before assigning data */
		this.prcRegForm.reset();
		this.setDefaultFeilds();
		this.empDetailsListArray = [];
		this.isPRCExist = false;
		this.prcInitialDate = undefined;

		/** if response exist data then do further process */
		if (res.data && Object.keys(res.data).length) {
			if (res.data.alertForValidation != null) {
				var invalidFields = res.data.invalidFields;
				invalidFields = invalidFields.split(',');
				let messageForInvalidFileds = '';
				for (let i = 0; i < invalidFields.length; i++) {
					const element = invalidFields[i];
					var isComma = false;
					if (element == 'applicantFullName') {
						messageForInvalidFileds += 'Applicant Full Name';
						isComma = true;
					} else if (element == 'applicantDob') {
						messageForInvalidFileds += 'Applicant DOB'; 
						isComma = true;
					} else if (element == 'gender') {
						messageForInvalidFileds += 'Gender'; 
						isComma = true;
					} else if (element == 'registrationDate') {
						messageForInvalidFileds += 'Registration Date'; 
						isComma = true;
					} else if (element == 'establishmentName') {
						messageForInvalidFileds += 'Establishment Name'; 
						isComma = true;
					} else if (element == 'contactNo') {
						messageForInvalidFileds += 'Contact Number';
						isComma = true; 
					} else if (element == 'ward') {
						messageForInvalidFileds += 'Ward No.'; 
						isComma = true;
					} else if (element == 'commencementDate') {
						messageForInvalidFileds += 'Date of Commencement'; 
						isComma = true;
					} else if (element == 'pancardNo') {
						messageForInvalidFileds += 'PAN Number'; 
						isComma = true;
					} else if (element == 'shopAndLicenseNo') {
						messageForInvalidFileds += 'Shop and License Number';
						isComma = true; 
					} else if (element == 'entry') {
						messageForInvalidFileds += 'Entry Number'; 
					} else if (element == 'subEntry') {
						messageForInvalidFileds += 'Sub Entry Number'; 
						isComma = true;
					} else if (element == 'professionConstitution') {
						messageForInvalidFileds += 'Profession'; 
						isComma = true;
					} else if (element == 'constitution') {
						messageForInvalidFileds += 'Constitution'; 
						isComma = true;
					} else if (element == 'officeAddress') {
						messageForInvalidFileds += 'Office Address'; 
						isComma = true;
					} else if (element == 'residentialAddress') {
						messageForInvalidFileds += 'Residential Address'; 
						isComma = true;
					}
					if (isComma && i < (invalidFields.length-1)) {
						messageForInvalidFileds += ', ';
						isComma = false;
					}
				}
				console.log('Please update your information ' + messageForInvalidFileds);
				$('.searchBox').append('<div class="invalidFields alert alert-warning"> Please update your information '+ messageForInvalidFileds+' </div>'); 
				this.commonService.openAlert("Warning", "", "warning", res.data.alertForValidation);
				return;
			} else {
				$('.invalidFields').remove();
			}

			if (res.data.hasPrc) {
				this.commonService.openAlert("PRC Is Already Exists", "", "warning", `Your PRC number is<br> <b>${res.data.prcNo}</b>`);
				return;
			}
			
			this.prcRegForm.patchValue(res.data);

			if (res.data.formType === 'BUS_REG_PEC') {
				this.prcRegForm.get('id').setValue(null);
				this.prcRegForm.get('taxFormId').setValue(null);
				this.prcRegForm.get('defaultDemandGenerated').setValue(false);
				this.prcRegForm.get('rcDate').enable();

				if (!res.hasPrc) {
					let count = this.config.getAllErrors(this.prcRegForm);
					if (count >= 1 && count <= 25) this.tabIndex = 0;
				}
			} else {

				/** If prcNo exist then check for rcDateEditAble is false then disable the field else enable the field */
				if (this.prcRegForm.get('prcNo').value) {
					if (this.prcRegForm.get('rcDateEditAble').value) {
						this.isPRCExist = false;
						this.prcRegForm.get('rcDate').enable();
					} else {
						this.prcRegForm.get('rcDate').disable();
						this.isPRCExist = true;
					}
				}

				this.prcInitialDate = this.prcRegForm.get('rcDate').value;

				this.empDetailsListArray = _.orderBy(res.data.employeeSalarySummary, ['year', (el) => (this.monthArray.indexOf(el.month))], ["asc", "asc"]);

				/* Set the slab name in outer object i.e slabDetails*/
				if (this.empDetailsListArray.length > 0) {
					for (let i = 0; i < this.empDetailsListArray.length; i++) {
						for (let k = 0; k < this.empDetailsListArray[i].slabDetails.length; k++) {
							this.empDetailsListArray[i].slabDetails[k].name = this.empDetailsListArray[i].slabDetails[k].slab.name;
						}
					}
				}
			}

			/*if country name is exist then Call get state list with country name */
			if (this.prcRegForm.get('officeAddress').get('country').value)
				this.officeAddrComponent.getStateLists(this.prcRegForm.get('officeAddress').get('country').value);
			if (this.prcRegForm.get('residentialAddress').get('country').value)
				this.resAddrComponent.getStateLists(this.prcRegForm.get('residentialAddress').get('country').value);
		} else {
			this.toastr.warning('No record found !');
		}
	}

	/**
	 * This method is used to get employee details from lookup
	 */
	getEmployeeSlabRate() {
		this.profeService.getEmployeeSlabRate().subscribe(res => {
			this.employeeSlabArr = [];
			this.employeeSlabArr = res.data;
		});
	}

	/**
	 * This method id used to calculate total number of employees from the table
	 */
	employeeCount() {
		this.totalEmployees = 0;
		for (let i = 0; i < this.employeeSlabArr.length; i++) {
			this.totalEmployees += Number(this.employeeSlabArr[i].empCount);
		}
	}

	/**
	 * This method use to open modal and reseting properties
	 * @param template - Property for accessing template
	 */
	openEmpModal(template: TemplateRef<any>) {

		if (!this.prcRegForm.get('pecNo').value) {
			this.commonService.openAlert("Warning", "PEC is required for PRC registration", "warning");
			return;
		}

		if (!this.prcRegForm.get('rcDate').value) {
			let count = this.config.getAllErrors(this.prcRegForm);
			this.commonService.openAlert("Warning", "RC date is required", "warning", "", cb => {
				if (count >= 1 && count <= 25) this.tabIndex = 0;
			});
			return;
		}

		if (this.prcRegForm.get('rcDate').invalid) {
			let count = this.config.getAllErrors(this.prcRegForm);
			this.commonService.openAlert("Warning", "RC date should not be greater than Commencement date", "warning", "", cb => {
				if (count >= 1 && count <= 25) this.tabIndex = 0;
			});
			return;
		}

		let rcDate = new Date(this.prcRegForm.get('rcDate').value).getFullYear();
		this.yearArray = [];

		if (rcDate < 2008) {
			rcDate = 2008;
		}

		while (rcDate <= new Date().getFullYear()) {
			this.yearArray.push(rcDate);
			rcDate++;
		}

		this.empDetailYear = null;
		this.empDetailMonth = null;

		this.clearModalFields();

		this.modalRef = this.modalService.show(
			template, Object.assign({}, { class: 'gray modal-lg' })
		);
	}

	/**
	 * This method use for reset modal fields
	 */
	clearModalFields() {
		this.mode = 'add';
		this.totalEmployees = 0;
		this.isEmpEditable = false;

		let dateStr = new Date(this.prcRegForm.get('rcDate').value);

		if (this.empDetailYear) {

			if (this.empDetailYear === (new Date).getFullYear()) {
				/** If the selected year will be same with current year*/
				let dateStr1 = new Date(this.prcRegForm.get('rcDate').value);
				this.monthIdx = dateStr1.getFullYear() == new Date().getFullYear() ? dateStr1.getMonth() : 0;
				if (this.monthArray.indexOf(this.empDetailMonth) > new Date().getMonth()) {
					this.monthIdx = 0;
				}
			} else {
				if (this.empDetailYear === dateStr.getFullYear()) {
					this.monthIdx = dateStr.getMonth();
				} else {
					if (this.empDetailYear == 2008) {
						this.monthIdx = 3;
					} else {
						this.monthIdx = 0;
					}
				}
			}

			this.currentMonthIdx = this.empDetailYear == new Date().getFullYear() ? (new Date().getMonth() + 1) : 12;
		} else {
			this.monthIdx = dateStr.getMonth();
			this.currentMonthIdx = dateStr.getFullYear() == new Date().getFullYear() ? (new Date().getMonth() + 1) : 12;
		}

		for (let i = 0; i < this.employeeSlabArr.length; i++) {
			this.employeeSlabArr[i].empCount = '';
		}
	}

	/**
	 * This method use to edit info and open modal
	 * @param template - Property for accessing template
	 * @param obj - Get exsting object 
	 */
	editEmpModal(template: TemplateRef<any>, obj) {

		if (!this.prcRegForm.get('rcDate').value) {
			let count = this.config.getAllErrors(this.prcRegForm);
			this.commonService.openAlert("Warning", "RC date is required", "warning", "", cb => {
				if (count >= 1 && count <= 25) this.tabIndex = 0;
			});
			return;
		}

		this.isEmpEditable = true;

		this.mode = 'edit';
		this.empDetailObj = obj;
		this.totalEmployees = obj.totEmpCount;
		this.empDetailMonth = obj.month;
		this.empDetailYear = obj.year;
		this.employeeSlabArr = _.cloneDeep(obj.slabDetails);

		this.modalRef = this.modalService.show(
			template, Object.assign({}, { class: 'gray modal-lg' })
		);
	}

	/**
	 * This method use for submit modal value and hide modal
	 */
	onSubmitEmpDetails() {
		if (!this.empDetailMonth) {
			this.commonService.openAlert("Warning", "Please select month", "warning");
			return;
		}

		if (!this.empDetailYear) {
			this.commonService.openAlert("Warning", "Please select year", "warning");
			return;
		}

		if (this.totalEmployees < 0) {
			this.commonService.openAlert("Warning", "Enter employee details", "warning");
			return;
		}

		if (this.mode === 'add') {

			/*set slabDetails object*/
			for (let i = 0; i < this.employeeSlabArr.length; i++) {
				this.employeeSlabArr[i].empCount = this.employeeSlabArr[i].empCount == '' ? 0 : Number(this.employeeSlabArr[i].empCount)
				this.employeeSlabArr[i].slab = {
					id: null, code: this.employeeSlabArr[i].code, incomeRange: null, taxRate: this.employeeSlabArr[i].taxRate,
					isActive: true, validFrom: this.employeeSlabArr[i].validFrom, validTo: this.employeeSlabArr[i].validTo
				};
			}

			/*set outer object*/
			let obj = {
				id: null, tempId: this.empSlabId++, year: this.empDetailYear, month: this.empDetailMonth, totEmpCount: this.totalEmployees,
				formId: null, taxFee: null, slabDetails: _.cloneDeep(this.employeeSlabArr)
			};

			/* Check if selected month and year is already present in array or not */
			let isMonthAndYearExist = 0;
			isMonthAndYearExist = _.findIndex(this.empDetailsListArray, (arr) => { return arr.month == obj.month && arr.year == obj.year; });

			if (isMonthAndYearExist >= 0) {
				this.toastr.warning(`Record for ${_.capitalize(obj.month)} ${obj.year} is already exist`);
			} else {
				this.empDetailsListArray.push(obj);
			}

			this.empDetailsListArray = _.orderBy(this.empDetailsListArray, ['year', (el) => (this.monthArray.indexOf(el.month))], ["asc", "asc"]);

		} else {

			_.forEach(this.empDetailsListArray, (element) => {
				/** Without PRC number search update the list */
				if ((element.tempId && this.empDetailObj.tempId) && (element.tempId == this.empDetailObj.tempId)) {

					element.totEmpCount = this.totalEmployees;
					element.slabDetails = _.cloneDeep(this.employeeSlabArr);

					this.modalRef.hide();

				} else if ((element.id && this.empDetailObj.id) && (element.id == this.empDetailObj.id)) {
					/** With PRC number search update the list */
					element.totEmpCount = this.totalEmployees;
					element.slabDetails = _.cloneDeep(this.employeeSlabArr);

					/*If prc exist then update the summary with single entry*/
					if (this.isPRCExist) {
						this.profeService.saveSummary(element).subscribe(res => {
							if (Object.keys(res).length) {
								this.toastr.success('Employee detail updated successful');
								this.modalRef.hide();
							}
						});
					}
				}
			});

		}

		this.clearModalFields();

	}

	/**
	 * This method use for the delete saved record
	 * @param idx - Index of the record
	 */
	deleteRecord(idx: number) {
		this.empDetailsListArray.splice(idx, 1);
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
	 * This method is use for get all profession constitution using API
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
			this.wardNoArray = res;
		});
	}

	getAllBlockNos(event) {
		this.profeService.getAllBlockNos(event).subscribe(res => {
			this.blockNoArray = res;
		});
	}

	/**
	 * filter month array according to current month
	 * @param event - Selected year
	 */
	empYearChange(event) {
		this.empDetailMonth = null;
		if (event === (new Date).getFullYear()) {
			/** If the selected year will be same with current year*/

			let dateStr = new Date(this.prcRegForm.get('rcDate').value);

			this.monthIdx = dateStr.getFullYear() == new Date().getFullYear() ? dateStr.getMonth() : 0;
			this.currentMonthIdx = (new Date().getMonth() + 1);

			if (this.monthArray.indexOf(this.empDetailMonth) > new Date().getMonth()) {
				this.empDetailMonth = null;
				this.monthIdx = 0;
				this.currentMonthIdx = (new Date().getMonth() + 1);
			}
		} else {
			/** If the selected year will be same with rcDate year*/
			if (event === new Date(this.prcRegForm.get('rcDate').value).getFullYear()) {

				if (this.monthArray.indexOf(this.empDetailMonth) < new Date(this.prcRegForm.get('rcDate').value).getMonth()) {
					this.empDetailMonth = null;
					this.monthIdx = new Date(this.prcRegForm.get('rcDate').value).getMonth();
					this.currentMonthIdx = 12;
				} else {
					this.monthIdx = new Date(this.prcRegForm.get('rcDate').value).getMonth();
					this.currentMonthIdx = 12;
				}
			} else {
				if (event == 2008) {
					this.monthIdx = 3;
					this.currentMonthIdx = 12;
				} else {
					this.monthIdx = 0;
					this.currentMonthIdx = 12;
				}
			}
		}
	}

}