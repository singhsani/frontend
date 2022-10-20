import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { EngineeringService } from '../engineering.service';
import * as _ from 'lodash';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { CitizenConfig } from '../../citizen-config';
@Component({
  selector: 'app-contractor-regsitration',
  templateUrl: './contractor-regsitration.component.html',
  styleUrls: ['./contractor-regsitration.component.scss']
})
export class ContractorRegsitrationComponent implements OnInit {

  @ViewChild('residenceAddress') resAddrComponent: any;
  @ViewChild('firmAddress') officeAddrComponent: any;
  @ViewChild('bissinessAddress') bussinessAddressComponent: any;
  public formControlNameToTabIndex = new Map();
  public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();

  translateKey: string = 'constructorNewRegistration';

  ownerShipDetail: FormArray;
  firmEmployeeDetail: FormArray;

  implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
  tabIndex: number = 0;

  contractorRegistrationForm: FormGroup;
  maxDate: Date = new Date();
  minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];
  public serverUploadFilesArray: Array<any> = [];
  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = false;
  isSubmitBtnVisible: boolean = true;

  constructor(
    private fb: FormBuilder,

    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,

    private router: Router,
    private formService: FormsActionsService,
    private modalService: BsModalService,
    private engineer: EngineeringService
  ) {
    this.engineer.apiType = "contractor";
    this.formService.apiType = "contractor";
    this.ownerShipDetail = this.fb.array([]);
    this.firmEmployeeDetail = this.fb.array([]);
  }

  ngOnInit() {
    this.contractorRegistrationControl();
    //this.contractorRegistrationForm.addControl('ownerShipDetail', this.ownerShipDetail);
    this.contractorRegistrationForm.addControl('firmEmployeeDetail', this.firmEmployeeDetail);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.getContractorData(this.formId);
    })

    this.getBankNames();
    this.getAllDocumentLists();

    if (!this.formId) {
      this.createFormData();
    }
    this.setFormControlToTabIndexMap();
  }

  setFormControlToTabIndexMap() {

    this.formControlNameToTabIndex.set('firstName', 0)
    this.formControlNameToTabIndex.set('middleName', 0)
    this.formControlNameToTabIndex.set('lastName', 0)
    this.formControlNameToTabIndex.set('mobileNumber', 0)
    this.formControlNameToTabIndex.set('emailId', 0)
    this.formControlNameToTabIndex.set('ownerFirstName', 0)
    this.formControlNameToTabIndex.set('ownerMiddleName', 0)
    this.formControlNameToTabIndex.set('ownerLastName', 0)
    this.formControlNameToTabIndex.set('ownerMobileNumber', 0)
    this.formControlNameToTabIndex.set('ownerEmailId', 0)
    this.formControlNameToTabIndex.set('bankAccountNo', 0)
    this.formControlNameToTabIndex.set('bankName', 0)
    this.formControlNameToTabIndex.set('branchName', 0)
    
  }

  createFormData() {

    this.engineer.createFormDataa().subscribe(res => {
      this.contractorRegistrationForm.patchValue(res);
      setTimeout(() => {
        this.showButtons = true;
      }, 0)
    });
  }
  contractorRegistrationControl() {

    this.contractorRegistrationForm = this.fb.group({

      apiType: "contractor",
      serviceCode: null,
      serviceFormId: null,
      applicationNumber: null,
     canEdit:[true],
      fristName: [null, [Validators.required, Validators.maxLength(50)]],
      middleName: [null,[Validators.required, Validators.maxLength(50)]],
      lastName: [null,[Validators.required, Validators.maxLength(50)]],
      mobileNumber: [null,[Validators.required]],
      emailId: [null,[Validators.required, ValidationService.emailValidator]],
      partnerShip: [null],
      ownerFirstName: [null,[Validators.required, Validators.maxLength(50)]],
      ownerMiddleName: [null,[Validators.required, Validators.maxLength(50)]],
      ownerLastName: [null,[Validators.required, Validators.maxLength(50)]],
      ownerMobileNumber: [null,[Validators.required]],
      ownerEmailId: [null,[Validators.required, ValidationService.emailValidator]],
      bankAccountNo: [null,[Validators.required]],
      branchName: [null,[Validators.required, Validators.maxLength(50)]],
      registrationBank: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),

      locationOfContractorWorks: this.fb.group({
        code: null,
        name: null
      }),
      applyingFor: [null, [Validators.required]],

      whichDepartment: [null],
      postRegistrationDetails: [null],
      engineerDetails: [null],
      incomeTaxDetails: [null],
      anyAnotherOrganisationShareholder: [null],
      registrationDateandRenewdate: [null],
      solvencyAmountandBankDetails: [null],
      oldRegistrationDateandNumber: [null],
      notCompletedReasonDetails: [null],
      amountRemainsInCorporationOrOrganization: [null],
      partnersList: this.fb.group({
        ownerType: [null],
        OwnerName: [null],
        ownerDetail: [null],
      }),
      contractorWorkDetails: null,
      // serviceCode:'Contractor-Registration',
      EmployeeDetails: this.fb.group({
        employeeName: [null],
        employeeQualification: [null],
        employeeStatus: [null],
        employeeExperiernceyears: [null],
        employeestartWorkingProject: [null],
        projectStartDate: [null],
      }),
      bussinessName: [null,[Validators.required, Validators.maxLength(50)]],
      bussinessMobileNo: [null,[Validators.required]],
      registrationDetails: [null],
      threeYearDetaols: [null],
      WorkShopplantRate: [null],
      ownerAccountDepartment: [null],
      turnoverDetails: [null],
      anotherorganisation: [null],
      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),
      bussinessAddress: this.fb.group(this.bussinessAddressComponent.addressControls()),
      OwnwemobileNumber : [null],
      attachments: [],
      createdByCitizen: [true],

    });


  }

  saveRecord(row: any) {
    if (row.valid) {
      row.isEditMode = false;
      row.newRecordAdded = false;
    }
  }

  getContractorData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("tresr", res)
      this.contractorRegistrationForm.patchValue(res);
      //this.showButtons = true;
      //this.contractorRegistrationForm.disable();
      this.locationChange(res.applyingFor);

      if (res.formStatus == 'PAYMENT_RECEIVED' || res.formStatus == 'SUBMITTED') {
        this.contractorRegistrationForm.disable();
        this.contractorRegistrationForm.get('canEdit').setValue(false);
      }
      this.setServiceDetailsOnInit(res);

    });
  }

  getBankNames() {
    this.engineer.getBankNames().subscribe(res => {
      this.bankNameArray = res.data;
    });
  }

  locationChange(event) {
    this.engineer.getFeeFromLocationn(event.value).subscribe(res => {
      this.contractorRegistrationForm.get('registrationAmount').setValue(res.fee);
    })
    this.contractorRegistrationForm.get('locationOfContractorWorks').get('code').setValue(event.value);
  }

  getAllDocumentLists() {
    this.engineer.getAllDocumentss().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);

      for (let file of this.attachmentList) {
        file['mandatory'] = false;
      }
    });
  }

  setServiceDetailsOnInit(res) {
    this.serverUploadFilesArray = res.attachments;
    const localUploadArray = [...this.serverUploadFilesArray];

    for (let file of localUploadArray) {
      console.log("file" + JSON.stringify(file));
      this.attachmentList.push(file);
    }
    this.manadoty();
  }

  manadoty() {
    this.uploadFilesArray = [];
    _.forEach(this.attachmentList, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }

  onRemoveRowOwnerShip(rowIndex: number) {
    this.ownerShipDetail.removeAt(rowIndex);
  }

  createFirmEmployeeDetail(): FormGroup {
    return this.fb.group({
      employeeName: null,
      employeeQualification: null,
      employeeStatus: null,
      experience: null,
      joiningDate: null,
      projectStartDate: null
    });
  }

  addRowFirmDetail() {
    this.firmEmployeeDetail.push(this.createFirmEmployeeDetail());
  }

  onRemoveRowFirmDetail(rowIndex: number) {
    this.firmEmployeeDetail.removeAt(rowIndex);
  }

  mandatoryFileCheck(serviceFormId, attachmentList) {
    return new Promise<any>((resolve, reject) => {
      this.formService.getFormData(serviceFormId).subscribe(respData => {
        if (respData.attachments) {
          let tempArray = [];
          respData.attachments.forEach(element => {
            tempArray.push(element.fieldIdentifier);
          });
          attachmentList.forEach(el => {
            if (tempArray.indexOf(el.fieldIdentifier) === -1 && el.mandatory) {
              resolve({ fileName: el.documentLabelEn, status: false });
              return;
            }
          });
          resolve({ fileName: "", status: true });
        } else {
          resolve({ fileName: "", status: true })
        }
      })
    })
  }

  openTermModel(template: TemplateRef<any>) {
    this.modalJsonRef = this.modalService.show(template);
  }
  hideModel() {
    this.modalJsonRef.hide();
  }

  onSubmit() {
    if (this.contractorRegistrationForm.invalid) {
      //this.commonService.prrintInvalidForm(this.affordableHousingForm);
      let count = this.affordableHousingConfiguration.getAllErrors(this.contractorRegistrationForm);

      this.commonService.openAlert("Warning", this.affordableHousingConfiguration.ALL_FEILD_REQUIRED_MESSAGE, "warning", "", cb => {
        switch (true) {
          case (count <= 27):
            this.tabIndex = 0;
            break;
          case (count <= 48):
            this.tabIndex = 1;
            break;
          case (count <= 58):
            this.tabIndex = 2;
            break;
          case (count <= 68):
            this.tabIndex = 4;
            break;
          default:
            this.tabIndex = 0;
        }

      });
      return;
    }
    /* Normal submit*/
    this.onSubmitUsingAPI();

  }


  onSubmitUsingAPI() {
    this.contractorRegistrationForm.get('serviceFormId').setValue(this.formId);
    this.mandatoryFileCheck(this.contractorRegistrationForm.get('serviceFormId').value, this.attachmentList).then(data => {
      if (data.status) {
        this.engineer.vendorSaveFormData(this.contractorRegistrationForm.getRawValue()).subscribe(res => {
          if (Object.keys(res).length) {
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
            this.commonService.openAlert("Application Submitted Successful", "", "success", `</b>`);
            this.resetForm();
          } else {
            this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
            return
          }
        }, (err) => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
        return;

      }
    });
  }

  resetForm(isBtnClicked?: boolean) {
    if (isBtnClicked) {
      this.commonService.confirmAlert('Are you sure?', 'question', 'Reset', cb => {
        this.conditionallyResetFields();
      });
    } else {
      this.conditionallyResetFields();
    }
  }


  conditionallyResetFields() {

    this.contractorRegistrationForm.enable();

  }

  patchValue() {
    const obj = {


    }

    this.contractorRegistrationForm.patchValue(obj);
  }

  //upload file
  uploadFilesArray: Array<any> = [];

  handleErrorsOnSubmit(key) {

    const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

    this.tabIndex = index;
    return false;
  }

}