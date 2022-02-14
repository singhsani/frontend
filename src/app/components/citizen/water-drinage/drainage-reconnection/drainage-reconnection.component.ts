import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from '../../../../shared/services/common.service';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { WaterDrinageConfig } from '../water-drinage-config';
import { DrainageService } from '../service/drainage.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ApplicantDetailDTO } from '../../tax/Models/applicant-details.model';
import { CommonService as CommonService1 } from 'src/app/vmcshared/Services/common-service';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';

@Component({
  selector: 'app-drainage-reconnection',
  templateUrl: './drainage-reconnection.component.html',
  styleUrls: ['./drainage-reconnection.component.scss']
})
export class DrainageReconnectionComponent implements OnInit {

  drainageReconnectionForm: FormGroup;
  translateKey: string = 'drainage_reconnection';
  licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

  formId: number;
	apiCode: string;
	
	uploadFilesArray: Array<any> = [];

	config: WaterDrinageConfig = new WaterDrinageConfig();

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
		public translateService: TranslateService,
		public drainageService: DrainageService,
		private alertService: AlertService,
		private commonService1: CommonService1,
		private addressService: ApplicantAddressService
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
				this.drainageReconnectionControls();
			this.getDrainageReConnectionNewData();
			//this.getLookups();
			this.getFormData(this.formId);
		  }
        

  }
  
	getDrainageReConnectionNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      try {
        this.drainageReconnectionForm.patchValue(res);
        
      } catch (error) {
        console.log(error.message)
      }
    });
  }


	getFormData(id: number) {
		this.formService.getFormData(id).subscribe(res => {
		  this.drainageReconnectionForm.patchValue(res);
		  res.serviceDetail.serviceUploadDocuments.forEach(app => {
			(<FormArray>this.drainageReconnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
		  });
		  this.requiredDocumentList();
		})
	  }
	  requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.drainageReconnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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
	drainageReconnectionControls() {
		this.drainageReconnectionForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'HEL-WTR-DRAINAGE-RECONNECTION',
			drainageConnectionNo: [null],
			ownerName: [null],
			address:[null],
		
			/* Step 2 controls start*/
			
			/* Step 2 controls end */
		});
	}

	searchByConnectionNo() {
		const connectionNo = this.drainageReconnectionForm.get('drainageConnectionNo').value;
		this.drainageService.searchByDrainageConnectionId(connectionNo).subscribe( data => {

			if (data['id']) {
				this.drainageReconnectionForm.get('ownerName').setValue(data['ownerName']);
				this.drainageReconnectionForm.get('address').setValue(data['address']);
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
		let step0 = 3;
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


	saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
		this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
			 (data) => {
			   this.commonService1.applicationNo = data.body.applicationNo;
			 },
			 (error) => {
			   this.commonService1.callErrorResponse(error);
			 });
	   }
   
}
