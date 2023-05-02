import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { VehicleService } from '../../../../../core/services/citizen/data-services/vehicle.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ProfessionalTaxService } from '../../../../../core/services/citizen/data-services/professional-tax.service';
import { PftConfig } from '../../professional-tax/pftConfig';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.component.html',
  styleUrls: ['./new-registration.component.scss']
})
export class NewRegistrationComponent implements OnInit {

  @ViewChild('address') addrComponent: any;
  @ViewChild('template') modalTemplate: any;

  translateKey: string = 'newRegistrationScreen';
  actionBarKey: string = 'adminActionBar';

  // mat steps title
  stepLable1: string = "vehicle_details";
  stepLable2: string = "owner_details";
  stepLable3: string = "tax_details";
  stepLable4: string = "cheque_return_details";

  maxDate: Date = new Date();
  //minDate: any = moment().subtract(6, 'months').format('YYYY-MM-DD');
  minDate: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  );
  vehicleRegistrationForm: FormGroup;
  vehicleDetails : FormGroup;
  ownerDetails : FormGroup;
  taxDetails : FormGroup;
  attachmentDetails : FormGroup;
  paymentForm: FormGroup;
  // purchasingTypeArray: any = [{ code: 'OLD_RATE', name: 'Old Rate' }, { code: 'NEW_RATE', name: 'New Rate' }];
  purchasingTypeArray: any = [];
  vehicleTypeArray: any = [];
  billingPeriodArray: any = [];
  wardNoArray: any = [];
  // payModeArray: any = [];
  vehicleId: number;
  makePaymentObj: any = {};
  makePaymentBtn: boolean = false;
  tabIndex: number = 0;
  isEditBtnVisible: boolean = false;
  isSubmitBtnVisible: boolean = true;
  modalRef: BsModalRef;
  taxAmountArray: any = [];
  totalVehicleTaxAmt: number = 0;
  attachmentList: any = [];
  showButton: boolean = false;
  placeHolderMessage = 'Please enter valid Registration no. e.g. GJ-06-AB-1234';
  

  public config: PftConfig;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private vehicleServise: VehicleService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private profeService: ProfessionalTaxService    
  ) {
    this.formService.apiType = 'vehicle';
    this.vehicleServise.apiType = 'vehicle';
    this.config = new PftConfig();
  }

  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      if (param) {
        this.vehicleId = Number(param.get('id'));
        // this.apiCode = Number(param.get('apiCode'));
      }
    });

    this.vehicleRegistrationFormControls();
    this.getVehicleLookups();
    // this.getVehicleTypeData();
    // this.getBillingPeriodLookups();
    this.getWardLookups();

    /**
     * call the get method for edit vehicle information if vehicle id is present
     */

    if (this.vehicleId) {
      this.getVehicleData(this.vehicleId);
      this.getAllDocumentLists(this.vehicleId);
    }
  }

  /**
   * this method is used to initialize the form control for vehicle registration
   */
  vehicleRegistrationFormControls() {
    /* Step 1 controls start */
    this.vehicleDetails = this.fb.group({
      engineNo: [null, [Validators.required, ValidationService.alphaNumericValidation]],
      vehicleType: this.fb.group({
        code: [null, Validators.required],
        name: null
      }),
      chasisNo: [null, [Validators.required, ValidationService.alphaNumericValidation]],
      vehicleNo: [null],
      registrationNo: [null, ValidationService.alphaNumericValidation],
      vehicleBasicValue: null,
      makeModel: null,
      dealerName: [null, Validators.required],
      dealerEmail: ['', [ValidationService.emailValidator]],
      dealerMobileNo: [null, ValidationService.mobileNumberValidationVehicle],
      purchaseDate: [null, Validators.required],
    })
    /* Step 1 controls end */
    
      /* Step 2 controls start */
    this.ownerDetails = this.fb.group({
      firstName: [null, Validators.required],
      middleName: null,
      lastName: [null, Validators.required],
      aadhaarNo: null,
      mobileNo: [null, ValidationService.mobileNumberValidationVehicle],
      email: ['', [ValidationService.emailValidator]],
      wardZoneMst: this.fb.group({
        wardzoneId: null,
        wardzoneName: null
      }),
      address: this.fb.group(this.addrComponent.addressControls()),
    })
    /* Step 2 controls end */

    /* Step 3 controls start */
     this.taxDetails = this.fb.group({
      billingPeriod: this.fb.group({
        code: [null, Validators.required],
        name: null
      }),
      vehicleApplicableRate: [{ value: 0, disabled: true }],
      vehicleTax: [{ value: 0, disabled: true }],
      tokenFees: [{ value: 100, disabled: true }],
      tokenNo: null,
      totalPayable: [{ value: 0, disabled: true }],
     })
    /* Step 3 controls end */

  

    this.vehicleRegistrationForm = this.fb.group({
      id: null,
      uniqueId: null,
      version: null,
      code: null,
      fieldView: null,
      fieldList: null,
      // purchasingType: this.fb.group({
      // 	code: [null, Validators.required],
      // 	name: null
      // }),
      purchasingType: ["NEW_RATE", Validators.required],
      refNumber: null,
      applicantAadhaarNo: null,
      // city: "Vadodra",
      // billingPeriod: "2016-17",
      paid: false,
      vehicleReceipts: [],
      canEdit: true,
      canDelete: null,
      canSubmit: true,
      adminFees: [{ value: 0, disabled: true }],
      dishonorCharges: [{ value: 0, disabled: true }],
      serviceFormId: null,
      formStatus: null,
    /* Step 4 controls start */
     attachments: [],
    /* Step 4 controls end */
    });

    this.vehicleRegistrationForm.patchValue({
      address: {
        addressType: "VEHICLE_ADDRESS"
      }
    });

    this.paymentForm = this.fb.group({
      vehicleId: null,
      billId: null,
      bankName: null,
      accountNo: null,
      amountPaid: null,
      instrumentDate: null,
      instrumentNumber: null
    });

    this.commonService.createCloneAbstractControl(this.vehicleDetails , this.vehicleRegistrationForm)
    this.commonService.createCloneAbstractControl(this.ownerDetails , this.vehicleRegistrationForm)
    this.commonService.createCloneAbstractControl(this.taxDetails , this.vehicleRegistrationForm)
  }

  /**
   * This method is used to get all attachment list from API if page is refreshed
   * @param taxFormId - serviceFormId
   */
  getAllDocumentLists(taxFormId) {
    this.vehicleServise.getAllDocuments().subscribe(res => {
      if (res && res.length > 0) {
        _.forEach(res, (element) => {
          element['serviceFormId'] = taxFormId;
        });
        this.attachmentList = _.cloneDeep(res);
      }
    });
  }

  /**
   * This method is used to get all lookups from API
   */
  getVehicleLookups() {
    this.vehicleServise.getVehicleLookups().subscribe(res => {

      this.vehicleTypeArray = res.VEHICLE_CATEGORY;
      this.purchasingTypeArray = res.PURCHASING_TYPE;
      this.billingPeriodArray = res.BILLING_PERIOD;
      // this.wardNoArray = res.WARD_NO;
      _.forEach(this.vehicleTypeArray, (key) => {
        key.name = _.replace(key.name, /&/g, "and");
      });
      //   this.setBillingPeriod( this.billingPeriodArray);
      this.taxDetails.get('billingPeriod').disable();
    });

  }

  // this method will set billing period in column
  // setBillingPeriod(billingPeriodArray:any){
  //     this.vehicleRegistrationForm.get('billingPeriod').patchValue(billingPeriodArray[billingPeriodArray.length - 1]);
  //     this.vehicleRegistrationForm.get('billingPeriod').disable();
  // }

  /**
   * This method is used to get vehicle information
   * @param id - vehicle id
   */
  getVehicleData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
   //   this.formService.getFormData(id).subscribe(res => {

        this.vehicleRegistrationForm.patchValue(res);
        this.vehicleDetails.patchValue(res);
        this.ownerDetails.patchValue(res);
        this.taxDetails.patchValue(res)
        this.showButton = true;

        if (!this.vehicleRegistrationForm.get('canEdit').value || this.vehicleRegistrationForm.get('formStatus').value == 'SUBMITTED') {
          this.vehicleRegistrationForm.disable();
          this.vehicleDetails.disable();
          this.ownerDetails.disable();
          this.taxDetails.disable()
        }


        // if vehicle receipt present then format the receipt date
        if (res.vehicleReceipts && res.vehicleReceipts.length > 0) {
          _.forEach(res.vehicleReceipts, (value, key) => {
            value.receiptDate = moment(value.receiptDate).format("DD/MM/YYYY")
          });
        }
        if (this.vehicleRegistrationForm.get('formStatus').value == "DRAFT") {
          this.vehicleRegistrationForm.get('attachments').setValue([]);
        }

      });
  //  });
  }

  getFinancialYear() {
    var fiscalyear = "";
    var today = this.vehicleDetails.get('purchaseDate').value;
    console.log(today);
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = "" + (today.getFullYear() - 1)
    } else {
      fiscalyear = "" + (today.getFullYear())
    }
    console.log(fiscalyear);
    return fiscalyear
  }
  /**
   * 
   * @param date get the selected vehicle purchasing date
   */
  onDateChange(date) {
    this.vehicleDetails.get('purchaseDate').value.toISOString().split('T')[0];
    // this.vehicleRegistrationForm.get('purchaseDate').setValue(moment(date).format("YYYY-MM-DD"));
    var billingPeriod = this.getFinancialYear();
    this.vehicleDetails.get('purchaseDate').setValue(moment(date).format("YYYY-MM-DD"));
    console.log(billingPeriod);
    this.billingPeriodArray.forEach(element => {

      if (billingPeriod == element.code.substr(0, 4)) {
        console.log(element);
        console.log(element.code);
        this.taxDetails.get('billingPeriod').patchValue(element);
      }
    });

  }

  /**
   * This method is use for get Vehicle Type dropdown data from API
   */
  getVehicleTypeData() {
    this.vehicleServise.getVehicletaxLookups().subscribe(res => {
      // _.forEach(res.VEHICLE_TYPE, (key) => {
      // 	key.name = _.replace(key.name, /&/g, "and");
      // });
      this.vehicleTypeArray = res.data;
      let purchaseTypeObj = _.filter(this.purchasingTypeArray, { 'code': 'NEW_RATE' })[0];
      this.vehicleRegistrationForm.get('purchasingType').setValue(purchaseTypeObj.code);
    });
  }

  /**
   * This method is used to get billing period dropdown data from API
   */
  getBillingPeriodLookups() {
    this.vehicleServise.getBillingPeriodLookups().subscribe(res => {
      this.billingPeriodArray = res.data;
    });

  }

  /**
   * This method is used to get ward dropdown data from API
   */
  getWardLookups() {
    this.vehicleServise.getWardLookup().subscribe(res => {
      this.wardNoArray = res;
    });
  }

  /**
   * This method is used to get form data by using engine no if exist
   * @param engineNo - vehicle engine no.
   */
  checkDataFromEngineNo(engineNo) {
    if (engineNo != "" && engineNo.trim() != "") {
      this.vehicleServise.getDataFromEngineNo(engineNo).subscribe(res => {
        this.isEditBtnVisible = true;
        this.isSubmitBtnVisible = false;
        this.vehicleRegistrationForm.patchValue(res);
        this.vehicleRegistrationForm.disable();
      });
    }
  }

  /**
   * This method is used to submit the Vehicle registration data
   */
  onSubmit() {
    if (!this.vehicleRegistrationForm.invalid) {
      let count = this.config.getAllErrors(this.vehicleRegistrationForm);
      this.commonService.openAlert("Warning", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning", "", cb => {

        switch (true) {
          case (count <= 16):
            this.markFormGroupTouched(this.vehicleDetails)
            this.tabIndex = 0;
            break;
          case (count <= 27):
            this.markFormGroupTouched(this.ownerDetails)
            this.tabIndex = 1;
            break;
          case (count <= 33):
            this.markFormGroupTouched(this.taxDetails)
            this.tabIndex = 2;
            break;
          default:
            this.markFormGroupTouched(this.vehicleDetails)
            this.tabIndex = 0;
        }
      });
      return;
    }
    this.mandatoryFileCheck().then(data => {
      if (data.status) {
        this.vehicleRegistrationForm.get('formStatus').setValue('SUBMITTED');
        this.vehicleServise.saveFormData(this.vehicleRegistrationForm.getRawValue()).subscribe(res => {
          this.toastr.success('Vehicle Registration Successful');
          this.router.navigate(['/citizen/my-applications']);
          // this.showVehicleTaxDetails(this.modalTemplate);
          // this.getVehicleTaxForPayment(res.id);
          // this.onVehicleTaxSubmit();
        });
      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }
    });
  }

  /**
 * Method is responsible to check required file upload.
 */
  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.formService.getFormData(this.vehicleId).subscribe(respData => {
        if (respData.attachments) {
          let tempArray = [];
          respData.attachments.forEach(element => {
            tempArray.push(element.fieldIdentifier);
          });
          this.attachmentList.forEach(el => {
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

  /**
   * This method is used to submit vehicle tax form
   */
  onVehicleTaxSubmit() {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      this.commonService.openAlert("Warning", "Enter all the required information", "warning");
      return;
    }
    this.isSubmitBtnVisible = false;

    // this.paymentForm.get('bankName').setValue(this.paymentForm.get('bank').get('code').value);
    // this.paymentForm.get('accountNo').setValue(this.paymentForm.get('bankAccountNo').value);
    // this.paymentForm.get('amountPaid').setValue(this.totalVehicleTaxAmt);
    // this.paymentForm.get('instrumentDate').setValue(this.paymentForm.get('chequeDate').value);
    // this.paymentForm.get('instrumentNumber').setValue(this.paymentForm.get('chequeNo').value);

    this.vehicleServise.saveVehicleTaxFormData(this.paymentForm.value).subscribe(res => {
      this.printReceipt(res);
      this.modalRef.hide();
      this.toastr.success('Vehicle Registration Successful');
      this.isSubmitBtnVisible = true;
    }, err => {
      this.isSubmitBtnVisible = true;
    });
  }

  /**
   * This method is used to get the vehicle tax details
   * @param vehicleId - vehicle id
   */
  getVehicleTaxForPayment(vehicleId) {
    this.totalVehicleTaxAmt = 0;
    this.vehicleServise.getVehicleTaxForPayment(vehicleId).subscribe(res => {
      this.taxAmountArray = res.amountsFields;
      this.paymentForm.patchValue(res);

      for (let i = 0; i < this.taxAmountArray.length; i++) {
        this.totalVehicleTaxAmt = this.totalVehicleTaxAmt + this.taxAmountArray[i].amount;
      }
    });
  }

  /**
   * This method is used to edit the vehicle tax form
   * Edit button Click handler
   */
  editVehicleTaxForm() {
    this.vehicleRegistrationForm.enable();
    this.isSubmitBtnVisible = true;

    this.vehicleRegistrationForm.get('tokenFees').disable();
    this.vehicleRegistrationForm.get('adminFees').disable();
    this.vehicleRegistrationForm.get('dishonorCharges').disable();
    this.vehicleRegistrationForm.get('vehicleApplicableRate').disable();
    this.vehicleRegistrationForm.get('totalPayable').disable();

    if (this.vehicleRegistrationForm.controls['vehicleReceipts'].value[0].paymentStatus == "PENDING") {
      this.vehicleRegistrationForm.get('paymentMode').enable();
    } else {
      this.vehicleRegistrationForm.get('paymentMode').disable();
    }
  }

  /**
   * This method is used to open payment dialog and process for the payment
   */
  processPayment(saveRes) {

    // this.formService.paymentDetails(this.makePaymentObj.id).subscribe(res => {

    // let obj = {
    // 	'refNumber': res.refNumber,
    // 	'amount': res.amount,
    // 	'payableServices': { 'code': res.serviceType },
    // 	'paymentMode': res.paymentModes[0]
    // };



    // let paymentData = {
    //   "refNumber": res.refNumber,
    //   "amount": res.amount,
    //   "serviceType": res.serviceType,
    //   "bankName": saveRes.bankName ? saveRes.bankName : null,
    //   "branchName": saveRes.branchName ? saveRes.branchName : null,
    //   "chequeDate": saveRes.checkDdDate ? saveRes.checkDdDate : null,
    //   "paymentMode": res.paymentModes[0].code,
    //   "transactionId": saveRes.transNo ? saveRes.transNo : null
    // }


    // let paymentData = {
    // 	"refNumber": saveRes.refNumber,
    // 	"amount": res.amount,
    // 	"serviceType": { 'code': res.serviceType },
    // 	'payableServices': { 'code': res.serviceType },
    // 	"bankName": saveRes.bankName,
    // 	"branchName": saveRes.branchName,
    // 	"chequeDate": saveRes.checkDdDate,
    // 	"paymentMode": res.paymentModes[0],
    // 	"transactionId": saveRes.transNo
    // };

    // this.vehicleServise.paymentServicePost(paymentData).subscribe((respData) => {
    // this.printReceipt(saveRes.id);
    // this.printReceipt(respData.refNumber);
    // this.router.navigate(['/admin/vehicle']);
    // });

    // this.commonModel.openPaymentDialog(obj, cb => {
    // 	this.router.navigate(['/admin/vehicle']);
    // });
    // });
  }


  /**
   * This method is used for printing the receipt 
   * @param id - vehicle id
   */
  printReceipt(id: number) {
    this.vehicleServise.printReceipt(id).subscribe(res => {
      let sectionToPrint: any = document.getElementById('sectionToPrint');
      sectionToPrint.innerHTML = res;
      setTimeout(() => {
        window.print();
        this.router.navigate(['/citizen/my-applications']);
      }, 300);
    },
      err => {
        this.toastr.error(err.error[0].message);
      });
  }

  /**
   * call calculateTax() method if step changes from 2 to 3
   * @param event - get the previous step index
   */
  calculateTax(event: any) {
    if (event.index === 1 && (this.vehicleDetails.get('purchaseDate').value == null || this.vehicleDetails.get('vehicleBasicValue').value == null || this.vehicleDetails.get('vehicleType').get('code').value == null)) {
      this.commonService.openAlert("Warning", "Enter Vehicle Type, Basic Value and Purchase Date", "warning");
      return;
    }
    else if (event.index === 1 && this.vehicleRegistrationForm.get('canEdit').value) {
      this.vehicleServise.calculateTax(this.vehicleDetails.getRawValue()).subscribe(res => {
        this.vehicleRegistrationForm.patchValue({
          adminFees: res.amountFields.adminFee,
       //   tokenFess: res.amountFields.vehicleTokenFee,
          dishonorCharges: res.amountFields.dishonorCharges ? res.amountFields.dishonorCharges : 0,
        });
        this.taxDetails.patchValue({
          vehicleApplicableRate: res.amountFields.vehicleBasicValue,
          tokenFess : res.amountFields.vehicleTokenFee,
          // totalPayable: res.amountFields.vehicleBasicValue,
          vehicleTax: res.vehicleApplicableRate
        })

        let totalPayable = res.amountFields.adminFee + res.amountFields.interest +
          res.amountFields.penalty + res.amountFields.vehicleBasicValue + res.amountFields.vehicleTokenFee;

        this.taxDetails.get('totalPayable').setValue(totalPayable);
      });
    }
  }

  /**
   * This method is used to open popup for vehicle tax & payment details
   * @param template - popup html
   */
  showVehicleTaxDetails(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  /**
   * This method is use for resetting the form
   */
  resetForm() {
    this.vehicleRegistrationForm.reset();
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The group to caress
  */
  markFormGroupTouched(formGroup: FormGroup) {
    if (Reflect.getOwnPropertyDescriptor(formGroup, 'controls')) {
      (<any>Object).values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // FormGroup
          this.markFormGroupTouched(control);
        }
        // FormControl
        control.markAsTouched();
      });
    }
  }

   /**
     * This method use to get output event of tab change
     * @param index - current index
     * @param controlName - local Form Group
     * @param mainControl - gobal form Group
     */
     onTabChange(index: number, controlName, mainControl, isSubmitted) {
    if (controlName.invalid) {
        this.markFormGroupTouched(controlName)
    } else {
        const organizationalAry = Object.keys(controlName.getRawValue());
        organizationalAry.forEach((element:any) => {
          mainControl.get(element).setValue(controlName.get(element).value);
        });
        this.tabIndex = index;
        if(isSubmitted){
          this.onSubmit()
        }
    }

}

  patchValue() {
    this.vehicleRegistrationForm.patchValue(this.dummyJSON);
  }

  dummyJSON: any = {
    "code": null,
    "fieldView": null,
    "fieldList": null,
    "vehicleNo": "234324",
    "vehicleType": {
      "code": "TWO_WHEELERS",
      "name": null
    },
    "engineNo": new Date().getTime(),
    "chasisNo": new Date().getTime(),
    "registrationNo": "GJ-06-1234",
    "vehicleBasicValue": "423543",
    "makeModel": "sdfsdf",
    "dealerName": "sdfsdfsdf",
    "purchaseDate": "2021-06-01",
    "purchasingType": "NEW_RATE",
    "tokenNo": null,
    "firstName": "Ram Bhai",
    "middleName": null,
    "lastName": "Patel",
    "applicantAadhaarNo": null,
    "mobileNo": "8962749074",
    "aadhaarNo": "111111111111",
    "email": "chetan.porwal@nascentinfo.com",
    "address": {
      "addressType": "VEHICLE_ADDRESS",
      "buildingName": "44",
      "streetName": "",
      "landmark": "",
      "area": "Akota",
      "state": "GUJARAT",
      "district": null,
      "city": "Vadodara",
      "country": "INDIA",
      "pincode": "423423",
      "buildingNameGuj": "સ્દ્ફ્સ્દ્ફ",
      "streetNameGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
      "landmarkGuj": "સ્દ્ફ્સ્દ્ફ",
      "areaGuj": "સ્દ્ફ્સ્દ્ફ",
      "stateGuj": "ગુજરાત",
      "districtGuj": null,
      "cityGuj": "વડોદરા",
      "countryGuj": "ભારત"
    },
    "billingPeriod": {
      "code": "2021_22",
      "name": null
    },
    "ward": {
      "code": "WARD_2",
      "name": null
    },
    "canEdit": true,
    "canDelete": false,
    "tokenFees": 100,
    "dishonorCharges": 0,
    "vehicleApplicableRate": 1.25,
    "totalPayable": 5294.2875,
  };

}
