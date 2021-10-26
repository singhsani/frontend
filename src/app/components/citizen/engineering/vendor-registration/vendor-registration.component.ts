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
  attachmentList: any = [];
  bankNameArray: any = [];
  public serverUploadFilesArray: Array<any> = [];

  uploadFilesArray: Array<any> = [];

  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = true;

  vendorNameLastYear: FormArray;

  vendorNameAuthorized: FormArray;

  vendorNameholding: FormArray;

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
    this.vendorNameLastYear = this.fb.array([]);
    this.vendorNameAuthorized = this.fb.array([]);
    this.vendorNameholding = this.fb.array([]);

  }

  ngOnInit() {
    this.vendorRegistrationControl();
    this.vendorRegistrationForm.addControl('listOfItemMaterialSupplier', this.listOfItemMaterialSupplier);
    this.vendorRegistrationForm.addControl('vendorNameArray', this.vendorNameArray);
    this.vendorRegistrationForm.addControl('vendorNameLastYear', this.vendorNameLastYear);
    this.vendorRegistrationForm.addControl('vendorNameAuthorized', this.vendorNameAuthorized);
    this.vendorRegistrationForm.addControl('vendorNameholding', this.vendorNameholding);

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

  // setFormControlToTabIndexMap() {

    
  //   this.formControlNameToTabIndex.set('nameOfTheFirm', 0)
  //     this.formControlNameToTabIndex.set('panNo', 0)
  //     this.formControlNameToTabIndex.set('tanNo', 0)
  //     this.formControlNameToTabIndex.set('locationOfFactoryWorks', 0)
  //     this.formControlNameToTabIndex.set('factoryAddress', 0)
  //     this.formControlNameToTabIndex.set('officeContactNumber', 0)
  //     this.formControlNameToTabIndex.set('officeFaxNumber', 0)
  //     this.formControlNameToTabIndex.set('officeEmailId', 0)
  //     this.formControlNameToTabIndex.set('resContactNumber', 0)
  //     this.formControlNameToTabIndex.set('resFaxNumber', 0)
  //     this.formControlNameToTabIndex.set('resEmailId', 0)
  //     this.formControlNameToTabIndex.set('registeredAddress', 0)

  //     this.formControlNameToTabIndex.set('registrationBank', 1)
  //     this.formControlNameToTabIndex.set('registrationAmount', 1)
  //     this.formControlNameToTabIndex.set('registrationDDNumber', 1)
  //     this.formControlNameToTabIndex.set('registrationDDIssuingDate', 1)
  //     this.formControlNameToTabIndex.set('isIncomeTaxDetails', 1)
  //     this.formControlNameToTabIndex.set('vendorNameDetails', 1)
  //     this.formControlNameToTabIndex.set('isManufacturingOwnedDetails', 1)
  //     this.formControlNameToTabIndex.set('isTotalInvestmentDetail', 1)
  //     this.formControlNameToTabIndex.set('isLastThreeYearsCopies', 1)
      
  //     this.formControlNameToTabIndex.set('loanCapitalWithBankLimit', 2)
  //     this.formControlNameToTabIndex.set('isCopyOfITCClearanceCertificate', 2)
  //     this.formControlNameToTabIndex.set('factoryLicenceNumber', 2)
  //     this.formControlNameToTabIndex.set('isRegistrationOfficeACT', 2)
  //     this.formControlNameToTabIndex.set('isISIProductManufactured', 2)
  //     this.formControlNameToTabIndex.set('isRegisteredByGovt', 2)

  //     this.formControlNameToTabIndex.set('isTestingRecordMaintanedDetail', 3)
  //     this.formControlNameToTabIndex.set('testStandardGovtLabApproved', 0)
  //     this.formControlNameToTabIndex.set('testStandardGovtLabApproved', 0)
  //     this.formControlNameToTabIndex.set('testStandardGovtLabApproved', 0)


  // }  
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

  vendorRegistrationControl() {

    this.vendorRegistrationForm = this.fb.group({

      apiType: "vendor",
      serviceCode: null,
      serviceFormId: this.formId,
      applicationNumber: null,
      canEdit: [true],

      gstNo: [null, ValidationService.gstNoValidator],
      gstRegiDate : null,

      id: null,
      nameOfTheFirm: [null, [Validators.required]],
      commencementDate: null,
      yearOfEstablishment: null,

      panNo: [null, [Validators.required, ValidationService.panValidator]],
      tanNo: [null, [Validators.required, ValidationService.tanValidator]],
      officeContactNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      officeFaxNumber: [null, [ValidationService.mobileNumberValidation]],
      officeEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      resContactNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      resFaxNumber: [null, [ValidationService.mobileNumberValidation]],
      resEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),

      namesOfTheOwner: null,
      manufacturingOwnedDetails: null,

      detailsOfLandDocumentsFactory : null,
      buildingPermissionDetail : null,
      factoryLicenseStartDate : null,
      factoryLicenseEndDate : null,
      MSMENSICSSIcertificateStartDate: null,
      MSMENSICSSIcertificateEndDate : null,

      ISIBISCElicences : null,

      listOfItemMaterial: this.listOfItemMaterialSupplier,
      academicQualificationsDetail: this.fb.array([]),
      vendorNameDetails: this.vendorNameArray,

      vendorNameLastYearDetails: this.vendorNameLastYear,
      vendorNameAuthorizedDetails: this.vendorNameAuthorized,
      vendorNameholdingDetails: this.vendorNameholding,

      registrationBank: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      registrationDDNumber:  [null, [Validators.required]],
      registrationAmount: [null, [Validators.maxLength(7)]],
      registrationDDIssuingDate:  [null, [Validators.required]],

      locationOfFactoryWorks: this.fb.group({
        code: [null,[Validators.required]],
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
      factoryLicenceNumber:  [null, [Validators.required]],
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
      orderNo: null,
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
    this.vendorNameLastYear.push(this.createItemMaterialSupplierLastThreeYear());
    this.vendorNameAuthorized.push(this.createItemAuthorized());
    this.vendorNameholding.push(this.createItemHolding());
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

  createItemMaterialSupplierLastThreeYear(): FormGroup {
    return this.fb.group({
      companyName: null,
      purchasingItem: null,
      purchasingDate: null,
    });
  }

  createItemAuthorized(): FormGroup {
    return this.fb.group({
      autthorized: null,
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

  onRemoveRowVendorTypeLastYear(rowIndex: number) {
    this.vendorNameLastYear.removeAt(rowIndex);
  }

  onRemovevendorNameAuthorized(rowIndex: number) {
    this.vendorNameAuthorized.removeAt(rowIndex);
  }
  
  onRemovevendorNameholding(rowIndex: number) {
    this.vendorNameholding.removeAt(rowIndex);
  }

  handleErrorsOnSubmit(key) {

		//const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

		//this.tabIndex = index;
		return false;


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
debugger;
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

      "manufacturingOwnedDetails": "true",

      "registrationDDNumber": "741852",

      "registrationDDIssuingDate": "2021-10-25",

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
    }

    this.vendorRegistrationForm.patchValue(obj);
  }

}
