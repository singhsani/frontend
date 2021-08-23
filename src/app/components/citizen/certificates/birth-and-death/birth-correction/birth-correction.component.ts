import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { Location } from '@angular/common';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import * as _ from 'lodash';
import { CertificateConfig } from '../../certificate-config';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-birth-correction',
	templateUrl: './birth-correction.component.html',
	styleUrls: ['./birth-correction.component.scss']
})
export class BirthCorrectionComponent implements OnInit {

	/**
	 * Birth correction form.
	 */
	birthCorrectionForm: FormGroup;

	/**
	 * check registration number status form.
	 */
	regStatusForm: FormGroup;

	/**
	 * language translation key.
	 */
	translateKey: string = 'birthCorrectionScreen';

	/**
	 * flag to display/hide application search form.
	 */
	showApplicationSearch: boolean = true;

	/**
	 * flag to display/hide application correction form.
	 */
	showcorrectionForm: boolean = false;

	/**
	 * flag to display/hide child name insertion form.
	 */
	allowChildNameInsertion: boolean = false;

	/**
	 * flag to display/hide child name correction form.
	 */
	allowChildNameCorrection: boolean = false;

	/**
	 * show file upload
	 */
	showButtons: boolean = false;

	/**
	 * used to file upload model.
	 */
	uploadModel: any = {};

	/**
	 * used to set start index 0 to tab.
	 */
	tabIndex: number = 0;

	/**
	 * tab step labels
	 */

	stepLable1: string = 'child_details';
	stepLable2: string = 'upload_documents';


	/**
	 * File upload validation array.
	 */
	// uploadFileArray: Array<any> =
	// 	[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
	// 	{ labelName: 'Kyc Document of Mother', fieldIdentifier: '1.2' },
	// 	{ labelName: 'Kyc Document of Father', fieldIdentifier: '1.3' },
	// ]
	uploadFileArray: Array<any> = [];


	/**
	 * Type of correction array.
	 */
	TypeOfCorrection: Array<any>;

	/**
	 * Application Id/ Service Form Id
	 */
	appId: number;

	/**
	 * Api Code
	 */
	apiCode: string;

	configDoc: CertificateConfig = new CertificateConfig();

	/**
	 * Constructor.
	 * @param fb - form builder.
	 * @param commonService - common service of alert.
	 * @param location - location to update url.
	 * @param validationService - common validation service.
	 * @param router - router
	 * @param route - activated route.
	 * @param formService - common form service.
	 */
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private location: Location,
		private commonService: CommonService,
		private formService: FormsActionsService,
		public TranslateService: TranslateService,
		private toster: ToastrService
	) { }

	/**
	 * Method initializes first.
	 */
	ngOnInit() {


		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);

			/**
			 * Creating Controls Of Birth Correction Form.
			 */
			this.birthCorrectionFormControls();

			/**
			 * get look up data.
			 */
			this.getLookupData();

		});

		if (this.appId) {

			/**
			 * hide application search form.
			 */
			this.showApplicationSearch = false;

			/**
			 * show application correction form.
			 */
			this.showcorrectionForm = true;

			/**
			 * get birth correction data.
			 */
			this.getBirthCorrectionData();
		} else {
			/**
			 * show application search form.
			 */
			this.showApplicationSearch = true;

			/**
			 * calling registration number status form method.
			 */
			this.registrationNumberStatusForm();
		}
	}

	/**
	 * methid is used to get birth certificate data.
	 */
	getBirthCorrectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {

			this.birthCorrectionForm.patchValue(res);
			// this.config.documentList(res, this.uploadFileArray);

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.birthCorrectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.configDoc.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
			this.showButtons = true;
			// let event = res.typeOfCorrection.code;
			// this.changeCorrection(this.birthCorrectionForm.get('typeOfCorrection').get('code').value);
			let event = this.birthCorrectionForm.get('typeOfCorrection').get('code').value;
			if (event === 'NAME_INSERTION') {
				this.allowChildNameInsertion = true;
				this.allowChildNameCorrection = false;
			} else if (event === 'ONLY_CORRECTION') {
				this.allowChildNameInsertion = false;
				this.allowChildNameCorrection = true;
			}
		});
	}


	/**
	 * Method is used to cread record.
	 * @param data - original json data.
	 */
	createBirthCorrectionData(data) {
		this.formService.createFormData().subscribe(res => {

			this.birthCorrectionForm.patchValue(res);

			// this.config.documentList(res, this.uploadFileArray);

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.birthCorrectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.configDoc.createDocumentsGrp(app));
			});
			this.requiredDocumentList();

			this.appId = res.serviceFormId;
			let cururl = this.location.path().replace('false', this.appId.toString());
			this.location.go(cururl);
			this.getLookupData();
			this.setValue(data);
			this.showcorrectionForm = true;
			this.showApplicationSearch = false;
			this.showButtons = true;
			this.changeCorrection(this.regStatusForm.get('typeOfCorrection').get('code').value);
			// this.birthCorrectionForm.get('refNumber').setValue(this.regStatusForm.get('registrationNumber').value)
			// this.birthCorrectionForm.get('typeOfCorrection').get('code').setValue(this.regStatusForm.get('typeOfCorrection').get('code').value);
			/**
		    * save data
		    */
			// this.formService.saveFormData(this.birthCorrectionForm.value).subscribe(res => {
			// 	this.birthCorrectionForm.patchValue(res);
			// })
		})
	}


	/**
	 * This method use for displaying string data in json 
	 */
	// listOfData(prods) {
	// 	let newgnData = JSON.parse(prods);
	// 	let prod_array = [];
	// 	for (let i = 0; i < newgnData.length; i += 1) {
	// 		prod_array.push(newgnData[i]);
	// 	}
	// 	return prod_array;
	// }

	/**
	 * Method is used to decide insertion/correction form on get.
	 * @param event - event type.
	 */
	changeCorrection(event) {

		if (event === 'NAME_INSERTION') {
			if (this.birthCorrectionForm.get('childName').value != "") {
				this.allowChildNameInsertion = true;
				this.allowChildNameCorrection = false;
			} else {
				this.allowChildNameInsertion = true
			}
		} else if (event === 'ONLY_CORRECTION') {
			if (this.birthCorrectionForm.get('childName').value == "") {
				this.allowChildNameInsertion = true;
				this.allowChildNameCorrection = false;
			} else {
				this.allowChildNameCorrection = true
			}
		}
	}

	/**
	 * call API to get registration data and status.
	 */
	getRegistrationNumberStatus() {
		
		this.formService.getRegistrationStatus(this.regStatusForm.value).subscribe(resp => {
			if (resp.success) {
				this.createBirthCorrectionData(resp.data);
			}
		}, err => {
			if (err.error[0].code == 'INSERTION_NOT_ALLOWED') {
				this.commonService.openAlert("Invalid Operation", "Name Already Available, Insertion Not Allowed", "warning");
				return;
			} else if (err.error[0].code == 'CORRECTION_NOT_ALLOWED') {
				this.commonService.openAlert("Invalid Operation", "Name Not Available, Correction Not Allowed Please Select Name Insertion", "warning");
				return;
			} else if (err.error[0].code == 'INVALID_REQUEST') {
				this.commonService.openAlert("Invalid Request", "Request Not Valid", "warning");
				return;
			}
			else {
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			}
		});
	}

	/**
	 * Method is used to set original data.
	 * @param data - original json.
	 */
	setValue(data) {

		let newgnData = JSON.parse(data);
		let prod_array = [];
		for (let i = 0; i < newgnData.length; i += 1) {
			prod_array.push(newgnData[i]);
		}

		// this.birthCorrectionForm.get('date').setValue(moment(date).format("YYYY-MM-DD"));
		console.log(moment(this.regStatusForm.get('birthDate').value).format("YYYY-MM-DD") );
		console.log(moment(prod_array[0].birthDate,'DD-MM-YYYY').format("YYYY-MM-DD"));
		if(moment(this.regStatusForm.get('birthDate').value).format("YYYY-MM-DD") == moment(prod_array[0].birthDate,'DD-MM-YYYY').format("YYYY-MM-DD")){
		this.birthCorrectionForm.patchValue(prod_array[0]);
		// this.birthCorrectionForm.get('fieldView').setValue(data.fieldView);
		// this.birthCorrectionForm.get('fieldList').setValue(data.fieldList);
		// this.birthCorrectionForm.get('childName').setValue(data.childName);
		// this.birthCorrectionForm.get('childNameGuj').setValue(data.childNameGuj);
		// this.birthCorrectionForm.get('fatherFirstName').setValue(data.fatherFirstName);
		// this.birthCorrectionForm.get('fatherMiddleName').setValue(data.fatherMiddleName);
		// this.birthCorrectionForm.get('fatherLastName').setValue(data.fatherLastName);
		// this.birthCorrectionForm.get('fatherFirstNameGuj').setValue(data.fatherFirstNameGuj);
		// this.birthCorrectionForm.get('fatherMiddleNameGuj').setValue(data.fatherMiddleNameGuj);
		// this.birthCorrectionForm.get('fatherLastNameGuj').setValue(data.fatherLastNameGuj);
		// this.birthCorrectionForm.get('motherFirstName').setValue(data.motherFirstName);
		// this.birthCorrectionForm.get('motherMiddleName').setValue(data.motherMiddleName);
		// this.birthCorrectionForm.get('motherLastName').setValue(data.motherLastName);
		// this.birthCorrectionForm.get('motherFirstNameGuj').setValue(data.motherFirstNameGuj);
		// this.birthCorrectionForm.get('motherMiddleNameGuj').setValue(data.motherMiddleNameGuj);
		// this.birthCorrectionForm.get('motherLastNameGuj').setValue(data.motherLastNameGuj);
		this.birthCorrectionForm.get('refNumber').setValue(this.regStatusForm.get('registrationNumber').value)
		this.birthCorrectionForm.get('typeOfCorrection').get('code').setValue(this.regStatusForm.get('typeOfCorrection').get('code').value);
		this.newgnDateconvert('birthDate', this.birthCorrectionForm.get('birthDate').value);
		this.newgnDateconvert('registrationDate', this.birthCorrectionForm.get('registrationDate').value);
		

		//let tempdate = new Date(this.birthCorrectionForm.get('birthDate').value);
		/**
		 * save data
		 */

		this.formService.saveFormData(this.birthCorrectionForm.value).subscribe(res => {
			this.birthCorrectionForm.patchValue(res);
			debugger
		})
	}
	else{
		this.toster.error('Wrong Date');
	}

	}

	/**
		* This method for convert newgn response date to yyyy-mm-dd formate
		*/
	// newgnDateconvert(controlName: any, date) {
	//  if(date) {
	// 	let dateString = date;
	// 	let dateParts = dateString.split(" ");
	// 	let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
	// 	this.birthCorrectionForm.get(controlName).setValue(moment(dateParts[0]).format("DD-MM-YYYY"));
	//  } else {
	// 	 console.log('control name is undefined', controlName)
	//  }
	// }

	newgnDateconvert(controlName: any, date) {
		let dateString = date;
		let dateParts = dateString.split("-");
		let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
		// let dateObject = new Date(+dateParts[0], dateParts[1] - 1,+dateParts[2]);
		this.birthCorrectionForm.get(controlName).setValue(moment(dateObject).format("YYYY-MM-DD"));
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.TypeOfCorrection = res.BIRTH_CORRECTION_TYPE;
		});
	}

	/**
	 * method is used to create registration status form.
	 */
	registrationNumberStatusForm() {
		this.regStatusForm = this.fb.group({
			typeOfCorrection: this.fb.group({
				code: [null, [Validators.required]]
			}),
			registrationNumber: [null, [Validators.required]],
			birthDate: [null, [Validators.required]],
		});
	}


	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		}
	}

	/**
	 * method is used to create birth correctio form.
	 */
	birthCorrectionFormControls() {
		this.birthCorrectionForm = this.fb.group({

			//step - 1 (13)
			childName: [null, Validators.required],
			childNameGuj: [null, Validators.required],
			fatherFirstName:  [null, Validators.required],
			// fatherMiddleName: null,
			// fatherLastName: null,

			fatherFirstNameGuj: [null, Validators.required],
			// fatherMiddleNameGuj: null,
			// fatherLastNameGuj: null,

			motherFirstName: [null, Validators.required],
			// motherMiddleName: null,
			// motherLastName: null,

			motherFirstNameGuj: [null, Validators.required],
			// motherMiddleNameGuj: null,
			// motherLastNameGuj: null,

			birthtime: [null, Validators.required],
			birthtimeguj: [null, Validators.required],

			gender: [null, Validators.required],
			genderguj: [null, Validators.required],

			placeofbirth: [null, Validators.required],
			placeofbirthguj: [null, Validators.required],

			birthaddress:[null, Validators.required],
			birthaddressguj: [null, Validators.required],

			permanentadd: [null, Validators.required],
			permanentaddguj: [null, Validators.required],

			refNumber: null,

			typeOfCorrection: this.fb.group({
				code: [null]
			}),
			birthDate: [null, Validators.required],
			birthdateguj: [null, Validators.required],
			registrationDate: [null, Validators.required],

			// fieldView: "ALL",
			// fieldList: null,

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),

			attachments: [],
		});
	}

	/**
	 * This method use for covert date format
	 * @param date - Selected date
	 */
	 onDateChange(date) {
		this.birthCorrectionForm.get('date').setValue(moment(date).format("YYYY-MM-DD"));
		
	}

	/**
	 * maximum date validation.
	 */
	 maxDate: Date = new Date();

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
	stepReset() {
		//this.stepper.reset();
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
			serviceFormId: this.appId,
		}
		return this.uploadModel;
	}


	/**
	* Method is create required document array
	*/
	requiredDocumentList() {
		this.uploadFileArray = [];
		_.forEach(this.birthCorrectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFileArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
	}
}
