import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
import { ManageRoutes } from '../../../../config/routes-conf';

import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { constants } from 'os';
import { ValidatorService } from 'src/app/vmcshared/data-table/validator.service';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
	selector: 'app-ele-connection-noc',
	templateUrl: './ele-connection-noc.component.html',
	styleUrls: ['./ele-connection-noc.component.scss']
})
export class EleConnectionNocComponent implements OnInit {


	electricConnectionForm: FormGroup;
	applicantDetails : FormGroup;
    formDetails : FormGroup;
	attachmentDetails : FormGroup;
	translateKey: string = 'eleConnectionScreen';

	appId: number;
	apiCode: string;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
	propertyStatusOutstanding: any = {};

	//Lookups Array
	FS_CONNECTION_PURPOSE: Array<any> = [];
	FS_FIRE_PLACE_TYPE: Array<any> = [];
	FS_SUBJECT: Array<any> = [];

	// required attachment array
	uploadFilesArray: Array<any> = [];

	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();
	licenseConfiguration : LicenseConfiguration = new LicenseConfiguration();


	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		public TranslateService: TranslateService,
		private fireFacilitiesService: FireFacilitiesService,
		private commonService : CommonService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getElectricConnectionData();
		this.getLookupData();
		this.electricConnectionFormControls();
	}

	getElectricConnectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.electricConnectionForm.patchValue(res);
			this.applicantDetails.patchValue(res);
			this.formDetails.patchValue(res)
			this.attachmentDetails.patchValue(res)

			this.fireFacilityConfig.isAttachmentButtonsVisible = true;

			//convert applicant name and set in applicantNameGuj filds 
			let applicantNameGujFields = this.applicantDetails.get('applicantNameGuj');
			let applicantNameValue = this.applicantDetails.get('applicantName').value;
			if (!applicantNameGujFields.value) {
				applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
			}

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.electricConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
			});

			this.documentManage();
		});
	}

	/**
 		* This method is use for get lookup data
 	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.FS_CONNECTION_PURPOSE = res.FS_CONNECTION_PURPOSE;
			this.FS_FIRE_PLACE_TYPE = res.FS_FIRE_PLACE_TYPE;
			this.FS_SUBJECT = res.FS_SUBJECT;
		});
	}



	electricConnectionFormControls() {

		/* Step 1 controls start */
		this.applicantDetails = this.fb.group({
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			applicationDate: [{ value: null, disabled: true }],
			contactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			email: [null, [Validators.required, Validators.maxLength(50),Validators.email, ValidationService.emailValidator]],
		})
	    /* Step 1 controls end */

		/* Step 2 controls start */
		this.formDetails = this.fb.group({
			electricityConnectionNo: [null, [Validators.required, Validators.maxLength(20)]],
			connectionHolderName: [null, [Validators.required, Validators.maxLength(100)]],
			connectionHolderNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			connectionHolderAddress: [null, [Validators.required, Validators.maxLength(500)]],
			connectionHolderAddressGuj: [null, [Validators.required, Validators.maxLength(1500)]],
			incidentDate: [null, Validators.required],
			propertyNo: [null, [Validators.maxLength(15)]],
			firePlaceAddress: [null, [Validators.required, Validators.maxLength(300)]],
			
			subject: this.fb.group({
				code: [null, Validators.required]
			}),
			firePlaceType: this.fb.group({
				code: [null, Validators.required]
			}),
			fireLossAmount: [null, [Validators.maxLength(10)]],
		})
		 /* Step 2 controls end */

		 /* Step 3 controls start */
		this.attachmentDetails = this.fb.group({
			attachments: []
		})
		 /* Step 3 controls end */

		this.electricConnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-ELE',
			attachments: []
			/* Step 6 controls end */
		});

		this.commonService.createCloneAbstractControl(this.applicantDetails,this.electricConnectionForm);
		this.commonService.createCloneAbstractControl(this.formDetails,this.electricConnectionForm);
		this.commonService.createCloneAbstractControl(this.attachmentDetails,this.electricConnectionForm);
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.electricConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date, controlType: string) {
		this.applicantDetails.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}


	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormatforFormDetails(date, controlType: string) {
		this.formDetails.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * this method is used to get property tax status 
	 * @param number 
	 */
	getPropertyStatus(number) {
		this.propertyStatusOutstanding = {};
		this.fireFacilitiesService.getPropertyTaxNoStatus(number).subscribe(res => {
			if (res.success) {
				if (res.data.outstanding) {
					this.electricConnectionForm.get('canEdit').setValue(false);
					this.formDetails.get('propertyNo').setErrors({ 'outstandingRemainingProperty': true });
					this.propertyStatusOutstanding = res.data;
				} else {
					this.electricConnectionForm.get('canEdit').setValue(true);
					this.formDetails.get('propertyNo').setErrors(null);
				}
			}
		}, (err: any) => {
			if (err.error && err.error.length) {
				//this.commonService.openAlert("Warning", err.error[0].message, "warning");
			}
		})
	}

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 9;
		let step1 = 20;
		let step2 = 22;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			// console.log(flag);
			if (count <= step0) {
				this.licenseConfiguration.currentTabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.licenseConfiguration.currentTabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.licenseConfiguration.currentTabIndex = 2;
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

	documentManage(){
		const subject = this.formDetails.get('subject').value;
		const firePlaceType = this.formDetails.get('firePlaceType').value;
		let buildingCollapseMandatory = false;
		let samatiLetterMandatory = false;
		if(subject && subject.code && subject.code == 'BUILDING_COLLAPSE'){
			buildingCollapseMandatory = true;
			samatiLetterMandatory = false;
		}

		if(firePlaceType && firePlaceType.code && firePlaceType.code == 'COMMERCIAL'){
			samatiLetterMandatory = true;
			// buildingCollapseMandatory = false;
		} 

		const documents = this.electricConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value;

		for(const document of documents){
			if(document.documentIdentifier == 'BUILDING_NIRBHAYATA_CERTIFICATE')
				document.mandatory = buildingCollapseMandatory;

			if (document.documentIdentifier == 'FIRE_NOC_OR_SAMATI_LETTER') 
				document.mandatory = samatiLetterMandatory;
		}
				this.electricConnectionForm.get('serviceDetail').patchValue({'serviceUploadDocuments': documents});
						this.requiredDocumentList();
	}
	
	patchValue(){
		this.electricConnectionForm.patchValue(this.dummyJSON);
	}

	dummyJSON:any = {
 
		"electricityConnectionNo": "111111ABC",
		"connectionHolderName": "zxfdsafsdfsdfsd",
		"connectionHolderNameGuj": "ઝ્ક્ષ્ફ્દ્સફ્સ્દ્ફ્સ્દ્ફ્સ્દ",
		"connectionHolderAddress": "fsdfsdfsdfsdf",
		"connectionHolderAddressGuj": "ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"incidentDate": moment(new Date()).format("YYYY-MM-DD"),
		"firePlaceAddress": "sdffsdfsdf",
		"subject": "sdfsdf",
		"firePlaceType": {
		  "code": "RESIDENTIAL"
		},
		"fileStatus": "DRAFT",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"agree": false,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"serviceDetail": {
		  "code": "FS-ELE",
		  "name": "NOC for Electric Connection",
		  "gujName": "ઇલેક્ટ્રીક કનેક્શન માટે એનઓસી",
		  "feesOnScrutiny": false,
		  "appointmentRequired": false
		}
	  };

}
