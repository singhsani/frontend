import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';

@Component({
	selector: 'app-final-fire-noc',
	templateUrl: './final-fire-noc.component.html',
	styleUrls: ['./final-fire-noc.component.scss']
})
export class FinalFireNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	finalFireNocForm: FormGroup;
	translateKey: string = 'finalFireNocScreen';

	formId: number;
	apiCode: string;

	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	// required attachment array
	uploadFilesArray: Array<any> = [];
	codeOther: boolean = false;

	//Lookups Array
	FS_AREA_ZONE: Array<any> = [];
	FS_APPLIED_FOR: Array<any> = [];
	FS_FIRE_VENDOR_TYPE: Array<any> = [];
	FS_PREVIOUSLY_NOC_TAKEN: Array<any> = [];
	FS_USAGE_TYPE: Array<any> = [];
	FS_AFTERNOON: Array<any> = [];
	FS_PURPOSE_OF_BUILDING_USE: Array<any> = [];

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber:""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.FireFacilitiesService.searchByProvisionalNumber(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {

				if (res.success) {
					this.serachLicenceObj.isDisplayRenewLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayRenewLicenceForm = false;
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
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private FireFacilitiesService: FireFacilitiesService,
		private location: Location,
		public TranslateService: TranslateService
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
		this.finalFireNocFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getFinalFireNocLicNewData();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		this.dependentAttachment(this.finalFireNocForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
		this.dependentAttachment(this.finalFireNocForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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

	/**
	 * Method is used to get form data
	 */
	getFinalFireNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.finalFireNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
			this.FS_APPLIED_FOR = res.FS_APPLIED_FOR;
			this.FS_AREA_ZONE = res.FS_AREA_ZONE;
			this.FS_FIRE_VENDOR_TYPE = res.FS_FIRE_VENDOR_TYPE;
			this.FS_PREVIOUSLY_NOC_TAKEN = res.FS_PREVIOUSLY_NOC_TAKEN;
			this.FS_USAGE_TYPE = res.FS_USAGE_TYPE;
			this.FS_PURPOSE_OF_BUILDING_USE = res.FS_PURPOSE_OF_BUILDING_USE
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
			this.finalFireNocForm.patchValue(searchData);

			this.finalFireNocForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
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
				finalFireNocNumber: res.finalFireNocNumber,
        applicationDate : res.applicationDate,

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
				attachments: []
			});

			this.fireFacilityConfig.isAttachmentButtonsVisible = true;

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				app.id = null;
				(<FormArray>this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
	finalFireNocFormControls() {
		this.finalFireNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-FINAL',
			/* Step 1 controls start */
			provisionalNocNumber: [{ value: null, disabled: true }],
			finalFireNocNumber: [{ value: null, disabled: true }],
			applicationDate: [{ value: null, disabled: true }],
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			contactNo: [null, [Validators.required, Validators.maxLength(10)]],
			officeContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			applicantPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			applicantPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			officeEmailId: [null, [Validators.required, Validators.maxLength(50)]],

			/* Step 2 controls start */
			appliedForId: this.fb.group({
				code: [null, Validators.required]
			}),
			usageTypeId: this.fb.group({
				code: [null, Validators.required]
			}),
			subjectTo: [null, [Validators.required, Validators.maxLength(200)]],
			purposeOfBuildingUse: [null],//array
			otherPurposeRemark: [null, [Validators.maxLength(200)]],
			/* Step 3 controls start */
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
			fireVendorType: this.fb.group({
				code: [null, Validators.required]
			}),
			fireVendorRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			fireVendorName: [null, [Validators.required, Validators.maxLength(150)]],
			fireVendorNameGuj: [null, [Validators.required, Validators.maxLength(450)]],
			fireVendorAddress: [null, [Validators.required, Validators.maxLength(900)]],
			/* Step 4 controls start */
			fireVendorOfficeAddress: [null, [Validators.required, Validators.maxLength(300)]],
			fpNo: [null, [Validators.required, Validators.maxLength(8)]],
			rsNo: [null, [Validators.required, Validators.maxLength(8)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(8)]],
			townPlanningNo: [null, [Validators.required, Validators.maxLength(8)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
			blockNo: [null, [Validators.required, Validators.maxLength(8)]],
			opNo: [null, [Validators.required, Validators.maxLength(8)]],
			citySurveyNo: [null, [Validators.required, Validators.maxLength(8)]],
			buildingHeight: [null, [Validators.required, Validators.maxLength(5)]],
			totalBuildingFloor: [null, [Validators.required, Validators.maxLength(5)]],
			noOfBasement: [null, [Validators.required, Validators.maxLength(3)]],
			lowerBasement: [null, [Validators.required, Validators.maxLength(2)]],
			upperBasement: [null, [Validators.required, Validators.maxLength(2)]],
			basementArea: [null, [Validators.required, Validators.maxLength(3)]],
			multipleTowers: [null, Validators.required],
			noOfTowers: [null, [Validators.required, Validators.maxLength(3)]],
			noOfApproachedRoad: [null, [Validators.required, Validators.maxLength(3)]],
			noOfVentilation: [null, [Validators.required, Validators.maxLength(3)]],
			ventilationProvisionDetail: [null, [Validators.required, Validators.maxLength(20)]],
			plotArea: [null, [Validators.required, Validators.maxLength(4)]],
			constructionArea: [null, [Validators.required, Validators.maxLength(4)]],
			drawingProvided: [null, Validators.required],
			siteAddressWithBuildingName: [null, [Validators.required, Validators.maxLength(200)]],
			siteAddressWithBuildingNameGuj: [null, [Validators.required, Validators.maxLength(600)]],
			otherInformation: [null, [Validators.required, Validators.maxLength(200)]],
			gaslineInUnderground: [null, Validators.required],
			undergroundCabling: [null, Validators.required],
			ongcLineInUnderground: [null, Validators.required],
			/* Step 5 controls start */
			areaZone: this.fb.group({
				code: [null, Validators.required]
			}),
			previouslyNocTaken: this.fb.group({
				code: [null, Validators.required]
			}),
			undergroundWaterTankLength: [null, [Validators.required, Validators.maxLength(8)]],
			undergroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(8)]],
			undergroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(8)]],
			undergroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(8)]],
			undergroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(8)]],
			undergroundWatertankMapApproved: [null, Validators.required],
			overgroundWaterTankLength: [null, [Validators.required, Validators.maxLength(8)]],
			overgroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(8)]],
			overgroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(8)]],
			overgroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(8)]],
			overgroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(8)]],
			overgroundWatertankMapApproved: [null, Validators.required],
			/* Step 6 controls start*/
			attachments: []
			/* Step 6 controls end */
		});
	}



	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 14;
		let step1 = 19;
		let step2 = 35;
		let step3 = 63;
		let step4 = 77;

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
			} else if (count <= step3) {
				this.fireFacilityConfig.currentTabIndex = 3;
				return false;
			} else if (count <= step4) {
				this.fireFacilityConfig.currentTabIndex = 4;
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
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}


	/**
	 * add other remark in Purpose of Building array 
	 * @param event : on change event value
	 */
	otherRemark(event: Event) {
		try {
			this.codeOther = false;
			_.forEach(event, (value) => {
				if (value.code == 'OTHER') {
					this.codeOther = true;
					// this.finalFireNocForm.get('otherPurposeRemark').setValidators([Validators.required])
				}
			});
			if (!this.codeOther) {
				this.finalFireNocForm.get('otherPurposeRemark').reset();
				// this.finalFireNocForm.get('otherPurposeRemark').clearValidators();
			}
		} catch (e) {

		}
	}
}
