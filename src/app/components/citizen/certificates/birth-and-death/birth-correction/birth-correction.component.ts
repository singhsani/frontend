import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { Location } from '@angular/common';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';
import { merge } from 'rxjs';

@Component({
	selector: 'app-birth-correction',
	templateUrl: './birth-correction.component.html',
	styleUrls: ['./birth-correction.component.scss']
})
export class BirthCorrectionComponent implements OnInit {

	/**
	 * get stepper element from view.
	 */
	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

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

	stepLable1: string = 'Edit_details';
	stepLable2: string = 'upload_documents';
	

	/**
	 * File upload validation array.
	 */
	private uploadFileArray: Array<any> =
		[{ labelName: 'Resident Proof', fieldIdentifier: '1.1' },
		{ labelName: 'Kyc Document of Mother', fieldIdentifier: '1.2' },
		{ labelName: 'Kyc Document of Father', fieldIdentifier: '1.3' },
	]

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
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private commonService: CommonService,
		private formService: FormsActionsService
	) { }

	/**
	 * Method initializes first.
	 */
	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
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
		 	 * create birth certificate form.
		 	 */
			this.birthCorrectionFormControls();

			/**
			 * get birth correction data.
			 */
			this.getBirthCorrectionData();

			/**
			 * get look up data.
			 */
			this.getLookupData();
		} else {

			/**
			 * show application search form.
			 */
			this.showApplicationSearch = true;

			/**
			 * calling registration number status form method.
			 */
			this.registrationNumberStatusForm();

			/**
			 * get look up data.
			 */
			this.getLookupData();
		}
	}

	/**
	 * methid is used to get birth certificate data.
	 */
	getBirthCorrectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {

			this.birthCorrectionForm.patchValue(res);

			let event = res.typeOfCorrection.code;

			if (event === 'NAME_INSERTION') {
					this.allowChildNameInsertion = true;
					this.allowChildNameCorrection = false;
			} else if (event === 'ONLY_CORRECTION') {
				this.allowChildNameInsertion = false;
				this.allowChildNameCorrection = true;
			}

			this.showButtons = true;
		});
	}

	/**
	 * Method is used to cread record.
	 * @param data - original json data.
	 */
	createBirthCorrectionData(data) {

		this.formService.createFormData().subscribe(res => {

			this.birthCorrectionFormControls();

			this.appId = res.serviceFormId;

			this.birthCorrectionForm.patchValue(res);

			let cururl = this.location.path().replace('false', this.appId.toString());

			this.location.go(cururl);

			this.getLookupData();

			this.setValue(data);

			this.showcorrectionForm = true;

			this.showApplicationSearch = false;

			this.showButtons = true;

			this.changeCorrection(this.regStatusForm.get('typeOfCorrection').get('code').value);
		})
	}

	/**
	 * Method is used to decide insertion/correction form on get.
	 * @param event - event type.
	 */
	changeCorrection(event) {

		if (event === 'NAME_INSERTION') {
			if (this.birthCorrectionForm.get('childName').value != "") {
				this.allowChildNameInsertion = false;
				this.allowChildNameCorrection = true;
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
		});
	}

	/**
	 * Method is used to set original data.
	 * @param data - original json.
	 */
	setValue(data) {
		this.birthCorrectionForm.get('fieldView').setValue(data.fieldView);
		this.birthCorrectionForm.get('fieldList').setValue(data.fieldList);
		this.birthCorrectionForm.get('childName').setValue(data.childName);
		this.birthCorrectionForm.get('fatherFirstName').setValue(data.fatherFirstName);
		this.birthCorrectionForm.get('fatherMiddleName').setValue(data.fatherMiddleName);
		this.birthCorrectionForm.get('fatherLastName').setValue(data.fatherLastName);
		this.birthCorrectionForm.get('fatherFirstNameGuj').setValue(data.fatherFirstNameGuj);
		this.birthCorrectionForm.get('fatherMiddleNameGuj').setValue(data.fatherMiddleNameGuj);
		this.birthCorrectionForm.get('fatherLastNameGuj').setValue(data.fatherLastNameGuj);
		this.birthCorrectionForm.get('motherFirstName').setValue(data.motherFirstName);
		this.birthCorrectionForm.get('motherMiddleName').setValue(data.motherMiddleName);
		this.birthCorrectionForm.get('motherLastName').setValue(data.motherLastName);
		this.birthCorrectionForm.get('motherFirstNameGuj').setValue(data.motherFirstNameGuj);
		this.birthCorrectionForm.get('motherMiddleNameGuj').setValue(data.motherMiddleNameGuj);
		this.birthCorrectionForm.get('motherLastNameGuj').setValue(data.motherLastNameGuj);
		this.birthCorrectionForm.get('refNumber').setValue(this.regStatusForm.get('applicationNumber').value)
		this.birthCorrectionForm.get('typeOfCorrection').get('code').setValue(this.regStatusForm.get('typeOfCorrection').get('code').value);

		/**
		 * save data
		 */

		this.formService.saveFormData(this.appId).subscribe(res => {
			console.log(res);
		})
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
			applicationNumber: [null, [Validators.required]],
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
			childName: null,
			fatherFirstName: null,
			fatherMiddleName: null,
			fatherLastName: null,

			fatherFirstNameGuj: null,
			fatherMiddleNameGuj: null,
			fatherLastNameGuj: null,

			motherFirstName: null,
			motherMiddleName: null,
			motherLastName: null,

			motherFirstNameGuj: null,
			motherMiddleNameGuj: null,
			motherLastNameGuj: null,

			refNumber: null,

			typeOfCorrection: this.fb.group({
				code: [null]
			}),

			fieldView: "ALL",
			fieldList: null,
			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: null,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: false,
			paymentStatus: null,
			canEdit: true,
			canDelete: true,
			canSubmit: null,
			serviceDetail: this.fb.group({
				code: null,
				name: null,
				gujName: null,
				feesOnScrutiny: null
			}),

			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),

			attachments: [null],
		});
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
	 * Method is used to get file status.
	 * @param fieldIdentifier - file identifier.
	 */
	getFileObjectContained(fieldIdentifier: string) {
		let found: boolean = false;
		for (let i = 0; i < this.uploadFileArray.length; i++) {
			if (this.uploadFileArray[i].fieldIdentifier == fieldIdentifier) {
				found = true;
				break;
			}
		}
		return found;
	}

	/**
	 * Method is used to create file object.
	 * @param labelName - file labelName
	 * @param fieldIdentifier - file identifier
	 */
	fileObjectCreater(labelName, fieldIdentifier): any {
		return { labelName: labelName, fieldIdentifier: fieldIdentifier }
	}

}
