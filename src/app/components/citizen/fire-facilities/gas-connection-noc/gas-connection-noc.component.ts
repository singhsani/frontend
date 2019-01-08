import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';

@Component({
	selector: 'app-gas-connection-noc',
	templateUrl: './gas-connection-noc.component.html',
	styleUrls: ['./gas-connection-noc.component.scss']
})
export class GasConnectionNocComponent implements OnInit {


	tabIndex: number = 0;

	gasConnectionForm: FormGroup;
	translateKey: string = 'gasConnectionScreen';

	appId: number;
	apiCode: string;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
	propertyStatusOutstanding = {};

	//Lookups Array
	FS_CONNECTION_PURPOSE: Array<any> = [];
	FS_FIRE_PLACE: Array<any> = [];

	// required attachment array
	private uploadFilesArray: Array<any> = [];
	private showButtons: boolean = false;


	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private TranslateService: TranslateService,
		private fireFacilitiesService: FireFacilitiesService
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
			this.gasConnectionForm.patchValue(res);
			this.showButtons = true;
			//convert applicant name and set in applicantNameGuj filds 
			let applicantNameGujFields = this.gasConnectionForm.get('applicantNameGuj');
			let applicantNameValue = this.gasConnectionForm.get('applicantName').value;
			if (!applicantNameGujFields.value) {
				applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
			}
			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				(<FormArray>this.gasConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
			});
			this.requiredDocumentList();
		});
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.FS_CONNECTION_PURPOSE = res.FS_CONNECTION_PURPOSE;
			this.FS_FIRE_PLACE = res.FS_FIRE_PLACE;
		});
	}
	/**
	 * define all gas connection form controls
	 */
	gasConnectionFormControls() {
		this.gasConnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-GAS',

			/* Step 1 controls start */

			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			applicationDate: [null, Validators.required],
			contactNo: [null, [Validators.required, Validators.maxLength(12)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],

			/* Step 2 controls start */
			gasConnectionNo: [null, [Validators.required, Validators.maxLength(15)]],
			connectionHolderName: [null, [Validators.required, Validators.maxLength(100)]],
			connectionHolderNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			incidentDate: [null, Validators.required],
			connectionPurpose: this.fb.group({
				code: [null, Validators.required]
			}),
			shopNo: [null, [Validators.maxLength(12)]],
			propertyNo: [null, [Validators.required, Validators.maxLength(15)]],

			firePlaceType: this.fb.group({
				code: [null, Validators.required]
			}),
			subject: [null, [Validators.required, Validators.maxLength(300)]],
			firePlaceAddress: [null, [Validators.required, Validators.maxLength(300)]],
			firePlaceAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			fireLossAmount: [null, [Validators.required, Validators.maxLength(10)]],
			highRiseFireNOCTaken: [null],

			/* Step 3 controls start */
			attachments: [],

			/* Step 6 controls end */
		});
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
	 * This Method for create attachment array in service detail
	 * @param data : value of array
	 */
	createDocumentsGrp(data?: any): FormGroup {
		return this.fb.group({
			dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
			documentIdentifier: [data.documentIdentifier ? data.documentIdentifier : null],
			documentKey: [data.documentKey ? data.documentKey : null],
			documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
			documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
			fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
			formPart: [data.formPart ? data.formPart : null],
			id: [data.id ? data.id : null],
			isActive: [data.isActive],
			mandatory: [data.mandatory ? data.mandatory : false],
			maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
			requiredOnAdminPortal: [data.requiredOnAdminPortal],
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal]
		});
	}

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date, controlType: string) {
		this.gasConnectionForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
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

	onChangeConnectionPurpose(event) {
		if (event || event == "COMMERCIAL") {
			this.gasConnectionForm.get('shopNo').reset()
		} else {
			this.gasConnectionForm.get('propertyNo').reset();
			this.gasConnectionForm.get('shopNo').reset()
		}
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
				this.tabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.tabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.tabIndex = 2;
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

	/**
 	 * This method use to get output event of tab change
 	 * @param evt - Tab index
 	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

}
