import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
//import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-book-children-theater',
    templateUrl: './book-children-theater.component.html',
    styleUrls: ['./book-children-theater.component.scss']
})
export class BookChildrenTheaterComponent implements OnInit {

    @ViewChild('address') addressComp: any;

    isFileUploaded: boolean = false;

    /**
       * instance variable for stadium booking facility.
       */
    translateKey: string = "citizenChildrenTheaterScreen";
    guideLineFlag: boolean = true;
    head_lines: string;

    /**
       * Booking Constants and utils
       */
    bookingConstants = BookingConstants;
    bookingUtils: BookingUtils;

    /**
      * Flags for hide/show
      */
    showChildrenTheaterSearchForm: boolean = false;
    showPaymentReciept: boolean = false;
    showChildrenTheaterApplicationForm: boolean = false;

    /**
      * Forms declaration
      */
    childrenTheaterSearchForm: FormGroup;
    childrenTheaterApplicationForm: FormGroup;

    /**
     * Local Arrays and Maps
     */
    selectedShift: Array<any> = [];
    filteredReponse: any;
    paymentObject: any;
    Dates: Array<any> = [];
    CHILDREN_THEATERS: Array<any> = [];
    CATEGORIES: Array<any> = [];
    // BANKS: Array<any> = [];
    availableStots: Array<any> = []
    tabIndex: number = 0;

    displayedColumnsFeeDetails: string[] = ['sno', 'programmePurpose', 'bookingRent', 'gst'];
    dataSource = [];

    /**
     * Date validations
     */
    startMinDate: Date = moment(new Date()).add(7, 'day').toDate();
    endMinDate: Date = moment(new Date()).add(7, 'day').toDate();
    endMaxDate:any = new Date();;
    endDate:any;

    /**
     * ngx-bootstrap models.
     */
    confirmRef: BsModalRef;

    constructor(private bookingService: BookingService,
        private router: Router,
        private _fb: FormBuilder, private toster: ToastrService,
        private modalService: BsModalService,
        private commonService: CommonService,
        private CD: ChangeDetectorRef,
        protected formService: FormsActionsService,
        protected toaster: ToastrService) {
        this.bookingUtils = new BookingUtils(formService, toster);
        this.bookingService.resourceType = this.bookingConstants.CT_RESOURCE_TYPE;

        this.head_lines = `Online Children theatre Booking facility
                            is the convenient and easy way to book the Children Theatre
                            of Vadodara Municiple Corporation. You can view the
                            availability details of the Children Theatre and select booking
                            date. The booking is confirmed on approval from department
                            and the successful payment of the rent amount for selected date.`;
    }

    ngOnInit() {
        this.createCTAvailiblityForm();
        this.createCTApplicationForm();
        this.getLookUpData();
        this.getResourceList();
        this.maxSlotDate();
        this.getFeesStructure();
        /**
		 * Subscribe start date changes
		 */
        this.childrenTheaterSearchForm.controls.startDate.valueChanges.subscribe(data => {
            this.childrenTheaterSearchForm.controls.endDate.reset();
            this.endMinDate = data;
            return;
        })
    }

    /**
       * Getting lookup data for Stadium booking.
       */
    getLookUpData() {
        this.bookingService.getDataFromLookups().subscribe(resp => {
            // this.BANKS = resp.BANK;
            // this.CANCELLATION_TYPE = resp.CANCELLATION_TYPE;
            this.CATEGORIES = resp.PURPOSE;
        });
    }

    /**
	 * This method use for set the date in form controls
	 * @param date get the selected date value
	 */
	onDateChange(date) {
        this.Dates = [];
        let futureMonth = moment(date).add(36, 'day');
        this.endMaxDate = moment(futureMonth).format("YYYY-MM-DD");
	}

    /**
     * Get All Resource List Of Stadium.
     */
    getResourceList() {
      this.bookingService.getResourceList().subscribe(resp => {
            this.CHILDREN_THEATERS = resp.data;
            this.childrenTheaterSearchForm.get('code').setValue(resp.data[0].name);
            this.childrenTheaterSearchForm.get('code').disable();
            this.getAvaillableSlot(resp.data);
        })
    }

    /**
         * Method is used to create town hall search form.
         */
    createCTAvailiblityForm() {
        this.childrenTheaterSearchForm = this._fb.group({
            code: [null, [Validators.required]],
            purpose: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]]
        });
    }

    createCTApplicationForm() {
        this.childrenTheaterApplicationForm = this._fb.group({
            //step 1
            organizationName: [null, [Validators.required, Validators.maxLength(100)]],
            orgTelephoneNo: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            organizationAddress: this._fb.group(this.addressComp.addressControls()),
            programPurpose: [null, [Validators.required, Validators.maxLength(200)]],

            //step 2
            applicantName: [null, [Validators.required, Validators.maxLength(100)]],
            applicantMobile: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            confirmMobile: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            emailId: [null, [Validators.required, ValidationService.emailValidator , Validators.maxLength(100)]],
            confirmEmailId: [null, [Validators.required, ValidationService.emailValidator , Validators.maxLength(50)]],
            relationshipWithOrg: [null, [Validators.required, Validators.maxLength(20)]],
            panCard:[null, ValidationService.panValidator],
            gstNo:[null, ValidationService.gstNoValidator],

            //step 3
            // accountHolderName: [null, [Validators.required, Validators.maxLength(50)]],
            // accountNo: [null, [Validators.required, Validators.maxLength(20)]],
            // bankName: this._fb.group({
            //     code: [null, [Validators.required]],
            //     name: null
            // }),
            // ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator, Validators.maxLength(11), Validators.minLength(11)]],
            agree: [null, [Validators.required]],
            termsCondition: [null, [Validators.required]],

            attachments: [],
            bookingPurposeMaster: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),

            //other attributes
            id: null,
            uniqueId: null,
            version: null,
            cancelledDate: null,
            bookingDate: null,
            status: null,
            refNumber: null,
            resourceType: null,
            payableServiceType: null,
            resourceCode: null,
            bookingFormId :null
        })

    }

    /**
     * Method is used to submit stadium application form.
     */
    submitStadiumApplication(): void {
        let errCount = this.bookingUtils.getAllErrors(this.childrenTheaterApplicationForm);
        if (this.childrenTheaterApplicationForm.invalid) {
            this.handleErrorsOnSubmit(errCount);
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
            return;
        }
        else if (!this.bookingUtils.matcher(this.childrenTheaterApplicationForm, 'emailId', 'confirmEmailId') || !this.bookingUtils.matcher(this.childrenTheaterApplicationForm, 'applicantMobile', 'confirmMobile')) {
            this.handleErrorsOnSubmit(7);
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, !this.bookingUtils.matcher(this.childrenTheaterApplicationForm, 'emailId', 'confirmEmailId') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
            return;
        } else if (!this.isFileUploaded) {
            this.handleErrorsOnSubmit(11);
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'School Or Institute letter Attachment Required!', 'warning')
            return;
        } else if (!this.childrenTheaterApplicationForm.get('agree').value) {
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, this.bookingConstants.AGREE_MESSAGE, 'warning')
            return;
        } else if (!this.childrenTheaterApplicationForm.get('termsCondition').value) {
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
            return;
        } else {
            this.bookingService.commonBookSlot(this.childrenTheaterApplicationForm.value).subscribe(resp => {
                if (resp.data.status == this.bookingConstants.SUBMITTED) {
                    this.commonService.commonAlert("Children Theater", "Your Application has been submitted.", "success", "Print Acknowledgement Receipt", false, '', pA => {
                        this.bookingService.printAcknowledgementReceipt(resp.data.refNumber).subscribe(acknowledgementHTML => {
                            let sectionToPrint: any = document.getElementById('sectionToPrint');
                            sectionToPrint.innerHTML = acknowledgementHTML;
                            setTimeout(() => {
                                window.print();
                                this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
                            });
                        }, err => {
                            this.commonService.openAlert("Error", err.error[0].message, "warning")
                        })
                    }, rA => {
                        this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
                    })
                }
            }, (err) => {
                // this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
                this.commonService.openAlert("Warning!", err.error[0].message, "warning");
            })
            return;
        }
    }

    /**
           * Method is used to get available stadium.
           */
    searchBooking() {
        this.selectedShift = [];
        if (this.childrenTheaterSearchForm.valid) {
			/**
		    * Filter Object to get list of available dates.
		    */
            let filterData = {
                resourceName : this.CHILDREN_THEATERS[0].code,
                // resourceName: this.childrenTheaterSearchForm.get('code').value,
                startDate: moment(this.childrenTheaterSearchForm.get('startDate').value).format("YYYY-MM-DD"),
                endDate: moment(this.childrenTheaterSearchForm.get('endDate').value).format("YYYY-MM-DD"),
            }
			/**
			 * calling api to get all available slots.
			 */
            this.bookingService.getAllSlots(filterData).subscribe(resp => {
                //console.log(resp);
                this.filteredReponse = resp;
                let temp = resp.data.scheduleList;
                this.Dates = temp.sort((a, b) => {
                    if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
                        return 1
                    } else {
                        return -1
                    }
                });
                this.availableStots = resp.data;
            });
        } else {
            this.bookingUtils.getAllErrors(this.childrenTheaterSearchForm);
            this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
        }
    }
    /**
     * Method is used to shortlist all selected dates.
     */
    shortlistShifts(confirmationModel: TemplateRef<any>) {
        this.selectedShift.sort((a, b) => {
            if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
                return 1;
            } else {
                return -1;
            }
        });
        this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-md' }));
    }

    /**
        * Method is used to shortlist selected townhalls.
        */
    confirmShortlist() {
        if (this.selectedShift.length > 0) {
            let shortListData = {
                resourceCode: this.filteredReponse.data.resourceCode,
                purposeOfBooking: this.childrenTheaterSearchForm.get('purpose').value,
                startDate: this.filteredReponse.data.startDate,
                endDate: this.filteredReponse.data.endDate,
                appointments: this.selectedShift.map(shifts => shifts.uniqueId)
            }
            this.bookingService.shortListBookings(shortListData).subscribe(resp => {
                this.showChildrenTheaterSearchForm = false;
                this.childrenTheaterApplicationForm.patchValue(resp.data);
                this.addressComp.getCountryLists();
                if (resp.data.status == this.bookingConstants.DRAFT) {
                    this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
                        this.paymentObject = payResp.data;
                        this.showPaymentReciept = true;
                        this.confirmRef.hide();
                    })
                }
            }, (err) => {
                this.commonService.openAlert("Error", err.error[0].message, "warning");
            });
        } else {
            this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
        }
    }

    /**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
    handleErrorsOnSubmit(count) {
        let step1 = 4;
        let step2 = 10;
        let step3 = 16;
        if (count < step1) {
            this.tabIndex = 0;
            return false;
        } else if (count < step2) {
            this.tabIndex = 1;
            return false;
        } else if (count < step3) {
            this.tabIndex = 2;
            return false;
        }
    }


  /**
   * Get user data
   */
  getUserProfile() {
    this.bookingService.getUserProfile().subscribe(resp => {
        console.log(resp);
        this.childrenTheaterApplicationForm.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
        this.childrenTheaterApplicationForm.get('emailId').setValue(resp.data.email);
        this.childrenTheaterApplicationForm.get('applicantMobile').setValue(resp.data.cellNo);
        this.childrenTheaterApplicationForm.get('confirmEmailId').setValue(resp.data.email);
        this.childrenTheaterApplicationForm.get('confirmMobile').setValue(resp.data.cellNo);
        this.childrenTheaterApplicationForm.get('accountHolderName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
    },
      err => {
        this.toster.error("Server Error");
      });
  }

  maxSlotDate(){
   this.endDate =  moment(new Date()).add(90, 'day').toDate()
  }

  onSameApplicantHolderName(event){
    this.childrenTheaterApplicationForm.get('accountHolderName').setValue(event.value);
  }

   getFeesStructure(){
      this.bookingService.getFeesStructure().subscribe(res =>{
      if(!res.success){
        this.commonService.openAlert("Error", res.message, "warning")
       }
      this.dataSource = res.data
      });
    }
   
    getAvaillableSlot(data){
        this.bookingService.getAvailableStots(data[0].code).subscribe(respData => {
          this.endDate = moment(respData.data.endDate, "DD-MM-YYYY").toDate();
        })
      }

}
