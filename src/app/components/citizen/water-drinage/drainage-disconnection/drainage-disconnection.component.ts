import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from '../../../../shared/services/common.service';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-drainage-disconnection',
  templateUrl: './drainage-disconnection.component.html',
  styleUrls: ['./drainage-disconnection.component.scss']
})
export class DrainageDisconnectionComponent implements OnInit {

  drainageDisconnectionForm: FormGroup; 
  translateKey: string = 'drainageDisconnection';
  licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

  formId: number;
  apiCode: string;

  //Lookups Array
   REASON_TYPE: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];

	// required attachment array
	public uploadFileArray: Array<any> = [];

  constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
    private commonService: CommonService,
    private formService: FormsActionsService,
		private toastrService: ToastrService,
		public TranslateService: TranslateService
	) { }

 /**
	 * T*his method call initially required methods.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});
        this.drainageDisconnectionControls();

  }
  


  /**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	drainageDisconnectionControls() {
		this.drainageDisconnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'HEL-WTR-DRAINAGE-DISCONNECTION',
			connectionNo: [null],
			ownerName: [null],
			address:[null],
			propertyDues: [null],
			waterDues: [null],
			
			reasonList: this.fb.group({
				reasonForDisconnectionId: [null, [Validators.required]]
			}),
			disconnectionTypeList: this.fb.group({
				disconnectionTypeId: [null, [Validators.required]]
			}),
   

			/* Step 2 controls start*/
			attachments: []
			/* Step 2 controls end */
		});
	}

	searchByConnectionNo(){}

 /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {
		let step0 = 7;
		let step1 = 6;

		switch (true) {
			case flag <= step0:
			this.licenseConfiguration.currentTabIndex = 0;
				break;
			case flag <= step1:
			this.licenseConfiguration.currentTabIndex = 1;
				break;
			
			default:
			this.licenseConfiguration.currentTabIndex = 0;

		}
	
	}
   



}







