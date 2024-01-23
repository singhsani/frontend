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
import { SessionStorageService } from 'angular-web-storage';

import { LicenseConfiguration } from '../../licences/license-configuration';
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

  translateKey: string = 'contractorRegistrationScreen';

  partnerShipDetailList: FormArray;
  firmEmployeeDetailList: FormArray;

  implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
  tabIndex: number = 0;

  contractorRegistrationForm: FormGroup;
  contractorDetailForm : FormGroup;
  businessDetail1Form : FormGroup;
  businessDetail2Form  : FormGroup;
  attachmentFrom : FormGroup
  maxDate: Date = new Date();
  minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];
  public serverUploadFilesArray: Array<any> = [];
  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = false;
  isSubmitBtnVisible: boolean = true;
  contractorOwnerType: any = [];
  isPreviewVendorNameDetail = false;
  isFirmNameDetail = false;
  checkbox: boolean = true;
  anotherOrganisations :boolean =  false;
  anotherOrganisationss :boolean =  false;
  qualifictionType : any = [];
  licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

  constructor(
    private fb: FormBuilder,

    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private session: SessionStorageService,
    private router: Router,
    private formService: FormsActionsService,
    private modalService: BsModalService,
    private engineer: EngineeringService
  ) {
    this.engineer.apiType = "contractor";
    this.formService.apiType = "contractor";
    this.partnerShipDetailList = this.fb.array([]);
    this.firmEmployeeDetailList = this.fb.array([]);
  }

  ngOnInit() {
    this.contractorRegistrationControl();
    //this.contractorRegistrationForm.addControl('ownerShipDetail', this.ownerShipDetail);
    this.businessDetail1Form.addControl('firmEmployeeDetails', this.firmEmployeeDetailList);
    this.contractorDetailForm.addControl('partnerDetails', this.partnerShipDetailList);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.getContractorData(this.formId);
    })

    /**
    * Update Permanent Address If 'officeResidentialAddressSame' is checked.
    */
     this.contractorRegistrationForm.controls.factoryAddress.valueChanges.subscribe(data => {
      if (this.contractorDetailForm.get('officeResidentialAddressSame').value) {
        this.onSameAddressChange({ checked: true });
        return;
      }
    });

    this.getBankNames();
    this.getAllDocumentLists();
    this.getLookUp();
    this.getLookUps();

    if (!this.formId) {
      this.createFormData();
    }
    this.setFormControlToTabIndexMap();
  }

  getLookUp() {
    this.engineer.getLookup().subscribe(res => {
      this.contractorOwnerType = res.VENDOR_TYPE_FIRM;
    });
  }

  getLookUps() {
    this.engineer.getLookups().subscribe(res => {
      this.qualifictionType = res.CONTRACTOR_REG_FIRM;
    });
  }

  setFormControlToTabIndexMap() {

    this.formControlNameToTabIndex.set('nameOfTheFirm', 0)
    this.formControlNameToTabIndex.set('middleName', 0)
    this.formControlNameToTabIndex.set('lastName', 0)
    this.formControlNameToTabIndex.set('officeContactNumber', 0)
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

  onSameAddressChange(event) {
    let id = this.contractorDetailForm.get('registeredAddress.id').value;
    if (event.checked) {
      this.contractorDetailForm.get('registeredAddress').patchValue(this.contractorDetailForm.get('factoryAddress').value);
      if (this.contractorDetailForm.get('factoryAddress').get('country').value) {
        this.resAddrComponent.getStateLists(this.contractorDetailForm.get('factoryAddress').get('country').value);
      }
    } else {
      this.contractorDetailForm.get('registeredAddress').reset();

    }
    this.contractorDetailForm.get('registeredAddress.addressType').setValue('FIRM_ADDRESS');
    this.contractorDetailForm.get('registeredAddress.id').setValue(id);
  }


  contractorRegistrationControl() {

    //  Tab 1 Starts 
    this.contractorDetailForm = this.fb.group({
      registrationGroup:[null],
      applyingFor: [null],
      nameOfTheFirm: [null, [Validators.required, Validators.maxLength(50)]],
      middleName: [null, [Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      officeContactNumber: [null, [Validators.required]],
      emailId: [null, [ValidationService.emailValidator]],
      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      ownerFirstName: [null, [Validators.required, Validators.maxLength(50)]],
      ownerMiddleName: [null, [Validators.maxLength(50)]],
      ownerLastName: [null, [Validators.required, Validators.maxLength(50)]],
      ownerMobileNumber: [null, [Validators.required]],
      ownerEmailId: [null, [ValidationService.emailValidator]],
      officeResidentialAddressSame: [null],
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),
      partnerShipp: [null],
      partnerDetails: this.partnerShipDetailList,
      businessName: [null, [Validators.required, Validators.maxLength(50)]],
      businessMobileNo: [null, [Validators.required]],
      panNo: [null, [Validators.required, ValidationService.panValidator]],
      gstNo: [null ,[Validators.required, ValidationService.gstNoValidator]],
      businessAddress: this.fb.group(this.bussinessAddressComponent.addressControls()),
      bankAccountNo: [null, [Validators.required]],
      registrationBank: this.fb.group({
        code: [null,[Validators.required]],
        name: null
      }),
      branchName: [null, [Validators.required, Validators.maxLength(50)]],
    })
   //Tab 1 Finish 

   // Tab 2 Starts
   this.businessDetail1Form = this.fb.group({
    threeYearDetails: [null],
    firmEmployeeDetails: this.firmEmployeeDetailList,
    turnOverDetails: [null],
    workShopPlantRate: [null],
   })
    //Tab 2 Finish 

  /// Tab 3 Starts 
    this.businessDetail2Form = this.fb.group({
      ownerAccountDepartment: [null],
      anotherOrganisation: [null],
      departmentOrInstitution :[null],
      pastRegistrationDetails: [null],
      engineerDetails: [null],
      incomeTaxDetails: [null],
      anyAnotherOrganisationShareholder: [null],
      corporationAnyDepartment : [null],
      solvencyAmountAndBankDetail: [null],
      oldRegistrationDate: [null],
      oldRegistrationNumber: [null],
      notCompletedReasonDetails: [null],
      amountRemainsInCorporationOrOrganization: [null],
    })
    //Tab 3 Finish 

    this.attachmentFrom = this.fb.group({
      attachments: [],
    })

    this.contractorRegistrationForm = this.fb.group({
      apiType: "contractor",
      serviceCode: null,
      serviceFormId: null,
      applicationNumber: null,
      canEdit: [true],
      locationOfContractorWorks: this.fb.group({
        code: null,
        name: null
      }),
      whichDepartment: [null],
      registrationDateOrReNewDate: [null],
      contractorWorkDetails: null,
      // serviceCode:'Contractor-Registration',
      registrationDetails: [null],
      attachments: [],
    });

    this.commonService.createCloneAbstractControl(this.contractorDetailForm, this.contractorRegistrationForm);
    this.commonService.createCloneAbstractControl(this.businessDetail1Form, this.contractorRegistrationForm);
    this.commonService.createCloneAbstractControl(this.businessDetail2Form, this.contractorRegistrationForm);
    this.commonService.createCloneAbstractControl(this.attachmentFrom, this.contractorRegistrationForm);
    this.firmEmployeeDetailList.push(this.createFirmEmployeeDetail());
  }

  addRowPartnweShipDetail() {
    this.partnerShipDetailList.push(this.createPartnerShipDetail());
  }


  createPartnerShipDetail(): FormGroup {
    return this.fb.group({
      ownerType: this.fb.group({
        code: null,
        name: null
      }),
      ownerName: [null],
      ownerDetail: [null],
    });
  }

  onRemoveRowOwnerShip(rowIndex: number) {
    this.partnerShipDetailList.removeAt(rowIndex);
  }

  addRowFirmDetail() {
    this.firmEmployeeDetailList.push(this.createFirmEmployeeDetail());
  }

  onRemoveRowFirmDetail(rowIndex: number) {
    this.firmEmployeeDetailList.removeAt(rowIndex);
  }

  createFirmEmployeeDetail(): FormGroup {
    return this.fb.group({
      employeeQualificationType: this.fb.group({
        code: null,
        name: null
      }),
      employeeName: [null],
      employeeStatus: [null],
      employeeExperienceYears: [null],
      joiningDate: [null, [Validators.required]],
      projectStartDate: [null, [Validators.required]],
    });
  }

  saveRecord(row: any) {
    if (row.valid) {
      row.isEditMode = false;
      row.newRecordAdded = false;
    }
  }

  getContractorData(id: number) {
    this.checkbox = true
    this.formService.getFormData(id).subscribe(res => {
      if(res.formStatus == 'SUBMITTED'){
        this.checkbox = false;
        this.anotherOrganisations = true;
        this.anotherOrganisationss = true;
      }
      console.log("tresr", res)
      this.contractorRegistrationForm.patchValue(res);
      this.contractorDetailForm.patchValue(res);
      this.businessDetail1Form.patchValue(res);
      this.businessDetail2Form.patchValue(res);
      this.attachmentFrom.patchValue(res);
      //this.showButtons = true;
      //this.contractorRegistrationForm.disable();
      this.locationChange(res.applyingFor);

      if (res.formStatus == 'PAYMENT_RECEIVED' || res.formStatus == 'SUBMITTED') {
        this.contractorRegistrationForm.disable();
        this.contractorRegistrationForm.get('canEdit').setValue(false);
      }
      res.firmEmployeeDetails.forEach(app => {
        (<FormArray>this.businessDetail1Form.get('firmEmployeeDetails')).push(this.createFormGroupVendor('firmEmployeeDetails', app));
      });
      this.isFirmNameDetail = true;
      res.partnerDetails.forEach(app => {
        (<FormArray>this.contractorDetailForm.get('partnerDetails')).push(this.createFormGroupVendor('partnerDetails', app));
      });
      this.isPreviewVendorNameDetail = true;

      this.setServiceDetailsOnInit(res);

    });
  }

  createFormGroupVendor(key: string, data: any): FormGroup {

    let formGroupData: FormGroup;
    switch (key) {
      case 'partnerDetails':
        formGroupData = this.fb.group({
          ownerType: this.fb.group({
            code: [{ value: data.ownerType.code ? data.ownerType.code : null, disabled: true }],
            name: [{ value: data.ownerType.name ? data.ownerType.name : null, disabled: true }]
          }),
          ownerName: [{ value: data.ownerName ? data.ownerName : null, disabled: true }],
          ownerDetail: [{ value: data.ownerDetail ? data.ownerDetail : null, disabled: true }],
        })
        break;

      case 'firmEmployeeDetails':
        formGroupData = this.fb.group({
          employeeName: [{ value: data.employeeName ? data.employeeName : null, disabled: true }],
          //employeeQualification: [{ value: data.employeeQualification ? data.employeeQualification : null, disabled: true }],
          employeeQualificationType: this.fb.group({
            code: [{ value: data.employeeQualificationType.code ? data.employeeQualificationType.code : null, disabled: true }],
            name: [{ value: data.employeeQualificationType.name ? data.employeeQualificationType.name : null, disabled: true }]
          }),
          employeeStatus: [{ value: data.employeeStatus ? data.employeeStatus : null, disabled: true }],
          employeeExperienceYears: [{ value: data.employeeExperienceYears ? data.employeeExperienceYears : null, disabled: true }],
          joiningDate: [{ value: data.joiningDate ? data.joiningDate : null, disabled: true }],
          projectStartDate: [{ value: data.projectStartDate ? data.projectStartDate : null, disabled: true }],
        })
        break;

      default:
        break;
    }
    return formGroupData;
  }

  selectLanguage(language: string) {
    this.session.set('currentLanguage', language);
  }

  getBankNames() {
    this.engineer.getBankNames().subscribe(res => {
      this.bankNameArray = res.data;
    });
  }

  onDateChange(fieldName, date) {
    console.log("sdfgdg " + this.businessDetail2Form.get(fieldName).value + " " + fieldName + " " + date);
    this.businessDetail2Form.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }

  // onDateChangePurchaseDate(control, date, obj) {
  //   obj.get(control).setValue(moment(date).format("YYYY-MM-DD"));
  // }

  locationChange(event) {
      this.engineer.getFeeFromLocationn(event.value).subscribe(res => {
        this.businessDetail2Form.get('solvencyAmountAndBankDetail').setValue(res.fee);
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
    this.contractorRegistrationForm.get('anyAnotherOrganisationShareholder').setValue(true);
    this.contractorRegistrationForm.get('partnerShipp').setValue(true);
    this.contractorRegistrationForm.get('ownerAccountDepartment').setValue(true);
    this.contractorRegistrationForm.get('anotherOrganisation').setValue(true);

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

  vendorArrayNameButtons: boolean = true;
  typeOfFirmChange(event) {

    if (event.value == 'PROPRIETORSHIP') {
      // this.vendorNameArray.push(this.createVendorNameArray());
      this.vendorArrayNameButtons = false;
    } else {
      this.vendorArrayNameButtons = true;
    }

  }

  groupChange(event){
   if(event.value == true){
     this.anotherOrganisations = true;
   }else{
     this.anotherOrganisations = false;
     this.contractorRegistrationForm.get('departmentOrInstitution').setValue(null);
   }

  }

  corporationAnyDeparment(event){
    if(event.value == true){
      this.anotherOrganisationss = true;
    }else{
      this.anotherOrganisationss = false;
      this.contractorRegistrationForm.get('corporationAnyDepartment').setValue(null);
    }

   }


  conditionallyResetFields() {

    this.contractorRegistrationForm.enable();

  }

  patchValue() {
    const obj = {
      "firstName": "Arvind Dangi",
      "middleName": "Dangi",
      "lastName": "Dangi",
      "officeContactNumber": "8962749074",
      "emailId": "chetan.porwal@nascentinfo.com",
      "panNo": "DFVFD1212D",
      "gstNo": "24ANCPP4357N2ZL",
      "ownerFirstName": "gkjghjk",
      "ownerMiddleName": " jhfj",
      "ownerLastName": "fffff",
      "ownerMobileNumber": "8888888888",
      "ownereEmailId": "jhgjh@gmail.com",
      "bankAccountNo": "123456789098",
      "bankName": "sbi",
      "branchName": "shujalpur",
      "whichDepartment": "gkjkjk",
      "pastRegistrationDetails": "gjkkjgljk",
      "engineerDetails": "hjkgj",
      "incomeTaxDetails": "jhfjh",
      // "anyAnotherOrganisationShareholder": "jhfjhf",
      "registrationDateOrReNewDate": "26/12/2022",
      "solvencyAmountAndBankDetail": "jhfgjk",
      "oldRegistrationDate": "2022-12-01",
      "oldRegistrationNumber": "hjfgjk",
      "notCompletedReasonDetails": "jhgkkk",
      "amountRemainsInCorporationOrOrganization": "jhgkkjhfgjh",
      "departmentOrInstitution" : "ghfjjghfjghfjghf",
      "corporationAnyDepartment" : "fjfjghfjfjfgh",
      "factoryAddress": {
        "addressType": "FIRM_ADDRESS",
        "buildingName": "41",
        "streetName": "Sayaji Rao",
        "landmark": "VMC",
        "area": "Akota",
        "state": "GUJARAT",
        "district": null,
        "city": "Vadodara",
        "country": "INDIA",
        "pincode": "435345",
        "buildingNameGuj": "દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "streetNameGuj": null,
        "landmarkGuj": null,
        "areaGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "stateGuj": null,
        "districtGuj": null,
        "cityGuj": null,
        "countryGuj": null
      },
      "registeredAddress": {
        "addressType": "RESIDENCE_ADDRESS",
        "buildingName": "42",
        "streetName": "Sayaji Rao",
        "landmark": "VMC",
        "area": "Akota",
        "state": "GUJARAT",
        "district": null,
        "city": "Vadodara",
        "country": "INDIA",
        "pincode": "435345",
        "buildingNameGuj": "દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "streetNameGuj": null,
        "landmarkGuj": null,
        "areaGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "stateGuj": null,
        "districtGuj": null,
        "cityGuj": null,
        "countryGuj": null
      },
      "businessAddress": {
        "addressType": "RESIDENCE_ADDRESS",
        "buildingName": "43",
        "streetName": "Sayaji Rao",
        "landmark": "VMC",
        "area": "Akota",
        "state": "GUJARAT",
        "district": null,
        "city": "Vadodara",
        "country": "INDIA",
        "pincode": "435345",
        "buildingNameGuj": "દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "streetNameGuj": null,
        "landmarkGuj": null,
        "areaGuj": "ફ્દ્ગ્દ્ફ્ગ્ફ્દ્ગ",
        "stateGuj": null,
        "districtGuj": null,
        "cityGuj": null,
        "countryGuj": null
      },
      "contractorWorkDetails": "utgjhgkh",
      "businessName": "contractor",
      "businessMobileNo": "8962749074",
      "OwnwemobileNumber": "6265661272",
      "registrationDetails": "kjgjklgl",
      "threeYearDetails": "jkgjk",
      "workShopPlantRate": "gjkkjgjk",
      // "ownerAccountDepartment": "ghkgjkj",
      "turnOverDetails": "gkjjk",
      // "anotherOrganisation": "jhfgjhfk",
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
