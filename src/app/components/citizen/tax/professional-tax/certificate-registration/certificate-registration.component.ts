import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatInput } from '@angular/material';
import { FormBuilder, FormGroup,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ProfessionalTaxService } from 'src/app/core/services/citizen/data-services/professional-tax.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { PftConfig } from '../pftConfig';
import { ManageRoutes } from 'src/app/config/routes-conf';

@Component({
  selector: 'app-certificate-registration',
  templateUrl: './certificate-registration.component.html',
  styleUrls: ['./certificate-registration.component.scss']
})
export class CertificateRegistrationComponent implements OnInit {

  @ViewChild('officeAddr') officeAddrComponent: any;
    @ViewChild('resAddr') resAddrComponent: any;
    @ViewChild('searchInput') searchInput: MatInput;
  public config = new PftConfig();

    translateKey: string = 'duplCertificateScreen';
    pecTranslateKey: string = 'pecRegistrationScreen';
    recTranslateKey: string = 'taxCollectionScreen';
    prcTranslateKey: string = 'prcRegistrationScreen';
    vadhTranslateKey: string = 'vadhKamiScreen';
    actionBarKey: string = 'adminActionBar';

    stepLable1: string = "applicant_detail";
    stepLable2: string = "payment_details";

    wardNoArray: Array<any> = [];
    blockNoArray: any = [];
    newDate: Date = new Date();
    exportType: string;

    dupCertificateForm: FormGroup;
    maxDate: Date = new Date();
    certificateTypeArray: any = [];
    isFormSubmit: boolean = false;
    saveDupCerificateResponse: any = {};
    searchResObj: any = {};
    isValidRegNo: boolean = false;
    paymentForm: FormGroup;
    professionalCertificateId : any;
    //authoContants = AuthorizationConstants;
    isFromOnlineApp: boolean = false;
    isSubmit: boolean = false;
    paramCertificate: any;
    formType : any;
    rupeeSign='(₹)'

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
    private profeService: ProfessionalTaxService,
    private commonService: CommonService,
        private route : ActivatedRoute,
        private alertService: AlertService,
    ) {
    }

    ngOnInit() {
        this.searchInput.focus();
        this.getAllWardNos();
        this.dupCertificateFormControls();
        
        this.route.queryParams.subscribe(param => {
            this.formType = param.from;
            if (param && param.regNo) {
                if (param.from == 'onlineApp') {
                    this.isFromOnlineApp = true;
                    this.dupCertificateForm.get("remarks").enable();
                    this.paramCertificate =param.certificateRegistrationNumber;
                    this.searchDetailsByRegNo(event,param.regNo);
                    if(param.formStatus == "APPROVED"){
                        this.isFromOnlineApp = false;
                        this.isSubmit = false;
                    }
                } 
            }
        });
        if(this.formType != 'onlineApp'){
        this.createFormData();
        this.isSubmit = true;
        }
    }


  /**
     * This method is use for create draft form
     */
    createFormData() {
        this.profeService.createFormData().subscribe(res => {
            let a = res;
            this.professionalCertificateId = a.id;
            this.dupCertificateForm.patchValue(res);
        });
    }

    /**
     * This method is used to create certificate form control
     */
    dupCertificateFormControls() {
        this.dupCertificateForm = this.fb.group({

            id: null,
            uniqueId: null,
            version: null,
            code: null,
            formId: null,
            certificateId: null,
            formType: null,

            ward: this.fb.group({
                wardzoneId: null,
                wardzoneName: null
            }),
            block: this.fb.group({
                wardzoneId: null,
                wardzoneName: null
            }),
            registrationDate: [{ value: null, disabled: true }],
            registrationNumber: null,
            remarks:null,
            certificateRegistrationDate: [{ value: null, disabled: true }],
            applicantFullName: [{ value: null, disabled: true }],
            commencementDate: [{ value: null, disabled: true }],
            establishmentName: [{ value: null, disabled: true }],
            officeAddress: this.fb.group(this.officeAddrComponent.addressControls()),
            residentialAddress: this.fb.group(this.resAddrComponent.addressControls()),
            censusNo: [{ value: null, disabled: true }],
            aadharNo: [{ value: null, disabled: true }],
            rcDate: [{ value: null, disabled: true }],
            certificateType: this.fb.group({
                code: [{ value: null, disabled: true }],
                name: null,
            }),
        });

        this.dupCertificateForm.disable();
        /** set default addressType */
        this.setDefaultFeilds();
    }

    /**
     * This method is used to set default value in address component
     * also enable some form control field
     */
    setDefaultFeilds() {

        this.dupCertificateForm.get('certificateType').disable();
        this.dupCertificateForm.get('certificateRegistrationDate').setValue(this.newDate)
        this.dupCertificateForm.patchValue({
            officeAddress: {
                addressType: "PF_PRC_OFFICE_ADDRESS",
            },
            residentialAddress: {
                addressType: "PF_PRC_RESIDENTIAL_ADDRESS",
            },
        });
    }

    /**
     * This method is use for get all ward numbers using API
    */
    getAllWardNos() {
        this.profeService.getAllWardNos().subscribe(res => {
            this.wardNoArray = res;
        });
    }

    getAllBlockNos(event) {
        this.profeService.getAllBlockNos(event).subscribe(res => {
            this.blockNoArray = res;
        });
    }

    /**
     * This method is used to search duplicate certificate details using reg no.
     * @param regNo - registration number 
     */
     searchDetailsByRegNo(event, regNo) {
        event.stopPropagation();
        if (regNo == '') {
            this.commonService.openAlert("Warning", this.config.PEC_PRC_REQUIRED_MESSAGE, "warning");
            return;
        }
        this.isFormSubmit = false;
        this.dupCertificateForm.get('certificateType').enable();
        this.isValidRegNo = true;
        this.saveDupCerificateResponse = {};
        this.searchResObj = {};

        regNo = regNo.toUpperCase();
        this.profeService.getSearchDetails(regNo).subscribe(res => {
            this.dupCertificateForm.reset();
            this.certificateTypeArray = [];
            this.setDefaultFeilds();

            /** if response exist data then do further process */
            if (res.data && Object.keys(res.data).length) {
                this.searchResObj = res.data;
                this.dupCertificateForm.patchValue(res.data);
                this.dupCertificateForm.get('formId').setValue(this.professionalCertificateId);
                if(this.isFromOnlineApp == true){
                    this.dupCertificateForm.get('registrationNumber').setValue(this.paramCertificate);
                }
                if (res.data.censusNo.length > 0) {
                    this.dupCertificateForm.get('censusNo').setValue(res.data.censusNo[0]['census']);
                }
                
                if (res.data.formType === 'EMP_REG_TYPE_PRC') {
                    this.dupCertificateForm.get('certificateType.code').setValue('PRC_ONLY');
                } else {
                    this.dupCertificateForm.get('certificateType.code').setValue('PEC_ONLY');
                }

            } else {
                this.isValidRegNo = false;
                this.toastr.warning(this.config.NO_RECORD_MSG);
            }

        }, err => {
            this.isValidRegNo = false;
            this.dupCertificateForm.reset();
            this.certificateTypeArray = [];
            this.setDefaultFeilds();
            if(err.status == 501){
                this.commonService.openAlert('Warning', err.error[0].message, 'warning');
            }
        });
    }
    /**
     * @param fieldName - get the selected field's name
     * @param date get the selected date value
     */
    onDateChange(fieldName, date) {
        this.dupCertificateForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
    }

    /**
     * This method is used to get the certificate type and payble amount for duplicate receipt
     */
    getCertificateTypeAndPayAmt(hasPrc) {
        this.profeService.getLookupDataForDupCertificate(hasPrc).subscribe(res => {
            this.certificateTypeArray = res.data;
        });
    }


    /**
     * This method is use for submit submit certificate form
     */
    onSubmit() {
        if (!this.isValidRegNo) {
            this.commonService.openAlert("Warning", this.config.VALID_PEC_PRC_MESSAGE, "warning");
            return;
        }
        this.dupCertificateForm.get('registrationNumber').setValue(this.getRegNumByCerType());

        this.profeService.certificateRegistration(this.dupCertificateForm.getRawValue()).subscribe(res => {
            this.commonService.openAlert("Application Submitted Successfully", "", "success", `Your Certificate  Registration Number is   <b>${res.certificateRegistrationNumber}</b>`);
            this.dupCertificateForm.reset();
            this.isFormSubmit = true;
            this.saveDupCerificateResponse = res;
      //      this.paymentForm.patchValue(res);
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
        });
    }
    /**
     * This method is use to return reg number using certificate type
     */
    getRegNumByCerType() {
        if (this.dupCertificateForm.get('certificateType').value.code == 'PEC_ONLY')
            return this.searchResObj.pecNo;
        else if (this.dupCertificateForm.get('certificateType').value.code == 'PRC_ONLY')
            return this.searchResObj.prcNo;
        else
            return this.searchResObj.prcNo;
    }
  }