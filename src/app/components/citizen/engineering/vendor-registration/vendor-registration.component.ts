import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { EngineeringService } from '../engineering.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
  academicQualificationAndExperience: FormArray;
  vendorNameArray: FormArray;
  vendorRegistrationForm: FormGroup;
  implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
  locations: Array<any> = [{ name: 'With in Gujarat', code: 'WITH_IN_GUJARAT' },
  { name: 'Outside Of Gujarat', code: 'OUTSIDE_GUJARAT' },
  { name: 'Outside Of India', code: 'OUTSIDE_INDIA' }];

  tabIndex: number = 0;
  isFromOnlineApp: boolean = false;
  maxDate: Date = new Date();
  minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];

  formId: number;
  showButtons: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private engineer: EngineeringService
  ) {
    this.engineer.apiType = "vendor";
    this.listOfItemMaterialSupplier = this.fb.array([]);
    this.academicQualificationAndExperience = this.fb.array([]);
    this.vendorNameArray = this.fb.array([]);
  }

  ngOnInit() {
    this.vendorRegistrationControl();
    this.vendorRegistrationForm.addControl('listOfItemMaterialSupplier', this.listOfItemMaterialSupplier);
    this.vendorRegistrationForm.addControl('academicQualificationAndExperience', this.academicQualificationAndExperience);
    this.vendorRegistrationForm.addControl('vendorNameArray', this.vendorNameArray);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
    })

    this.getBankNames();
    this.getAllDocumentLists();

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

  vendorRegistrationControl() {

    this.vendorRegistrationForm = this.fb.group({

      apiType: null,
      serviceCode: null,
      serviceFormId: null,

      id: null,
      nameOfTheFirm: null,
      commencementDate: null,
      yearOfEstablishment: null,
      panTanNo: [null, Validators.required, ValidationService.panValidator],
      contactNumber: [null, Validators.required, ValidationService.mobileNumberValidation],
      faxNumber: [null, Validators.required, ValidationService.mobileNumberValidation],
      emailId: [null, Validators.required, ValidationService.emailValidator],

      factoryAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      registeredAddress: this.fb.group(this.resAddrComponent.addressControls()),

      namesOfTheOwner: null,
      manufacturingOwnedDetails: null,

      listOfItemMaterialDetail: this.fb.array([]),
      academicQualificationAndExperienceDetail: this.fb.array([]),
      vendorNameDetail: this.fb.array([]),

      registrationBank: this.fb.group({
        code: [null],
        name: [null]
      }),
      registrationDDNumber: [null],
      registrationAmount: [null, [Validators.maxLength(7)]],
      registrationDDIssuingDate: [null],

      locationOfFactoryWorks: this.fb.group({
        code: [null],
        name: [null]
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

      totalTurnoverLastThreeYears: [null],
      loanCapitalWithBankLimit: [null],
      productManufacturedDescription: [null],
      areaOfLandFactory: [null],
      builtAreaFactory: [null],
      noOfWorkingShifts: [null],
      factoryLicenceNumber: [null],
      sscNSICCertificateNumber: [null],
      valueOfPlantAndMachinery: [null],
      detailsEquipmentCapacity: [null],
      detailsMachineryCapacity: [null],
      testStandardGovtLabApproved: [null],
      adoptedForQualityControl: [null],
      methodEmployeeIdentify: [null],
      sourceOfRawMaterialAddress: [null],
      productionCapacityPerAnnum: [null],
      maximumProductionPerAnnum: [null],

      purchaserName: [null],
      orderNo: [null],
      orderDate: [null],
      quantitySuppliedCompletionDate: [null],

      estimationOfStocks: [null],
      numberOfItemsHoldingISOCertificate: [null],
      remarks: [null],

      personnelDetailSkilled: [null],
      personnelDetailUnSkilled: [null],
      personnelDetailOther: [null],

      officeResidentialAddressSame: null

    });
    this.academicQualificationAndExperience.push(this.createEducationQualification());
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }

  getAllDocumentLists() {
    this.engineer.getAllDocuments().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);
    });
  }

  addRow() {
    this.listOfItemMaterialSupplier.push(this.createItemMaterialSupplier());
  }

  createItemMaterialSupplier(): FormGroup {
    return this.fb.group({
      itemsMaterial: null,
      ratingDescription: null,
      ISNumber: null,
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
    this.vendorNameArray.push(this.createItemMaterialSupplier());
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


  onSubmit() {

    this.engineer.vendorSaveFormData(this.vendorRegistrationForm.getRawValue()).subscribe(res => {
      this.commonService.openAlert(" Successful", "", "success", `</b>`);
    })
  }
}

