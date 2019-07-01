import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalConfig } from '../hospital-config';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { TranslateService } from '../../../shared/modules/translate/translate.service';
import { ManageRoutes } from '../../../config/routes-conf';
import { Location } from '@angular/common';

@Component({
	selector: 'app-birth-correction',
	templateUrl: './birth-correction.component.html',
	styleUrls: ['./birth-correction.component.scss']
})
export class BirthCorrectionComponent implements OnInit {

	/**
	 * get stepper element from view.
	 */
	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	/**
	 * Birth correction form.
	 */
	birthCorrectionForm: FormGroup;

	/**
	 * check registration number status form.
	 */
	regStatusForm: FormGroup;

	/**
	 * language translation key.
	 */
	translateKey: string = 'birthCorrectionScreen';

	/**
	 * flag to display/hide application search form.
	 */
	showApplicationSearch: boolean = true;

	/**
	 * flag to display/hide application correction form.
	 */
	showcorrectionForm: boolean = false;

	/**
	 * flag to display/hide child name insertion form.
	 */
	allowChildNameInsertion: boolean = false;

	/**
	 * flag to display/hide child name correction form.
	 */
	allowChildNameCorrection: boolean = false;

	/**
	 * show file upload
	 */
	showButtons: boolean = false;

	/**
	 * used to file upload model.
	 */
	uploadModel: any = {};

	/**
	 * used to set start index 0 to tab.
	 */
	tabIndex: number = 0;

	/**
	 * tab step labels
	 */

	stepLable1: string = 'child_details';
	stepLable2: string = 'upload_documents';


	/**
	 * File upload validation array.
	 */
	uploadFileArray: Array<any> = [];

	/**
	 * Type of correction array.
	 */
	TypeOfCorrection: Array<any>;

	/**
	 * Application Id/ Service Form Id
	 */
	appId: number;

	/**
	 * Api Code
	 */
	apiCode: string;

	config: HospitalConfig = new HospitalConfig();

	/**
	 * Constructor.
	 * @param fb - form builder.
	 * @param commonService - common service of alert.
	 * @param location - location to update url.
	 * @param validationService - common validation service.
	 * @param router - router
	 * @param route - activated route.
	 * @param formService - common form service.
	 */
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private location: Location,
		private commonService: CommonService,
		private formService: HosFormActionsService,
		public translateService: TranslateService
	) { }

	/**
	 * Method initializes first.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
			this.birthCorrectionFormControls();
			this.getLookupData();
		});

		if (this.appId) {
			this.showApplicationSearch = false;
			this.showcorrectionForm = true;
			this.getBirthCorrectionData();
		} else {
			this.showApplicationSearch = true;
			this.registrationNumberStatusForm();
		}
	}

	/**
	   * method is used to create birth correctio form.
	   */
	birthCorrectionFormControls() {
		this.birthCorrectionForm = this.fb.group({
			//step - 1 (13)
			childName: null,
			childNameGuj: null,
			refNumber: null,
			typeOfCorrection: this.fb.group({
				code: [null]
			}),
			fieldView: "ALL",
			fieldList: null,
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			attachments: [],
		});
	}

	/**
	 * methid is used to get birth certificate data.
	 */
	getBirthCorrectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.birthCorrectionForm.patchValue(res);
			this.config.documentList(res, this.uploadFileArray);
			let event = res.typeOfCorrection.code;
			if (event === 'NAME_INSERTION') {
				this.allowChildNameInsertion = true;
				this.allowChildNameCorrection = false;
			}
			this.showButtons = true;
		});
	}

	/**
	 * Method is used to cread record.
	 * @param data - original json data.
	 */

	createBirthCorrectionData(data) {
		this.formService.createFormData().subscribe(res => {
			this.birthCorrectionForm.patchValue(res);
			this.config.documentList(res, this.uploadFileArray);
			this.appId = res.serviceFormId;
			let cururl = this.location.path().replace('false', this.appId.toString());
			this.location.go(cururl);
			this.getLookupData();
			this.setValue(data);
			this.showcorrectionForm = true;
			this.showApplicationSearch = false;
			this.showButtons = true;
			this.changeCorrection(this.regStatusForm.get('typeOfCorrection').get('code').value);
		})
	}

	/**
	 * Method is used to decide insertion/correction form on get.
	 * @param event - event type.
	 */
	changeCorrection(event) {

		if (event === 'NAME_INSERTION') {
			if (this.birthCorrectionForm.get('childName').value != "") {
				this.allowChildNameInsertion = false;
				this.allowChildNameCorrection = true;
			} else {
				this.allowChildNameInsertion = true
			}
		}
	}

	/**
	 * call API to get registration data and status.
	 */
	getRegistrationNumberStatus() {
		if (this.regStatusForm.valid) {
			this.formService.getRegistrationStatus(this.regStatusForm.getRawValue()).subscribe(resp => {
				if (resp.success) {
					this.createBirthCorrectionData(resp.data);
				}
			}, err => {
				if (err.error[0].code == 'INSERTION_NOT_ALLOWED') {
					this.commonService.openAlert("Invalid Operation", "Name Already Available, Insertion Not Allowed", "warning");
					return;
				} else if (err.error[0].code == 'INVALID_REQUEST') {
					this.commonService.openAlert("Invalid Request", "Request Not Valid", "warning");
					return;
				}
			});
		} else {
			this.config.getAllErrors(this.regStatusForm);
			this.commonService.openAlert("Feild Error", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning")
		}
	}

	/**
	 * Method is used to set original data.
	 * @param data - original json.
	 */
	setValue(data) {
		this.birthCorrectionForm.get('fieldView').setValue(data.fieldView);
		this.birthCorrectionForm.get('fieldList').setValue(data.fieldList);
		this.birthCorrectionForm.get('childName').setValue(data.childName);
		this.birthCorrectionForm.get('childNameGuj').setValue(data.childNameGuj)
		this.birthCorrectionForm.get('refNumber').setValue(this.regStatusForm.get('applicationNumber').value)
		this.birthCorrectionForm.get('typeOfCorrection').get('code').setValue(this.regStatusForm.getRawValue().typeOfCorrection.code);
		this.formService.saveFormData(this.birthCorrectionForm.value).subscribe(res => {
			this.birthCorrectionForm.patchValue(res);
		})
	}


	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.TypeOfCorrection = res.BIRTH_CORRECTION_TYPE;
		});
	}

	/**
	 * method is used to create registration status form.
	 */
	registrationNumberStatusForm() {
		this.regStatusForm = this.fb.group({
			typeOfCorrection: this.fb.group({
				code: ['NAME_INSERTION', [Validators.required]]
			}),
			applicationNumber: [null, [Validators.required, Validators.maxLength(50)]],
		});
		this.regStatusForm.get('typeOfCorrection').get('code').disable();
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 6;
		if (count <= step1) {
			this.tabIndex = 0;
			return false;
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
	 * Method is used to set data value to upload method.
	 * @param indentifier - file identifier
	 * @param labelName - file label name.
	 * @param formPart - file form part
	 * @param variableName - file variable name.
	 */
	setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {
		this.uploadModel = {
			fieldIdentifier: indentifier.toString(),
			labelName: labelName,
			formPart: formPart,
			variableName: variableName,
			serviceFormId: this.appId,
		}
		return this.uploadModel;
	}
}
