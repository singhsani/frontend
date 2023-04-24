import { Component, forwardRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
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
import { ValidatorService } from 'src/app/vmcshared/data-table/validator.service';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss'],
})
export class VendorRegistrationComponent implements OnInit {

  @ViewChild('officeAddr') officeAddrComponent: any;
  @ViewChild('resAddr') resAddrComponent: any;

  public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();

  public formControlNameToTabIndex = new Map();

  actionBarKey: string = 'adminActionBar';
  translateKey: string = 'addressScreen';
  listOfItemMaterialSupplier: FormArray;
  academicQualifications: FormArray;
  vendorNameArray: FormArray;
  vendorRegistrationForm: FormGroup;
  firmDetails : FormGroup;
  registrationDetail : FormGroup;
  factoryAndEmployeeDetail : FormGroup;
  productAndSupplierDetail : FormGroup;
  refrenceDocument : FormGroup
  vendorMachinesCapacities: FormArray;
  vendorRegisteredGovtDetail: FormArray;

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
  orderMinDate: Date = new Date();
  fiveYearDate = moment(new Date()).add("5", "years").format("YYYY-MM-DD");
  threeYearDate = moment(new Date()).subtract("3", "years").format("YYYY-MM-DD");

  attachmentList: any = [];
  bankNameArray: any = [];
  vendorTypeFirm: any = [];
  vendorTypeFirmUpdate: any = [];
  academicQualificationDes: any = [];
  public serverUploadFilesArray: Array<any> = [];

  uploadFilesArray: Array<any> = [];

  manuFacturDetails: any;

  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = true;
  vendorArrayNameButtons: boolean = false;
  isPreviewVendorNameDetail = false;
  isListOfItemMaterial = false;
  isVendorNameHoldingDetails = false;
  isVendorNameAuthorizedDetails = false;
  isVendorNameLastYearDetails = false;
  isSupplierOrderDetails = false;
  isQualificationDetails = false;
  isInstalledMachineCapacities = false;
  isRegisteredGovtDetail = false;

  vendorNameLastYear: FormArray;
  vendorNameAuthorized: FormArray;
  vendorNameholding: FormArray;
  academicQualificationAndExperience: FormArray;
  vendorDetailsOfOrderIndicationQuantity: FormArray;
  //for factory address
  setAddressValue = '';
  buildingName = '';
  streetName = '';
  landmark = '';
  area = '';
  pinCode = '';
  state = '';
  city = '';
  country = '';
  canAddressEdit = true;
  checkbox: boolean = true;
  
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
    this.vendorMachinesCapacities = this.fb.array([]);
    this.vendorRegisteredGovtDetail = this.fb.array([]);

  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.vendorRegistrationControl();
    this.vendorRegistrationForm.addControl('listOfItemMaterialSupplier', this.listOfItemMaterialSupplier);
    this.vendorRegistrationForm.addControl('vendorNameArray', this.vendorNameArray);
    this.vendorRegistrationForm.addControl('academicQualificationAndExperience', this.academicQualificationAndExperience);
    this.vendorRegistrationForm.addControl('vendorNameLastYear', this.vendorNameLastYear);
    this.vendorRegistrationForm.addControl('vendorNameAuthorized', this.vendorNameAuthorized);
    this.vendorRegistrationForm.addControl('vendorNameholding', this.vendorNameholding);
    this.vendorRegistrationForm.addControl('vendorDetailsOfOrderIndicationQuantity', this.vendorDetailsOfOrderIndicationQuantity);
    this.vendorRegistrationForm.addControl('vendorMachinesCapacities', this.vendorMachinesCapacities);
    this.vendorRegistrationForm.addControl('vendorRegisteredGovtDetail', this.vendorRegisteredGovtDetail);

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
    this.formControlNameToTabIndex.set('listOfItemMaterial', 1)
    this.formControlNameToTabIndex.set('vendorNameDetails', 1)
    this.formControlNameToTabIndex.set('manufacturingOwnedDetails', 1)
    this.formControlNameToTabIndex.set('acceptAndCondition', 4)
    this.formControlNameToTabIndex.set('buildingName', 0),
      this.formControlNameToTabIndex.set('streetName', 0)
    this.formControlNameToTabIndex.set('landmark', 0)
    this.formControlNameToTabIndex.set('area', 0)
    this.formControlNameToTabIndex.set('state', 0)
    this.formControlNameToTabIndex.set('pincode', 0)
    this.formControlNameToTabIndex.set('city', 0)
    this.formControlNameToTabIndex.set('country', 0)
  }
  getVendorData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("tresr", res)
      this.vendorRegistrationForm.patchValue(res);
      this.firmDetails.patchValue(res);
      this.registrationDetail.patchValue(res);
      this.factoryAndEmployeeDetail.patchValue(res);
      this.productAndSupplierDetail.patchValue(res)
      if (res.formStatus != 'REJECTED') {
        let obj = {value : res.applyingFor }
        this.locationChange(obj);
      }

      //this.showButtons = false;

      if (res.formStatus == 'PAYMENT_RECEIVED' || res.formStatus == 'SUBMITTED') {
        this.vendorRegistrationForm.disable();
        this.firmDetails.disable();
        this.registrationDetail.disable();
        this.factoryAndEmployeeDetail.disable()
        this.productAndSupplierDetail.disable();
        this.canAddressEdit = false
        this.vendorRegistrationForm.get('canEdit').setValue(false);
      }
      // to remove the intaial (frist index) of data 
      (<FormArray>this.registrationDetail.get('vendorNameDetails')).removeAt(this.registrationDetail.controls.vendorNameDetails.value[0]);
      (<FormArray>this.registrationDetail.get('listOfItemMaterial')).removeAt(this.registrationDetail.controls.listOfItemMaterial.value[0]);

      res.vendorNameDetails.forEach(app => {
        (<FormArray>this.registrationDetail.get('vendorNameDetails')).push(this.createFormGroupVendor('vendorNameDetails', app));
      });
      this.isPreviewVendorNameDetail = true;

      res.listOfItemMaterial.forEach(app => {
        (<FormArray>this.registrationDetail.get('listOfItemMaterial')).push(this.createFormGroupVendor('listOfItemMaterial', app));
      });
      this.isListOfItemMaterial = true;

      res.vendorNameHoldingDetails.forEach(app => {
        (<FormArray>this.productAndSupplierDetail.get('vendorNameHoldingDetails')).push(this.createFormGroupVendor('vendorNameHoldingDetails', app));
      });
      this.isVendorNameHoldingDetails = true;

      res.vendorNameAuthorizedDetails.forEach(app => {
        (<FormArray>this.productAndSupplierDetail.get('vendorNameAuthorizedDetails')).push(this.createFormGroupVendor('vendorNameAuthorizedDetails', app));
      });
      this.isVendorNameAuthorizedDetails = true;

      res.vendorNameLastYearDetails.forEach(app => {
        (<FormArray>this.productAndSupplierDetail.get('vendorNameLastYearDetails')).push(this.createFormGroupVendor('vendorNameLastYearDetails', app));
      });
      this.isVendorNameLastYearDetails = true;

      res.supplierOrderDetails.forEach(app => {
        (<FormArray>this.productAndSupplierDetail.get('supplierOrderDetails')).push(this.createFormGroupVendor('supplierOrderDetails', app));
      });
      this.isSupplierOrderDetails = true;

      res.qualificationDetails.forEach(app => {
        (<FormArray>this.factoryAndEmployeeDetail.get('qualificationDetails')).push(this.createFormGroupVendor('qualificationDetails', app));
      });
      this.isQualificationDetails = true;

      res.installedMachineCapacities.forEach(app => {
        (<FormArray>this.factoryAndEmployeeDetail.get('installedMachineCapacities')).push(this.createFormGroupVendor('installedMachineCapacities', app));
      });
      this.isInstalledMachineCapacities = true;

      res.registeredGovtDetail.forEach(app => {
        (<FormArray>this.factoryAndEmployeeDetail.get('registeredGovtDetail')).push(this.createFormGroupVendor('registeredGovtDetail', app));
      });
      this.isRegisteredGovtDetail = true;


      this.setServiceDetailsOnInit(res);
      //	this.sortedList.push(res);
    });
  }

  createFormGroupVendor(key: string, data: any): FormGroup {

    let formGroupData: FormGroup;
    switch (key) {
      case 'vendorNameDetails':
        formGroupData = this.fb.group({
          ownerType: this.fb.group({
            code: [{ value: data.ownerType.code ? data.ownerType.code : null, disabled: true }],
            name: [{ value: data.ownerType.name ? data.ownerType.name : null, disabled: true }]
          }),
          ownerName: [{ value: data.ownerName ? data.ownerName : null, disabled: true }],
          ownerAddress: [{ value: data.ownerAddress ? data.ownerAddress : null, disabled: true }],
        })
        break;

      case 'listOfItemMaterial':
        formGroupData = this.fb.group({
          itemsMaterial: [{ value: data.itemsMaterial ? data.itemsMaterial : null, disabled: true }],
          rating: [{ value: data.rating ? data.rating : null, disabled: true }],
          description: [{ value: data.description ? data.description : null, disabled: true }],
          isNumber: [{ value: data.isNumber ? data.isNumber : null, disabled: true }],
        })
        break;

      case 'vendorNameHoldingDetails':
        formGroupData = this.fb.group({
          itemName: [{ value: data.itemName ? data.itemName : null, disabled: true }],
          certificateDetail: [{ value: data.certificateDetail ? data.certificateDetail : null, disabled: true }],
        })
        break;

      case 'vendorNameAuthorizedDetails':
        formGroupData = this.fb.group({
          authorized: [{ value: data.authorized ? data.authorized : null, disabled: true }],
          contactNumber: [{ value: data.contactNumber ? data.contactNumber : null, disabled: true }],
          address: [{ value: data.address ? data.address : null, disabled: true }]
        })
        break;

      case 'vendorNameLastYearDetails':
        formGroupData = this.fb.group({
          companyName: [{ value: data.companyName ? data.companyName : null, disabled: true }],
          purchasingItem: [{ value: data.purchasingItem ? data.purchasingItem : null, disabled: true }],
          purchasingDate: [{ value: data.purchasingDate ? data.purchasingDate : null, disabled: true }],
        })
        break;

      case 'supplierOrderDetails':
        formGroupData = this.fb.group({
          purchaserName: [{ value: data.purchaserName ? data.purchaserName : null, disabled: true }],
          orderNumber: [{ value: data.orderNumber ? data.orderNumber : null, disabled: true }],
          orderDate: [{ value: data.orderDate ? data.orderDate : null, disabled: true }],
          quantitySuppliedCompletionDate:
            [{ value: data.quantitySuppliedCompletionDate ? data.quantitySuppliedCompletionDate : null, disabled: true }],
        })
        break;

      case 'qualificationDetails':
        formGroupData = this.fb.group({
          fullName: [{ value: data.fullName ? data.fullName : null, disabled: true }],
          qualification: [{ value: data.qualification ? data.qualification : null, disabled: true }],
          designation: this.fb.group({
            code: [{ value: data.designation.code ? data.designation.code : null, disabled: true }],
            name: [{ value: data.designation.name ? data.designation.name : null, disabled: true }]
          }),
          experienceInYears: [{ value: data.experienceInYears ? data.experienceInYears : null, disabled: true }]
        })
        break;

      case 'installedMachineCapacities':
        formGroupData = this.fb.group({
          nameOfMachinery: [{ value: data.nameOfMachinery ? data.nameOfMachinery : null, disabled: true }],
          workingProcessDetail: [{ value: data.workingProcessDetail ? data.workingProcessDetail : null, disabled: true }],
          productionCapacityWorking: [{ value: data.productionCapacityWorking ? data.productionCapacityWorking : null, disabled: true }],
        })
        break;

      case 'registeredGovtDetail':
        formGroupData = this.fb.group({
          nameOfAuthority: [{ value: data.nameOfAuthority ? data.nameOfAuthority : null, disabled: true }],
          regNumber: [{ value: data.regNumber ? data.regNumber : null, disabled: true }],
          registrationDate: [{ value: data.registrationDate ? data.registrationDate : null, disabled: true }],
          validityFrom: [{ value: data.validityFrom ? data.validityFrom : null, disabled: true }],
          validityTo: [{ value: data.validityTo ? data.validityTo : null, disabled: true }],
        })
        break;

      default:
        break;
    }
    return formGroupData;
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
      this.vendorTypeFirm = res.VENDOR_TYPE_FIRM;
      this.vendorTypeFirmUpdate = res.VENDOR_TYPE_FIRM;
    });
  }

  vendorRegistrationControl() {
    	/* Step 1 controls start */
    this.firmDetails = this.fb.group({
      applyingFor: [null, [Validators.required]],
      typeOfFirm: [null, Validators.required],
      nameOfTheFirm: [null, [Validators.required, Validators.maxLength(150)]],
      commencementDate: [null, [Validators.required]],
      yearOfEstablishment: [null],
      panNo: [null, [Validators.required, ValidationService.panValidator]],
      tanNo: [null, [ValidationService.tanValidator]],
      gstNo: [null, [ValidationService.gstNoValidator]],
      gstRegiDate: [null],

      officeContactNumber: [null, [Validators.required,ValidationService.telPhoneNumberValidator]],
      officeFaxNumber: [null, [ValidationService.faxValidation]],
      officeEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      branchMobileNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      branchAlterMobileNumber: [null, [Validators.maxLength(10), Validators.minLength(10)]],
      branchISDNumber: [null, [Validators.maxLength(12)]],
      branchSTDNumber: [null, [Validators.maxLength(11)]],

      headMobileNumber: [null, [Validators.required, ValidationService.mobileNumberValidation]],
      headAlterMobileNumber: [null, [ValidationService.telPhoneNumberValidator]],
      headISDNumber: [null, [Validators.maxLength(12)]],
      headSTDNumber: [null, [Validators.maxLength(11)]],
      headName: [null, [Validators.required, Validators.maxLength(150)]],
      headDesignation: [null],
      headEmail: [null, [Validators.required, ValidationService.emailValidator]],

      resContactNumber: [null, [Validators.required,ValidationService.telPhoneNumberValidator]],
      resFaxNumber: [null, [ValidationService.faxValidation]],
      resEmailId: [null, [Validators.required, ValidationService.emailValidator]],

      factoryAddressDetails: [null],
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),
      branchAddress: this.fb.group(this.resAddrComponent.addressControls()),
      contactAddress: this.fb.group(this.resAddrComponent.addressControls()),
      namesOfTheOwner: null,

      locationOfFactoryWorks: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      buildingName: [null, [ValidationService.buildingNameValidator, Validators.maxLength(60)]],
      streetName: [null, Validators.maxLength(60)],
      landmark: [null, Validators.maxLength(100)],
      area: [null, Validators.maxLength(60)],
      state: [null, [Validators.maxLength(60)]],
      district: [null, [Validators.maxLength(60)]],
      city: [null, [Validators.maxLength(60)]],
      country: [null, [Validators.maxLength(60)]],
      pincode: [null, [Validators.maxLength(6)]],
    })
	/* Step 1 controls end */

  	/* Step 2 controls start */
    this.registrationDetail = this.fb.group({
      incomeTaxDetails: [null, [Validators.required]],
      isManufacturingOwnedDetails: [null],
      manufacturingOwnedDetails: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      totalInvestmentDetail: [null],
      totalTurnoverLastThreeYears: null,
      lastThreeYearsCopies: [null],
      vendorNameDetails: this.vendorNameArray,
      listOfItemMaterial: this.listOfItemMaterialSupplier,
      registrationBank: [{ value: null, disabled: true }],
      registrationAmount: [{ value: null, disabled: true }],
      registrationDDNumber: null,
      registrationDDIssuingDate: [{ value: null, disabled: true }],
    })
/* Step 2 controls end */

/* Step 3 controls start */
    this.factoryAndEmployeeDetail = this.fb.group({
      copyOfITCClearanceCertificate: [null],
      loanCapitalWithBankLimit: null,
      productManufacturedDescription: null,
      areaOfLandFactory: null,
      builtAreaFactory: null,
      detailsOfLandDocumentsFactory: null,
      buildingPermissionDetail: null,
      noOfWorkingShifts: null,
      factoryLicenceNumber: [null],
      sscNSICCertificateNumber: null,
      factoryLicenseStartDate: [null],
      factoryLicenseEndDate: [null],
      certificateMSMENSISSIStartDate: [null],
      certificateMSMENSISSIEndDate: [null],
      licencesISIBISCE: null,
      valueOfPlantAndMachinery: null,
      registrationOfficeACT: [null],
      productManufacturedISI: [null],
      registeredByGovt: [null],
      detailsEquipmentCapacity: null,
      detailsMachineryCapacity: null,
      numberOfItemsHoldingISOCertificate: null,
      registeredGovtDetail: this.vendorRegisteredGovtDetail,
      installedMachineCapacities: this.vendorMachinesCapacities,
      qualificationDetails: this.academicQualificationAndExperience,
      personnelDetailSkilled: null,
      personnelDetailUnSkilled: null,
      personnelDetailOther: null,
    })
    /* Step 3 controls end */

    /* Step 4 controls start */
    this.productAndSupplierDetail = this.fb.group({
      testingRecordMaintainedDetail: [null],
      testStandardGovtLabApproved: null,
      methodEmployeeIdentify: null,
      adoptedForQualityControl: null,
      personInChargeProductionControl: [null],
      sourceOfRawMaterialAddress: null,
      productionCapacityPerAnnum: null,
      maximumProductionPerAnnum: null,
      vendorNameAuthorizedDetails: this.vendorNameAuthorized,
      vendorNameLastYearDetails: this.vendorNameLastYear,
      supplierOrderDetails: this.vendorDetailsOfOrderIndicationQuantity,
      firmUnderDealBlacklisted: [null],
      estimationOfStocks: null,
      resultSampleTesting: [null],
      vendorNameHoldingDetails: this.vendorNameholding,
      remarks: [null],

    })
    /* Step 4 controls end */

    this.vendorRegistrationForm = this.fb.group({
      apiType: "vendor",
      serviceCode: null,
      serviceFormId: this.formId,
      applicationNumber: null,
      canEdit: [true],
      attachments: [],
      acceptAndCondition: [null],
      createdByCitizen: [true],
    });
    /** Method is used to copy local contoller to Main contoller **/
    this.commonService.createCloneAbstractControl(this.firmDetails,this.vendorRegistrationForm);
		this.commonService.createCloneAbstractControl(this.registrationDetail,this.vendorRegistrationForm);
		this.commonService.createCloneAbstractControl(this.factoryAndEmployeeDetail,this.vendorRegistrationForm);	
		this.commonService.createCloneAbstractControl(this.productAndSupplierDetail,this.vendorRegistrationForm);
  }



  getAllDocumentLists() {
    this.engineer.getAllDocuments().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);

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
    });
  }

  handleErrorsOnSubmit(key) {
    const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;
    this.tabIndex = index;
    if(this.tabIndex == 0){
      this.onTabChange(1,this.firmDetails, this.vendorRegistrationForm)
    }
    else if(this.tabIndex == 1){
      this.onTabChange(2,this.registrationDetail, this.vendorRegistrationForm)
    }
    return false;


  }

  onDateChange(fieldName, date) {
    this.firmDetails.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }

  onDatesChange(fieldName, date) {
    this.factoryAndEmployeeDetail.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }
  onDateChangePurchaseDate(control, date, obj) {
    obj.get(control).setValue(moment(date).format("YYYY-MM-DD"));
  }

  onDateChangeOrder(fieldName, date, obj) {
    obj.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
    this.orderMinDate = date;
    this.fiveYearDate = moment(date).add("5", "years").format("YYYY-MM-DD");
  }

  getAllLocationDetail() {
    this.engineer.getAllLocationDetail().subscribe(res => {
      this.locations = _.cloneDeep(res);
    });
  }

  locationChange(event) {
    if(event == null || event.value == null){
      return false
    }
    else{
    this.engineer.getFeeFromLocation(event.value).subscribe(res => {
      this.registrationDetail.get('registrationAmount').setValue(res.fee);     
    })
    this.firmDetails.get('locationOfFactoryWorks').get('code').setValue(event.value);
    if (event.value == "IN_GUJARAT") {
      this.resetAddressValue()
      this.firmDetails.get('state').setValue('GUJARAT')
      this.firmDetails.get('city').setValue('Vadodara')
      this.firmDetails.get('country').setValue('INDIA')
      this.firmDetails.get('state').disable()
      this.firmDetails.get('city').enable()
      this.firmDetails.get('country').disable()
      this.state = 'Gujarat'
      this.city = '';
      this.country = 'India'

    }
    else if (event.value == "OUTSIDE_GUJARAT") {
      this.resetAddressValue()
      this.firmDetails.get('country').setValue('INDIA')
      this.firmDetails.get('state').enable()
      this.firmDetails.get('city').enable()
      this.firmDetails.get('country').disable()
      this.state = ''
      this.city = ''
      this.country = 'India'
    }
    else {
      this.resetAddressValue()
      this.firmDetails.get('state').enable()
      this.firmDetails.get('city').enable()
      this.firmDetails.get('country').enable()
      this.state = ''
      this.city = ''
      this.country = ''
    }
  }
  // call for deafult open tab 
  if(this.vendorRegistrationForm.get('canEdit').value == true){
    this.vendorNameArray.removeAt(0);
    this.listOfItemMaterialSupplier.removeAt(0)
    this.vendorNameArray.push(this.createVendorNameArray())
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier())
  }
  }

  typeOfFirmChange(event) {
    this.vendorTypeFirm = [...this.vendorTypeFirmUpdate];
    this.registrationDetail.get('vendorNameDetails').reset();
    this.vendorTypeFirm = this.vendorTypeFirm.filter(o => o.code === event.value);

    if (event.value == 'PROPRIETORSHIP') {
      // this.vendorNameArray.push(this.createVendorNameArray());
      this.vendorArrayNameButtons = true;
    } else {
      this.vendorArrayNameButtons = false;
    }
  }

  addRow() {
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier());
  }

  createItemMaterialSupplier(): FormGroup {
    return this.fb.group({
      itemsMaterial: [null, [Validators.required]],
      rating: null,
      description: null,
      isNumber: [null, [Validators.required]],
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

  createDetailsOfMahineInstalledCapacities(): FormGroup {
    return this.fb.group({
      nameOfMachinery: null,
      workingProcessDetail: null,
      productionCapacityWorking: null
    });
  }

  createRegisteredGovtDetail(): FormGroup {
    return this.fb.group({
      nameOfAuthority: null,
      regNumber: null,
      registrationDate: null,
      validityFrom: null,
      validityTo: null
    });
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

  createVendorNameArray(): FormGroup {
    return this.fb.group({
      ownerType: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      ownerName: [null, [Validators.required]],
      ownerAddress: [null, [Validators.required]]
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

  addRowVendorMachineInstalledCapacity() {
    this.vendorMachinesCapacities.push(this.createDetailsOfMahineInstalledCapacities());
  }

  addRowVendorRegisteredGovtDetail() {
    this.vendorRegisteredGovtDetail.push(this.createRegisteredGovtDetail());
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

  onRemoveVendorMahcineCapacity(rowIndex: number) {
    this.vendorMachinesCapacities.removeAt(rowIndex);
  }

  onRemoveVendorRegisteredGovtDetail(rowIndex: number) {
    this.vendorRegisteredGovtDetail.removeAt(rowIndex);
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

  addRowVendorName() {
    this.vendorNameArray.push(this.createVendorNameArray());
  }

  onRemoveRowVendorName(rowIndex: number) {
    this.vendorNameArray.removeAt(rowIndex);
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
    //this.reportForm.get('professionalTaxType').setValidators(null);
    // })
    this.vendorRegistrationForm.get('serviceFormId').setValue(this.formId);
    this.vendorRegistrationForm.get('applyingFor').setValidators(null);
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
      "headName": "Arvind Dangi",
      "headDesignation": "gjkgjkhg",
      'headEmail': "hkhJ@gmail.com",
      "licencesISIBISCE": "7485967485"

    }

    this.vendorRegistrationForm.patchValue(obj);
  }

  getYearChange(event) {
    this.vendorRegistrationForm.get('yearOfEstablishment').setValue(event)
  }


  /**
   * Method use to initialise form controls for address form group
  */





  onChangebuildingName(event) {
    this.buildingName = event.target.value;
    this.onChangeaddress()
  }

  onChangestreetName(event) {
    this.streetName = event.target.value;
    this.onChangeaddress()
  }

  onChangelandmark(event) {
    this.landmark = event.target.value;
    this.onChangeaddress()
  }

  onChangearea(event) {
    this.area = event.target.value;
    this.onChangeaddress()
  }

  onChangepincode(event) {
    this.pinCode = event.target.value;
    this.onChangeaddress()
  }

  onChangeCity(event) {
    this.city = event.target.value;
    this.onChangeaddress()
  }

  onChangeCountry(event) {
    this.country = event.target.value;
    this.onChangeaddress()
  }

  onChangeState(event) {
    this.state = event.target.value;
    this.onChangeaddress()
  }

  onChangeaddress() {

    this.setAddressValue = this.buildingName + ' ' + this.streetName + ' ' + this.landmark + ' ' + ' ' + this.area + ' '
      + this.city + ' ' + this.state + ' ' + this.country + ' ' + this.pinCode
    //console.log('setAddressValue', this.setAddressValue);

    this.firmDetails.get('factoryAddressDetails').setValue(this.setAddressValue)
    this.firmDetails.get('factoryAddressDetails').disable()
    // console.log(this.vendorRegistrationForm.get('factoryAddressDetails').value);

  }

  resetAddressValue() {
    this.firmDetails.get('buildingName').setValue(null)
    this.firmDetails.get('streetName').setValue(null)
    this.firmDetails.get('landmark').setValue(null)
    this.firmDetails.get('area').setValue(null)
    this.firmDetails.get('pincode').setValue(null)
    this.firmDetails.get('state').setValue(null)
    this.firmDetails.get('city').setValue(null)
    this.firmDetails.get('country').setValue(null)
    this.setAddressValue = ''
    this.buildingName = ''
    this.streetName = ''
    this.city = ''
    this.country = ''
    this.pinCode = ''
    this.state = ''
    this.landmark = ''
    this.area = ''
  }

  onSameAddressChange(event){
    if(event.checked){  
      this.firmDetails.get('registeredAddress').get('buildingName').setValue(this.firmDetails.get('buildingName').value)
      this.firmDetails.get('registeredAddress').get('streetName').setValue(this.firmDetails.get('streetName').value)
      this.firmDetails.get('registeredAddress').get('city').setValue(this.firmDetails.get('city').value)
      this.firmDetails.get('registeredAddress').get('country').setValue(this.firmDetails.get('country').value)
      this.firmDetails.get('registeredAddress').get('pincode').setValue(this.firmDetails.get('pincode').value)
      this.firmDetails.get('registeredAddress').get('state').setValue(this.firmDetails.get('state').value)
      this.firmDetails.get('registeredAddress').get('landmark').setValue(this.firmDetails.get('landmark').value)
      this.firmDetails.get('registeredAddress').get('area').setValue(this.firmDetails.get('area').value)
    }
    else{
      this.firmDetails.get('registeredAddress').get('buildingName').setValue(null)
      this.firmDetails.get('registeredAddress').get('streetName').setValue(null)
      this.firmDetails.get('registeredAddress').get('city').setValue(null)
      this.firmDetails.get('registeredAddress').get('country').setValue(null)
      this.firmDetails.get('registeredAddress').get('pincode').setValue(null)
      this.firmDetails.get('registeredAddress').get('state').setValue(null)
      this.firmDetails.get('registeredAddress').get('landmark').setValue(null)
      this.firmDetails.get('registeredAddress').get('area').setValue(null)
    }
  }

  public onTabChange(index: number, controlName, mainControl) {
    if (controlName.invalid) {
        this.commonService.markFormGroupTouched(controlName);
    } else {
        const organizationalAry = Object.keys(controlName.value);
        organizationalAry.forEach((element:any) => {
               // push form Array data into main Controller
            if (controlName.get(element) instanceof FormArray) {
                const formGroupAry = this.engineer.createArray(controlName.get(element));
                mainControl.get(element).value.push()
                for(let i = 0; i < controlName.get(element).controls.length; i++) {
                    mainControl.get(element).value.push(formGroupAry.value[i]);
                    mainControl.get(element).controls.push(formGroupAry.controls[i]);
                }   
            }
            else {
                mainControl.get(element).setValue(controlName.get(element).value);
            }
        });
        this.tabIndex = index;
    }
  }
  
  onFormTabChange(evt) {
    this.tabIndex = evt;
  }
}
