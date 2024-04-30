import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManageRoutes } from '../../../../../config/routes-conf';
import { PftConfig } from '../pftConfig';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ProfessionalTaxService } from '../../../../../core/services/citizen/data-services/professional-tax.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { ApplicantDetailsComponent } from 'src/app/shared/components/applicant-details/applicant-details.component';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { EngineeringService } from '../../../engineering/engineering.service';
import { LicenseConfiguration } from '../../../licences/license-configuration';

declare var $: any;

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

	employerDetail: FormGroup;
	bankDetail: FormGroup;
	registrationDetail: FormGroup;
	actDetail: FormGroup;
	attachmentdetail : FormGroup;

	genderArray: any = [];
	professionArray: any = [];
	wardNoArray: any = [];
	blockNoArray: any = [];
	constitutionArray: any = [];
	bankNameArray: any = [];
	entryNoArray: any = [];
	subEntryNoArray: any = [];
	attachmentList: any = [];
	tabIndex: number = 0;
	serviceFormId: number;
	apiCode: string = '';
	showButtons: boolean = false;
	isFormDisable:boolean=false;

	dobMaxDate = moment(new Date()).subtract("18", "years").format("YYYY-MM-DD");
	maxDate: Date = new Date();
	maxCommDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');// maxt Date for commencement
	pecRegForm: FormGroup;
	isDeleteBtnShow: boolean = true;
	isQryParamExist: boolean = false;

	isCensusNo: boolean = true;
	selectedCensusNo: any = "CensusNo";
	isCensusSelected: boolean = true;
	placeHolderMessage = null;
	CanEdit: boolean = true;
	censusNo: boolean = true;
	isBlockNo: boolean = false;
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();


	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private formService: FormsActionsService,
		private profeService: ProfessionalTaxService,
		private alertService: AlertService,
		private commonService: CommonService,
		private dialog: MatDialog,
		private engineer: EngineeringService
	) {

		this.profeService.apiType = "pecForm";
		this.formService.apiType = "pecForm";
	}

	ngOnInit() {

		this.pecRegistrationFormControls();
		this.pecRegistrationFornControlsStepWise();

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
			if (this.employerDetail.get('officeResidentialAddressSame').value) {
				this.onSameAddressChange({ checked: true });
				return;
			}
		});

	}

	pecRegistrationFornControlsStepWise() {
		this.employerDetail = this.fb.group({
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
			mobileNo: null,
			email: [null, ValidationService.emailValidator],
			ward: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
			}),
			block: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
			}),
			applicantDob: null,
			rcDate: [{ value: null, disabled: true }],
			commencementDate: null,
			vatNo: null,
			aadharNo: null,
			officeAddress: this.fb.group(this.officeAddrComponent.addressControls()),
			residentialAddress: this.fb.group(this.resAddrComponent.addressControls()),
			officeResidentialAddressSame: null
		});

		this.bankDetail = this.fb.group({
			bankAccountNo: null,
			bank: this.fb.group({
				code: [null], name: null,
			}),
			branchName: null
		});

		this.registrationDetail = this.fb.group({
			pancardNo: [null, ValidationService.panValidator],
			centralSalesTax: null,
			shopAndLicenseNo: null,
			gujaratSalesTax: null,
			professionalTax: null,
			companyRegNo: null,
			gstNo: [null],
			censusNo: this.fb.array([])
		});

		this.actDetail = this.fb.group({
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
			otherProfession: [null]
		});

		this.attachmentdetail = this.fb.group({
			attachments : [null]
		});
		
		this.commonService.createCloneAbstractControl(this.employerDetail,this.pecRegForm);
		this.commonService.createCloneAbstractControl(this.bankDetail,this.pecRegForm);
		this.commonService.createCloneAbstractControl(this.registrationDetail,this.pecRegForm);
		this.commonService.createCloneAbstractControl(this.actDetail,this.pecRegForm);
		this.commonService.createCloneAbstractControl(this.attachmentdetail,this.pecRegForm);
		
		this.setDefaultFeildsStepWise();		
	}

	setDefaultFeildsStepWise() {
		this.employerDetail.patchValue({
			officeAddress: {
				addressType: "PF_PEC_OFFICE_ADDRESS",
			},
			residentialAddress: {
				addressType: "PF_PEC_RESIDENTIAL_ADDRESS",
			},
			gender: this.fb.group({
				code: ['MALE', Validators.required],
			}),
			registrationDate: moment(new Date()).format('YYYY-MM-DD')
		});
		this.actDetail.patchValue({			
			applicableRate: 0
		});
	}

	public onTabChange(index: number, controlName, mainControl) {
		if (controlName.invalid) {
			this.commonService.markFormGroupTouched(controlName);
		} else {
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
			if(mainControl.get('censusNo').value){
				/*If census is duplicate */
			var hasDuplicate = false;
			this.pecRegForm.get('censusNo').value.map(v => v.census).sort().sort((a, b) => {
				if (a === b) hasDuplicate = true;
			});

			if (hasDuplicate) {
				this.commonService.openAlert("Census/Property number should not be repeated", "", "warning");
				return;
			}
			/*If census is duplicate */

		}
			//this.tabIndex = index;
			if (!this.CanEdit) {
				setTimeout( function(){ 
					$('.closeAttachFile').remove();
					$('.subEntry ng-select').addClass('ng-select-disabled');
					$('.profession ng-select').addClass('ng-select-disabled');
				}, 300);
			}
			if(index == 5 || (index == 1)){
				this.saveFrom(controlName, index)
			}
		}
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
			status: null,

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
			mobileNo:null,
			email: [null, ValidationService.emailValidator],
			ward: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
			}),
			block: this.fb.group({
				wardzoneId: null,
				wardzoneName: null
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
				code: [null], name: null,
			}),
			branchName: null,

			// third step controls
			pancardNo: [null],
			centralSalesTax: null,
			shopAndLicenseNo: null,
			gujaratSalesTax: null,
			professionalTax: null,
			companyRegNo: null,
			gstNo: [null],
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
			otherProfession: [null],
			attachments: [],
			formStatus: null,
			officeResidentialAddressSame: null,
			apiType : "pecForm",
			canEdit: true,

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

	onConstitutionChange(event) {
		if (event == 'COMPANY') {
			for (let file of this.attachmentList) {
				if (file['documentIdentifier'] == 'MOU') {
					file['mandatory'] = true;
				}
			}
		}else{
			for (let file of this.attachmentList) {
				if (file['documentIdentifier'] == 'MOU') {
					file['mandatory'] = false;
				}
			}
		}
	}

	/**
	 * Declared census formArray property
	 */
	get censusCollection(): FormArray {
		return this.registrationDetail.get('censusNo') as FormArray;
	};

	/**
	 * This method is use to initialise formGroup for census array
	 */
	createCensus(): FormGroup {
		return this.fb.group({
			census: [null, Validators.required]
		});
	}

	/** this method is use for set seleted input filed for Census or property number */
	selectCensusOrPropertyNo(value) {
		if (value.value == 'CensusNo') {
			this.isCensusNo = true;
			this.isCensusSelected = true;
		} else {
			this.isCensusNo = false;
			this.isCensusSelected = false;
		}
	}

	/**
	 * This method is use for check isExistPropertyNo or not 
	 * @param propertyNo -entered property code
	*/
	isExistPropertyNo(propertyNo?: any, index?: any) {
		var censusNoArray = this.registrationDetail.get('censusNo').value;
		delete censusNoArray[censusNoArray.length - 1];
		censusNoArray.forEach(element => {
			if (censusNoArray.length > 1) {
				if (element.census == propertyNo) {
					this.commonService.openAlert("Error", "Property/Census Number Already Exists.", "warning");
					this.removeCensus(index);
					return false;
				}
			}
		});
		 if (propertyNo){
			if(propertyNo.length < 16 ){
				this.removeCensus(index);
			}else{
				this.registrationDetail.get('censusNo').value.forEach(ele =>{
					if(propertyNo == ele.census ){
						this.commonService.openAlert("Census/Property number should not be repeated", "", "warning");
						this.removeCensus(index);
					}
				})
			}
		 }
		// 	this.profeService.isExistPropertyNoCheck(propertyNo).subscribe(res => {
		// 		if (res.list) {
		// 			this.alertService.confirm(res.data[0]);
		// 			var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
		// 				if (!isConfirm) {
		// 					this.removeCensus(index);
		// 				}
		// 				subConfirm.unsubscribe();
		// 			});
		// 		}
		// 	}, (err) => {
		// 		if (err.error[0])
		// 			this.commonService.openAlert("Error", err.error[0].message, "warning");
		// 		this.removeCensus(index);
		// 	});
	}

	/**
	 * This method use to add more census number
	 */
	addMoreCenus() {
		this.isCensusNo = true;
		let isValid = true;
		this.selectedCensusNo = false
		// if (this.registrationDetail.get('censusNo')['controls'].length == 5) {
		// 	this.toastr.warning('maximum 5 census number allow');
		// 	return;
		// }
		for (let i = 0; i < this.registrationDetail.get('censusNo')['controls'].length; i++) {
			if (this.registrationDetail.get('censusNo')['controls'][i].invalid) {
				isValid = false;
				if (this.isCensusSelected) {
					this.placeHolderMessage = "Census No is Required";
				} else {
					this.placeHolderMessage = "Property No is Required";
				}
				this.config.getAllErrors(this.registrationDetail.get('censusNo')['controls'][i]);
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

		this.actDetail.get('subEntry').get('code').setValue(null);
		this.actDetail.get('applicableRate').setValue(0);
		this.actDetail.get('professionConstitution').get('code').setValue(null);
		this.actDetail.get('constitution').get('code').setValue(null);

		this.getAllSubEntries(event);
		if(event == "ENTRY_009" &&event == "ENTRY_010" ){
			this.actDetail.get('otherProfession').setValidators([Validators.required]);
			this.actDetail.get('otherProfession').updateValueAndValidity();
		}else{
			this.actDetail.get('otherProfession').clearValidators();
			this.actDetail.get('otherProfession').updateValueAndValidity();
		}
	}

	onGstNumber(event) {
		if (event.target.value.length < 15) {
			this.employerDetail.get('gstNo').setValue(null);
		}
	}
	/**
	 * This method is use for set applicable rate from subEnry
	 * @param event - selected value of subEntry
	 */
	onSubEntryChange(event) {
		if (event)
			this.actDetail.get('applicableRate').setValue(event.taxRate);
		else
			this.actDetail.get('applicableRate').setValue(null);
	}

	/**
	 * This method use for set the date in form controls
	 * @param fieldName - get the selected field's name
	 * @param date get the selected date value
	 */
	onDateChange(fieldName, date) {
		this.pecRegForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
		this.employerDetail.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use for set applicant details on submit
	 */
	getUserDetailsAndSubmit() {
		if (this.pecRegForm.get('entry').get('code').value == 'ENTRY_008'  || this.pecRegForm.get('entry').get('code').value == 'ENTRY_009' || this.pecRegForm.get('entry').get('code').value == 'ENTRY_010') {
			this.pecRegForm.get('professionConstitution').get('code').setValue('OTHER');
		}
		this.onSubmit();
	}

	/**
	 * This method is used to submit the PEC registration data
	 */
	onSubmit() {
		if (this.pecRegForm.invalid) {
			let count = this.config.getAllErrors(this.pecRegForm);
			this.commonService.openAlert("Warning", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning", "", cb => {
				switch (true) {
					case (count <= 30):
						this.licenseConfiguration.currentTabIndex = 0;
						break;
					case (count <= 33):
						this.licenseConfiguration.currentTabIndex = 1;
						break;
					case (count <= 41):
						this.licenseConfiguration.currentTabIndex = 2;
						break;
					case (count <= 46):
						this.licenseConfiguration.currentTabIndex = 3;
						break;
					default:
						this.licenseConfiguration.currentTabIndex = 0;
				}
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
				this.pecRegForm.get('pancardNo').setValue(this.pecRegForm.get('pancardNo').value.toUpperCase());
				this.pecRegForm.get('gstNo').setValue(this.pecRegForm.get('gstNo').value ? this.pecRegForm.get('gstNo').value.toUpperCase() : null);
				this.profeService.pftSaveFormData(this.pecRegForm.getRawValue()).subscribe(res => {
					if (Object.keys(res).length) {
						// if (this.pecRegForm.get('pecNo').value) {
						// 	this.commonService.openAlert("PEC Information Updated Successful", "", "success", `PEC number is ${res.pecNo}`, cb => {
						// 		this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
						// 	});
						// } else {
						this.commonService.openAlert("PEC Application Submitted Successfully", "", "success", `Your Application Number is<br> <b>${res.uniqueId}</b> <br> Your Application is valid for 3 working days only. Kindly visit respective ward office with all the valid documents for approval.`, cb => {
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
		this.employerDetail.reset();
		this.bankDetail.reset();
		this.registrationDetail.reset();
		this.actDetail.reset();
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
				if (res.formStatus == "SUBMITTED") {
					res.canEditForm = false;
					this.CanEdit = res.canEditForm;
					this.isBlockNo = true;
					this.isFormDisable=true;
					this.pecRegForm.disable();
					this.employerDetail.disable();
					this.bankDetail.disable();
					this.registrationDetail.disable();
					this.actDetail.disable();			
					this.isDeleteBtnShow = false;
				}
				if (!(res.censusNo.length == 0)) {
					if (res.censusNo[0].census.length > 16) {
						this.censusNo = true;
						this.selectedCensusNo = true;
					}
					else {
						this.censusNo = false;
					}
				}
				if (res.formStatus == "SUBMITTED") {
					this.pecRegForm.disable();
					this.pecRegForm.get('canEdit').setValue(false)

				}
				if(res.formStatus == "DRAFT"){
					this.getAllBlockNos(res.wardId)
					if(res.officeResidentialAddressSame == true){
						this.onSameAddressChange({ checked: true });
					}
				}
			});

		}

	}
	isFieldDisabled(): boolean {
		return this.employerDetail.get('applicantDob').disabled;
	  }

	setValuesInForm(res, fromPRC) {
		if (res && Object.keys(res).length) {

			this.pecRegForm.patchValue(res);
			this.employerDetail.patchValue(res);
			this.bankDetail.patchValue(res);
			this.registrationDetail.patchValue(res);
			this.actDetail.patchValue(res);

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
				this.employerDetail.disable();
				this.bankDetail.disable();
				this.registrationDetail.disable();
				this.actDetail.disable();

				this.isDeleteBtnShow = false;
				this.censusCollection.controls.forEach(control => {
					if (control instanceof FormGroup) {
						control.get('census').disable();
					}
				});
			} else if (this.isQryParamExist && fromPRC) {
				this.employerDetail.get('pecNo').disable();
				this.employerDetail.get('rcDate').disable();
				this.employerDetail.get('registrationDate').disable();
				this.employerDetail.get('commencementDate').disable();
				this.actDetail.get('entry').disable();
				this.actDetail.get('subEntry').disable();
				this.actDetail.get('professionConstitution').disable();
				this.actDetail.get('constitution').disable();
				this.actDetail.get('otherProfession').disable();
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
			this.employerDetail.get('commencementDate').enable();
			this.isDeleteBtnShow = true;
			this.pecRegForm.enable();
			this.employerDetail.enable();
			this.bankDetail.enable();
			this.registrationDetail.enable();
			this.actDetail.enable();
			this.setDefaultFeilds();
			this.setDefaultFeildsStepWise();
			this.defaultDisabledField();
		}
	}


	/**
	 * This method is use for set default disable field
	 */
	defaultDisabledField() {
		this.employerDetail.get('pecNo').disable();
		this.employerDetail.get('prcNo').disable();
		this.employerDetail.get('applicableRate').disable();
		this.employerDetail.get('registrationDate').disable();
		this.employerDetail.get('rcDate').disable();

		this.censusCollection.controls.splice(0);
		this.addMoreCenus();

		this.employerDetail.get('commencementDate').enable();
	}

	/**
	 * This method use for edit pec information
	 */
	editPECDetail() {
		this.isDeleteBtnShow = true;
		this.pecRegForm.enable();
		this.employerDetail.enable();
		this.bankDetail.enable();
		this.registrationDetail.enable();
		this.actDetail.enable();
		this.employerDetail.get('pecNo').disable();
		this.employerDetail.get('prcNo').disable();
		this.employerDetail.get('rcDate').disable();
		this.employerDetail.get('registrationDate').disable();
		this.employerDetail.get('commencementDate').disable();

		this.actDetail.get('applicableRate').disable();
		this.actDetail.get('entry').disable();
		this.actDetail.get('subEntry').disable();
		this.actDetail.get('professionConstitution').disable();
		this.actDetail.get('constitution').disable();
		this.actDetail.get('otherProfession').disable();

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

				this.actDetail.get('subEntry.code').setValue(code);
				this.actDetail.get('applicableRate').setValue(this.subEntryNoArray[0].taxRate);
				this.actDetail.get('professionConstitution.code').setValue('OTHER');

				this.actDetail.get('subEntry').disable();
				this.actDetail.get('professionConstitution').disable();
				this.actDetail.get('otherProfession').setValidators([Validators.required]);
				this.actDetail.get('otherProfession').updateValueAndValidity();
			} else {
				this.actDetail.get('otherProfession').setValue(null);
				this.actDetail.get('otherProfession').clearValidators();
				this.actDetail.get('otherProfession').updateValueAndValidity();
				if (!this.employerDetail.get('pecNo').value) {
					this.actDetail.get('subEntry').enable();
					this.actDetail.get('professionConstitution').enable();
				}
			}
			if(this.actDetail.get('subEntry').get('code').value && this.actDetail.get('professionConstitution').get('code').value){
				this.actDetail.get('subEntry').disable();
				this.actDetail.get('professionConstitution').disable();
				
			}else{
				this.actDetail.get('subEntry').enable();
				this.actDetail.get('professionConstitution').enable();
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
			this.wardNoArray = res;
		});
	}

	getAllBlockNos(event) {
		if (event == undefined) {
			return false;
		}
		this.profeService.getAllBlockNos(event).subscribe(res => {
			this.blockNoArray = res;
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
		if (this.subEntryNoArray.length > 0 && this.actDetail.get('subEntry').get('code').value) {
			for (let i = 0; i < this.subEntryNoArray.length; i++) {
				if (this.subEntryNoArray[i].code == this.actDetail.get('subEntry').get('code').value) {
					return this.subEntryNoArray[i].name;
				}
			}
		}
	}

	/**
	 * This method return the title of selected subEntry
	 */
	findProfConstitution() {
		if (this.professionArray.length > 0 && this.actDetail.get('professionConstitution').get('code').value) {
			for (let i = 0; i < this.professionArray.length; i++) {
				if (this.professionArray[i].code == this.actDetail.get('professionConstitution').get('code').value) {
					return this.professionArray[i].name;
				}
			}
		}
	}

		onSameAddressChange(event) {
		let id = this.employerDetail.get('residentialAddress.id').value;
		if (event.checked) {
		 this.employerDetail.get('residentialAddress').disable();
		  this.employerDetail.get('residentialAddress').patchValue(this.employerDetail.get('officeAddress').value);
		  if (this.employerDetail.get('officeAddress').get('country').value) {
			this.resAddrComponent.getStateLists(this.employerDetail.get('officeAddress').get('country').value);
		  }
		} else {
		  this.employerDetail.get('residentialAddress').reset();
		  this.employerDetail.get('residentialAddress').enable();
		  const officeAddress = this.employerDetail.get('officeAddress').value;
		  this.employerDetail.get('residentialAddress.city').setValue(officeAddress.city);
		  this.employerDetail.get('residentialAddress.state').setValue(officeAddress.state);
		  this.employerDetail.get('residentialAddress.country').setValue(officeAddress.country);
		}
	  
		this.employerDetail.get('residentialAddress.addressType').setValue('PF_PEC_RESIDENTIAL_ADDRESS');
		this.employerDetail.get('residentialAddress.id').setValue(id);
	  }

	patchValue() {
		this.pecRegForm.patchValue(this.dummyJSON);
	}

	dummyJSON: any = {
		"code": null,
		"fieldView": null,
		"fieldList": null,
		"creditAmount": 0,
		"totalTaxAmount": 0,
		"lastPaid": null,
		"timeInterval": null,
		"demands": null,
		"defaultDemandGenerated": false,
		"status": "ACTIVE",
		"pecNo": null,
		"prcNo": null,
		"registrationDate": "2019-12-09",
		"applicantFullNameGuj": null,
		"applicantFullName": "Ramu Kaka",
		"gender": {
			"code": "MALE",
			"name": null
		},
		"establishmentName": "Tea Stall",
		"contactNo": "8962749074",
		"mobileNo":"8962749074",
		"email": "chetan.porwal@nascentinfo.com",
		"ward": {
			"wardzoneId": "5",
			"wardzoneName": null
		},
		"block": {
			"wardzoneId": "22",
			"wardzoneName": null
		},
		"applicantDob": "1970-01-01",
		"rcDate": null,
		"commencementDate": "2021-04-01",
		"vatNo": null,
		"aadharNo": null,
		"officeAddress": {
			"addressType": "PF_PEC_OFFICE_ADDRESS",
			"buildingName": "44",
			"streetName": "Sayaji Rao",
			"landmark": "VMC",
			"area": "Akota",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "435345",
			"buildingNameGuj": "દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
			"streetNameGuj": null,
			"landmarkGuj": null,
			"areaGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ",
			"stateGuj": null,
			"districtGuj": null,
			"cityGuj": null,
			"countryGuj": null
		},
		"residentialAddress": {
			"addressType": "PF_PEC_RESIDENTIAL_ADDRESS",
			"buildingName": "44",
			"streetName": "Sayaji Rao",
			"landmark": "VMC",
			"area": "Akota",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "435345",
			"buildingNameGuj": "દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
			"streetNameGuj": null,
			"landmarkGuj": null,
			"areaGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ",
			"stateGuj": null,
			"districtGuj": null,
			"cityGuj": null,
			"countryGuj": null
		},
		"bankAccountNo": "443534543543534",
		"bank": {
			"code": "ALLAHABAD_BANK",
			"name": null
		},
		"branchName": "Teen Darwaza",
		"pancardNo": "ABCDE1234F",
		"centralSalesTax": null,
		"shopAndLicenseNo": "sdfsdfsdfsdf",
		"gujaratSalesTax": null,
		"professionalTax": null,
		"companyRegNo": "sdfsdfsdf",
		"gstNo": "29ABCDE1234F2Z5",
		"censusNo": [
			{
				"census": "01-01-000-111-000-020"
			}
		],
		"entry": {
			"code": "ENTRY_002",
			"name": null
		},
		"subEntry": {
			"code": "002_A",
			"name": null
		},
		"constitution": {
			"code": "INDIVIDUAL",
			"name": null
		},
		"professionConstitution": {
			"code": "INSURANCE_AGENT",
			"name": null
		},
		"applicableRate": 2000,
		"otherProfession": null,
		"attachments": [],
		"formStatus": "SUBMITTED",
		"officeResidentialAddressSame": true
	};


	saveFrom(control, index){
		if(control.valid){
		  this.formService.saveFormData(this.pecRegForm.getRawValue()).subscribe(
			res => {
			  this.pecRegForm.patchValue(res);
			  this.licenseConfiguration.currentTabIndex = index
			},
			err => {
			 this.commonService.openAlert('error', err, 'error')
			}
		  )
		}
	  }

}
