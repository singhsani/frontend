
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { AnimalPondService } from '../common/services/animal-pond.service';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../license-configuration';
import { log } from 'console';

@Component({
	selector: 'app-animal-pond-duplicate',
	templateUrl: './animal-pond-duplicate.component.html',
	styleUrls: ['./animal-pond-duplicate.component.scss']
})
export class AnimalPondDuplicateComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	animalPondDuplicateForm: FormGroup;
	translateKey: string = 'animalPondDuplicateScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	public showButtons: boolean = false;

	//Lookups Array
	PERSON_TYPE: Array<any> = [];

	// required attachment array
	public uploadFileArray: Array<any> = [];
	ANIMAL_POND_STATUS_OF_BUSINESS: Array<any> = [];

	// serach api variable
	serachLicenceObj = {
		isDisplayDuplicateLicenceForm: <boolean>false,
		searchLicenceNumber: ""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		let obj = { refNumber: this.serachLicenceObj.searchLicenceNumber };
		this.AnimalPondService.searchLicence(obj).subscribe(
			(res: any) => {
				if (res.success) {
					this.serachLicenceObj.isDisplayDuplicateLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
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
	* @param toastrService - Show massage with timer.
	 */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private toastrService: ToastrService,
		private AnimalPondService: AnimalPondService,
		private location: Location
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
		this.animalPondDuplicateFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayDuplicateLicenceForm = true;
			this.getAnimalPondLicDuplicateData();
			this.animalPondDuplicateForm.disable();
			this.enableFielList();
		}
	}

	/**
	 * This method is use to create new record for citizen.
	 * @param searchData: exciting licence number data
	 */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {
			this.formId = res.serviceFormId;
			this.animalPondDuplicateForm.patchValue(searchData);

			this.animalPondDuplicateForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
				serviceFormId: res.serviceFormId,
				wardNo: searchData.wardNo,
				zoneNo: searchData.zoneNo,
				blockNo: searchData.blockNo.code,
				totalAnimal: searchData.totalAnimal,

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

				periodFrom: res.periodFrom,
				periodTo: res.periodTo,
				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				// licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: []
			});
			this.showButtons = true;

			this.animalPondDuplicateForm.disable();
			this.enableFielList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * This method use for edit some fiels.
	 */
	enableFielList() {
		// this.animalPondDuplicateForm.get('temporaryAddress').enable();
		this.animalPondDuplicateForm.get('noOfCopies').enable();
	}

	/**
	 * Method is used to get form data
	 */
	getAnimalPondLicDuplicateData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.animalPondDuplicateForm.patchValue(res);
				this.showButtons = true;
			} catch (error) {
				console.log(error.message);
			}
		});
	}

	/**
	* Method is used to get lookup data
	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.PERSON_TYPE = res.PERSON_TYPE;
			this.ANIMAL_POND_STATUS_OF_BUSINESS = res.ANIMAL_POND_STATUS_OF_BUSINESS
		});
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	animalPondDuplicateFormControls() {
		this.animalPondDuplicateForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'APL-DUP',
			refNumber: [null],
			/* Step 1 controls start */
			personType: this.fb.group({
				code: [null]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30)]],
			holderMiddleName: [null, [Validators.maxLength(30)]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30)]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.maxLength(30)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [ValidationService.telPhoneNumberValidator]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
			holderPanNo: [null, [Validators.required, Validators.maxLength(10)]],
			/* Step 1 controls end */
			applicationDate: [],
			licenseIssueDate: [null],
			licenseDuplicatealDate: [null],
			loinumber: [null],
			noOfCopies: [1, [Validators.required]],
			/* Step 4 controls start*/
			attachments: [],
			businessType: this.fb.group({
				code: [null, Validators.required]
			}),
			wardNo: [null],
			zoneNo: [null],
			blockNo:[null],
			totalAnimal: null
			/* Step 4 controls end */
		});
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
			serviceFormId: this.formId,
		}
		return this.uploadModel;
	}

	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(flag) {

		let step0 = 23;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;

			if (count <= step0) {
				this.tabIndex = 0;
				return false;
			}
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

	changeNoOfCopies(event) {
		if (event.target.value < 1) {
			this.animalPondDuplicateForm.get('noOfCopies').setValue(1);
			this.commonService.openAlert('Warning', 'No. Of Copies Zero Not allowed', 'warning');
			return;
		}
	}

}


