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
import * as _ from 'lodash';
import { Constants } from 'src/app/vmcshared/Constants';
import { WaterDrinageConfig } from '../water-drinage-config';
import { DrainageService } from '../service/drainage.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-drainage-transfer-connection',
  templateUrl: './drainage-transfer-connection.component.html',
  styleUrls: ['./drainage-transfer-connection.component.scss']
})
export class DrainageTransferConnectionComponent implements OnInit {

  
  drainageTransferconnectionForm: FormGroup;
  translateKey: string = 'drainage_transfer_connection';
  licenseConfiguration: LicenseConfiguration = new LicenseConfiguration(); 

  formId: number;
  apiCode: string;

  //Lookups Array
   REASON_TYPE: Array<any> = [];
	MF_RELATIONSHIP_OF_APPLICANT: Array<any> = [];
	reasonList = [];
	// required attachment array
	public uploadFileArray: Array<any> = [];
	uploadFilesArray: Array<any> = [];
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
			this.drainageTransferconnectionControls();
			this.getDrainagedTranferConnectionNewData();
			this.getLookups();
			this.getFormData(this.formId);
			}

	}
	
	/**
   * this method is used to get drainage pipeline connection data
   * 
   */
  getDrainagedTranferConnectionNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      try {
        this.drainageTransferconnectionForm.patchValue(res);
      } catch (error) {
        console.log(error.message)
      }
    });
  }

	getFormData(id: number) {
		this.formService.getFormData(id).subscribe(res => {
		  this.drainageTransferconnectionForm.patchValue(res);
		  res.serviceDetail.serviceUploadDocuments.forEach(app => {
			(<FormArray>this.drainageTransferconnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
		  });
		  this.requiredDocumentList();
		})
	  }
	  requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.drainageTransferconnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
		  if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
			this.uploadFilesArray.push({
			  'labelName': value.documentLabelEn,
			  'fieldIdentifier': value.fieldIdentifier,
			  'documentIdentifier': value.documentIdentifier
			})
		  }
		});
		console.log("uploadFileArray", this.uploadFilesArray);
		
	  }


  
	getLookups() {
		let lookupcode = `lookup_codes=${Constants.LookupCodes.Disconnection_Type}&lookup_codes=${Constants.LookupCodes.Reason_for_Disconnection}`;
		this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
				this.reasonList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Reason_for_Disconnection))[0].items;
	
		});
	}

  /**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	drainageTransferconnectionControls() {
		this.drainageTransferconnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'HEL-WTR-DRAINAGE-TRANS-CONNECTION',
			drainageConnectionNo: [null],
			ownerName: [null],
			address:[null],
			property_dues: [null],
			water_dues: [null],
			newOwnerName: [null, [Validators.required]],
			mobileNo: [null, [Validators.maxLength(10)]],
			aadhaarNo: [null, [Validators.maxLength(12)]],
			reasonForTransfer: [null, [Validators.required]],
			
		});
	}

	searchByConnectionNo(){
		const connectionNo = this.drainageTransferconnectionForm.get('drainageConnectionNo').value;
		this.drainageService.searchByDrainageConnectionId(connectionNo).subscribe( data => {

			if (data['id']) {
				this.drainageTransferconnectionForm.get('ownerName').setValue(data['ownerName']);
				this.drainageTransferconnectionForm.get('address').setValue(data['address']);
				this.drainageTransferconnectionForm.get('property_dues').setValue(data['propertyDues']);
				this.drainageTransferconnectionForm.get('water_dues').setValue(data['waterDues']);
			} else {
				this.alertService.info('No Data Found!');
			}
			
		}, error => {
			console.log('error', error);
		})

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
