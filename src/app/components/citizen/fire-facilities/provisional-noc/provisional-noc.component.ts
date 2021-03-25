import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';

@Component({
	selector: 'app-provisional-noc',
	templateUrl: './provisional-noc.component.html',
	styleUrls: ['./provisional-noc.component.scss']
})
export class ProvisionalNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	provisionalNocForm: FormGroup;
	translateKey: string = 'provisionalFireNocScreen';
	formId: number;
	apiCode: string;

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

	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	/**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
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
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getprovisionaNocLicNewData();
			this.provisionalNocFormControls();

		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.provisionalNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		this.dependentAttachment(this.provisionalNocForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
		this.dependentAttachment(this.provisionalNocForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.provisionalNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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
	getprovisionaNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.provisionalNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.provisionalNocForm.get('applicantNameGuj');
				let applicantNameValue = this.provisionalNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.provisionalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	provisionalNocFormControls() {
		this.provisionalNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-PROVI',
			/* Step 1 controls start */
			provisionalNocNumber: [{ value: null, disabled: true }],
			applicationDate: [{ value: null, disabled: true }],
			oldReferenceNumber: [{ value: null, disabled: true }],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			contactNo: [null, [Validators.required, Validators.maxLength(10)]],
			// officeContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			officeContactNo : [null, [Validators.required, Validators.maxLength(10)]],
			onsitePersonMobileNo: [null, [Validators.maxLength(10)]],
			applicantPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			applicantPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			officeEmailId: [null, [ValidationService.emailValidator, Validators.maxLength(50)]],

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
			architectRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			architectName: [null, [Validators.required, Validators.maxLength(100)]],
			architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
			architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			architectPermanentAddress: [null, [Validators.required, Validators.maxLength(300)]],
			architectPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],

			// architectContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			architectContactNo : [null, [Validators.required, Validators.maxLength(10)]],
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
			attachments: [],
			/* Step 6 controls end */
			fileStatus:null
		});
	}

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 13;
		let step1 = 18;
		let step2 = 34;
		let step3 = 62;
		let step4 = 76;

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
					// this.provisionalNocForm.get('otherPurposeRemark').setValidators([Validators.required])
				}
			});
			if (!this.codeOther) {
				this.provisionalNocForm.get('otherPurposeRemark').reset();
				// this.provisionalNocForm.get('otherPurposeRemark').clearValidators();
			}
		} catch (e) {

		}
	}

	patchValue(){
		this.provisionalNocForm.patchValue(this.dummyJSON);
	}

	dummyJSON:any={
		"provisionalNocNumber": null,
		"oldReferenceNumber": null,
		"officeContactNo": "111111111111",
		"onsitePersonMobileNo": "2222222222",
		"applicantPermanentAddress": "dfsdfsdfsdfsdf",
		"applicantPermanentAddressGuj": "દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફસ્દ્ફ્સ્દ્ફ્સ્દ્ફ્દ્સ",
		"officeEmailId": "a@a.com",
		"appliedForId": {
		  "code": "FS_HIGH_RISE"
		},
		"usageTypeId": {
		  "code": "FS_RESIDENTIAL"
		},
		"subjectTo": "dfsdfsdfsdf",
		"purposeOfBuildingUse": [
		  {
			"code": "MALL_MULTIPLEX",
			"name": "Mall Multiplex",
			"gujName": "મોલ મલ્ટિપ્લેક્સ"
		  }
		],
		"otherPurposeRemark": null,
		"architectRegistrationNumber": "324234324324324",
		"architectName": "sdfsdfsdf",
		"architectNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"architectFirmName": "sdfsdfsdfsdfsdf",
		"architectFirmNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"architectPermanentAddress": "dfsdfsdfsdfsdfdsfdsf",
		"architectPermanentAddressGuj": "દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્દ્સ્ફ્દ્સ્ફ",
		"architectContactNo": "342342342342",
		"siteAddress": "gfdsgdfgfdgfdg",
		"siteAddressGuj": "ગ્ફ્દ્સ્ગ્દ્ફ્ગ્ફ્દ્ગ્ફ્દ્ગ",
		"fireVendorType": {
		  "code": "CLASS_A"
		},
		"fireVendorRegistrationNumber": "345435435435435",
		"fireVendorName": "fdgdfgfdgfdgfdgfdg",
		"fireVendorNameGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ્ફ્દ્ગ્ફ્દ્ગ્ફ્દ્ગ",
		"fireVendorAddress": "dfgfdgfdgfdgfdgfdg",
		"fireVendorOfficeAddress": "fdgfdgfdgfgfgfdgfgfgfgfg",
		"fpNo": "43543534",
		"rsNo": "43534543",
		"tikaNo": "43543543",
		"townPlanningNo": "43543543",
		"buildingLocation": "fdgfdgfdgfdg",
		"blockNo": "234",
		"opNo": "23423423",
		"citySurveyNo": "42342342",
		"buildingHeight": 234,
		"totalBuildingFloor": 234,
		"noOfBasement": 1,
		"lowerBasement": 34,
		"upperBasement": 43,
		"basementArea": 454,
		"multipleTowers": true,
		"noOfTowers": 423,
		"noOfApproachedRoad": 423,
		"noOfVentilation": 423,
		"ventilationProvisionDetail": "435",
		"plotArea": 45,
		"constructionArea": 45,
		"drawingProvided": true,
		"siteAddressWithBuildingName": "dfgfdgfdg",
		"siteAddressWithBuildingNameGuj": "દ્ફ્ગ્ફ્દ્ગ્ફ્દ્ગ",
		"otherInformation": "fdgfdgfdgfdg",
		"gaslineInUnderground": true,
		"undergroundCabling": true,
		"ongcLineInUnderground": true,
		"areaZone": {
		  "code": "COMMERCIAL_ZONE"
		},
		"previouslyNocTaken": {
		  "code": "FS_YES"
		},
		"undergroundWaterTankLength": "435",
		"undergroundWaterTankBreadth": "45",
		"undergroundWaterTankHeight": "54435",
		"undergroundWaterTankCapacity": "435",
		"undergroundWaterTankVolume": "435",
		"undergroundWatertankMapApproved": true,
		"overgroundWaterTankLength": "435",
		"overgroundWaterTankBreadth": "54",
		"overgroundWaterTankHeight": "55",
		"overgroundWaterTankCapacity": "5345",
		"overgroundWaterTankVolume": "435",
		"overgroundWatertankMapApproved": true,
		"attachments": [],
		"fileStatus": "DRAFT",
		"serviceType": "FS_PROVISIONAL_NOC",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"agree": false,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"firstName": "SHAN",
		"middleName": null,
		"lastName": "SANGEWAR",
		"aadhaarNo": null,
		"email": "shantanu.sangewar@nascentinfo.com",
		"serviceDetail": {
		  "code": "FS-PROVI",
		  "name": "Provisional Fire NOC",
		  "gujName": "કામચલાઉ અંતિમ એનઓસી",
		  "feesOnScrutiny": false,
		  "appointmentRequired": false
		}
	  };
}
