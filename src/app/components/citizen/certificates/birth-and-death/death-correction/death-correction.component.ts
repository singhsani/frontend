import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { Location } from '@angular/common';
import { CommonService } from '../../../../../shared/services/common.service';
import { CertificateConfig } from '../../certificate-config';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';

@Component({
	selector: 'app-death-correction',
	templateUrl: './death-correction.component.html',
	styleUrls: ['./death-correction.component.scss']
})
export class DeathCorrectionComponent implements OnInit {

	/**
	 * check registration number status form.
	 */
	regStatusForm: FormGroup;

	uploadFileArray: Array<any> = [];

	/**
	 * death correction form group.
	 */
	deathCorrectionForm: FormGroup;

	/**
	 * file upload model
	 */
	uploadModel: any = {};

	/**
	 * Type of correction Array
	 */
	TypeOfCorrection: Array<any>;

	/**
	 * flag to show/hide application search form.
	 */
	showApplicationSearch: boolean = true;

	/**
	 * flag to show/hide application correction form.
	 */
	showcorrectionForm: boolean = false;

	/**
	 * flag to show/hide file upload.
	 */
	showButtons: boolean = false;

	/**
	 * language translation key.
	 */
	translateKey: string = 'deathCorrectionScreen';

	/**
	 * application id/Service form Id 
	 */
	appId: number;

	/**
	 * Api code
	 */
	apiCode: string;
	config: CertificateConfig = new CertificateConfig();


	tabIndex: number = 0;
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
		private commonService: CommonService,
		private location: Location,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		public TranslateService: TranslateService
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

		this.deathCorrectionFormControls();

		if (this.appId) {

			/**
			 * hide application search form.
			 */
			this.showApplicationSearch = false;

			/**
			 * show correction form.
			 */
			this.showcorrectionForm = true;

			/**
			 * get birth correction data.
			 */
			this.getDeathCorrectionData();

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
			this.getLookupDataForReg();

		}
	}

	/**
	 * Get Death Correction data from API.
	 */
	getDeathCorrectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {

			this.deathCorrectionForm.patchValue(res);
			// this.documentList(res, this.uploadFileArray);

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.deathCorrectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
			this.showButtons = true;
		});
	}

	/**
	 * Method is used to create virth correction application.
	 * @param data - original json data.
	 */
	createBirthCorrectionData(data) {
		this.formService.createFormData().subscribe(res => {

			// this.deathCorrectionFormControls();
			this.appId = res.serviceFormId;

			this.deathCorrectionForm.patchValue(res);
			// this.documentList(res, this.uploadFileArray);

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.deathCorrectionForm.controls.serviceDetail.get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
			this.showButtons = true;

			let cururl = this.location.path().replace('false', this.appId.toString());
			this.location.go(cururl);
			this.getLookupData();
			this.setValue(data);
			this.showcorrectionForm = true;
			this.showApplicationSearch = false;
			this.showButtons = true;

		})
	}

	/**
	 * Method is used to update correction form with original data.
	 * @param data - original json data.
	 */
	setValue(data) {

		let newgnData = JSON.parse(data);
			let prod_array = [];
			for (let i = 0; i < newgnData.length; i += 1) {
				prod_array.push(newgnData[i]);
			}

			this.deathCorrectionForm.patchValue(prod_array[0]);

		// this.deathCorrectionForm.get('fieldView').setValue(data.fieldView);
		// this.deathCorrectionForm.get('fieldList').setValue(data.fieldList);
		// this.deathCorrectionForm.get('deceasedMiddleName').setValue(data[0].deceasedMiddleName);
		// this.deathCorrectionForm.get('deceasedLastName').setValue(data.deceasedLastName);
		// this.deathCorrectionForm.get('deceasedFirstName').setValue(data.deceasedFirstName);
		// this.deathCorrectionForm.get('deceasedFirstNameGuj').setValue(data.deceasedFirstNameGuj);
		// this.deathCorrectionForm.get('deceasedLastNameGuj').setValue(data.deceasedLastNameGuj);
		// this.deathCorrectionForm.get('deceasedMiddleNameGuj').setValue(data.deceasedMiddleNameGuj);
		// // this.deathCorrectionForm.get('fatherOrHusbandName').setValue(data.fatherOrHusbandName);
		// this.deathCorrectionForm.get('motherName').setValue(data.motherName);
		// this.deathCorrectionForm.get('motherNameGuj').setValue(data.motherNameGuj);
		this.deathCorrectionForm.get('refNumber').setValue(this.regStatusForm.get('registrationNumber').value);
		this.deathCorrectionForm.get('typeOfCorrection').get('code').setValue(this.regStatusForm.get('typeOfCorrection').get('code').value);
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
			if (err.error[0].code == 'INVALID_FILENUMBER') {
				this.commonService.openAlert("Invalid Operation", "File Number Not Valid", "warning");
			}
			else if (err.error[0].code == 'INVALID_REQUEST') {
				this.commonService.openAlert("Invalid Request", "Request Not Valid", "warning");
			}
		});
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.TypeOfCorrection = res.DEATH_CORRECTION_TYPE;
		});
	}

	/**
	 * Method is used to get look up data for registration.
	 */
	getLookupDataForReg() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.TypeOfCorrection = res.DEATH_CORRECTION_TYPE;
			this.regStatusForm.get('typeOfCorrection').get('code').setValue(this.TypeOfCorrection[0].code);
		});
	}


	/**
 	 * method is used to create registration status form.
 	 */
	registrationNumberStatusForm() {
		this.regStatusForm = this.fb.group({
			typeOfCorrection: this.fb.group({
				code: [null, Validators.required]
			}),
			registrationNumber: [null, [Validators.required]],
			dateofdeath: [null, [Validators.required]],
		});
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step0 = 6;
		let step1 = 8;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step1 && count > step0) {
			this.tabIndex = 1;
			return false;
		}
	}

	/**
	 * method is used to create death correction form.
	 */
	deathCorrectionFormControls() {
		this.deathCorrectionForm = this.fb.group({

			//step 1(deceased deatails - 6)
			deceasedname: [null, Validators.required],
			// deceasedMiddleName: null,
			// deceasedLastName: null,
			deceasednameguj: [null, Validators.required],
			gender: [null, Validators.required],
			genderguj: [null, Validators.required],
			dateofdeath: [null, Validators.required],
			
			// deceasedMiddleNameGuj: null,
			// deceasedLastNameGuj: null,

			//step 2(family details - 2)
			fathername: [null, Validators.required],
			fathernameguj: [null, Validators.required],
			mothername: [null, Validators.required],
			mothernameguj:[null, Validators.required],
			// fatherOrHusbandName: null,

			refNumber: null,
			registrationNumber: null,

			//step 3(other details)
			placeofdeath: [null, Validators.required],
			placeofdeathguj: [null, Validators.required],
			regdate: [null, Validators.required],
			deathaddress: [null, Validators.required],
			deathaddressguj: [null, Validators.required],
			permanentaddress: [null, Validators.required],
			permanentaddressguj: [null, Validators.required],

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
			// serviceDetail: this.fb.group({
			// 	code: null,
			// 	name: null,
			// 	gujcbName: null,
			// 	feesOnScrutiny: null
			// }),
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			attachments: []
		});

	}


	/**
	 * Method is used to get file status.
	 * @param fieldIdentifier - file identifier.
	 */
	// getFileObjectContained(fieldIdentifier: string) {
	// 	let found: boolean = false;
	// 	for (let i = 0; i < this.uploadFileArray.length; i++) {
	// 		if (this.uploadFileArray[i].fieldIdentifier == fieldIdentifier) {
	// 			found = true;
	// 			break;
	// 		}
	// 	}
	// 	return found;
	// }

	/**
	 * Method is used to create file object.
	 * @param labelName - file labelName
	 * @param fieldIdentifier - file identifier
	 */
	fileObjectCreater(labelName, fieldIdentifier): any {
		return { labelName: labelName, fieldIdentifier: fieldIdentifier }
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt: number) {
		this.tabIndex = evt;
	}


    /**
	 * Method is create required document array
	 */
	// public documentList(res, uploadFilesArray: Array<any>) {
	//     res.serviceDetail.serviceUploadDocuments.forEach(file => {
	//         if (file.isActive && file.requiredOnCitizenPortal) {
	//             uploadFilesArray.push(file);
	//         }
	//     });
	//     // _.forEach(form.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
	//     //     if (value.isActive && value.requiredOnCitizenPortal) {
	//     //         uploadFilesArray.push({
	//     //             'labelName': value.documentLabelEn,
	//     //             'fieldIdentifier': value.fieldIdentifier,
	//     //             'documentIdentifier': value.documentIdentifier
	//     //         })
	//     //     }
	//     // });
	// }

	/**
	* Method is create required document array
	*/
	requiredDocumentList() {
		this.uploadFileArray = [];
		_.forEach(this.deathCorrectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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