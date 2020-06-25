import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { DrainageService } from '../service/drainage.service';
import { Constants } from 'src/app/vmcshared/Constants';
import * as _ from 'lodash';
import { WaterDrinageConfig} from '../water-drinage-config';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

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

	uploadFilesArray: Array<any> = [];

	//Lookups Array
	reasonList = [];
	disconnectionTypeList = [];
	config: WaterDrinageConfig = new WaterDrinageConfig();

	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private formService: FormsActionsService,
		private toastrService: ToastrService,
		public translateService: TranslateService,
		public drainageService: DrainageService,
		private alertService: AlertService

	) { }

	/**
		* T*his method call initially required methods.
		*/
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.apiCode = param.get('apiCode');
			this.formId = Number(param.get('id'));
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		  }else{
			this.drainageDisconnectionControls();
			this.getLookups();
			this.getFormData(this.formId);
		  }
	

	}

	getFormData(id: number) {
		this.formService.getFormData(id).subscribe(res => {
		  this.drainageDisconnectionForm.patchValue(res);
		  res.serviceDetail.serviceUploadDocuments.forEach(app => {
			(<FormArray>this.drainageDisconnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
		  });
		  this.requiredDocumentList();
		})
	  }
	  requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.drainageDisconnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
		  if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
			this.uploadFilesArray.push({
			  'labelName': value.documentLabelEn,
			  'fieldIdentifier': value.fieldIdentifier,
			  'documentIdentifier': value.documentIdentifier
			})
		  }
		});
		console.log("uploadFileArray", this.uploadFilesArray);
		//check for attachment is mandatory
		//	this.dependentAttachment(this.waterPipeliConnectionForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
		//this.dependentAttachment(this.waterPipeliConnectionForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
	  }


	/**
	  * Method is used to set form controls
	  * 'Guj' control is consider as a Gujarati fields
	  */
	drainageDisconnectionControls() {
		this.drainageDisconnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'HEL-WTR-DRAINAGE-DISCONNECTION',
			drainageConnectionNo: [null],
			ownerName: [null],
			address: [null],
			reasonForDisconnection: [null, [Validators.required]],
			drainageDisconnectionType: [null, [Validators.required]],
			// reasonList: this.fb.group({
			// 	reasonForDisconnectionId: [null, [Validators.required]]
			// }),
			// disconnectionTypeList: this.fb.group({
			// 	disconnectionTypeId: [null, [Validators.required]]
			// }),


			/* Step 2 controls start*/
			attachments: []
			/* Step 2 controls end */
		});
	}

	searchByConnectionNo() {
		const connectionNo = this.drainageDisconnectionForm.get('drainageConnectionNo').value;
		this.drainageService.searchByDrainageConnectionId(connectionNo).subscribe( data => {

			if (data['id']) {
				this.drainageDisconnectionForm.get('ownerName').setValue(data['ownerName']);
				this.drainageDisconnectionForm.get('address').setValue(data['address']);
			} else {
				this.alertService.info('No Data Found!');
			}
			
		}, error => {
			console.log('error', error);
		})

	}

	getLookups() {
        let lookupcode = `lookup_codes=${Constants.LookupCodes.Disconnection_Type}&lookup_codes=${Constants.LookupCodes.Reason_for_Disconnection}`;
        this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
            this.reasonList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Reason_for_Disconnection))[0].items;
			this.disconnectionTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Disconnection_Type))[0].items;
		});
		
    }

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







