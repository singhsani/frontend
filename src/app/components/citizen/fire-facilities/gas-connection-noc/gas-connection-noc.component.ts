import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LicenseConfiguration } from '../../licences/license-configuration';

@Component({
	selector: 'app-gas-connection-noc',
	templateUrl: './gas-connection-noc.component.html',
	styleUrls: ['./gas-connection-noc.component.scss']
})
export class GasConnectionNocComponent implements OnInit {



	gasConnectionForm: FormGroup;
	applicantDetails : FormGroup;
	formDetails : FormGroup;
	attachmentDetails : FormGroup;
	translateKey: string = 'gasConnectionScreen';

	appId: number;
	apiCode: string;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
	propertyStatusOutstanding: any = {};

	//Lookups Array
	FS_CONNECTION_PURPOSE: Array<any> = [];
	FS_FIRE_PLACE: Array<any> = [];
	FS_SUBJECT: Array<any> = [];
	wardNo: Array<any> = [];

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
		private CD: ChangeDetectorRef,
		private  commonService : CommonService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getGasConnectionData();
		this.getLookupData();
		this.gasConnectionFormControls();
	}


	/**
	 * this method is use for get api data and patch in form
	 */
	getGasConnectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.gasConnectionForm.patchValue(res)
			this.applicantDetails.patchValue(res)
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
				(<FormArray>this.gasConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
			this.FS_FIRE_PLACE = res.FS_FIRE_PLACE;
			this.FS_SUBJECT = res.FS_SUBJECT;
			this.wardNo = res.WARD;
		});
	}
	/**
	 * define all gas connection form controls
	 */
	gasConnectionFormControls() {

       /* Step 1 controls start */
		this.applicantDetails = this.fb.group({
		oldReferenceNumber: [null],
		applicantName: [null, [Validators.required, Validators.maxLength(100)]],
		applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
		applicationDate: [{ value: null, disabled: true }, Validators.required],
		contactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), , Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
		mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
		email: [null, [Validators.required, Validators.maxLength(50),Validators.email, ValidationService.emailValidator]],
		})
		/* Step 1 controls end */

		/* Step 2 controls start */
		this.formDetails = this.fb.group({
			gasConnectionNo: [null, [Validators.required, Validators.maxLength(15)]],
			connectionHolderName: [null, [Validators.required, Validators.maxLength(100)]],
			connectionHolderNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			incidentDate: [null, Validators.required],
			connectionPurpose: this.fb.group({
				code: [null, Validators.required]
			}),
			shopNo: [null, Validators.maxLength(12)],
			propertyNo: [null, [Validators.required, Validators.maxLength(15)]],

			firePlaceType: this.fb.group({
				code: [null, Validators.required]
			}),
			subject: this.fb.group({
				code: [null, Validators.required]
			}),
			wardNo: this.fb.group({
				code: [null, Validators.required]
			}),
			firePlaceAddress: [null, [Validators.required, Validators.maxLength(100)]],
			firePlaceAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			fireLossAmount: [null, [Validators.maxLength(10)]],
			highRiseFireNOCTaken: [null],
		})
        /* Step 2 controls end */

        /* Step 3 controls start */
		this.attachmentDetails = this.fb.group({
			attachments: [],
		})
		 /* Step 3  controls end */


		this.gasConnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-GAS',
			attachments: [],
		});

		this.commonService.createCloneAbstractControl(this.applicantDetails,this.gasConnectionForm);
		this.commonService.createCloneAbstractControl(this.formDetails,this.gasConnectionForm);
		this.commonService.createCloneAbstractControl(this.attachmentDetails,this.gasConnectionForm);
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.gasConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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
	 * this method is used to get property tax status	 * 
	 * @param number 
	 */
	getPropertyStatus(number) {
		this.propertyStatusOutstanding = {};
		this.fireFacilitiesService.getPropertyTaxNoStatus(number).subscribe(res => {
			if (res.success) {
				if (res.data.outstanding) {
					this.gasConnectionForm.get('canEdit').setValue(false);
					this.gasConnectionForm.get('propertyNo').setErrors({ 'outstandingRemainingProperty': true });
					this.propertyStatusOutstanding = res.data;
				} else {
					this.gasConnectionForm.get('canEdit').setValue(true);
					this.gasConnectionForm.get('propertyNo').setErrors(null);
				}
			}
		}, (err: any) => {
			if (err.error && err.error.length) {
				//this.commonService.openAlert("Warning", err.error[0].message, "warning");
			}
		})
	}


	documentManage() {
		const subject = this.gasConnectionForm.get('subject').value;
		const highRiseFireNOCTaken = this.gasConnectionForm.get('highRiseFireNOCTaken').value;
		let buildingCollapseMandatory = false;
		let highriseFireNocwMandatory = highRiseFireNOCTaken;
		if (subject && subject.code && subject.code == 'BUILDING_COLLAPSE') {
			buildingCollapseMandatory = true;
		}

		const documents = this.gasConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value;

		for (const document of documents) {
			if (document.documentIdentifier == 'BUILDING_NIRBHAYATA_CERTIFICATE')
				document.mandatory = buildingCollapseMandatory;
			else if (document.documentIdentifier == 'FIRE_NOC_XEROX_COPY')
				document.mandatory = highriseFireNocwMandatory;
		}
		this.gasConnectionForm.get('serviceDetail').patchValue({ 'serviceUploadDocuments': documents });
		this.requiredDocumentList();
	}


	onChangeConnectionPurpose(event) {
debugger
		if (event == "COMMERCIAL" || event == 'INDUSTRIAL') {
			this.formDetails.get('shopNo').reset();
			this.formDetails.get('shopNo').setValidators([Validators.required, Validators.maxLength(12)]);
			this.formDetails.get('shopNo').updateValueAndValidity()
		} else {
			//this.gasConnectionForm.get('propertyNo').reset();
			this.formDetails.get('shopNo').reset();
			this.formDetails.get('shopNo').clearValidators();
			this.formDetails.get('shopNo').updateValueAndValidity()
		}
		this.CD.detectChanges();
	}


	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 9;
		let step1 = 21;
		let step2 = 23;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			// console.log(flag);
			if (count <= step0) {
				this.fireFacilityConfig.currentTabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.fireFacilityConfig.currentTabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.fireFacilityConfig.currentTabIndex = 2;
				return false;
			}
			else {
				console.log("else condition");
			}
		}
	}

	patchValue() {
		this.gasConnectionForm.patchValue(this.dummyJSON);
	}

	dummyJSON: any = {

		"gasConnectionNo": "sdfdfsdfsdf",
		"connectionHolderName": "sdfsdfsdf",
		"connectionHolderNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"incidentDate": moment(new Date()).format("YYYY-MM-DD"),
		"connectionPurpose": {
			"code": "RESIDENTIAL"
		},
		"shopNo": null,
		"propertyNo": "324234234234234",
		"firePlaceType": {
			"code": "HOUSE"
		},
		"subject": "dfsd",
		"firePlaceAddress": "fsdgdfgdfgdfgfdg",
		"firePlaceAddressGuj": "ફ્સ્દ્ગ્દ્ફ્ગ્દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
		"highRiseFireNOCTaken": true,
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
			"code": "FS-GAS",
			"name": "NOC for Gas Connection",
			"gujName": "ગેસ કનેક્શન માટે એનઓસી",
			"feesOnScrutiny": false,
			"appointmentRequired": false
		}
	};

}
