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

@Component({
	selector: 'app-navratri-noc',
	templateUrl: './navratri-noc.component.html',
	styleUrls: ['./navratri-noc.component.scss']
})
export class NavratriNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	navaratriNocForm: FormGroup;
	translateKey: string = 'navratriFireNocScreen';

	formId: number;
	apiCode: string;

	// required attachment array
	uploadFilesArray: Array<any> = [];
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();
	//Lookups Array
	// FS_AREA_ZONE: Array<any> = [];

	//	startMinDate = moment(new Date()).format('YYYY-MM-DD');
	endMinDate = moment(new Date()).format('YYYY-MM-DD');
	endLetterDate = moment(new Date()).format('YYYY-MM-DD');
	toMinDate :any = new Date;
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

		// this.getLookupData();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getnavratriNocLicNewData();
			this.navaratriNocFormControls();
		}


		/**
		 * Subscribe start date changes
		 */
		this.navaratriNocForm.controls.fromDate.valueChanges.subscribe(data => {
			this.navaratriNocForm.controls.toDate.reset();
			this.toMinDate = data;
			//this.toStartDate = data;
		  return;
	  });     
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.navaratriNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		this.dependentAttachment(this.navaratriNocForm.get('applicationThroughPolice').value, 'POLICE_COMMISSIONER_LETTER_NO');
		this.dependentAttachment(this.navaratriNocForm.get('securityArrangement').value, 'SECURITY_ARRANGEMENT');
		this.dependentAttachment(this.navaratriNocForm.get('landOwnerConsentIncluded').value, 'CONSENT_LETTER');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {
		var control = (<FormArray>this.navaratriNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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
     * This method is change date formate.
     * @param date : Input date(any format).
     * @param controlType : Input From Control.
     */
	dateFormate(date, controlType: string) {
		this.navaratriNocForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method for set validation on form control
	 * @param formControl - control name
	 */
	onChange(controlName: string, dependentControl: string) {
		this.navaratriNocForm.get(dependentControl).reset();
		if (this.navaratriNocForm.get(controlName).value) {
			this.navaratriNocForm.get(dependentControl).setValidators([Validators.required]);
			// this.navaratriNocForm.updateValueAndValidity();
		}
		else {
			this.navaratriNocForm.get(dependentControl).clearValidators();
			// this.navaratriNocForm.updateValueAndValidity();
		}
	}

	/**
	 * This method for set validation on form control
	 * @param event - control event
	 */
	changeApplicationThroughPolice(value, isReset: boolean) {
		let policeCommisionerLetterNo = this.navaratriNocForm.get('policeCommisionerLetterNo'), policeCommisionerLetterDate = this.navaratriNocForm.get('policeCommisionerLetterDate');
		if (isReset) {
			policeCommisionerLetterNo.reset();
			policeCommisionerLetterDate.reset();
		}
		policeCommisionerLetterNo.clearValidators();
		policeCommisionerLetterDate.clearValidators();
		if (value) {
			policeCommisionerLetterNo.setValidators([Validators.required, Validators.maxLength(20)]);
			policeCommisionerLetterDate.setValidators([Validators.required]);
		}
		policeCommisionerLetterNo.updateValueAndValidity();
		policeCommisionerLetterDate.updateValueAndValidity();
	}

	/**
	 * This method for set validation on form control
	 * @param event - control event
	 */
	changeLandOwnerIsVMC(value, isReset: boolean) {
		let vmcFeeReceiptNo = this.navaratriNocForm.get('vmcFeeReceiptNo');
		if (isReset) {
			vmcFeeReceiptNo.reset();
		}
		vmcFeeReceiptNo.clearValidators();
		if (value) {
			vmcFeeReceiptNo.setValidators([Validators.required, Validators.maxLength(15)]);
		}
		vmcFeeReceiptNo.updateValueAndValidity();
	}

	/**
	 * This method for set validation on form control
	 * @param event - control event
	 */
	changeLandOwnerConsentIncluded(value, isReset: boolean) {
		let consentLetterDate = this.navaratriNocForm.get('consentLetterDate');
		if (isReset) {
			consentLetterDate.reset();
		}
		consentLetterDate.clearValidators();
		if (value) {
			consentLetterDate.setValidators([Validators.required, Validators.maxLength(10)]);
		}
		consentLetterDate.updateValueAndValidity();
	}

	/**
	 * Method is used to get form data
	 */
	getnavratriNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.navaratriNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.navaratriNocForm.get('applicantNameGuj');
				let applicantNameValue = this.navaratriNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.navaratriNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
				});
				this.requiredDocumentList();

				this.changeApplicationThroughPolice(this.navaratriNocForm.get('applicationThroughPolice').value, false);
				this.changeLandOwnerIsVMC(this.navaratriNocForm.get('landOwnerIsVMC').value, false);
				this.changeLandOwnerConsentIncluded(this.navaratriNocForm.get('landOwnerConsentIncluded').value, false);

			} catch (error) {
				console.log(error.message)
			}
		});
	}

	/**
	* Method is used to get lookup data
	*/
	// getLookupData() {
	// 	this.formService.getDataFromLookups().subscribe(res => {
	// 		this.FS_APPLIED_FOR = res.FS_APPLIED_FOR;
	// 	});
	// }

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	navaratriNocFormControls() {
		this.navaratriNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-NAV',
			/* Step 1 controls start */
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			contactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],
			applicationDate: [{ value: null, disabled: true }],

			/* Step 2 controls start */
			applicationThroughPolice: [null, [Validators.required, Validators.maxLength(10)]],
			policeCommisionerLetterNo: [null, [Validators.required, Validators.maxLength(20)]],
			policeCommisionerLetterDate: [null, [Validators.required]],
			organizeName: [null, [Validators.required, Validators.maxLength(100)]],
			organizeNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			organizerAddress: [null, [Validators.required, Validators.maxLength(200)]],
			organizerAddressGuj: [null, [Validators.required, Validators.maxLength(600)]],
			organizerMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			responsiblePersonMobileName: [null, [Validators.required, Validators.maxLength(100)]],
			responsiblePersonMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],

			/* Step 3 controls start */
			garbaPlaceAddress: [null, [Validators.required, Validators.maxLength(100)]],
			garbaPlaceAddressGuj: [null, [Validators.required, Validators.maxLength(300)]],
			fromDate: [null, [Validators.required]],
			toDate: [null, [Validators.required]],
			tpNo: [null, [Validators.required, Validators.maxLength(10)]],
			fpNo: [null, [Validators.required, Validators.maxLength(10)]],
			plotNo: [null, [Validators.required, Validators.maxLength(10)]],
			landOwnerConsentIncluded: [null, [Validators.maxLength(10)]],
			garbaInVMCRange: [null, [Validators.required, Validators.maxLength(10)]],
			landOwnerIsVMC: [null, [Validators.required, Validators.maxLength(10)]],
			vmcFeeReceiptNo: [null, [Validators.required, Validators.maxLength(15)]],
			consentLetterDate: [null, [Validators.required, Validators.maxLength(10)]],
			hazardousPerformanceDetail: [null, [Validators.required, Validators.maxLength(150)]],

			/* Step 4 controls start */
			noOfGatheringPersons: [null, [Validators.required, Validators.maxLength(5)]],
			eventArea: [null, [Validators.required, Validators.maxLength(5)]],
			sittingArea: [null, [Validators.required, Validators.maxLength(5)]],
			stageArea: [null, [Validators.required, Validators.maxLength(5)]],
			performanceArea: [null, [Validators.required, Validators.maxLength(5)]],
			totalArea: [null, [Validators.required, Validators.maxLength(5)]],
			shamiyanaLength: [null, [Validators.required, Validators.maxLength(5)]],
			shamiyanaWidth: [null, [Validators.required, Validators.maxLength(5)]],
			archGateHeight: [null, [Validators.required, Validators.maxLength(5)]],
			archGateWidth: [null, [Validators.required, Validators.maxLength(5)]],
			layoutPlanIncluded: [null, [Validators.required, Validators.maxLength(10)]],
			noOfExits: [null, [Validators.required, Validators.maxLength(6)]],
			securityArrangement: [null, [Validators.required, Validators.maxLength(10)]], //yes,no
			parkingArrangement: [null, [Validators.required, Validators.maxLength(10)]],//yes,no
			trainedFiremanStaffKept: [null, [Validators.required, Validators.maxLength(10)]],//yes,no
			funFairPlanned: [null, [Validators.required, Validators.maxLength(10)]],//yes,no
			weatherExitShownInMap: [null, [Validators.required, Validators.maxLength(10)]],//yes,no
			foodStallDetail: [null, [Validators.required, Validators.maxLength(200)]],
			highTensionLineOverGround: [null, [Validators.required, Validators.maxLength(10)]],
			fireSafetyActionWithProof: [null, [Validators.required, Validators.maxLength(200)]],

			/* Step 5 controls start*/
			attachments: []
			/* Step 5 controls end */
		});
	}

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {

		let step0 = 7;
		let step1 = 16;
		let step2 = 26;
		let step3 = 46;

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
			} else {
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

	patchValue(){
		this.navaratriNocForm.patchValue(this.dummyJSON);
	}

	dummyJSON:any={

		"applicationThroughPolice": true,
		"policeCommisionerLetterNo": "એફ/પરફ/વશી/૧૦૦/૨૦૨૧",
		"policeCommisionerLetterDate": moment(new Date()).format("YYYY-MM-DD"),
		"organizeName": "gdfgfdgfdgdf",
		"organizeNameGuj": "ગ્દ્ફ્ગ્ફ્દ્ગ્ફ્દ્ગ્દ્ફ",
		"organizerAddress": "gfdgfdfdggfdgfdg",
		"organizerAddressGuj": "ગ્ફ્દ્ગ્ફ્દ્ફ્દ્ગ્ગ્ફ્દ્ગ્ફ્દ્ગ",
		"organizerMobileNo": "2435435435",
		"responsiblePersonMobileName": "Test",
		"responsiblePersonMobileNo": "4354354354",
		"garbaPlaceAddress": "sdfsdfsdffsdsdfsdf",
		"garbaPlaceAddressGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્ફ્સ્દ્સ્દ્ફ્સ્દ્ફ",
		"fromDate": moment(new Date()).format("YYYY-MM-DD"),
		"toDate": moment(new Date()).format("YYYY-MM-DD"),
		"tpNo" : "5656hfgj",
		"fpNo" : "1212jsjs",
		"plotNo" : "1212jsjs",
		"landOwnerConsentIncluded": true,
		"garbaInVMCRange": true,
		"landOwnerIsVMC": true,
		"vmcFeeReceiptNo": "fsdgfdgdfgfdg",
		"consentLetterDate": moment(new Date()).format("YYYY-MM-DD"),
		"hazardousPerformanceDetail": "sdfsdfsdfsdfsdfsdfdsfsdf",
		"noOfGatheringPersons": "234",
		"eventArea": "234",
		"sittingArea": "23423",
		"stageArea": "23423",
		"performanceArea": "42342",
		"totalArea": "32423",
		"shamiyanaLength": "32423",
		"shamiyanaWidth": "23423",
		"archGateHeight": "23423",
		"archGateWidth": "32423",
		"layoutPlanIncluded": true,
		"noOfExits": "23",
		"securityArrangement": true,
		"parkingArrangement": true,
		"trainedFiremanStaffKept": true,
		"funFairPlanned": true,
		"weatherExitShownInMap": true,
		"foodStallDetail": "234",
		"highTensionLineOverGround": true,
		"fireSafetyActionWithProof": "fdgdfgfdgfdg",
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
		  "code": "FS-NAV",
		  "name": "Navratri NOC Application",
		  "gujName": "નવરાત્રી એનઓસી અરજી",
		  "feesOnScrutiny": false,
		  "appointmentRequired": false
		}
	  };
}

