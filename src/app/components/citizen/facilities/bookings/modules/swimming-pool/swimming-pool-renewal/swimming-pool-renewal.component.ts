import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../../../../config/routes-conf';

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


@Component({
  selector: 'app-swimming-pool-renewal',
  templateUrl: './swimming-pool-renewal.component.html',
  styleUrls: ['./swimming-pool-renewal.component.scss']
})
export class SwimmingPoolRenewalComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  @ViewChild('address') addressComp: any;
  
  public config = new ComponentConfig;

  swimmimgPoolRenewalForm: FormGroup;
  translateKey: string = 'swimmingPoolRenewalScreen';

  showDowlLoadFileTab: boolean = false;
  showSwimmingPoolForm: boolean = true;

  formId: number;
  apiCode: string;
  public tabIndex: number = 0;
  disableDate = new Date(moment().format('YYYY-MM-DD'));
  isFileUploaded1: boolean = false;
  isFileUploaded2: boolean = false;
  isFileUploaded3: boolean = false;
  isFileUploaded4: boolean = false;
  applicantageyear: number = null;

  countryListArray: any = [];
  stateListArray: any = [];
  cityListArray: any = [];
  isBuildinAreaReq: boolean = false;
  /**
  * Loading Booking Configuration
  */
  bookingUtils: BookingUtils ;
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
  BANK: Array<any> = [];
  session: any;
  durationisReadOnly: boolean = false;
  oldFormCategory: any;
  dependentOnCategory: boolean = false;

  // serach api variable
  serachObj = {
    isDisplayRenewLicenceForm: <boolean>false,
    searchLicenceNumber:""
  }

	/**
	 * This method for serach licence using licence number.
	 */
  searchLicence() {
    this.bookingService.searchRenewSwimmingPool(this.serachObj.searchLicenceNumber).subscribe(
      (res: any) => {
        if (res.success) {
          this.serachObj.isDisplayRenewLicenceForm = true;
          this.createRecordPatchSerachData(res.data);
        } else {
          this.serachObj.isDisplayRenewLicenceForm = false;
        }
      }, (err: any) => {

        this.serachObj.isDisplayRenewLicenceForm = false;
        if (err.error && err.error.length) {
          this.commonService.openAlert("Warning", err.error[0].message, "warning");
        }
      })
  }

	/**
	* @param fb - Declare FormBuilder property.
	* @param validationError - Declare validation service property
	* @param formService - Declare form service property 
	* @param uploadFileService - Declare upload file service property.
	* @param commonService - Declare sweet alert.
	* @param shopAndEstablishmentService - Call only shop licence api.
	* @param toastrService - Show massage with timer.
	*/
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private formService: FormsActionsService,
    public bookingService: BookingService,
    private commonService: CommonService,
    public TranslateService: TranslateService
  ) { 
    this.bookingUtils = new BookingUtils(formService, toastr);
    this.bookingService.resourceType = 'swimming'; }

	/**
	 * This method call initially required methods.
	 */
  ngOnInit() {
    // this.route.paramMap.subscribe(param => {
    //   this.formId = Number(param.get('id'));
    //   this.apiCode = param.get('apiCode');
    //   this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    // });

    this.getLookupData();
    this.swimmimgPoolRenewalFormControls();

    if (!this.formId) {
      this.serachObj.isDisplayRenewLicenceForm = false;
    }
    else {
      this.serachObj.isDisplayRenewLicenceForm = true;
      this.getShopRenewalData();
      this.swimmimgPoolRenewalForm.disable();
      this.enableFielList();
    }
  }

	/**
	 * This method is use to create new record for citizen.
	 * @param searchData: exciting licence number data
	 */
  createRecordPatchSerachData(searchData: any) {
    // this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    // this.formService.createFormData().subscribe(res => {

    // this.formId = res.serviceFormId;
    this.swimmimgPoolRenewalForm.patchValue(searchData);
    /**
     * save category for last submit process
     */
    this.oldFormCategory = searchData.category.code;

    this.bookingService.saveDraftform(this.swimmimgPoolRenewalForm.value, this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value).subscribe(
      res => {
        this.swimmimgPoolRenewalForm.get('refNumber').setValue(res.refNumber);
        this.swimmimgPoolRenewalForm.patchValue(res);
      },
      err => {
        this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
      });
    this.swimmimgPoolRenewalForm.patchValue({
      // id: res.id,
      // uniqueId: res.uniqueId,
      // version: res.version,
      // serviceFormId: res.serviceFormId,
      // refNumber: this.serachObj.searchLicenceNumber,
      // createdDate: res.createdDate,
      // updatedDate: res.createdDate,
      // serviceType: res.serviceType,
      // // deptFileStatus: res.deptFileStatus,
      // serviceName: res.serviceName,
      // fileNumber: res.fileNumber,
      // pid: res.pid,
      // outwardNo: res.outwardNo,
      // agree: res.agree,

      // paymentStatus: res.paymentStatus,
      // canEdit: res.canEdit,
      // canDelete: res.canDelete,
      // canSubmit: res.canSubmit,
      // serviceCode: res.serviceCode,
      // applicationNo: res.applicationNo,

      // periodFrom: res.periodFrom,
      // periodTo: res.periodTo,
      // renewal: res.renewal,
      // adminCharges: res.adminCharges,
      // netAmount: res.netAmount,
      attachments: [],

    });

    // this.licenseConfiguration.isAttachmentButtonsVisible = true;

    this.swimmimgPoolRenewalForm.disable();
    this.enableFielList();

    // this.getCategoryDropdownData(this.swimmimgPoolRenewalForm.get('noOfHumanWorking').value.code);
    // this.getSubCategoryDropdownData(this.swimmimgPoolRenewalForm.get('categoryOfBusiness').value.code);
    // let currentUrl = this.location.path().replace('false', this.formId.toString());
    // this.location.go(currentUrl);
    // res.serviceDetail.serviceUploadDocuments.forEach(app => {
    //   (<FormArray>this.swimmimgPoolRenewalForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
    // });
    // this.requiredDocumentList();
    // });

  }

  /**
   * This method for find user category
   */
  changeCtegory(event: any) {

    if (event == 'SWIMMER' && this.oldFormCategory == 'LEARNER') {
      this.dependentOnCategory = true;
    }
    else {
      this.dependentOnCategory = false;
    }

  }

	/**
	 * This method use for edit some fiels.
	 */
  enableFielList() {
    this.swimmimgPoolRenewalForm.get('swimmingPoolName').enable();
    this.swimmimgPoolRenewalForm.get('batchDuration').enable();
    // this.swimmimgPoolRenewalForm.get('membershipType').enable();
    this.swimmimgPoolRenewalForm.get('category').enable();
    this.swimmimgPoolRenewalForm.get('batchDuration').enable();
    this.swimmimgPoolRenewalForm.get('batchFor').enable();
    this.swimmimgPoolRenewalForm.get('batchName').enable();
  }

	/**
	 * This method patch form data.
	 */
  getShopRenewalData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      this.swimmimgPoolRenewalForm.patchValue(res);
      // this.licenseConfiguration.isAttachmentButtonsVisible = true;

      // this.getCategoryDropdownData(this.swimmimgPoolRenewalForm.get('noOfHumanWorking').value.code);
      // this.getSubCategoryDropdownData(this.swimmimgPoolRenewalForm.get('categoryOfBusiness').value.code);

      // res.serviceDetail.serviceUploadDocuments.forEach(app => {
      //   (<FormArray>this.swimmimgPoolRenewalForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
      // });
      this.requiredDocumentList();
    });
  }


	/**
	 * This method create form controls.
	 */
  swimmimgPoolRenewalFormControls() {
    this.swimmimgPoolRenewalForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
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
      swimmingPoolName: this.fb.group({
        code: ['LALBAUG_SWIMMING_POOL', [Validators.required]],
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

      applicantName: [null, Validators.required],
      applicantPhoto: null,
      applicantMobileNumber: [null, Validators.required],
      applicantEmergencyNumber: null,
      applicantBirthDate: [null, Validators.required],
      applicantAge: null,
      applicantIDProof: this.fb.group({
        code: null,
        name: null,
        gujName: null
      }),
      applicantIDProofNumber: null,
      applicantEmail: null,
      applicantBloodGroup: this.fb.group({
        code: null,
        name: null,
        gujName: null
      }),
      applicantAddress: this.fb.group(this.addressComp.addressControls()),

      // accountHolderName: [null,  [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      // accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
      // bankName: this.fb.group({
      //   code: [null, Validators.required],
      //   name: null,
      //   gujName: null
      // }),
      // ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
      scheduleList: null,
      attachments: [],
      fileStatus: null,
      pid: null,
      remarks: null,
      family: false,
      staffMember: false,
      birthDate : [null, Validators.required]
    });
  }

	/**
	 * This method is use for get lookup data.
	 */
  getLookupData() {
    this.bookingService.getDataFromLookups().subscribe(res => {
      this.bookingService.getDataFromLookups().subscribe(resp => {
        this.SWIMMING_POOL_NAME = resp.SWIMMING_POOL_NAME;
        this.CATEGORY = resp.CATEGORY;
        this.MEMBERSHIP_TYPE = resp.MEMBERSHIP_TYPE;
        this.BATCH_DURATION = resp.BATCH_DURATION;
        this.BLOOD_GROUP = resp.BLOOD_GROUP;
        this.APPLICANT_PROOF = resp.APPLICANT_PROOF;
        this.BANK = resp.BANK;
      },
        err => {
          this.toastr.error("Server Error");
        });
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
  defaultAsperPool() {
    this.bookingService.filterPoolCode(this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value).subscribe(rep => {
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
      poolName : this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value,
      birthDate :this.swimmimgPoolRenewalForm.get('birthDate').value,
      category: this.swimmimgPoolRenewalForm.get('category').get('code').value
   }
    if (event == 'REGULAR') {
      this.bookingService.filterBatchCode(obj).subscribe(rep => {
        this.BATCH_NAME = rep;
      },
        err => {
          this.toastr.error("Server Error");
        })
    }
    else if (event) {
      this.bookingService.filterBatchCode(obj).subscribe(rep => {
        this.BATCH_NAME = rep;
      },
        err => {
          this.toastr.error("Server Error");
        })
    }
    else {
      this.toastr.error("Server Error");
    }

  }

  /**
   * Method for hide duration field
   */
  changeBatchDuration(event) {
    if (event == 'LEARNER') {
      this.swimmimgPoolRenewalForm.get('batchDuration').get('code').setValue('MONTHLY');
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
	 * Method is create required document array
	 */
  requiredDocumentList() {
    this.uploadFilesArray = [];
    let organizationCategory = this.swimmimgPoolRenewalForm.get('typeOfOrganisation').value.code;
    if (organizationCategory) {
      _.forEach(this.swimmimgPoolRenewalForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {


        if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
          this.uploadFilesArray.push({
            'labelName': value.documentLabelEn,
            'fieldIdentifier': value.fieldIdentifier,
            'documentIdentifier': value.documentIdentifier
          })
        }

        if (value.dependentFieldName) {
          let dependentFieldArray = value.dependentFieldName.split(",");
          if (dependentFieldArray.includes(organizationCategory) && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
            this.uploadFilesArray.push({
              'labelName': value.documentLabelEn,
              'fieldIdentifier': value.fieldIdentifier,
              'documentIdentifier': value.documentIdentifier
            })
          }
        }

      });
    }
  }

  /**
 * Method is used for calculate age
 */
  calculateAge(event: any) {

    this.applicantageyear = moment().diff(event, 'years', false);
    // this.applicantagedays = bday.diff(bday.add(this.applicantageyear, 'years'), 'days', false);

    this.swimmimgPoolRenewalForm.get("applicantAge").setValue(this.applicantageyear);
  }

  /**
   * This method is change date format.
   * @param date : selected date
   * @param controlType : form control name
   */
  dateFormat(date, controlType: string) {
    this.swimmimgPoolRenewalForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
  }

  /**
   * Save form data
   */
  saveFormData() {
    // if (this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value) {
    // this.swimmimgPoolRenewalForm.get('swimmingPoolName').setValue(this.swimmimgPoolRenewalForm.get('resourceCodeLK').get('code').value);
    this.bookingService.saveDraftform(this.swimmimgPoolRenewalForm.getRawValue(), this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value).subscribe(
      res => {
        this.swimmimgPoolRenewalForm.get('refNumber').setValue(res.refNumber);
        this.swimmimgPoolRenewalForm.patchValue(res);
      },
      err => {
        this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
      });
    // }
  }


	/**
 * This method required for final form submition.
 * @param flag - flag of invalid control.
 */
  handleErrorsOnSubmit(flag) {
    if ((flag <= 16)) {
      this.tabIndex = 0;
    }
        // this.licenseConfiguration.currentTabIndex = 0;
      // case flag <= 28:
      //   this.licenseConfiguration.currentTabIndex = 1;
      //   break;
      // case flag <= 36:
      //   this.licenseConfiguration.currentTabIndex = 2;
      //   break;
      // case flag <= 42:
      //   this.licenseConfiguration.currentTabIndex = 3;
      //   break;
      // case flag <= 49:
      //   this.licenseConfiguration.currentTabIndex = 4;
      //   break;
      // case flag <= 57:
      //   this.licenseConfiguration.currentTabIndex = 5;
      //   break;
      // case flag <= 61:
      //   this.licenseConfiguration.currentTabIndex = 6;
      //   break;
      // default:
      //   this.licenseConfiguration.currentTabIndex = 0;
    }
  

  /**
   * Print receipt and processed for department approval
   */
  printSwimmingReceipt() {
    let errCount = this.bookingUtils.getAllErrors(this.swimmimgPoolRenewalForm);
    if (this.swimmimgPoolRenewalForm.invalid) {
      this.handleErrorsOnSubmit(errCount);
      this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
      return;
    } else {
      // print call
      this.bookingService.saveDraftform(this.swimmimgPoolRenewalForm.getRawValue(), this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value).subscribe(
        res => {
          this.bookingService.printSwimmingReceipt(res.refNumber, 'SWIMMING_POOL_RENEWAL_FEES').subscribe(printHTML => {
            let sectionToPrint: any = document.getElementById('sectionToPrint');
            sectionToPrint.innerHTML = printHTML;
            setTimeout(() => {
              window.print();
              this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
            });

          }, err => {
            this.toastr.error("Server Error");

          });

        }, err => {
          this.toastr.error("Server Error");

        });

    }
  }
  /**
  * Submit form data
  */
  submitApplication(): void {

    let errCount = this.bookingUtils.getAllErrors(this.swimmimgPoolRenewalForm);
    if (this.swimmimgPoolRenewalForm.invalid) {
      this.handleErrorsOnSubmit(errCount);
      this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
      return;
    }
    // else if (!this.bookingUtils.matcher(this.swimmimgPoolRenewalForm, 'emailId', 'confirmEmailId') || !this.bookingUtils.matcher(this.swimmimgPoolRenewalForm, 'applicantMobile', 'confirmMobile')) {
    //   this.commonService.openAlert("Field Error", !this.bookingUtils.matcher(this.swimmimgPoolRenewalForm, 'emailId', 'confirmEmailId') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning');
    //   this.handleErrorsOnSubmit(7);
    //   return;}
    // else if (!this.isFileUploaded1 || !this.isFileUploaded2 || !this.isFileUploaded3 || !this.isFileUploaded4) {
    //   this.handleErrorsOnSubmit(33);
    //   this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'Attachment Required!', 'warning')
    //   return;
    // }
    else {
      // save call
      this.bookingService.saveDraftform(this.swimmimgPoolRenewalForm.getRawValue(), this.swimmimgPoolRenewalForm.get('swimmingPoolName').get('code').value).subscribe(
        res => {
          this.swimmimgPoolRenewalForm.get('refNumber').setValue(res.refNumber);
          this.swimmimgPoolRenewalForm.patchValue(res);
          // payment call
          this.bookingService.getTransactionDetails(this.swimmimgPoolRenewalForm.get('refNumber').value).subscribe(rep => {

          }, (err) => {
            if (err.status == 402) {
              // this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService, this.swimmimgPoolRenewalForm, this.router, 'citizen/bookings/swimming-pool/swimmingPoolRenewal');
              this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway ,this.swimmimgPoolRenewalForm, this.router);
              return;

              // submit and print call
              // this.bookingService.submitFormData(this.swimmimgPoolRenewalForm.value).subscribe(resp => {

              //   if (resp.data.status == this.bookingConstants.SUBMITTED) {
              //     this.commonService.commonAlert("Swimming Pool", "Booked Successfully", "success", "Print Receipt", false, '', pA => {
              //       this.bookingService.printReceipt(resp.data.refNumber, 'SWIMMING_POOL_FEES').subscribe(printHTML => {
              //         let sectionToPrint: any = document.getElementById('sectionToPrint');
              //         sectionToPrint.innerHTML = printHTML;
              //         setTimeout(() => {
              //           window.print();
              //           this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
              //         });
              //       }, err => {
              //         this.commonService.openAlert("Error", err.error[0].message, "warning")
              //       })
              //     }, rA => {
              //       this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
              //     })
              //   }

              // }, (err) => {
              //   if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
              //     this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
              //       this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL])
              //     })
              //   } else {
              //     this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
              //   }
              // })

            } else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
              this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
                this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
              })
            } else {
              this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
            }
          })

        },
        err => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });

      return;
    }

  }
}
