import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';

@Component({
  selector: 'app-fire-certificate',
  templateUrl: './fire-certificate.component.html',
  styleUrls: ['./fire-certificate.component.scss']
})
export class FireCertificateComponent implements OnInit {

  fireCertificateForm: FormGroup;
  translateKey: string = 'fireCertificateScreen';

  appId: number;
  apiCode: string;
  tabIndex: number = 0;
  //Lookups Array
  FS_FIRE_PLACE_TYPE: Array<any> = [];
  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
  // required attachment array
  private uploadFilesArray: Array<any> = [];
  private showButtons: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private atp: AmazingTimePickerService,
    private router: Router,
    private TranslateService:TranslateService
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
      this.showButtons = true;
      //convert applicant name and set in applicantNameGuj filds 
			let applicantNameGujFields=this.fireCertificateForm.get('applicantNameGuj');
			let applicantNameValue=this.fireCertificateForm.get('applicantName').value;
			if(!applicantNameGujFields.value){
				applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
      }
      
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.fireCertificateForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
      });
      this.requiredDocumentList();

      // } catch (error) {
      //   console.log(error.message)
      // }
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
  * Method is create required document array
  */
  requiredDocumentList() {
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
    this.fireCertificateForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'FS_FIRE_CERTIFICATE',
      applicantName: [null, [Validators.required, Validators.maxLength(100)]],
      applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
      applicationDate: [null, [Validators.required, Validators.maxLength(50)]],
      oldReferenceNumber: [null, [Validators.maxLength(10)]],
      incidentDate: [null, [Validators.required, Validators.maxLength(50)]],
      incidentTime: [null, [Validators.required, Validators.maxLength(50)]],
      firePlaceAddress: [null, [Validators.required, Validators.maxLength(300)]],
      firePlaceAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
      connectionHolderAddress: [null, [Validators.required, Validators.maxLength(500)]],
      connectionHolderAddressGuj: [null, [Validators.required, Validators.maxLength(1500)]],
      propertyNo: [null, [Validators.required, Validators.maxLength(15)]],
      firePlaceType: this.fb.group({
        code: [null]
      }),
      fireLossAmount: [null, [Validators.required, Validators.maxLength(50)]],
      attachments: []
    });
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
    this.fireCertificateForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
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

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param ev - event
	 * @param index - index of child
	 */
  changeTimeFormat(ev: string, controlName: string) {
    if (ev && ev.length < 8) {
      ev = ev.concat(":00");
    }
    this.fireCertificateForm.get(controlName).setValue(ev);
  }

  /**
 * This method is handle depended documents on save event
 * @param res - form response after save event
 */
  handleOnSaveAndNext(res) {
    this.requiredDocumentList();
  }

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
  handleErrorsOnSubmit(flag) {

    let step0 = 16;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;
      // console.log(flag);
      if (count <= step0) {
        this.tabIndex = 0;
        return false;
      } else {
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

}
