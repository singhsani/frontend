import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { EngineeringService } from '../engineering.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ManageRoutes } from 'src/app/config/routes-conf';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {

  @ViewChild('officeAddr') officeAddrComponent: any;
  @ViewChild('resAddr') resAddrComponent: any;

  actionBarKey: string = 'adminActionBar';
  listOfItemMaterialSupplier: FormArray;
  academicQualifications: FormArray;
  vendorNameArray: FormArray;
  vendorRegistrationForm: FormGroup;
  implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
  locations: any = [];
  //Array<any> = [{ name: 'With in Gujarat', code: 'WITH_IN_GUJARAT' },
  // { name: 'Outside Of Gujarat', code: 'OUTSIDE_GUJARAT' },
  // { name: 'Outside Of India', code: 'OUTSIDE_INDIA' }];

  tabIndex: number = 0;
  isFromOnlineApp: boolean = false;
  maxDate: Date = new Date();
  minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];
  public serverUploadFilesArray: Array<any> = [];
  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private formService: FormsActionsService,
    private modalService: BsModalService,
    private engineer: EngineeringService
  ) {
    this.engineer.apiType = "vendor";
    this.formService.apiType = "vendor";
    this.listOfItemMaterialSupplier = this.fb.array([]);
    this.academicQualifications = this.fb.array([]);
    this.vendorNameArray = this.fb.array([]);
  }

  ngOnInit() {
    this.vendorRegistrationControl();
    this.vendorRegistrationForm.addControl('listOfItemMaterialSupplier', this.listOfItemMaterialSupplier);
    this.vendorRegistrationForm.addControl('vendorNameArray', this.vendorNameArray);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.getVendorData(this.formId);
    })

    this.getBankNames();
    this.getAllDocumentLists();
    this.getAllLocationDetail();

    if (!this.formId) {
      this.createFormData();
    }

  }

  /**
 * This method is use for create draft form
 */
  createFormData() {
    this.engineer.createFormData().subscribe(res => {
      this.vendorRegistrationForm.patchValue(res);
      setTimeout(() => {
        this.showButtons = true;
      }, 0)
    });
  }

  getVendorData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("tresr", res)
      this.vendorRegistrationForm.patchValue(res);
      this.showButtons = true;
      this.vendorRegistrationForm.disable();
      this.setServiceDetailsOnInit(res);
      //	this.sortedList.push(res);
    });
  }

  setServiceDetailsOnInit(res) {
    this.serverUploadFilesArray = res.attachments;
    const localUploadArray = [...this.serverUploadFilesArray];

    for (let file of localUploadArray) {
      console.log("file" + JSON.stringify(file));
      this.attachmentList.push(file);
    }
  }


  vendorRegistrationControl() {

    this.vendorRegistrationForm = this.fb.group({

      apiType: null,
      serviceCode: null,
      serviceFormId: this.formId,
      applicationNumber: null,

      id: null,
      nameOfTheFirm: null,
      commencementDate: null,
      yearOfEstablishment: null,

      panNo: [null, [Validators.required, ValidationService.panValidator]],
      tanNo: [null, [Validators.required, ValidationService.panValidator]],
      officeContactNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      officeFaxNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      officeEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      resContactNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      resFaxNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      resEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),

      namesOfTheOwner: null,
      manufacturingOwnedDetails: null,

      listOfItemMaterial: this.listOfItemMaterialSupplier,
      academicQualificationsDetail: this.fb.array([]),
      vendorNameDetails: this.vendorNameArray,

      registrationBank: this.fb.group({
        code: null,
        name: null
      }),
      registrationDDNumber: null,
      registrationAmount: [null, [Validators.maxLength(7)]],
      registrationDDIssuingDate: null,

      locationOfFactoryWorks: this.fb.group({
        code: null,
        name: null
      }),

      isIncomeTaxDetails: [null, [Validators.required]],
      isManufacturingOwnedDetails: [null, [Validators.required]],
      isTotalInvestmentDetail: [null, [Validators.required]],
      isLastThreeYearsCopies: [null, [Validators.required]],
      isCopyOfITCClearanceCertificate: [null, [Validators.required]],
      isRegistrationOfficeACT: [null, [Validators.required]],
      isISIProductManufactured: [null, [Validators.required]],
      isRegisteredByGovt: [null, [Validators.required]],
      isTestingRecordMaintanedDetail: [null, [Validators.required]],
      isPersonInChargeProductionControl: [null, [Validators.required]],
      isFirmUnderDealBlacklisted: [null, [Validators.required]],
      isResultSampleTesting: [null, [Validators.required]],

      totalTurnoverLastThreeYears: null,
      loanCapitalWithBankLimit: null,
      productManufacturedDescription: null,
      areaOfLandFactory: null,
      builtAreaFactory: null,
      noOfWorkingShifts: null,
      factoryLicenceNumber: null,
      sscNSICCertificateNumber: null,
      valueOfPlantAndMachinery: null,
      detailsEquipmentCapacity: null,
      detailsMachineryCapacity: null,
      testStandardGovtLabApproved: null,
      adoptedForQualityControl: null,
      methodEmployeeIdentify: null,
      sourceOfRawMaterialAddress: null,
      productionCapacityPerAnnum: null,
      maximumProductionPerAnnum: null,
      estimationOfStocks: null,
      numberOfItemsHoldingISOCertificate: null,
      remarks: null,

      purchaserName: null,
      orderNumber: null,
      orderDate: null,
      quantitySuppliedCompletionDate: null,

      managerialFullName: null,
      managerialQualification: null,
      managerialExperienceInYears: null,
      productionStaffFullName: null,
      productionStaffQualification: null,
      productionStaffExperienceInYears: null,
      qualityControlStaffFullName: null,
      qualityControlStaffQualification: null,
      qualityControlStaffExperienceInYears: null,
      personnelDetailSkilled: null,
      personnelDetailUnSkilled: null,
      personnelDetailOther: null,

      attachments: [],
      acceptAndCondition: [true],
      createdByCitizen: [true],
    });
    this.academicQualifications.push(this.createEducationQualification());
    this.vendorNameArray.push(this.createVendorNameArray());
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier());
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }

  getAllDocumentLists() {
    this.engineer.getAllDocuments().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);

      for (let file of this.attachmentList) {
        file['mandatory'] = false;
      }
    });
  }

  onDateChange(fieldName, date) {
    this.vendorRegistrationForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }

  getAllLocationDetail() {
    this.engineer.getAllLocationDetail().subscribe(res => {
      this.locations = _.cloneDeep(res);
    });
  }

  locationChange(code) {
    this.engineer.getFeeFromLocation(code).subscribe(res => {
      this.vendorRegistrationForm.get('registrationAmount').setValue(res.fee);
    })

  }

  addRow() {
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier());
  }

  createItemMaterialSupplier(): FormGroup {
    return this.fb.group({
      itemsMaterial: null,
      rating: null,
      description: null,
      isNumber: null,
    });
  }

  onRemoveRowItemMaterial(rowIndex: number) {
    this.listOfItemMaterialSupplier.removeAt(rowIndex);
  }

  createEducationQualification(): FormGroup {
    return this.fb.group({
      managerialFullName: null,
      managerialQualification: null,
      managerialExperienceInYears: null,

      productionStaffFullName: null,
      productionStaffQualification: null,
      productionStaffExperienceInYears: null,

      qualityControlStaffFullName: null,
      qualityControlStaffQualification: null,
      qualityControlStaffExperienceInYears: null,
    });
  }

  addRowVendorName() {
    this.vendorNameArray.push(this.createVendorNameArray());
  }

  onRemoveRowVendorName(rowIndex: number) {
    this.vendorNameArray.removeAt(rowIndex);
  }

  createVendorNameArray(): FormGroup {
    return this.fb.group({
      ownerType: null,
      ownerName: null,
    });
  }

  onRemoveRowVendorType(rowIndex: number) {
    this.vendorNameArray.removeAt(rowIndex);
  }

  getBankNames() {
    this.engineer.getBankNames().subscribe(res => {
      this.bankNameArray = res.data;
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

    // this.engineer.vendorSaveFormData(this.vendorRegistrationForm.getRawValue()).subscribe(res => {
    //   this.commonService.openAlert(" Successful", "", "success", `</b>`);
    // })
    this.vendorRegistrationForm.get('serviceFormId').setValue(this.formId);

    this.mandatoryFileCheck(this.vendorRegistrationForm.get('serviceFormId').value, this.attachmentList).then(data => {
      if (data.status) {
        this.engineer.vendorSaveFormData(this.vendorRegistrationForm.getRawValue()).subscribe(res => {
          if (Object.keys(res).length) {
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
            this.commonService.openAlert(" Successful", "", "success", `</b>`);
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

    this.vendorRegistrationForm.enable();

  }

  patchValue() {
    const obj = {

      "nameOfTheFirm": "Rudra Enterprises",
      "commencementDate": "2021-07-15",
      "yearOfEstablishment": "2021",
      "panNo": "ABCDE1223F",
      "tanNo": "ABCDE1223F",

      "officeContactNumber": "8962749074",
      "officeFaxNumber": "74148529633",
      "officeEmailId": "A@nascntinfo.com",

      "resContactNumber": "8962749074",
      "resFaxNumber": "74148529633",
      "resEmailId": "A@nascntinfo.com",

      "manufacturingOwnedDetails": "true",

      "registrationDDNumber": "741852",

      "registrationDDIssuingDate": "2021-07-15",

      "locationOfFactoryWorks": {
        "code": "WITH_IN_GUJARAT",
      },

      "isIncomeTaxDetails": "true",
      "isManufacturingOwnedDetails": "true",
      "isTotalInvestmentDetail": "true",
      "isLastThreeYearsCopies": "true",
      "isCopyOfITCClearanceCertificate": "true",
      "isRegistrationOfficeACT": "true",
      "isISIProductManufactured": "true",
      "isRegisteredByGovt": "true",
      "isTestingRecordMaintanedDetail": "true",
      "isPersonInChargeProductionControl": "true",
      "isFirmUnderDealBlacklisted": "true",
      "isResultSampleTesting": "true",

      "remarks": "Vendor Registration Form Submitted",

      "factoryAddress": {
        "buildingName": "12",
        "streetName": "Akota",
        "landmark": "sfasdfa",
        "area": "dsf",
        "state": "GUJARAT",
        "district": null,
        "city": "Vadodara",
        "country": "INDIA",
        "pincode": "748596"
      },
      "registeredAddress": {
        "buildingName": "12",
        "streetName": "Akota",
        "landmark": "sfasdfa",
        "area": "dsf",
        "state": "GUJARAT",
        "district": null,
        "city": "Vadodara",
        "country": "INDIA",
        "pincode": "748596"
      },

      "totalTurnoverLastThreeYears": "Fifteen Lakhs",
      "loanCapitalWithBankLimit": "500000",
      "productManufacturedDescription": "Nascent Info Technologies",
      "areaOfLandFactory": 1500,
      "builtAreaFactory": 15000,
      "noOfWorkingShifts": 15,
      "factoryLicenceNumber": "147852963",
      "sscNSICCertificateNumber": "1488529636",
      "valueOfPlantAndMachinery": "Nascent Info Technologies",
      "detailsEquipmentCapacity": "Nascent Info Technologies",
      "detailsMachineryCapacity": "Nascent Info Technologies",
      "testStandardGovtLabApproved": "Nascent Info Technologies",
      "adoptedForQualityControl": "Nascent Info Technologies",
      "methodEmployeeIdentify": "Nascent Info Technologies",
      "sourceOfRawMaterialAddress": "Nascent Info Technologies",
      "productionCapacityPerAnnum": 25000,
      "maximumProductionPerAnnum": 2500,

      "purchaserName": "Nascent Info Technologies",
      "orderNumber": 14785,
      "orderDate": "15-07-2021",
      "quantitySuppliedCompletionDate": "15-07-2021",

      "estimationOfStocks": "Nascent Info Technologies",
      "numberOfItemsHoldingISOCertificate": "Nascent Info Technologies",

      "managerialFullName": "Nascent Info Technologies",
      "managerialQualification": "Nascent Info Technologies",
      "managerialExperienceInYears": "Nascent Info Technologies",
      "productionStaffFullName": "Nascent Info Technologies",
      "productionStaffQualification": "Nascent Info Technologies",
      "productionStaffExperienceInYears": "Nascent Info Technologies",
      "qualityControlStaffFullName": "Nascent Info Technologies",
      "qualityControlStaffQualification": "Nascent Info Technologies",
      "qualityControlStaffExperienceInYears": "Nascent Info Technologies",

      "personnelDetailSkilled": "Nascent Info Technologies",
      "personnelDetailUnSkilled": "Nascent Info Technologies",
      "personnelDetailOther": "Nascent Info Technologies",
    }

    this.vendorRegistrationForm.patchValue(obj);
  }

}
