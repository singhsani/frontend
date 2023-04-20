import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { ComponentConfig } from 'src/app/components/component-config';
import { AppSwimmingPoolService } from '../swimming-pool.service';
import { count } from 'rxjs-compat/operator/count';


@Component({
  selector: 'app-swimming-pool',
  templateUrl: './swimming-pool.component.html',
  styleUrls: ['./swimming-pool.component.scss']
})
export class SwimmingPoolComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  @ViewChild('address') addressComp: any;

  public config = new ComponentConfig;

  /**
	 * form groups.
	 */
  swimmimgPoolBookingForm: FormGroup;
  generalDetails: FormGroup;
  applicantDetail:FormGroup;

  translateKey: string = 'swimmingPoolScreen';
  showDowlLoadFileTab: boolean = false;
  showSwimmingPoolForm: boolean = true;

  isVisibleIdNumber = false;
  isPanCardVisibleIdNumber = false;
  isLicenseVisibleIdNumber = false;
  isElectionCardIdNumber = false;
  isPassportIdNumber = false;

  formId: number;
  apiCode: string;
  public tabIndex: number = 0;
  istodaydate= new Date();
  disableDate = new Date(moment().subtract(1, 'm').format('YYYY-MM-DD'));
  disableBirthDate = new Date(moment().subtract(1, 'y').format('YYYY-MM-DD'));
  minBirthDate = new Date(1900, 0, 1);
  maxBirthdate = new Date();
  isFileUploaded1: boolean = false;
  isFileUploaded2: boolean = false;
  isFileUploaded3: boolean = false;
  isFileUploaded4: boolean = false;
  applicantageyear: number = null;
  isFileUploaded5: boolean = false;
  isFileUploaded6: boolean = false;
  isFileUploaded7: boolean = false;
  isSwimmingTestReportShow: boolean = false;
  isApplicateAgeGreaterThanEighteen: boolean = false;

  countryListArray: any = [];
  stateListArray: any = [];
  cityListArray: any = [];
  isBuildinAreaReq: boolean = false;
  attachments = [];
  /**
  * Loading Booking Configuration
  */
  bookingUtils: BookingUtils;
  bookingConstants = BookingConstants;

  // required attachment array
  public uploadFilesArray: Array<any> = [];

  //lookup
  SWIMMING_POOL_NAME: Array<any> = [];
  BATCH_FOR: Array<any> = [];
  BATCH_NAME: Array<any> = [];
  CATEGORY: Array<any> = [];
  MEMBERSHIP_TYPE: Array<any> = [];
  BATCH_DURATION: Array<any> = [];
  BLOOD_GROUP: Array<any> = [];
  APPLICANT_PROOF: Array<any> = [];
  idlist : Array<any> = [];
  // BANK: Array<any> = [];
  session: any;
  durationisReadOnly: boolean = false;
  swimmingPoolRenewal: boolean = false;
  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param uploadFileService - Declare upload file service property.
   * @param commonService - Declare sweet alert.
   * @param toastrService - Show massage with timer.
   */

  searchObj = {
    isDisplayRenewLicenceForm: <boolean>false,
    searchLicenceNumber: null
  }
  memberNumber: FormControl;
  isRenewalForm = false;
  isVisibleElectricityBill = false;
  showMsg = false;

  constructor(
    private fb: FormBuilder,
    public validationError: ValidationService,
    private bookingService: BookingService,
    private formService: FormsActionsService,
    private commonService: CommonService,
    private toastr: ToastrService,
    public translateService: TranslateService,
    private router: Router,
    private swimmingPoolService: AppSwimmingPoolService,
    private route: ActivatedRoute
  ) {
    this.bookingUtils = new BookingUtils(formService, toastr);
    this.bookingService.resourceType = 'swimming';
    this.memberNumber = new FormControl('', ValidationService.swimmingPoolMemberValidator);
  }

  /**
 * Min month should be current month.
 */
  startMinMonth: Date = new Date(this.disableDate.getFullYear(), this.disableDate.getMonth(), 1);
  // moment(new Date(this.disableDate.getFullYear(), this.disableDate.getMonth(), )).subtract(1, 'month').toDate();
  maxEndMonth: any;


  /**
   * This method call initially required methods.
   */
  ngOnInit() {
    this.swimmingPoolFormControls();
    this.getLookupData();
    this.getResourceList();
    // this.getCountryLists();
    this.getUserProfile();
    this.defaultAsperPool();

    console.log(this.router.url);
    if (this.router.url.indexOf('swimmingPoolRenewal') > -1) {
      this.searchObj.isDisplayRenewLicenceForm = true;
      // this.swimmingPoolRenewal = true;
    }

    if(this.istodaydate.getDay() <= 20 ){
      this.chosenMonthHandler(this.startMinMonth.setMonth(this.startMinMonth.getMonth()));
    }else{
    this.chosenMonthHandler(this.startMinMonth.setMonth(this.startMinMonth.getMonth() + 1));
    }

    this.setFormControlToTabIndexMap();
  }
  /**
  * Method is used to get lookup data
  */
  getLookupData() {
    this.bookingService.getDataFromLookups().subscribe(resp => {
      this.SWIMMING_POOL_NAME = resp.SWIMMING_POOL_NAME;
      this.CATEGORY = resp.CATEGORY;
      this.MEMBERSHIP_TYPE = resp.MEMBERSHIP_TYPE;
      this.BATCH_DURATION = resp.BATCH_DURATION;
      this.BLOOD_GROUP = resp.BLOOD_GROUP;
     // this.APPLICANT_PROOF = resp.APPLICANT_PROOF;
      resp.APPLICANT_PROOF.forEach(element => {
        if(element.code == "DRIVING_LICENSE" || element.code == "AADHAAR_CARD" ||  element.code == "PASSPORT" || element.code == "ELECTION_CARD" || element.code == "ELECTRICITY_BILL"){
           this.idlist.push(element) 
           this.APPLICANT_PROOF = this.idlist.sort((a, b) => {
            if(a.code > b.code) {
              return 1;
            } else if(a.code < b.code) {
              return -1;
            } else {
              return 0;
            }
          });
        }
      });
      // this.BANK = resp.BANK;
    },
      err => {
        this.toastr.error("Server Error");
      })
  }

  /**
   * Filter details as per pool name selection
   */
  filterAsperPool(event: any) {
    this.bookingService.filterPoolCode(event).subscribe(rep => {
      this.BATCH_FOR = rep;
    },
      err => {
        this.toastr.error("Server Error");
      })
  }

  /**
  * Filter details as per category selection
  */
  filterAsperCategory(event: any) {
    let poolName = this.generalDetails.get('swimmingPoolName').get('code').value;
    if (event) {
      this.bookingService.filterBatchDuration(event, poolName).subscribe(rep => {
        this.BATCH_DURATION = rep;
      },
        err => {
          this.toastr.error("Server Error");
        })
    }
    else {
      this.toastr.error("Server Error");
    }

    if (event == 'SWIMMER') {
      this.isSwimmingTestReportShow = true;
    }
    else {
      this.isSwimmingTestReportShow = false;
    }
  }
  defaultAsperPool() {
    this.bookingService.filterPoolCode(this.generalDetails.get('swimmingPoolName').get('code').value).subscribe(rep => {
      this.BATCH_FOR = rep;
    },
      err => {
        this.toastr.error("Server Error");
      })
  }

  /**
   * Filter details as per pool name selection
   */
  filterAsperBatchName(event: any) {
    let obj = {
       batchCode : event,
       poolName : this.generalDetails.get('swimmingPoolName').get('code').value,
       category: this.generalDetails.get('category').get('code').value,
       birthDate : this.generalDetails.get('birthDate').value
    }
    this.BATCH_NAME = []
    this.bookingService.filterBatchCode(obj).subscribe(rep => {
      this.BATCH_NAME = rep;
    },
      err => {
        this.commonService.openAlert("Warning", err.error[0].message, "warning" , "", cb => {
        this.generalDetails.get('swimmingPoolName').get('code').reset();
        this.generalDetails.get('membershipType').get('code').reset();
        this.generalDetails.get('category').get('code').reset();
        this.generalDetails.get('batchDuration').get('code').reset();
        this.generalDetails.get('birthDate').reset();
        this.generalDetails.get('batchFor').get('code').reset();
        this.generalDetails.get('batchName').get('code').reset();
        this.applicantDetail.get('applicantBirthDate').reset();
        this.applicantDetail.get('applicantAge').reset()
        }) ;
      })
  }

  filterBatch(event : any){
    let obj = {
      poolName : this.swimmimgPoolBookingForm.get('swimmingPoolName').get('code').value,
      category: this.swimmimgPoolBookingForm.get('category').get('code').value,
      batchfor : this.swimmimgPoolBookingForm.get('batchFor').get('code').value,
      batchTimming : event
   }
    this.bookingService.countBatch(obj).subscribe(rep => {
     // this.BATCH_NAME = rep.get('name').value;
    },
    err => {
      this.swimmimgPoolBookingForm.get('batchName').get('code').reset();
      this.commonService.openAlert('warning',err.error[0].message,'warning');
    });

    
  }

  

  /**
   * Method for hide duration field
   */
  changeBatchDuration(event) {
    if (event == 'LEARNER') {
      this.generalDetails.get('batchDuration').get('code').setValue('MONTHLY');
      this.durationisReadOnly = true;
    } else {
      this.durationisReadOnly = false;
    }

  }

  /**
   * This method for get resource list
   */
  getResourceList() {
    this.bookingService.getResourceList().subscribe(resp => {
      this.SWIMMING_POOL_NAME = resp.data;
    },
      err => {
        this.toastr.error("Server Error");
      })
  }

  /**
   * Get user data
   */
  getUserProfile() {
    this.bookingService.getUserProfile().subscribe(resp => {
      this.applicantDetail.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
      this.applicantDetail.get('applicantEmail').setValue(resp.data.email);
      this.applicantDetail.get('applicantMobileNumber').setValue(resp.data.cellNo);
    },
      err => {
        this.toastr.error("Server Error");
      });

     this.applicantDetail.get('applicantAddress').get('country').setValue('INDIA');
     this.applicantDetail.get('applicantAddress').get('state').setValue('GUJARAT');
     this.applicantDetail.get('applicantAddress').get('city').setValue('Vadodara');
    //  this.applicantDetail.get('applicantAddress').get('country').disable();
    //  this.applicantDetail.get('applicantAddress').get('state').disable();
    //  this.applicantDetail.get('applicantAddress').get('city').disable();
    //this.applicantDetail.get('applicantJoiningMonth').disable();


  }

  /**
   * This method for download file
   */
  downloadGuidLineDocumemnt(fileName: any) {
    this.bookingService.downloadGuidLineDocumemnt(fileName, 'application/pdf').subscribe(resp => {

      var newBlob = new Blob([resp], { type: "application/pdf" });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // For other browsers: 
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    },

      err => {
        this.toastr.error("Server Error");
      })

  }

  /**
  * Method is used to set form controls
  * 'Guj' control is consider as a Gujarati fields
  */
  swimmingPoolFormControls() {
    this.swimmimgPoolBookingForm = this.fb.group({
      id: null,
      uniqueId: null,
      version: 0,
      cancelledDate: null,
      bookingDate: null,
      status: null,
      refNumber: null,
      resourceType: null,
      payableServiceType: null,
      resourceCode: null,
      scheduleList: null,
      attachments: [],
      fileStatus: null,
      pid: null,
      remarks: null,
      family: false,
      staffMember: false,
      isRenewalForm: false,
      memberNumber: null,
      termsCondition : null
    });
    /*General Details*/
    this.generalDetails = this.fb.group({
      swimmingPoolName: this.fb.group({
        code: [null, [Validators.required]],
        name: null,
        gujName: null
      }),
      membershipType: this.fb.group({
        code: [null, Validators.required],
        name: null,
        gujName: null
      }),
      category: this.fb.group({
        code: [null, Validators.required],
        name: null,
        gujName: null
      }),
      batchDuration: this.fb.group({
        code: [null, Validators.required],
        name: null,
        gujName: null
      }),
      batchFor: this.fb.group({
        code: [null, Validators.required],
        name: null,
        gujName: null
      }),
      batchName: this.fb.group({
        code: [null, Validators.required],
        name: null,
        gujName: null
      }),
      birthDate :[null, Validators.required],
    });
     /*Applicant Details*/
     this.applicantDetail = this.fb.group({
      applicantName: [null, Validators.required],
      applicantPhoto: null,
      applicantMobileNumber: [null, Validators.required],
      applicantEmergencyNumber: null,
      applicantBirthDate: [null, {disabled: true }],
      applicantAge: null,
      applicantJoiningMonth: [null, Validators.required],
      applicantIDProof: this.fb.group({
        code: null,
        name: null,
        gujName: null
      }),
      applicantIDProofNumber: null,
      applicantEmail: [null, ValidationService.emailValidator],
      applicantBloodGroup: this.fb.group({
        code: null,
        name: null,
        gujName: null
      }),
      applicantAddress: this.fb.group(this.addressComp.addressControls()),

     });

    this.commonService.createCloneAbstractControl(this.generalDetails,this.swimmimgPoolBookingForm);
    this.commonService.createCloneAbstractControl(this.applicantDetail,this.swimmimgPoolBookingForm);
  }

  /**
  * Method is used for calculate age
  */
  calculateAge(event: any) {

    this.applicantageyear = moment().diff(event, 'years', false);
    // this.applicantagedays = bday.diff(bday.add(this.applicantageyear, 'years'), 'days', false);
    this.applicantDetail.get('applicantBirthDate').setValue(this.generalDetails.get('birthDate').value)
    this.applicantDetail.get("applicantAge").setValue(this.applicantageyear);
    if (this.applicantageyear <= 18) {
      this.isApplicateAgeGreaterThanEighteen = true;
    }
    else {
      this.isApplicateAgeGreaterThanEighteen = false;
    }
  }

  /**
   * This method is change date format.
   * @param date : selected date
   * @param controlType : form control name
   */
  dateFormat(date, controlType: string) {
    this.applicantDetail.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }
  dateFormatt(date, controlType: string) {
    this.generalDetails.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }
  dateFormat2(date, controlType: string) {
    this.applicantDetail.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }



  /**
   * This method required for final form submition.
   * @param count - flag of invalid control.
   */
  // handleErrorsonSubmit(count) {
  //   let step1 = 15;
  //   let step2 = 27;
  //   let step3 = 40;
  //   if (count <= step1) {
  //     this.tabIndex = 0;
  //     return false;
  //   } else if (count <= step2) {
  //     this.tabIndex = 1;
  //     return false;
  //   } else if (count <= step3) {
  //     this.tabIndex = 2;
  //     return false;
  //   }
  // }
  /**
   * Save form data
   */
  saveFormData() {
    // this.swimmimgPoolBookingForm.get('swimmingPoolName').setValue(this.swimmimgPoolBookingForm.get('resourceCodeLK').get('code').value);
    if (this.generalDetails.get('swimmingPoolName').get('code').value) {
      this.bookingService.saveDraftform(this.swimmimgPoolBookingForm.getRawValue(), this.generalDetails.get('swimmingPoolName').get('code').value).subscribe(
        res => {
          this.swimmimgPoolBookingForm.get('refNumber').setValue(res.refNumber);
          this.swimmimgPoolBookingForm.patchValue(res);
        },
        err => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
    }
    // }
  }

  /**
   * Submit form data
   */
  submitApplication(): void {
    let errCount = this.bookingUtils.getAllErrors(this.swimmimgPoolBookingForm);
    if (this.swimmimgPoolBookingForm.invalid) {
      this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
      return;
    }
    else if (this.isApplicateAgeGreaterThanEighteen == true && !this.isFileUploaded3) {
      this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'Attachment Required!', 'warning')
      return;
    }
    else if (!this.isRenewalForm && (!this.isFileUploaded1 || !this.isFileUploaded2 || !this.isFileUploaded4 || !this.isFileUploaded5)) {
      this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'Attachment Required!', 'warning')
      return;
    }
    else if (this.isSwimmingTestReportShow == true && !this.isFileUploaded6) {
      this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'Attachment Required!', 'warning')
      return;
    }
    else {
      // save call
      this.swimmingPoolService.submitData(this.swimmimgPoolBookingForm.getRawValue(), this.generalDetails.get('swimmingPoolName').get('code').value).subscribe(
        res => {
          let refNumber = this.swimmimgPoolBookingForm.get("refNumber").value;
          // this.sendSms(refNumber, "SUBMIT");
          this.sendMail(refNumber, "SUBMIT");
          this.swimmingPoolService.printAcknowledgeReceipt(res.refNumber).subscribe(data => {
            let sectionToPrint: any = document.getElementById('sectionToPrint');
            sectionToPrint.innerHTML = data;
            setTimeout(() => {
              window.print();
              if (!this.isRenewalForm) {
                this.paymentRequest(res);
              } else {
                this.router.navigate(['../../my-bookings'], { relativeTo: this.route });
              }
            });
          });
          // this.swimmimgPoolBookingForm.get('refNumber').setValue(res.refNumber);
          // this.swimmimgPoolBookingForm.patchValue(res);
          // // payment call
          // this.bookingService.getTransactionDetails(this.swimmimgPoolBookingForm.get('refNumber').value).subscribe(rep => {

          // }, (err) => {
          //   if (err.status == 402) {
          //     this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway ,this.swimmimgPoolBookingForm, this.router);
          //     return;
          //   } else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
          //     this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
          //       this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
          //     })
          //   } else {
          //     this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
          //   }
          // })
          this.toastr.success('Application Saved Successfully.')
        },
        err => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });

      return;
    }

  }

  paymentRequest(element) {
    this.bookingService.getTransactionDetails(element.refNumber).subscribe(transactionData => {
    }, err => {
      if (err.status == 402) {
        // if (err.status == 402) {
        // this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService);
        this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway, null, null, null, { gatewayCustomerId: err.error.data.id, txtadditionalInfo1: element.resourceType, payableServiceType: element.payableServiceType });
        this.router.navigate(['../../my-bookings'], { relativeTo: this.route });
        // }
      } else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
        this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "")
      } else {
        this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
      }
    })
  }

  CheckType(idCode) {

    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;
    if (idCode === 'AADHAAR_CARD') {
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isPassportIdNumber = false;
      this.isVisibleElectricityBill = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.aadharValidation]);
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
    else if (idCode === 'PAN_CARD') {
      this.isPanCardVisibleIdNumber = true;
      this.isVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isPassportIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isVisibleElectricityBill = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.panValidator]);
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
    else if (idCode === 'DRIVING_LICENSE') {
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isPassportIdNumber = false;
      this.isLicenseVisibleIdNumber = true;
      this.isVisibleElectricityBill = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.drivingLicenseValidator])
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
    else if (idCode === 'ELECTION_CARD') {
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isPassportIdNumber = false;
      this.isElectionCardIdNumber = true;
      this.isVisibleElectricityBill = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.electionCardValidator])
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
    else if (idCode === 'PASSPORT') {
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isPassportIdNumber = true;
      this.isVisibleElectricityBill = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.passportValidator])
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
   else if (idCode === 'ELECTRICITY_BILL') {
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isPassportIdNumber = false;
      this.isVisibleElectricityBill = true;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required, ValidationService.electricityBillValidation]);
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }
    else {
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.isLicenseVisibleIdNumber = false;
      this.isElectionCardIdNumber = false;
      this.isPassportIdNumber = false;
      this.applicantDetail.controls['applicantIDProofNumber'].setValue('');
      this.applicantDetail.controls['applicantIDProofNumber'].setValidators([Validators.required]);
      this.applicantDetail.controls['applicantIDProofNumber'].updateValueAndValidity();
    }

  }

  /** this method is used for send msn on submit
   * @param refNumber
   * @param eventType
   */
  sendSms(refNumber: any, eventType: any) {

    if (refNumber) {
      this.bookingService.sendSmsForSwimming(refNumber, eventType).subscribe(resp => {
      }, err => {
        this.toastr.error("Something went wrong");
      })
    } else {
      this.toastr.error("Invalid request");
    }
  }

  /**
          * Method is used to send mail on submit
          * @param refNumber 
          * @param eventType 
          * 
          */
  sendMail(refNumber: any, eventType: any) {
    if (refNumber) {
      this.bookingService.sendMailForSwimming(refNumber, eventType).subscribe(resp => {
      }, err => {
        this.toastr.error("Something went wrong");
      })
    } else {
      this.toastr.error("Invalid request");
    }
  }

  chosenMonthHandler(event) {
    console.log(event);
    this.dateFormat(event, 'applicantJoiningMonth');
  }

  getSwimmingPoolData() {
    if (this.memberNumber.invalid)
      return;

    this.bookingService.searchRenewSwimmingPool(this.memberNumber.value).subscribe(
      res => {
        res = res.data;
        if (res && res.bookingFormId)
          this.swimmimgPoolBookingForm.patchValue({ 'serviceFormId': res.bookingFormId });
        this.attachments = res.attachments;
        this.swimmimgPoolBookingForm.patchValue(res);
        // this.attachments = res.data;
        // this.swimmimgPoolBookingForm.disable();
        this.searchObj.isDisplayRenewLicenceForm = false;
        this.showDowlLoadFileTab = false;
        this.showSwimmingPoolForm = true;
        this.isRenewalForm = true;
        this.swimmimgPoolBookingForm.get('isRenewalForm').setValue(true);
        // this.swimmimgPoolBookingForm.get('remarks').enable();
        this.filterAsperBatchName(this.generalDetails.get('category').get('code').value);
      }, (error: any) => {
        this.commonService.openAlert("Error", error.error[0].message, "warning")
      })
  }

  getNumber(event){
    if(event.target.value.length >= 1 && event.target.value.length <= 11 ){
      this.showMsg = true;
    }
    else if(event.target.value.length == 0){
      this.showMsg = false
    }
    else{
      this.showMsg = false
    }   
  }

  termsConditionClick(event) {
    this.swimmimgPoolBookingForm.controls['termsCondition'].setValue(event.checked);
  }

  checkValidation(controlName,isSubmitted){
		if(controlName.invalid){
			this.handleErrorsOnSubmit(controlName)
		}else{
			const organizationalAry = Object.keys(controlName.value);
			organizationalAry.forEach(element => {
				this.swimmimgPoolBookingForm.get(element).setValue(controlName.get(element).value);
			});
			this.commonService.setValueToFromControl(controlName,this.swimmimgPoolBookingForm);
			this.tabIndex= this.tabIndex +1;
			if(isSubmitted){
				this.submitApplication(); 
			}else{
        this.saveFormData();
      }
		}
  }

  /**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
   public formControlNameToTabIndex = new Map();
	handleErrorsOnSubmit(controlName) {
		const key = this.bookingUtils.getInvalidFormControlKey(controlName);
		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

		this.tabIndex = index;
		return false;
	}

  setFormControlToTabIndexMap() {
		// index 1
	
		this.formControlNameToTabIndex.set("applicantMobileNumber", 1);
    this.formControlNameToTabIndex.set("applicantName", 1);
		this.formControlNameToTabIndex.set("applicantEmergencyNumber", 1);
		this.formControlNameToTabIndex.set("applicantEmail", 1);
		this.formControlNameToTabIndex.set("applicantBirthDate", 1);
		this.formControlNameToTabIndex.set("applicantAge", 1);
		this.formControlNameToTabIndex.set("applicantIDProof", 1);
    this.formControlNameToTabIndex.set("applicantIDProofNumber", 1);
    this.formControlNameToTabIndex.set("applicantBloodGroup", 1);
    this.formControlNameToTabIndex.set("applicantJoiningMonth", 1);
    this.formControlNameToTabIndex.set("applicantAddress", 1);
    //index 2
    this.formControlNameToTabIndex.set('bankName', 2)
		this.formControlNameToTabIndex.set('accountHolderName', 2)
		this.formControlNameToTabIndex.set('accountNo', 2)
		this.formControlNameToTabIndex.set('ifscCode', 2)
		
	}
}
