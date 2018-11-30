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
	tabIndex: number = 0;

	// required attachment array
	private uploadFilesArray: Array<any> = [];
	private showButtons: boolean = false;

	//Lookups Array
	FS_AREA_ZONE: Array<any> = [];
	FS_APPLIED_FOR: Array<any> = [];
	FS_FIRE_VENDOR_TYPE: Array<any> = [];
	FS_PREVIOUSLY_NOC_TAKEN: Array<any> = [];
	FS_USAGE_TYPE: Array<any> = [];
	FS_AFTERNOON: Array<any> = [];
	FS_PURPOSE_OF_BUILDING_USE: Array<any> = [];
	LOOKUP: any;

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.FireFacilitiesService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
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
		private TranslateService: TranslateService
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
		// this.dependentAttachment(this.finalFireNocForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
		// this.dependentAttachment(this.finalFireNocForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
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
				this.showButtons = true;

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
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
			this.LOOKUP = res;
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
				// attachments: res.attachments,
			});

			this.showButtons = true;

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				app.id = null;
				(<FormArray>this.finalFireNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
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
			provisionalNocNumber: [null],
			applicationDate: [null],
			oldReferenceNumber: [null],
			firstName: [null, [Validators.required, Validators.maxLength(100)]],
			lastName: [null, [Validators.required, Validators.maxLength(100)]],
			middleName: [null, Validators.maxLength(100)],
			contactNo: [null, [Validators.required, Validators.maxLength(10)]],
			officeContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			applicantPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			applicantPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			officeEmailId: [null, [Validators.required, Validators.maxLength(50)]],

			appliedForId: this.fb.group({
				code: [null, Validators.required]
			}),
			usageTypeId: this.fb.group({
				code: [null, Validators.required]
			}),
			subjectTo: [null, [Validators.required, Validators.maxLength(200)]],
			purposeOfBuildingUse: [null],//array
			architectName: [null, [Validators.required, Validators.maxLength(100)]],
			architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
			architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			architectRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			architectPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			architectPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],

			architectContactNo: [null, [Validators.required, Validators.maxLength(10)]],
			siteAddress: [null, [Validators.required, Validators.maxLength(300)]],
			siteAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			fireVendorType: this.fb.group({
				code: [null, Validators.required]
			}),
			fireVendorRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			fireVendorName: [null, [Validators.required, Validators.maxLength(300)]],
			fireVendorAddress: [null, [Validators.required, Validators.maxLength(900)]],
			fireVendorOfficeAddress: [null, [Validators.required, Validators.maxLength(300)]],
			fpNo: [null, [Validators.required, Validators.maxLength(10)]],
			rsNo: [null, [Validators.required, Validators.maxLength(10)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(10)]],
			townPlanningNo: [null, [Validators.required, Validators.maxLength(10)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
			blockNo: [null, [Validators.required, Validators.maxLength(10)]],
			opNo: [null, [Validators.required, Validators.maxLength(10)]],
			cityServayNo: [null, [Validators.required, Validators.maxLength(10)]],
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
			otherInformation: [null, [Validators.required, Validators.maxLength(200)]],
			gaslineInUnderground: [null, Validators.required],
			undergroundCabling: [null, Validators.required],
			ongcLineInUnderground: [null, Validators.required],
			areaZone: this.fb.group({
				code: [null, Validators.required]
			}),
			previouslyNocTaken: this.fb.group({
				code: [null, Validators.required]
			}),
			undergroundWaterTankLength: [null, [Validators.required, Validators.maxLength(4)]],
			undergroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWatertankMapApproved: [null, Validators.required],
			overgroundWaterTankLength: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWatertankMapApproved: [null, Validators.required],
			/* Step 6 controls start*/
			attachments: [],
			serviceDetail: this.fb.group({
				code: null,
				name: null,
				gujName: null,
				feesOnScrutiny: null,
				appointmentRequired: false,
				serviceUploadDocuments: this.fb.array([

				])
			}),
			/* Step 6 controls end */
		});
	}

	/**
     * This Method for create attachment array in service detail
     * @param data : value of array
     */
	createDocumentsGrp(data?: any): FormGroup {
		return this.fb.group({
			// dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
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
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
			// version: [data.version ? data.version : null]
		});
	}

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 14;
		let step1 = 18;
		let step2 = 33;
		let step3 = 60;
		let step4 = 74;

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
			} else if (count <= step3) {
				this.tabIndex = 3;
				return false;
			} else if (count <= step4) {
				this.tabIndex = 4;
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

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}
}
