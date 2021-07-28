import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { DatePipe, Location } from '@angular/common';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';

@Component({
	selector: 'app-fire-renewal-noc',
	templateUrl: './fire-renewal-noc.component.html',
	styleUrls: ['./fire-renewal-noc.component.scss'],
	providers: [DatePipe]
})
export class FireRenewalNocComponent implements OnInit {


	renewalFireNocForm: FormGroup;
	translateKey: string = 'renewalFireNocScreen';

	formId: number;
	apiCode: string;
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	// required attachment array
	uploadFilesArray: Array<any> = [];

	// serach api variable
	searchRenewalFireNOCObj = {
		isDisplayRenewFireNOCForm: <boolean>false,
		searchRenewalFireNOCNumber:""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchRenewalFireNOC() {
		this.FireFacilitiesService.searchRenewalFireNOC(this.searchRenewalFireNOCObj.searchRenewalFireNOCNumber).subscribe(
			(res: any) => {
				if (res.success) {
					this.searchRenewalFireNOCObj.isDisplayRenewFireNOCForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.searchRenewalFireNOCObj.isDisplayRenewFireNOCForm = false;
				}
			}, (err: any) => {
				this.searchRenewalFireNOCObj.isDisplayRenewFireNOCForm = false;
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			})
	}

	/**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
	 * @param FireFacilitiesService - search application by number.
	 * @param Location - Go to specific path(url)
     */
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private FireFacilitiesService: FireFacilitiesService,
		private location: Location,
		public TranslateService: TranslateService,
		private datePipe: DatePipe
	) { }

	/**
	 * This method call initially required methods.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getLookupData();
		this.renewalFireNocFormControls();

		if (!this.formId) {
			this.searchRenewalFireNOCObj.isDisplayRenewFireNOCForm = false;
		}
		else {
			this.searchRenewalFireNOCObj.isDisplayRenewFireNOCForm = true;
			this.getrevisedFireNocLicNewData();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.renewalFireNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {
		var control = (<FormArray>this.renewalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
		var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

		if (eventValue && fields) {
			fields.get('mandatory').setValue(true);
			if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
				this.uploadFilesArray.push({
					'labelName': fields.get('documentLabelEn').value,
					'fieldIdentifier': fields.get('fieldIdentifier').value,
					'documentIdentifier': dependedKey
				})
			}
		} else {
			if (fields) {
				fields.get('mandatory').setValue(false);
				var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
				if (indewx != -1) {
					this.uploadFilesArray.splice(indewx, 1);
				}
			}
		}

	}

	transformDate(){
		const finalNOCIssueDate = this.renewalFireNocForm.get('finalNOCIssueDate').value;
		const finalNOCIssueDateTransform = this.datePipe.transform(finalNOCIssueDate, 'dd/MM/yyyy');
		this.renewalFireNocForm.get('finalNOCIssueDate').setValue(finalNOCIssueDateTransform);

		const nextRenewalDate = this.renewalFireNocForm.get('nextRenewalDate').value;
		const nextRenewalDateTransform = this.datePipe.transform(nextRenewalDate, 'dd/MM/yyyy');
		this.renewalFireNocForm.get('nextRenewalDate').setValue(nextRenewalDateTransform);
	}

	/**
	 * Method is used to get form data
	 */
	getrevisedFireNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.renewalFireNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				this.transformDate();

				this.renewalFireNocForm.disable();
				this.renewalFireNocForm.get('apiType').enable();

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.renewalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
				});
				this.requiredDocumentList();



			} catch (error) {
				console.log(error.message)
			}
		});
	}

	/**
	* Method is used to get lookup data
	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {

		});
	}
	/**
     * This method is use to create new record for citizen.
     * @param searchData: exciting licence number data
     */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.renewalFireNocForm.patchValue(searchData);

			this.renewalFireNocForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				refNumber: this.searchRenewalFireNOCObj.searchRenewalFireNOCNumber,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				paymentStatus: res.paymentStatus,
				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode,
				applicationNo: res.applicationNo,
				applicationDate: res.applicationDate,
				contactNo:res.mobileNo,

				// periodFrom: res.periodFrom,
				// periodTo: res.periodTo,
				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				// licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				serviceDetail: res.serviceDetail,
				attachments: [],
			});

			this.fireFacilityConfig.isAttachmentButtonsVisible = true;
			this.transformDate();


			this.renewalFireNocForm.disable();
			this.renewalFireNocForm.get('apiType').enable();

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				app.id = null;
				(<FormArray>this.renewalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
			});
			this.requiredDocumentList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	renewalFireNocFormControls() {
		this.renewalFireNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-REN',

			/* Step 1 controls start */
			finalFireNocNumber: [null],
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			applicationDate: [null],
			officeContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			contactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			applicantPermanentAddress: [null, [Validators.required, Validators.maxLength(150)]],
			applicantPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(450)]],
			officeEmailId: [null, [Validators.required, Validators.maxLength(50)]],

			/* Step 2 controls start */
			architectName: [null, [Validators.required, Validators.maxLength(100)]],
			architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
			architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			architectRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			architectPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			architectPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			architectContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			siteAddress: [null, [Validators.required, Validators.maxLength(300)]],
			siteAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			fireVendorRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			fireVendorName: [null, [Validators.required, Validators.maxLength(150)]],
			fireVendorNameGuj: [null, [Validators.required, Validators.maxLength(450)]],

			/* Step 3 controls start */
			fpNo: [null, [Validators.required, Validators.maxLength(8)]],
			rsNo: [null, [Validators.required, Validators.maxLength(8)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(8)]],
			townPlanningNo: [null, [Validators.required, Validators.maxLength(8)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
			blockNo: [null, [Validators.maxLength(8)]],
			opNo: [null, [Validators.required, Validators.maxLength(8)]],
			citySurveyNo: [null, [Validators.required, Validators.maxLength(8)]],

			finalNOCIssueDate: [null],
			nextRenewalDate: [null],
			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
		});
	}



	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 13;
		let step1 = 26;
		let step2 = 36;

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



	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}
}
