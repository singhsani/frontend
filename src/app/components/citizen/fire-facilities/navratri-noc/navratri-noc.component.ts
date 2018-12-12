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
	tabIndex: number = 0;

	// required attachment array
	private uploadFilesArray: Array<any> = [];
	private showButtons: boolean = false;
	//Lookups Array
	// FS_AREA_ZONE: Array<any> = [];

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

		// this.getLookupData();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getnavratriNocLicNewData();
			this.navaratriNocFormControls();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {

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
		this.dependentAttachment(this.navaratriNocForm.get('securityArrangement').value, 'SECURITY_ARRANGEMENT');
		this.dependentAttachment(this.navaratriNocForm.get('vmcConsentLetterIncluded').value, 'CONSENT_LETTER');
		this.dependentAttachment(this.navaratriNocForm.get('weatherExitShownInMap').value,'LOCATION_MAP');
		this.dependentAttachment(this.navaratriNocForm.get('trainedFiremanStaffKept').value,'TRAIN_FIRE_PERSON_LIST');
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
	onChange(controlName: string, formControl: string) {
		this.navaratriNocForm.get(formControl).reset();
		if (controlName) {
			this.navaratriNocForm.get(formControl).setValidators([Validators.required]);
		}
		else {	
			this.navaratriNocForm.get(formControl).clearValidators();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getnavratriNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.navaratriNocForm.patchValue(res);
				this.showButtons = true;

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.navaratriNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
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
			firstName: [null, [Validators.required, Validators.maxLength(100)]],
			lastName: [null, [Validators.required, Validators.maxLength(100)]],
			middleName: [null, Validators.maxLength(100)],
			contactNo: [null, [Validators.required, Validators.maxLength(10)]],
			email: [null, [Validators.required, Validators.maxLength(50)]],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],

			applicationThroughPolice: [null, [Validators.required, Validators.maxLength(10)]],
			policeCommisionerLetterNo: [null, [Validators.required, Validators.maxLength(20)]],
			policeCommisionerLetterDate: [null, [Validators.required]],
			organizeName: [null, [Validators.required, Validators.maxLength(100)]],
			organizeNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			organizerAddress: [null, [Validators.required, Validators.maxLength(200)]],
			organizerAddressGuj: [null, [Validators.required, Validators.maxLength(600)]],
			organizerMobileNo: [null, [Validators.maxLength(10)]],
			responsiblePersonMobileNo: [null, [Validators.required, Validators.maxLength(10)]],
			garbaPlaceAddress: [null, [Validators.required, Validators.maxLength(100)]],
			garbaPlaceAddressGuj: [null, [Validators.required, Validators.maxLength(300)]],
			fromDate: [null, [Validators.required]],
			toDate: [null, [Validators.required]],
			landOwnerConsentIncluded: [null, [Validators.required]],
			garbaInVMCRange: [null, [Validators.required, Validators.maxLength(10)]],
			landOwnerIsVMC: [null, [Validators.required, Validators.maxLength(10)]],
			vmcfeeReceiptNo: [null, [Validators.maxLength(15)]],
			vmcConsentLetterIncluded: [null, [Validators.maxLength(15)]],
			consentLetterDate: [null, [Validators.maxLength(10)]],
			hazardousPerformanceDetail: [null, [Validators.required, Validators.maxLength(150)]],
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

			/* Step 6 controls start*/
			attachments: []
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

		let step0 = 9;
		let step1 = 18;
		let step2 = 29;
		let step3 = 50;
		let step4 = 59;

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

