import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { LicenseConfiguration } from '../../licences/license-configuration';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-fire-certificate',
  templateUrl: './fire-certificate.component.html',
  styleUrls: ['./fire-certificate.component.scss']
})
export class FireCertificateComponent implements OnInit {

  fireCertificateForm: FormGroup;
  applicantDetails: FormGroup
  attachmentDetails : FormGroup
  translateKey: string = 'fireCertificateScreen';

  appId: number;
  apiCode: string;
  //Lookups Array
  FS_FIRE_PLACE_TYPE: Array<any> = [];
  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
  // required attachment array
  uploadFilesArray: Array<any> = [];
  fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();
  licenseConfiguration : LicenseConfiguration = new LicenseConfiguration();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private atp: AmazingTimePickerService,
    private router: Router,
    public TranslateService: TranslateService,
    private commonService : CommonService
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      this.appId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });
    this.getLookupData();
    if (!this.appId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }
    else {
      this.getFireCertificategetData();
      this.fireCertificateFormControls();
    }
  }

	/**
	 * this method is use for get api data and patch in form
	 */
  getFireCertificategetData() {
    this.formService.getFormData(this.appId).subscribe(res => {

      // try {
      this.fireCertificateForm.patchValue(res);
      this.applicantDetails.patchValue(res)
      this.attachmentDetails.patchValue(res)
      this.fireFacilityConfig.isAttachmentButtonsVisible = true;
      //convert applicant name and set in applicantNameGuj filds 
      let applicantNameGujFields = this.applicantDetails.get('applicantNameGuj');
      let applicantNameValue = this.applicantDetails.get('applicantName').value;
      if (!applicantNameGujFields.value) {
        applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
      }

      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.fireCertificateForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
      });
      this.documentsManage();
      // } catch (error) {
      //   console.log(error.message)
      // }
    });
  }

  /**
  * Method is create required document array
  */
  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.fireCertificateForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });

  }

	/**
	 * define all gas connection form controls
	 */
  fireCertificateFormControls() {

    	/* Step 1 controls start */
    this.applicantDetails = this.fb.group({
      applicantName: [null, [Validators.required, Validators.maxLength(100)]],
      applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
      applicationDate: [{ value: null, disabled: true }],
      oldReferenceNumber: [null, [Validators.maxLength(10)]],
      incidentDate: [null, [Validators.required, Validators.maxLength(50)]],
      incidentTime: [null, [Validators.required, Validators.maxLength(50)]],
      whetherTheFireplaceInVMCAreaOrNot: [false, [Validators.required]],//true/false
      firePlaceAddress: [null, [Validators.required, Validators.maxLength(300)]],
      firePlaceAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
      connectionHolderAddress: [null, [Validators.required, Validators.maxLength(500)]],
      connectionHolderAddressGuj: [null, [Validators.required, Validators.maxLength(1500)]],
      propertyNo: [null, [Validators.required, Validators.maxLength(15)]],
      fireplaceNameOrVehicleNumber: [null, [Validators.required, Validators.maxLength(50)]],
      firePlaceType: this.fb.group({
        code: [null, [Validators.required]]
      }),
      fireLossAmount: [null, [Validators.required, Validators.maxLength(10)]],
      contactNo : [null, [Validators.required, Validators.maxLength(10)]],
      mobileNo : [null, [Validators.required, Validators.maxLength(10)]],
      email : [null, [Validators.required, Validators.maxLength(50),Validators.email,ValidationService.emailValidator]],
    })
   	/* Step 1 controls end */

    /* Step 1 controls start */
    this.attachmentDetails = this.fb.group({
      attachments : []
    })
   /* Step 2 controls end */

    this.fireCertificateForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'FS_FIRE_CERTIFICATE',
      attachments: []
    });

    this.commonService.createCloneAbstractControl(this.applicantDetails,this.fireCertificateForm);
    this.commonService.createCloneAbstractControl(this.attachmentDetails,this.fireCertificateForm);
  }

  /**
	* Method is used to get lookup data
	*/
  getLookupData() {
    this.formService.getDataFromLookups().subscribe(res => {
      this.FS_FIRE_PLACE_TYPE = res.FS_FIRE_PLACE_TYPE;
    });
  }

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
  dateFormat(date, controlType: string) {
    this.applicantDetails.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }

	/**
	 * Method is used to open time picker.
	 * @param controlName - control name.
	 */
  openTimePicker(controlName: string) {
    const amazingTimePicker = this.atp.open({
      changeToMinutes: true,
      theme: 'material-purple',
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time.length == 5) {
        this.fireCertificateForm.get(controlName).setValue(time + ":00");
      }
    });
  }

  documentsManage(){
    const firePlaceType = this.applicantDetails.get('firePlaceType').value;

    let licenseCopyMandotary = false;
    let rcBookMandotary = false;
    if(firePlaceType && firePlaceType.code && (firePlaceType.code == 'COMMERCIAL' || firePlaceType.code == 'INDUSTRIAL')){
			licenseCopyMandotary = true;
		}

    if(firePlaceType && firePlaceType.code && firePlaceType.code == 'VEHICLE'){
			rcBookMandotary = true;
		} 

    const documents = this.fireCertificateForm.get('serviceDetail').get('serviceUploadDocuments').value;


    for(const document of documents){
			if(document.documentIdentifier == 'LICENSE_COPY')
				document.mandatory = licenseCopyMandotary;

        if(document.documentIdentifier == 'RC_BOOK')
				document.mandatory = rcBookMandotary;
		}

    this.fireCertificateForm.get('serviceDetail').patchValue({'serviceUploadDocuments': documents});

		this.requiredDocumentList();
  }

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param ev - event
	 * @param index - index of child
	 */
  changeTimeFormat(ev: string, controlName: string) {
    if (ev && ev.length < 8) {
      ev = ev.concat(":00");
    }
    this.applicantDetails.get(controlName).setValue(ev);
  }


	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
  handleErrorsOnSubmit(flag) {
    let step0 = 17;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;
      // console.log(flag);
      if (count <= step0) {
        this.fireFacilityConfig.currentTabIndex = 0;
        return false;
      } else {
        console.log("else condition");
      }

    }
  }

}
