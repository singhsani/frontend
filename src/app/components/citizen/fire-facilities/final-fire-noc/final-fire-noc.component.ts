import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';

import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
@Component({
	selector: 'app-final-fire-noc',
	templateUrl: './final-fire-noc.component.html',
	styleUrls: ['./final-fire-noc.component.scss']
})
export class FinalFireNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	finalFireNocNewForm: FormGroup;
	translateKey: string = 'finalFireNocNewScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

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
		private toastrService: ToastrService
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

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getFinalFireNocLicNewData();
			this.getLookupData();
			this.finalFireNocNewFormControls();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getFinalFireNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.finalFireNocNewForm.patchValue(res);
				this.showButtons = true;
			} catch (error) {
				console.log(error.message)
			}
		});
	}


	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {

		});
	}


   /**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	finalFireNocNewFormControls() {
		this.finalFireNocNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-FINAL',
			/* Step 1 controls start */
			licenseType: this.fb.group({
				code: [null]
			}),
			personType: this.fb.group({
				code: [null]
			}),
			holderFirstName: [null, [Validators.required, Validators.maxLength(30),ValidationService.nameValidator]],
			holderMiddleName: [null, [Validators.required, Validators.maxLength(30),ValidationService.nameValidator]],
			holderLastName: [null, [Validators.required, Validators.maxLength(30),ValidationService.nameValidator]],
			holderFirstNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderMiddleNameGuj: [null, [Validators.required, Validators.maxLength(90)]],
			holderLastNameGuj: [null, [Validators.required, Validators.maxLength(90)]],

			permanantAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			temporaryAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),

			holderTelephoneNo: [null, [Validators.maxLength(12), Validators.minLength(10)]],
			holderMobileNo: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
			holderFaxNo: [null, [Validators.maxLength(12)]],
			holderAadharNo: [null, [Validators.required, Validators.maxLength(12)]],
			holderPanNo: [null, [Validators.required, Validators.maxLength(10)]],
			/* Step 1 controls end */

			/* Step 2 controls start */
			zoneNo: this.fb.group({ code: [null, Validators.required] }),
			wardNo: this.fb.group({ code: [null, Validators.required] }),
			blockNo: this.fb.group({ code: [null, Validators.required] }),
			businessAddress: this.fb.group(this.permanantAddressEstablishment.addressControls()),
			extraDetailsOfBusiness: [null, [Validators.maxLength(500)]],
			relationshipId: this.fb.group({
				code: [null, Validators.required]
			}),
			statusOfBusinessId: this.fb.group({
				code: [null, Validators.required]
			}),
			/* Step 2 controls end */

			/* Step 3 controls start */
			relationshipList: this.fb.array([]),
			/* Step 3 controls end */

			applicationDate: [],
			licenseIssueDate: [null],
			licenseRenewalDate: [null],
			loinumber: [null],

			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
		});
	}
}
