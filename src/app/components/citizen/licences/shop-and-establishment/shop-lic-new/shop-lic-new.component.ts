import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel, MatDialog, MatDialogConfig } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

import {NewShopEstablishmentService} from './../common/services/new-shop-establishment.service'

@Component({
	selector: 'app-shop-lic-new',
	templateUrl: './shop-lic-new.component.html',
	styleUrls: ['./shop-lic-new.component.scss']
})
export class ShopLicNewComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;
	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicNewForm: FormGroup;
	// addList: FormArray;

	translateKey: string = 'shopLicNewScreen';

	formId: number;
	apiCode: string;

	// Step Titles
	stepLable1: string = "Applicant Basic Details";
	stepLable2: string = "Step";

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

	gender = [];
	relationship = [];
	businessCategory = [];
	wardNo = [];

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		public dialog: MatDialog,
		private newShopEstablishmentService:NewShopEstablishmentService
	) { }

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

			this.shopLicNewForm.patchValue(res);
			this.showButtons = true;
			res.employerFamilyList.forEach(app => {
				(<FormArray>this.shopLicNewForm.get('employerFamilyList')).push(this.createArray(app));
			});

		});
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
	* Method is used to get lookup data
	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.relationship = res.SHOP_LIC_EMPLOYEES_PERSON_RELATIONSHIP;
			this.businessCategory = res.SHOP_LIC_BUSINESS_CATEGORY;
			this.wardNo = res.SHOP_LIC_WARD_NO;
			this.gender = res.GENDER
		});
	}

	/**
	* Method is used to set form controls
	*/
	shopLicNewFormControls() {
		this.shopLicNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-LIC',

			relationWithApplicant: {},

			/* Step 2 controls start */
			establishmentName: [null, Validators.required], //2
			situationOfEstablishment: [null, Validators.required], //4
			noOfHumanWorking: this.fb.group({
				code: ['YES'],
				name: [null],
			}), //5
			assessmentDoneByVMC: this.fb.group({
				code: ['YES'],
				name: [null],
			}), //6
			propertyTaxNo: [null, Validators.required], //7
			wardNo: this.fb.group({
				code: [null],
				name: [null],
			}), //8
			aadharNumber: null, //9
			professionalTaxPECNo: null, //10
			prcNo: null, //11
			applicantVimaAmountPaid: this.fb.group({
				code: ['YES'],
				name: [null],
			}), //12
			number: null, //13
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),//3
			/* Step 2 controls end */

			/* Step 3 controls start */
			situationOfOffice: [null, Validators.required], //14
			nameOfEmployer: [null, Validators.required], //15
			residentialAddressOfEmployee: [null, Validators.required], //16
			nameOfManager: [null, Validators.required], //17
			// ResidentialAddressOfManager: [null, Validators.required], // not declare on sheet
			categoryOfBusiness: this.fb.group({
				code: [null],
				name: [null],
			}), //18
			subCategoryOfBusiness: this.fb.group({
				code: [null],
				name: [null],
			}), //19
			nameOfBusiness: [null, Validators.required], //19
			commencementOfBusinessDate: [null, Validators.required], //19
			/* Step 3 controls end */

			periodFrom: [null],
			periodTo: [null],
			newRegistration: [null],
			renewal: [null],
			adminCharges: [null],
			netAmount: [null],
			familyEmployedInEstablishment: ['setFamilyEmployedInEstablishment'],

			employerFamilyList: this.fb.array([]),

			totalAdultEmployerFamily: [null],
			totalYoungEmployerFamily: [null],
			totalManEmployerFamily: [null],
			totalWomenEmployerFamily: [null],
			totalFamilyMembers: [null],

			partnerList: this.fb.array([]),

			totalAdultPartner: [null],
			totalYoungPartner: [null],
			totalManPartner: [null],
			totalWomenPartner: [null],
			totalPartner: [null],

			// totalAdultEmployee: [null],
			// totalYoungEmployee: [null],
			// totalManEmployee: [null],
			// totalWomenEmployee: [null],
			// totalEmployee: [null],
			enterHoliday: [null],

			/*  */
			attachments: [''],
			/*  */


		});
	}

	/**
	* Method is used to return array
	*/
	createArray(data?:any) {
		debugger;
		// debugger; 
		// if (!partner) {
		// 	partner = {
		// 		firstName: null,
		// 		middleName: null,
		// 		lastName: null,
		// 		contactNo: null,
		// 		email: null,
		// 		aadhaarNo: null,
		// 		address: null,
		// 		serviceCode: "SHOP-LIC",
		// 		relationship: this.fb.group({
		// 			code: null,
		// 			name: ''
		// 		}),
		// 		gender: this.fb.group({
		// 			code: null,
		// 			name: ''
		// 		}),
		// 		personType: null,
		// 		age: null,
		// 		employee: false
		// 	}
		// }
			if(!data){
				data={
					name: null,
					contactNo: null,
					email: null,
					aadhaarNo: null,
					address: null,
					serviceCode: "SHOP-LIC",
					relationship: this.fb.group({
						code: null
					}),
					gender: this.fb.group({
						code: null
					}),
					age:null,
					employee: false,
					personType: null
				}
			}		
			return this.fb.group({
				name: [data.name ? data.name: '', Validators.required],
				contactNo: [data.contactNo ? data.contactNo: ''],
				email: [data.email ? data.email: ''],
				aadhaarNo: [data.aadhaarNo ? data.aadhaarNo: ''],
				address: [data.address ? data.address: '', Validators.required],
				serviceCode: "SHOP-LIC",
				relationship: this.fb.group({
					code: ['', [Validators.required]]
				}),
				gender: this.fb.group({
					code: ['', [Validators.required]]
				}),
				age: [''],
				employee: data.employee ? data.employeec : false,
				personType: data.personType
			})
		
		
	}

	/**
	* Method is used to add array in form
	*/
	addItem(persontype: string) {
		if (persontype == 'EMPLOYER_FAMILY') {
			return this.shopLicNewForm.get('employerFamilyList') as FormArray;
		}
		else if (persontype == 'PARTNER') {
			return this.shopLicNewForm.get('partnerList') as FormArray;
		}
		else {
			return null;
		}
	}

	/**
	* Method is used when user click for add person
	*/
	addEmployerFamily(persontype: string) {
		this.newShopEstablishmentService.createEmployerFamily({
			formId:this.formId,
			type:persontype
		}).subscribe(res=>{

		})
		// if (this.addItem().length >= 6) {
		// 	this.commonService.openAlert("Warning", "Maximum Child Limit 6.", "warning");
		// } else {
			
		this.addItem(persontype).push(this.createArray(persontype));
		// this.birthCertificateForm.get('noOfChilds').setValue(this.addItem().length);
		// this.setTotalChildAlive();
		// }

	}

	/**
	* This method is change date format.
	*/
	dateFormat(date, controlType: string) {
		this.shopLicNewForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		this.stepper.reset();
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
	* Method is used to show number input
	*/
	showConfirm($event) {
		if (!$event) {
			this.shopLicNewForm.get('No').setValue(null)
		}
	}

}
