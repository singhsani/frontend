import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
// import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Constants } from 'src/app/vmcshared/Constants';

@Component({
    selector: 'app-book-theater',
    templateUrl: './book-theater.component.html',
    styleUrls: ['./book-theater.component.scss']
})
export class BookTheaterComponent implements OnInit {

    @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
    @ViewChild('address') addressComp: any;

    /**
       * Loading Booking Configuration
       */
    bookingUtils: BookingUtils;
    bookingConstants = BookingConstants;
    constants = Constants;

    /**
     * boolean flags to handle view.
     */
    showTheaterBookingForm: boolean = false;
    showBookingInfo: boolean = false;
    showShortListData: boolean = false;
    showPaymentReciept: boolean = false;
    showTheaterSearchForm: boolean = false;
    guideLineFlag: boolean = true;
    btnProceed: boolean = true;

    /**
     * Translation Key.
     */
    translateKey = "citizenTheaterBookingScreen";

    /**
     * Forms.
     */
    searchTheaterForm: FormGroup;
    theaterBookingForm: FormGroup;
    firstTheaterBookingForm: FormGroup;
    bankTheaterBookingForm: FormGroup;

    /**
     * LookUps & Arrays.
     */
    THEATERS: Array<any> = [];
    CATEGORIES: Array<any> = [];
    availableStots: Array<any> = [];
    selectedShift: Array<any> = [];
    Dates: Array<any> = [];
    // BANKS: Array<any> = [];


    /**
     * Function Objects.
     */
    bookingObject: any;
    categoryObject: any;
    paymentObject: any;
    filteredReponse: any;
    tabIndex: number = 0;

    /**
     * display colums in table.
     */
    displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus', 'action'];
    displayedColumnsFeeDetails: string[] = ['sno', 'programmePurpose', 'bookingRent'];


    /**
     * Min date should be current date.
     */
    startMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    endMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    maxEndDate: any;

    /**
       * ngx-bootstrap models.
       */
    confirmRef: BsModalRef;
    dataSource = [];
    public formControlNameToTabIndex = new Map();

    rupeeSign: string;
    showSelectLanguage : boolean = true
    /**
     * Constructor
     * @param fb - formbuilder.
     * @param bookingService - booking service for api reference.
     * @param toster - toaster service.
     * @param validationService - validation service.
     * @param router -routing service.
     * @param formService - form service for api reference.
     * @param commonService - common services for popups.
     */
    constructor(
        private fb: FormBuilder,
        private bookingService: BookingService,
        protected toster: ToastrService,
        private commonService: CommonService,
        private modalService: BsModalService,
        protected formService: FormsActionsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.bookingUtils = new BookingUtils(formService, toster);
        this.bookingService.resourceType = 'amphiTheater';
    }

    /**
     * Method Initialzes first.
     */
    ngOnInit() {

        this.getFeesStructure();
        this.createSearchTheaterForm();
        this.createTheaterBookingForm();
        this.getResourceList();
        this.getLookUps();
        this.setFormControlToTabIndexMap();

        //this.getCategoryLookUps();

        /**
        * Subscribe changes of start date.
        */
        this.searchTheaterForm.controls.startDate.valueChanges.subscribe(data => {
            this.searchTheaterForm.controls.endDate.reset();
            this.endMinDate = data;
            return;
        })
        this.rupeeSign = this.constants.rupeeSymbol;
    }

    /**
     * This method is used to set endDate 30 days after the selected start date
     * @param date - selected start date
     */
    onDateChange(date) {
        this.Dates = [];
        let futureMonth = moment(date).add(30, 'day');
        // this.maxEndDate = moment(futureMonth).format("YYYY-MM-DD");
    }

    /**
     * Create theater search f
     */
    createSearchTheaterForm() {
        this.searchTheaterForm = this.fb.group({
            code: [null, [Validators.required]],
            category: this.fb.group({
                code: [null, [Validators.required]],
            }),
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]]
        });
    }

    /**
     * Get all theater resource list.
     */
    getResourceList() {
        this.bookingService.getResourceList().subscribe(res => {
            if (res.data.length) {
                //this.searchTheaterForm.get('code').setValue(res.data[0].code);
                this.searchTheaterForm.get('code').setValue(res.data[0].name);
                this.searchTheaterForm.get('code').disable();
                this.bookingObject = res.data[0];
            }
            this.THEATERS = res.data;
            this.getAvaillableSlot(res.data);
        },
            err => {
                this.toster.error(err.error.error_description);
            }
        );
    }

    /**
     * Get all booking category list from api.
     */
    getLookUps() {
        this.bookingService.getDataFromLookups().subscribe((respData) => {
            this.CATEGORIES = respData.PURPOSE;
            // this.BANKS = respData.BANK;
        });
    }

    /**
     * Method is used to craete theater booking form.
     */
    createTheaterBookingForm() {

        this.firstTheaterBookingForm = this.fb.group({
            eventFromDate: [null],
            eventToDate: [null],
            programmePurpose: [null],
            organizationName: [null, [Validators.required, Validators.maxLength(50)]],
            organizationNumber: [null, [Validators.required]],
            confirmMobile: [null, Validators.required],
            organizationEmail: [null, [Validators.required, ValidationService.emailValidator]],
            confirmEmailID: [null, [Validators.required, ValidationService.emailValidator]],
            organizationAddress: this.fb.group(this.addressComp.addressControls())

        }),
            this.bankTheaterBookingForm = this.fb.group({
                bankName: this.fb.group({
                    code: [null, [Validators.required]]
                }),
                accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
                accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
                ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
                termsCondition: null,
                agree: null
            }),
            this.theaterBookingForm = this.fb.group({

                id: null,
                refNumber: null,
                status: null,
                uniqueId: null,
                version: 0,
                bookingDate: [null],
                cancelledDate: null,
                bookingPurposeMaster: this.fb.group({
                    code: [null],
                    name: null
                })
            });

        this.commonService.createCloneAbstractControl(this.firstTheaterBookingForm, this.theaterBookingForm);
        this.commonService.createCloneAbstractControl(this.bankTheaterBookingForm, this.theaterBookingForm);

    }



    /**
     * Method is used to filter slots on specific date.
     */
    searchBooking() {
        this.selectedShift = [];
        if (this.searchTheaterForm.valid) {
            let filterData = {
                // resourceName: this.searchTheaterForm.get('code').value,
                resourceName: this.THEATERS[0].code,
                startDate: moment(this.searchTheaterForm.get('startDate').value).format("YYYY-MM-DD"),
                endDate: moment(this.searchTheaterForm.get('endDate').value).format("YYYY-MM-DD"),
            }
            this.bookingService.getAllSlots(filterData).subscribe(resp => {
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
            }, err => {
                //this.toster.error(err.error.message);
            });
        }
        else {
            this.bookingUtils.getAllErrors(this.searchTheaterForm);
            this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
        }
    }

    /**
  * Method is used to shortlist all selected dates.
  */
    shortListTheater(confirmationModel: TemplateRef<any>) {
        this.selectedShift.sort((a, b) => {
            if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
                return 1;
            } else {
                return -1;
            }
        });
        this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-md customWidth' }));
    }

    /**
     * Method is used to shortlist theater.
     */
    confirmShortlist() {
        if (this.selectedShift.length > 0) {
            let shortListData = {
                resourceCode: this.filteredReponse.data.resourceCode,
                purposeOfBooking: this.searchTheaterForm.get('category').value,
                startDate: this.filteredReponse.data.startDate,
                endDate: this.filteredReponse.data.endDate,
                appointments: this.selectedShift.map(shifts => shifts.uniqueId)
            }

            this.bookingService.shortListBookings(shortListData).subscribe(resp => {

                if (resp.success) {
                    this.showTheaterSearchForm = false;
                    this.firstTheaterBookingForm.patchValue(resp.data);
                    this.bankTheaterBookingForm.patchValue(resp.data);
                    this.theaterBookingForm.patchValue(resp.data);
                    if (resp.data.bookingPurposeMaster) {
                        this.firstTheaterBookingForm.get('programmePurpose').setValue(resp.data.bookingPurposeMaster.name)
                        this.firstTheaterBookingForm.get('programmePurpose').disable();
                    }
                    this.addressComp.getCountryLists();
                    if (resp.data.status == this.bookingConstants.DRAFT) {
                        this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
                            this.paymentObject = payResp.data;
                            this.firstTheaterBookingForm.get('eventFromDate').setValue(this.paymentObject.EVENT_FROM_DATE);
                            this.firstTheaterBookingForm.get('eventFromDate').disable();
                            this.firstTheaterBookingForm.get('eventToDate').setValue(this.paymentObject.EVENT_TO_DATE);
                            this.firstTheaterBookingForm.get('eventToDate').disable();
                            this.showPaymentReciept = true;
                            this.confirmRef.hide();
                        })
                    }
                }

            }, err => {
                this.confirmRef.hide();
                this.commonService.openAlert("Error", err.error[0].message, "warning");
            })
        } else {
            this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
        }
    }

    /**
     * Method is used to confirm theater booking.
     */
    confirmBooking() {
        this.bookingService.commonBookSlot(this.theaterBookingForm.getRawValue()).subscribe(respData => {
            if (respData.success) {
                this.searchBooking();
                this.showShortListData = true;
                this.showBookingInfo = false;
                this.showTheaterBookingForm = false;
                this.commonService.successAlert("Theater Booking Status", "Theater SucessFully Booked", "success");
            }
        }, err => {
            if (err.status === 602) {
                this.toster.error("Theater Booking Expired");
                this.searchBooking();
            }
        })
    }

    /**
     * Method is used to submit theater application.
     */
    submitTheaterApplication() {
        let errCount = this.bookingUtils.getAllErrors(this.theaterBookingForm);
        if (this.theaterBookingForm.invalid) {
            //this.handleErrorsOnSubmit(errCount);
            this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
            return;
        } else if (!this.theaterBookingForm.get('agree').value) {
            this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
            return;
        } else if (!this.theaterBookingForm.get('termsCondition').value) {
            this.commonService.openAlert("Field Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
            return;
        } else {
            this.bookingService.commonBookSlot(this.theaterBookingForm.value).subscribe(resp => {
            }, (err) => {
                if (err.status == 402) {

                    let refNumber = this.theaterBookingForm.get("refNumber").value;
                    this.sendMail(refNumber, "SUBMIT");

                    // this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService, this.theaterBookingForm, this.router);
                    this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway, this.theaterBookingForm, this.router);
                    this.router.navigate(['../../my-bookings'], { relativeTo: this.route });
                    return;
                } else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
                    this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
                        this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL])
                    })
                } else {
                    this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
                }
            })
            return;
        }
    }

    /**
     * Method is used to handle error/validation on submit
     * @param count - count of invalid control.
     */
    //     handleErrorsOnSubmit(count) {
    //         let step1 = 4;
    //         let step2 = 11;
    //         let step3 = 17;
    //         if (count < step1) {
    //             this.tabIndex = 0;
    //             return false;
    //         } else if (count < step2) {
    //             this.tabIndex = 1;
    //             return false;
    //         } else if (count < step3) {
    //             this.tabIndex = 2;
    //             return false;
    //         }
    //     }

    getFeesStructure() {
        this.bookingService.getFeesStructure().subscribe(res => {
            if (!res.success) {
                this.commonService.openAlert("Error", res.message, "warning")
            }
            this.dataSource = res.data
        });
    }

    covertReadableString(headerName: string) {
        if (headerName == "ORG") {
            headerName = "For Organization";
        } else if (headerName == "SCHOOL") {
            headerName = " For School";
        }
        return headerName;
    }

    covertGujaratiString(headerName: string) {
        if (headerName == "ORG") {
            headerName = "સંસ્થા માટે";
        } else if (headerName == "SCHOOL") {
            headerName = "શાળા માટે";
        }
        return headerName;
    }

    getAvaillableSlot(data) {
        this.bookingService.getAvailableStots(data[0].code).subscribe(respData => {
            this.maxEndDate = moment(respData.data.endDate, "DD-MM-YYYY").toDate();
        })
    }

    /**
      * Method is used to send mail on submit
      * @param refNumber
      * @param eventType
      *
      */
    sendMail(refNumber: any, eventType: any) {
        if (refNumber) {
            this.bookingService.sendMail(refNumber, eventType).subscribe(resp => {
            }, err => {
                this.toster.error("Something went wrong");
            })
        } else {
            this.toster.error("Invalid request");
        }
    }

    termsConditionClick(event) {
        this.theaterBookingForm.controls['termsCondition'].setValue(event.checked);
    }

    /**
       * Get user data
       */
    getUserProfile() {
        this.bookingService.getUserProfile().subscribe(resp => {

            this.firstTheaterBookingForm.get('organizationEmail').setValue(resp.data.email);
            this.firstTheaterBookingForm.get('organizationNumber').setValue(resp.data.cellNo);
            this.firstTheaterBookingForm.get('confirmEmailID').setValue(resp.data.email);
            this.firstTheaterBookingForm.get('confirmMobile').setValue(resp.data.cellNo);

        },
            err => {
                this.toster.error("Server Error");
            });
    }

    handleErrorsOnSubmit(controlName) {
        const key = this.bookingUtils.getInvalidFormControlKey(controlName);
        const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 1;
        if (index) {
            this.tabIndex = index - 1;
            return false;
        }
    }

    checkValidation(controlName, isSubmitted) {
        if (controlName.invalid) {
            this.handleErrorsOnSubmit(controlName)
        } else if (controlName.value.organizationEmail != controlName.value.confirmEmailID) {
            this.handleErrorsOnSubmit(controlName)
        } else if (controlName.value.organizationNumber != controlName.value.confirmMobile) {
            this.handleErrorsOnSubmit(controlName)
        }  else {
            const organizationalAry = Object.keys(controlName.value);
            organizationalAry.forEach(element => {
                this.theaterBookingForm.get(element).setValue(controlName.get(element).value);
            });
            this.commonService.setValueToFromControl(controlName, this.theaterBookingForm);
            this.tabIndex = this.tabIndex + 1;
            if (isSubmitted) {
                this.submitTheaterApplication();
            }
        }
    }

    setFormControlToTabIndexMap() {
        // First tab
        this.formControlNameToTabIndex.set('organizationName', 1)
        this.formControlNameToTabIndex.set('organizationNumber', 1)
        this.formControlNameToTabIndex.set('confirmMobile', 1)
        this.formControlNameToTabIndex.set('organizationEmail', 1)
        this.formControlNameToTabIndex.set('confirmEmailID', 1)
        this.formControlNameToTabIndex.set('organizationAddress', 1)


        // second tab

        this.formControlNameToTabIndex.set('bankName', 2)
        this.formControlNameToTabIndex.set('accountHolderName', 2)
        this.formControlNameToTabIndex.set('accountNo', 2)
        this.formControlNameToTabIndex.set('ifscCode', 2)
    }

    clickProcess(event) {
        if (event.checked == true) {
            this.btnProceed = false;
        } else {
            this.btnProceed = true;
        }
    }

    covertGujaratinumber(headerName) {
        if (headerName == 1) {
            headerName = '૧'
        }
        else if (headerName == 2) {
            headerName = '૨'
        }
        else if (headerName == 2500) {
            headerName = '૨૫૦૦'
        }
        else if (headerName == 600) {
            headerName = '૬૦૦'
        }
        return headerName
    }

    selectLanguage(event) {
		this.btnProceed = true;
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}
}
