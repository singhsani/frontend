import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CertificateConfig } from '../../certificate-config';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-no-birth-record',
	templateUrl: './no-birth-record.component.html',
	styleUrls: ['./no-birth-record.component.scss']
})
export class NoBirthRecordComponent implements OnInit {
	@ViewChild('address') addrComponent: any;
	// uploadFileArray: Array<any> = [
	// 	{ labelName: 'Date Of Birth', fieldIdentifier: '1.1' },
	// 	{ labelName: 'Place Of Birth', fieldIdentifier: '1.2' },
	// 	{ labelName: 'Applicant Id', fieldIdentifier: '1.3' }
	// ]
	noRecordBirthForm: FormGroup;
	translateKey: string = 'nrcBirthScreen';
	appId: number;
	apiCode: string;
	manageRoutes: any = ManageRoutes;

	maxDate: Date = new Date();
	relationshipArray: Array<any> = [];
	genderArray: Array<any> = [];
	placeArray: Array<any> = [];
	reasonArray: Array<any> = [];
	showButtons: boolean = false;
	isVisibeNRCForm: boolean = true;
	showSearchForm: boolean = true;
	uploadFilesArray: Array<any> = [];

	// uploadModel: any = {};
	tabIndex: number = 0;

	// Step Titles
	stepLable1: string = "no_record_certificate_detail";
	stepLable2: string = "birth_blace_address_detail";
	stepLable3: string = "applicant_detail";
	stepLable4: string = "upload_documents";

	/**
	 * Using Common Configuration
	*/
	config: CertificateConfig = new CertificateConfig();
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private location: Location,
		public TranslateService: TranslateService
	) {

	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.nrcBirthCertFormControls();
		this.getLookupData();

		/* if serviceFormId is present in url then call get api and show NRC form*/
		if (this.appId) {
			this.showSearchForm = false;
			this.isVisibeNRCForm = false;
			this.getNoRecordBirthData();
		}

	}

	/**
	 * This method use for initialise form controls
	 */
	nrcBirthCertFormControls() {

		this.noRecordBirthForm = this.fb.group({

			childName: [null, [Validators.required, ValidationService.nameValidator]],
			fatherName: [null, [Validators.required, ValidationService.nameValidator]],
			motherName: [null, [Validators.required, ValidationService.nameValidator]],
			gender: this.fb.group({
				code: [null, Validators.required],
			}),
			birthPlace: this.fb.group({
				code: [null, Validators.required],
			}),
			birthPlaceDetail: null,
			birthDate: [null, Validators.required],

			birthPlaceAddress: this.fb.group(this.addrComponent.addressControls()),
			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),
			applicantRelationDetail: null,
			reasonDetail: this.fb.group({
				code: [null, Validators.required]
			}),
			attachments: [],
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			regNumber: null,

		});
	}

	/**
	 * This method use for get the no record for birth data
	 */
	getNoRecordBirthData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.noRecordBirthForm.patchValue(res);
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.noRecordBirthForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
			this.showButtons = true;
		});
	}
	/**
	* Method is create required document array
	*/
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.noRecordBirthForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
	}
	/**
	 * This method is use for set user selected date 
	 * @param date - get selected date
	 */
	onDateChange(date) {
		this.noRecordBirthForm.get('birthDate').setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use to show java validations errors 
	 */
	handleErrorsOnSubmit(count) {

		let step1 = 7;
		let step2 = 8;
		let step3 = 11;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step2) {
			this.tabIndex = 1;
			return false;
		} else if (count <= step3) {
			this.tabIndex = 2;
			return false;
		} else if (count >= 32 && count <= 40) {
			this.tabIndex = 2;
		}

	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
			this.reasonArray = res.NRC_BIRTH_OR_DEATH_REASON;
		});
	}

	// /**
	//  * This method use to return file upload model
	//  * @param indentifier - get different indentifier for different file 
	//  */
	// setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {

	// 	this.uploadModel = {
	// 		fieldIdentifier: indentifier.toString(),
	// 		labelName: labelName.toString(),
	// 		formPart: formPart.toString(),
	// 		variableName: variableName.toString(),
	// 		serviceFormId: this.appId,
	// 	}

	// 	return this.uploadModel;
	// }


	/**
	 * This method is use for get the value of birth place change
	 * @param event - radio button change value
	 */
	birthPlaceChange(event) {
		if (event.value !== 'OTHER_PLACE') {
			this.noRecordBirthForm.get('birthPlaceDetail').setValue('');
			this.noRecordBirthForm.get('birthPlaceDetail').clearValidators();
		} else {
			this.noRecordBirthForm.get('birthPlaceDetail').setValidators([Validators.required]);
		}
		this.noRecordBirthForm.controls['birthPlaceDetail'].updateValueAndValidity();

	}

	/**
	 * This method is use for get the value of applicant relation change
	 * @param event - select box change value
	 */
	applicantRelChange(value) {
		if (value !== 'OTHER_RELATIONSHIP') {
			this.noRecordBirthForm.get('applicantRelationDetail').setValue('');
			this.noRecordBirthForm.get('applicantRelationDetail').clearValidators();
		} else {
			this.noRecordBirthForm.get('applicantRelationDetail').setValidators([Validators.required]);
		}
		this.noRecordBirthForm.controls['applicantRelationDetail'].updateValueAndValidity();

	}

	/**
	 * Method is used to get file status.
	 * @param fieldIdentifier - file identifier.
	 */

	// getFileObjectContained(fieldIdentifier: string) {
	// 	debugger;
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
	 * This method use for get the output event from search component
	 * @param event - Output event
	 */
	showNRCForm(event) {
		let tabledataValue = event;
		if (tabledataValue != false) {

			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode('HEL-DUPBR');
			this.formService.createFormData().subscribe(res => {
				//set value for get in duplicate birth (other component) component by BehaviorSubject
				this.formService.setNBCtoDuplicateBirth(event);
				let redirectUrl = ManageRoutes.getFullRoute('HEL-DUPBR');
				this.router.navigate([redirectUrl, res.serviceFormId, 'HEL-DUPBR']);
			});
		}
		else {
			this.isVisibeNRCForm = false;
			this.formService.createFormData().subscribe(res => {
				this.appId = res.serviceFormId;
				let url = this.location.path().replace('false', this.appId.toString());
				this.router.navigate([url]);
				this.noRecordBirthForm.patchValue(res);
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.noRecordBirthForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
				});
				this.requiredDocumentList();
				this.showButtons = true;
			});
			this.showSearchForm = false;
		}
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	
}
