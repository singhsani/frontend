import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogFormComponentTempFire } from '../common/components/dialog-form-tempFire/dialog-form.component';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';


@Component({
	selector: 'app-temp-fireworks-noc',
	templateUrl: './temp-fireworks-noc.component.html',
	styleUrls: ['./temp-fireworks-noc.component.scss']
})
export class TempFireworksNocComponent implements OnInit {

	tempFireworksNocForm: FormGroup;
	translateKey: string = 'tempFireworksFireNocScreen';

	formId: number;
	apiCode: string;

	// required attachment array
	uploadFilesArray: Array<any> = [];
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	//Lookups Array
	FS_WIRING_TYPE: Array<any> = [];
//	startMinDate = moment(new Date()).format('YYYY-MM-DD');
	endMinDate = moment(new Date()).format('YYYY-MM-DD');
	fromDate = moment(new Date()).format('YYYY-MM-DD');
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
		public TranslateService: TranslateService,
		private commonService: CommonService,
		private toastrService: ToastrService,
		private fireFacilitiesService: FireFacilitiesService,
		private dialog: MatDialog
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
			this.gettempFireworksNocNewData();
			this.tempFireworksNocFormControls();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory

		// this.dependentAttachment(this.tempFireworksNocForm.get('applicationThroughPolice').value, 'LETTER_TO_APPLICANT');
		this.dependentAttachment(this.tempFireworksNocForm.get('securityArrangement').value, 'SECURITY_ARRANGEMENT');
		// this.dependentAttachment(this.tempFireworksNocForm.get('layoutPlanIncluded').value, 'LOCATION_MAP');
		this.dependentAttachment(this.tempFireworksNocForm.get('ownerConsentLetterIncluded').value, 'CONSENT_LETTER');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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


	openDialog() {
		let returnArray = this.tempFireworksNocForm.get('shopDetails') as FormArray;
		if (returnArray.length >= 15) {
			this.commonService.openAlert("Warning", "Maximum Limit " + 15 + " .", "warning");
		} else if (this.tempFireworksNocForm.get('canEdit').value) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data = {};

			const dialogRef = this.dialog.open(DialogFormComponentTempFire, dialogConfig);

			dialogRef.afterClosed().subscribe(
				data => {
					if (data) {
						returnArray.push(this.createOTDetailArray(data));
						this.tempFireworksNocForm.get('noOfShops').setValue(returnArray.length)
					}

				}
			);
		}
		else {
			this.commonService.openAlert("Warning", "OT Detail is already added", "warning");
		}
	}

	/**
	 * Method is used to return array
	 * @param data : person data array 
	 */
	createOTDetailArray(data?: any) {
		return this.fb.group({
			// serviceFormId: this.formId,
			id: data.id ? data.id : null,
			shopNo: [data.shopNo ? data.shopNo : null, [Validators.maxLength(150)]],
			shopName: [data.shopName ? data.shopName : null, [Validators.maxLength(5)]],
		
		
		})

	}
    /**
     * This method is change date formate.
     * @param date : Input date(any format).
     * @param controlType : Input From Control.
     */
	dateFormate(date, controlType: string) {
		this.tempFireworksNocForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to get form data
	 */
	gettempFireworksNocNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.tempFireworksNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.tempFireworksNocForm.get('applicantNameGuj');
				let applicantNameValue = this.tempFireworksNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.shopDetails.forEach(app => {
					(<FormArray>this.tempFireworksNocForm.get('shopDetails')).push(this.createOTDetailArray(app));
				});

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.tempFireworksNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
			this.FS_WIRING_TYPE = res.FS_WIRING_TYPE;
		});
	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	tempFireworksNocFormControls() {
		this.tempFireworksNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-FIREWORKSHOP',
			/* Step 1 controls start */
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],
			oldReferenceNumber: [null, [Validators.maxLength(10)]],//not now
			applicationDate: [null, [Validators.required]],//not now

			/* Step 2 controls start */
			applicationThroughPolice: [false, [Validators.required]],//true/false
			temporaryShopAddress: [null, [Validators.required, Validators.maxLength(200)]],
			fromDate: [null, [Validators.required, Validators.maxLength(10)]],
			toDate: [null, [Validators.required, Validators.maxLength(10)]],
			noOfShops: [null, [Validators.required, Validators.maxLength(10)]],
			shopInVMCBoundry: [false, [Validators.required]],//true/false
			// requiredNOCForArea: [null, [Validators.required, Validators.maxLength(3)]],
			shopInOpenSpace: [null, [Validators.required, Validators.maxLength(150)]],
			ownerIsVMC: [false, [Validators.required]],//true/false
			ownerConsentLetterIncluded: [false, [Validators.required]],//true/false
			consentLetterDate: [null, [Validators.maxLength(100)]],//date
			propertyNo: [null, [Validators.required, Validators.maxLength(15)]],
			layoutPlanIncluded: [null, [Validators.required]],//true/false
			weatherExitShownInMap: [null, [Validators.required]],//true/false
			noOfExits: [null, [Validators.required, Validators.maxLength(3)]],
			usageOfInflammable: [null, [Validators.required, Validators.maxLength(500)]],
			shopDetails: this.fb.array([]),
			/* Step 3 controls start */
			securityArrangement: [null, [Validators.required]],//true/false
			parkingArrangement: [null, [Validators.required]],//true/false
			exitNoSmokingSignboardProvision: [null, [Validators.required]],//true/false
			standbyFireEngineDemanded: [null, [Validators.required]],//true/false
			lastYearLicenceReceived: [null, [Validators.required]],//true/false
			vmcFeeReceiptNo: [null, [Validators.required, Validators.maxLength(12)]],
			wiringType: this.fb.group({
				code: [null, Validators.required]
			}),

			/* Step 4 controls start */
			attachments: []
			/* Attachment Step end */
		});
	}


	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 8;
		let step1 = 30;

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
			}
			else {
				console.log("else condition");
			}

		}
	}

	/**
	 * This methos for edit OT data
	 * @param arrayId : OT index
	 * @param otdata : object data
	 */
	editOT(arrayId: any, otdata: any) {
		let id = otdata.controls.id.value;
		let shopNo = otdata.controls.shopNo.value;
		let shopName = otdata.controls.shopName.value;
		

		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;

		dialogConfig.data = {
			id, shopNo, shopName
		}

		const dialogRef = this.dialog.open(DialogFormComponentTempFire,
			dialogConfig);

		dialogRef.afterClosed().subscribe(
			val => {
				if (val) {
					let returnArray = this.tempFireworksNocForm.get('shopDetails') as FormArray;
					returnArray.controls[arrayId].setValue(val);
				}
			}
		);
	}

	/**
	 * Method is used to delete OT information from shopDetails array.
	 * @param OTData - OT data.
	 * @param index - index of shopDetails array
	 */
	deleteOT(OTData: any, index: number) {
		let returnArray = this.tempFireworksNocForm.get('shopDetails') as FormArray;
		// this.addItem(persontype).controls.splice(index, 1);
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.tempFireworksNocForm.get('noOfShops').value >= 1) {
				if (OTData.id == null) {
					returnArray.removeAt(index);
					this.tempFireworksNocForm.get('noOfShops').setValue(this.tempFireworksNocForm.get('noOfShops').value - 1);
					this.toastrService.success('OT details has been removed.')
				} else {
					//call api get response than delete
					this.fireFacilitiesService.deleteArrayDataTempFire(this.tempFireworksNocForm.get('id').value, OTData.id).subscribe(respData => {
						if (respData.success) {
							returnArray.removeAt(index);
							this.tempFireworksNocForm.get('noOfShops').setValue(returnArray.length);
							this.toastrService.success('OT details has been removed.')
						}
					})
				}

			}
		}
		);
	}


	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}

	patchValue(){
		this.tempFireworksNocForm.patchValue(this.dummyJSON);
	}

	dummyJSON:any = {
		"oldReferenceNumber": null,
		"applicationThroughPolice": true,
		"temporaryShopAddress": "aaaaaaaaaaaaaaa",
		"fromDate": moment(new Date()).format("YYYY-MM-DD"),
		"toDate": moment(new Date()).format("YYYY-MM-DD"),
		"noOfShops": "4",
		"shopInVMCBoundry": true,
		"shopInOpenSpace": "sdfsdf",
		"ownerIsVMC": true,
		"ownerConsentLetterIncluded": true,
		"consentLetterDate": moment(new Date()).format("YYYY-MM-DD"),
		"propertyNo": "sdfsdfsdf",
		"layoutPlanIncluded": true,
		"weatherExitShownInMap": true,
		"noOfExits": "3",
		"usageOfInflammable": "sdfdsfsdf",
		"securityArrangement": true,
		"parkingArrangement": true,
		"exitNoSmokingSignboardProvision": true,
		"standbyFireEngineDemanded": true,
		"lastYearLicenceReceived": true,
		"vmcFeeReceiptNo": "dfsdfsdfsdfs",
		"wiringType": {
		  "code": "OPEN"
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
		"canSubmit": true
	  };
}

