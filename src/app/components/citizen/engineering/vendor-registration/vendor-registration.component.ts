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
import { CitizenConfig } from '../../citizen-config';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {

  @ViewChild('officeAddr') officeAddrComponent: any;
  @ViewChild('resAddr') resAddrComponent: any;

  public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();

  public formControlNameToTabIndex = new Map();

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
  minDateNew = moment().subtract(2000, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];
  academicQualificationDes: any = [];
  public serverUploadFilesArray: Array<any> = [];

  uploadFilesArray: Array<any> = [];

  manuFacturDetails: any;

  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = true;

  vendorNameLastYear: FormArray;

  vendorNameAuthorized: FormArray;

  vendorNameholding: FormArray;

  academicQualificationAndExperience: FormArray;

  vendorDetailsOfOrderIndicationQuantity: FormArray;

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
    this.academicQualificationAndExperience = this.fb.array([]);
    this.academicQualifications = this.fb.array([]);
    this.vendorNameArray = this.fb.array([]);
    this.vendorNameLastYear = this.fb.array([]);
    this.vendorNameAuthorized = this.fb.array([]);
    this.vendorNameholding = this.fb.array([]);
    this.vendorDetailsOfOrderIndicationQuantity = this.fb.array([]);
  }

  ngOnInit() {
    this.vendorRegistrationControl();
    this.vendorRegistrationForm.addControl('listOfItemMaterialSupplier', this.listOfItemMaterialSupplier);
    this.vendorRegistrationForm.addControl('vendorNameArray', this.vendorNameArray);
    this.vendorRegistrationForm.addControl('academicQualificationAndExperience', this.academicQualificationAndExperience);
    this.vendorRegistrationForm.addControl('vendorNameLastYear', this.vendorNameLastYear);
    this.vendorRegistrationForm.addControl('vendorNameAuthorized', this.vendorNameAuthorized);
    this.vendorRegistrationForm.addControl('vendorNameholding', this.vendorNameholding);
    this.vendorRegistrationForm.addControl('vendorDetailsOfOrderIndicationQuantity', this.vendorDetailsOfOrderIndicationQuantity);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.getVendorData(this.formId);
    })

    this.getBankNames();
    this.getAllDocumentLists();
    this.getAllLocationDetail();
    this.getLookUp();

    if (!this.formId) {
      this.createFormData();
    }

    this.setFormControlToTabIndexMap();

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

  setFormControlToTabIndexMap() {

    this.formControlNameToTabIndex.set('nameOfTheFirm', 0)
    this.formControlNameToTabIndex.set('commencementDate', 0)
    this.formControlNameToTabIndex.set('yearOfEstablishment', 0)
    this.formControlNameToTabIndex.set('panNo', 0)
    this.formControlNameToTabIndex.set('tanNo', 0)
    this.formControlNameToTabIndex.set('gstNo', 0)
    this.formControlNameToTabIndex.set('gstRegiDate', 0)
    this.formControlNameToTabIndex.set('officeContactNumber', 0)
    this.formControlNameToTabIndex.set('officeFaxNumber', 0)
    this.formControlNameToTabIndex.set('officeEmailId', 0)
    this.formControlNameToTabIndex.set('branchMobileNumber', 0)
    this.formControlNameToTabIndex.set('branchAlterMobileNumber', 0)
    this.formControlNameToTabIndex.set('branchISDNumber', 0)
    this.formControlNameToTabIndex.set('branchSTDNumber', 0)
    this.formControlNameToTabIndex.set('headMobileNumber', 0)
    this.formControlNameToTabIndex.set('headAlterMobileNumber', 0)
    this.formControlNameToTabIndex.set('headISDNumber', 0)
    this.formControlNameToTabIndex.set('headSTDNumber', 0)
    this.formControlNameToTabIndex.set('resContactNumber', 0)
    this.formControlNameToTabIndex.set('resFaxNumber', 0)
    this.formControlNameToTabIndex.set('resEmailId', 0)
    this.formControlNameToTabIndex.set('factoryAddress', 0)
    this.formControlNameToTabIndex.set('registeredAddress', 0)


    this.formControlNameToTabIndex.set('locationOfFactoryWorks', 0)
    this.formControlNameToTabIndex.set('isIncomeTaxDetails', 1)
    this.formControlNameToTabIndex.set('manufacturingOwnedDetails', 1)
    this.formControlNameToTabIndex.set('acceptAndCondition', 4)


  }
  getVendorData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("tresr", res)
      this.vendorRegistrationForm.patchValue(res);
      //this.showButtons = false;
      //this.vendorRegistrationForm.disable();
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

  getLookUp() {
    this.engineer.getLookup().subscribe(res => {

      this.manuFacturDetails = res.VENDOR_MANUFACTURING_OWNED;
      this.academicQualificationDes = res.ACEDEMIC_QUALIFICATION_DESC;

    });
  }

  vendorRegistrationControl() {

    this.vendorRegistrationForm = this.fb.group({

      apiType: "vendor",
      serviceCode: null,
      serviceFormId: this.formId,
      applicationNumber: null,
      canEdit: [true],

      nameOfTheFirm: [null, [Validators.required, Validators.maxLength(150)]],
      commencementDate: [null, [Validators.required]],
      yearOfEstablishment: [null, [Validators.required]],
      panNo: [null, [Validators.required, ValidationService.panValidator]],
      tanNo: [null, [ValidationService.tanValidator]],
      gstNo: [null, [ValidationService.gstNoValidator]],
      gstRegiDate: [null],

      officeContactNumber: [null, [Validators.required]],
      officeFaxNumber: [null, [ValidationService.faxValidation]],
      officeEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      branchMobileNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      branchAlterMobileNumber: [null, [Validators.maxLength(10), Validators.minLength(10)]],
      branchISDNumber: [null, [Validators.maxLength(11)]],
      branchSTDNumber: [null, [Validators.maxLength(12)]],

      headMobileNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      headAlterMobileNumber: [null, [Validators.maxLength(10), Validators.minLength(10)]],
      headISDNumber: [null, [Validators.maxLength(11)]],
      headSTDNumber: [null, [Validators.maxLength(12)]],

      resContactNumber: [null, [Validators.required]],
      resFaxNumber: [null, [ValidationService.faxValidation]],
      resEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),

      namesOfTheOwner: null,
      //manufacturingOwnedDetails: null,

      listOfItemMaterial: this.listOfItemMaterialSupplier,
      qualificationDetails: this.academicQualificationAndExperience,
      vendorNameDetails: this.vendorNameArray,
      vendorNameLastYearDetails: this.vendorNameLastYear,
      vendorNameAuthorizedDetails: this.vendorNameAuthorized,
      vendorNameholdingDetails: this.vendorNameholding,
      supplierOrderDetails: this.vendorDetailsOfOrderIndicationQuantity,

      registrationBank: this.fb.group({
        code: [{ value: null, disabled: true }],
        name: null
      }),
      registrationDDNumber: [{ value: null, disabled: true }],
      registrationAmount: [{ value: null, disabled: true }],
      registrationDDIssuingDate: [{ value: null, disabled: true }],

      locationOfFactoryWorks: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),

      incomeTaxDetails: [null, [Validators.required]],
      isManufacturingOwnedDetails: [null],

      manufacturingOwnedDetails: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),

      detailsOfLandDocumentsFactory: null,
      buildingPermissionDetail: null,
      factoryLicenseStartDate: [null],
      factoryLicenseEndDate: [null],
      MSMENSICSSICertificateStartDate: [null],
      MSMENSICSSICertificateEndDate: [null],

      productManufacturedISI: [null],
      ISIBISCElicences: null,
      totalInvestmentDetail: [null],
      lastThreeYearsCopies: [null],
      copyOfITCClearanceCertificate: [null],
      registrationOfficeACT: [null],
      registeredByGovt: [null],
      testingRecordMaintainedDetail: [null],
      personInChargeProductionControl: [null],
      firmUnderDealBlacklisted: [null],
      resultSampleTesting: [null],
      MSMENSICSSIcertificateEndDate: null,

      totalTurnoverLastThreeYears: null,
      loanCapitalWithBankLimit: null,
      productManufacturedDescription: null,
      areaOfLandFactory: null,
      builtAreaFactory: null,
      noOfWorkingShifts: null,
      factoryLicenceNumber: [null],
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
      remarks: [null],

      // purchaserName: null,
      // orderNo: null,
      // orderDate: null,
      // quantitySuppliedCompletionDate: null,

      // managerialFullName: null,
      // managerialQualification: null,
      // managerialExperienceInYears: null,
      // productionStaffFullName: null,
      // productionStaffQualification: null,
      // productionStaffExperienceInYears: null,
      // qualityControlStaffFullName: null,
      // qualityControlStaffQualification: null,
      // qualityControlStaffExperienceInYears: null,
      personnelDetailSkilled: null,
      personnelDetailUnSkilled: null,
      personnelDetailOther: null,

      attachments: [],
      acceptAndCondition: [null],
      createdByCitizen: [true],

    });

    this.academicQualifications.push(this.createEducationQualification());
    this.academicQualificationAndExperience.push(this.createEducationQualification());
    this.vendorNameArray.push(this.createVendorNameArray());
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier());
    this.vendorNameLastYear.push(this.createItemMaterialSupplierLastThreeYear());
    this.vendorNameAuthorized.push(this.createItemAuthorized());
    this.vendorNameholding.push(this.createItemHolding());
    this.vendorDetailsOfOrderIndicationQuantity.push(this.createDetailsOfIndicatingQuantity());
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }

  getAllDocumentLists() {
    this.engineer.getAllDocuments().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);

      // for (let file of this.attachmentList) {
      //   file['mandatory'] = false;
      // }
    });
  }

  handleErrorsOnSubmit(key) {

    const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

    this.tabIndex = index;
    return false;


  }

  onDateChange(fieldName, date) {
    this.vendorRegistrationForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }

  onDateChangePurchaseDate(control, date, obj) {
    obj.get(control).setValue(moment(date).format("YYYY-MM-DD"));
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

  createItemMaterialSupplierLastThreeYear(): FormGroup {
    return this.fb.group({
      companyName: null,
      purchasingItem: null,
      purchasingDate: null,
    });
  }

  createItemAuthorized(): FormGroup {
    return this.fb.group({
      authorized: null,
      contactNumber: null,
      address: null,
    });
  }

  createItemHolding(): FormGroup {
    return this.fb.group({
      itemName: null,
      certificateDetail: null,
    });
  }

  addRowLastThreeYear() {
    this.vendorNameLastYear.push(this.createItemMaterialSupplierLastThreeYear());
  }

  addRowvendorNameAuthorized() {
    this.vendorNameAuthorized.push(this.createItemAuthorized());
  }

  addRowvendorNameholding() {
    this.vendorNameholding.push(this.createItemHolding());
  }

  addacademicQualification() {
    this.academicQualificationAndExperience.push(this.createEducationQualification());
  }

  onRemoveacademicQualificationAndExperience(rowIndex: number) {
    this.academicQualificationAndExperience.removeAt(rowIndex);
  }


  addRowVendorDetailsOfOrderIndicationQuantity() {
    this.vendorDetailsOfOrderIndicationQuantity.push(this.createDetailsOfIndicatingQuantity());
  }

  onRemoveRowVendorTypeLastYear(rowIndex: number) {
    this.vendorNameLastYear.removeAt(rowIndex);
  }

  onRemovevendorNameAuthorized(rowIndex: number) {
    this.vendorNameAuthorized.removeAt(rowIndex);
  }

  onRemovevendorNameholding(rowIndex: number) {
    this.vendorNameholding.removeAt(rowIndex);
  }

  onRemoveVendorDetailsOfOrderIndicationQuantity(rowIndex: number) {
    this.vendorDetailsOfOrderIndicationQuantity.removeAt(rowIndex);
  }


  onRemoveRowItemMaterial(rowIndex: number) {
    this.listOfItemMaterialSupplier.removeAt(rowIndex);
  }

  createEducationQualification(): FormGroup {
    return this.fb.group({
      fullName: null,
      qualification: null,
      designation: this.fb.group({
        code: null,
        name: null
      }),
      experienceInYears: null,
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
      ownerAddress: null
    });
  }

  createDetailsOfIndicatingQuantity(): FormGroup {
    return this.fb.group({
      purchaserName: null,
      orderNumber: null,
      orderDate: null,
      quantitySuppliedCompletionDate: null
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
    if (this.vendorRegistrationForm.invalid) {
      //this.commonService.prrintInvalidForm(this.affordableHousingForm);
      let count = this.affordableHousingConfiguration.getAllErrors(this.vendorRegistrationForm);

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

    // this.engineer.vendorSaveFormData(this.vendorRegistrationForm.getRawValue()).subscribe(res => {
    //   this.commonService.openAlert(" Successful", "", "success", `</b>`);
    // })
    this.vendorRegistrationForm.get('serviceFormId').setValue(this.formId);

    this.mandatoryFileCheck(this.vendorRegistrationForm.get('serviceFormId').value, this.attachmentList).then(data => {
      if (data.status) {
        this.engineer.vendorSaveFormData(this.vendorRegistrationForm.getRawValue()).subscribe(res => {
          if (Object.keys(res).length) {
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
            this.commonService.openAlert("Application Submitted Successful", "", "success", `</b>`);
            this.resetForm();
          }
        }, (err) => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
        return;

      }
      else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
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
      "officeFaxNumber": "7414852963",
      "officeEmailId": "chetan.porwal@nascentinfo.com",

      "resContactNumber": "8962749074",
      "resFaxNumber": "7414852963",
      "resEmailId": "chetan.porwal@nascentinfo.com",

      "registrationDDNumber": "741852",

      "registrationDDIssuingDate": "2021-10-25",

      "locationOfFactoryWorks": {
        "code": "WITH_IN_GUJARAT",
      },

      "incomeTaxDetails": "true",
      "manufacturingOwnedDetails": {
        "code": "OWNED",
      },
      "totalInvestmentDetail": "true",
      "lastThreeYearsCopies": "true",
      "copyOfITCClearanceCertificate": "true",
      "registrationOfficeACT": "true",
      "productManufacturedISI": "true",
      "registeredByGovt": "true",
      "testingRecordMaintainedDetail": "true",
      "personInChargeProductionControl": "true",
      "firmUnderDealBlacklisted": "true",
      "resultSampleTesting": "true",

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
      "productManufacturedDescription": "sdf",
      "areaOfLandFactory": 1500,
      "builtAreaFactory": 15000,
      "noOfWorkingShifts": 15,
      "factoryLicenceNumber": "147852963",
      "sscNSICCertificateNumber": "1488529636",
      "valueOfPlantAndMachinery": "sdf",
      "detailsEquipmentCapacity": "dd",
      "detailsMachineryCapacity": "dd",
      "testStandardGovtLabApproved": "ffgf",
      "adoptedForQualityControl": "sdf",
      "methodEmployeeIdentify": "fdg",
      "sourceOfRawMaterialAddress": "gfgh",
      "productionCapacityPerAnnum": 25000,
      "maximumProductionPerAnnum": 2500,

      "purchaserName": "sdf",
      "orderNumber": 14785,
      "orderDate": "15-07-2021",
      "quantitySuppliedCompletionDate": "15-07-2021",

      "estimationOfStocks": "SDF",
      "numberOfItemsHoldingISOCertificate": "SDF",

      "managerialFullName": "SDF",
      "managerialQualification": "SDF",
      "managerialExperienceInYears": "SDF",
      "productionStaffFullName": "SDF",
      "productionStaffQualification": "SDF",
      "productionStaffExperienceInYears": "SDF",
      "qualityControlStaffFullName": "SDF",
      "qualityControlStaffQualification": "SDF",
      "qualityControlStaffExperienceInYears": "SDF",

      "personnelDetailSkilled": "SDF",
      "personnelDetailUnSkilled": "SDF",
      "personnelDetailOther": "SDF",

      "branchMobileNumber": "7485967485",
      "branchAlterMobileNumber": "7485967485",
      "branchISDNumber": "7485967485",
      "branchSTDNumber": "7485967485",
      "headMobileNumber": "7485967485",
      "headAlterMobileNumber": "7485967485",
      "headISDNumber": "7485967485",
      "headSTDNumber": "7485967485",
      "ISIBISCElicences": "7485967485"

    }

    this.vendorRegistrationForm.patchValue(obj);
  }

}
