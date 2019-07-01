import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
// import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BookingService } from '../../../shared-booking/services/booking-service.service';

@Component({
    selector: 'app-book-theater',
    templateUrl: './book-theater.component.html',
    styleUrls: ['./book-theater.component.scss']
})
export class BookTheaterComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
    @ViewChild('address') addressComp: any;

    /**
       * Loading Booking Configuration
       */
    bookingUtils: BookingUtils = new BookingUtils();
    bookingConstants = BookingConstants;

	/**
	 * boolean flags to handle view.
	 */
    showTheaterBookingForm: boolean = false;
    showBookingInfo: boolean = false;
    showShortListData: boolean = false;
    showPaymentReciept: boolean = false;
    showTheaterSearchForm: boolean = true;

	/**
	 * Translation Key.
	 */
    translateKey = "citizenTheaterBookingScreen";

	/**
	 * Forms.
	 */
    searchTheaterForm: FormGroup;
    theaterBookingForm: FormGroup;

	/**
	 * LookUps & Arrays.
	 */
    THEATERS: Array<any> = [];
    CATEGORIES: Array<any> = [];
    availableStots: Array<any> = [];
    selectedShift: Array<any> = [];
    Dates: Array<any> = [];
    BANKS: Array<any> = [];


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

	/**
	 * Min date should be current date.
	 */
    startMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    endMinDate: Date = moment(new Date()).add(1, 'day').toDate();

    /**
       * ngx-bootstrap models.
       */
    confirmRef: BsModalRef;

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
        private toster: ToastrService,
        private commonService: CommonService,
        private modalService: BsModalService,
        private router : Router) { this.bookingService.resourceType = 'amphiTheater'; }

	/**
	 * Method Initialzes first.
	 */
    ngOnInit() {
        this.createSearchTheaterForm();
        this.createTheaterBookingForm();
        this.getResourceList();
        this.getLookUps();
        //this.getCategoryLookUps();

        /**
        * Subscribe changes of start date.
        */
        this.searchTheaterForm.controls.startDate.valueChanges.subscribe(data => {
            this.searchTheaterForm.controls.endDate.reset();
            this.endMinDate = data;
            return;
        })
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
                this.searchTheaterForm.get('code').setValue(res.data[0].code);
                this.bookingObject = res.data[0];
            }
            this.THEATERS = res.data;
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
            this.BANKS = respData.BANK;
        });
    }

	/**
	 * Method is used to craete theater booking form.
	 */
    createTheaterBookingForm() {
        this.theaterBookingForm = this.fb.group({
            /**
             * Organization Details
             */
            organizationName: [null, [Validators.required, Validators.maxLength(50)]],
            organizationNumber: [null, [Validators.required]],
            organizationEmail: [null, [Validators.required]],
            organizationAddress: this.fb.group(this.addressComp.addressControls()),
			/**
			 * Bank Accoount Details
			 */
            bankName: this.fb.group({
                code: [null, [Validators.required]]
            }),
            accountHolderName: [null, [Validators.required, Validators.maxLength(50)]],
            accountNo: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
            ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
			/**
			 * Booking Details
			 */
            termsCondition: null,
            agree: null,
			/**
			 * form details
			 */
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
        })
    }

	/**
	 * Method is used to filter slots on specific date.
	 */
    searchBooking() {
        this.selectedShift = [];
        if (this.searchTheaterForm.valid) {
            let filterData = {
                resourceName: this.searchTheaterForm.get('code').value,
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
                this.toster.error(err.error.message);
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
                    this.theaterBookingForm.patchValue(resp.data);
                    if (resp.data.status == this.bookingConstants.DRAFT) {
                        this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
                            this.paymentObject = payResp.data;
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
            this.handleErrorsOnSubmit(errCount);
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
                    this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService, this.theaterBookingForm, this.router);
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
    handleErrorsOnSubmit(count) {
        let step1 = 4;
        let step2 = 11;
        let step3 = 17;
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
}
