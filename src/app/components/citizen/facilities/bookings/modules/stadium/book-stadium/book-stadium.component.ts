import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
//import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../shared-booking/services/booking-service.service';

@Component({
    selector: 'app-book-stadium',
    templateUrl: './book-stadium.component.html',
    styleUrls: ['./book-stadium.component.scss']
})
export class BookStadiumComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
    @ViewChild('address') addressComp: any;


    /**
     * instance variable for stadium booking facility.
     */
    translateKey: string = "citizenStadiumScreen";
    guideLineFlag: boolean = true;
    head_lines: string;

    /**
     * Booking Constants and utils
     */
    bookingConstants = BookingConstants;
    bookingUtils: BookingUtils = new BookingUtils();

    /**
     * Flags for hide/show
     */
    showStadiumSearchForm: boolean = false;
    showPaymentReciept: boolean = false;
    showStadiumApplicationForm: boolean = false;

    /**
     * Forms declaration
     */
    stadiumSearchForm: FormGroup;
    stadiumApplicationForm: FormGroup;

    /**
     * resources
     */
    STADIUMS: Array<any> = [];

    /**
     * Local Arrays and Maps
     */

    selectedShift: Array<any> = [];
    filteredReponse: any;
    paymentObject: any;
    Dates: Array<any> = [];
    availableStots: Array<any> = []
    tabIndex: number = 0;

    /**
       * ngx-bootstrap models.
       */
    confirmRef: BsModalRef;


    /**
     * LookUps Constants
     */
    BANKS: Array<any> = [];
    PURPOSES: Array<any> = [];
    CANCELLATION_TYPE: Array<any> = [];

    displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

    startMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    endMinDate: Date = moment(new Date()).add(1, 'day').toDate();


    constructor(private bookingService: BookingService,
        private router: Router,
        private _fb: FormBuilder, private toster: ToastrService,
        private modalService: BsModalService,
        private commonService: CommonService) {
        this.bookingService.resourceType = this.bookingConstants.STADIUM_RESOURCE_TYPE;
    }

    ngOnInit() {
        /**
             * Static headlines
             */
        this.head_lines = `Online Stadium Booking facility is the convenient and
		easy way to book the Stadium of Vadodara Municpal Corporation. You can
    view the availiblity details of the stadium and select booking date.
    The booking is confirmed on the successfull online payment of the rent amount
    for selected date`;

        this.createStadiumAvailiblityForm();
        this.createStadiumApplicationForm();
        this.getLookUpData();
        this.getResourceList();

        /**
         * Subscribe changes of start date.
         */
        this.stadiumSearchForm.controls.startDate.valueChanges.subscribe(data => {
            this.stadiumSearchForm.controls.endDate.reset();
            this.endMinDate = data;
            return;
        })
    }


    /**
       * Method is used to create town hall search form.
       */
    createStadiumAvailiblityForm() {
        this.stadiumSearchForm = this._fb.group({
            code: [null, [Validators.required]],
            purpose: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]]
        });
    }

    createStadiumApplicationForm() {
        this.stadiumApplicationForm = this._fb.group({
            accountHolderName: null,
            accountNo: null,
            applicantAddress: this._fb.group(this.addressComp.addressControls()),
            applicantMobile: null,
            confirmMobile: null,
            applicantName: null,
            attachment: null,
            bankName: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),
            bookingDate: null,
            bookingFrom: null,
            bookingPurposeMaster: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),
            bookingTo: null,
            cancelledDate: null,
            concessionPercentage: 0,
            concessionRequired: false,
            emailId: null,
            confirmEmailId: null,
            id: 3,
            ifscCode: null,
            refNumber: null,
            resourceCode: null,
            resourceType: null,
            scheduleList: [],
            status: null,
            uniqueId: null,
            version: 0,
            termsCondition: null,
            agree: null,
        });
    }

    /**
     * Getting lookup data for Stadium booking.
     */
    getLookUpData() {
        this.bookingService.getDataFromLookups().subscribe(resp => {
            this.BANKS = resp.BANK;
            this.CANCELLATION_TYPE = resp.CANCELLATION_TYPE;
            this.PURPOSES = resp.PURPOSE;
        });
    }

    /**
     * Get All Resource List Of Stadium.
     */
    getResourceList() {
        this.bookingService.getResourceList().subscribe(resp => {
            this.STADIUMS = resp.data;
        })
    }

    /**
       * Method is used to get available stadium.
       */
    searchBooking() {
        this.selectedShift = [];
        if (this.stadiumSearchForm.valid) {
			/**
		    * Filter Object to get list of available dates.
		    */
            let filterData = {
                resourceName: this.stadiumSearchForm.get('code').value,
                startDate: moment(this.stadiumSearchForm.get('startDate').value).format("YYYY-MM-DD"),
                endDate: moment(this.stadiumSearchForm.get('endDate').value).format("YYYY-MM-DD"),
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
            this.bookingUtils.getAllErrors(this.stadiumSearchForm);
            this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
        }
    }

    /**
     * Method is used to submit stadium application form.
     */
    submitStadiumApplication(): void {
        let errCount = this.bookingUtils.getAllErrors(this.stadiumApplicationForm);
        if (this.stadiumApplicationForm.invalid) {
            this.handleErrorsOnSubmit(errCount);
            this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
            return;
        }
        else if (!this.bookingUtils.matcher(this.stadiumApplicationForm, 'emailId', 'confirmEmailId') || !this.bookingUtils.matcher(this.stadiumApplicationForm, 'applicantMobile', 'confirmMobile')) {
            this.handleErrorsOnSubmit(7);
            this.commonService.openAlert("Feild Error", !this.bookingUtils.matcher(this.stadiumApplicationForm, 'emailId', 'confirmEmailId') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
            return;
        } else if (!this.stadiumApplicationForm.get('agree').value) {
            this.commonService.openAlert("Feild Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
            return;
        } else if (!this.stadiumApplicationForm.get('termsCondition').value) {
            this.commonService.openAlert("Feild Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
            return;
        } else {
            this.bookingService.commonBookSlot(this.stadiumApplicationForm.value).subscribe(resp => {
                if (resp.data.status == this.bookingConstants.SUBMITTED) {
                    this.commonService.commonAlert("Stadium Booking", "Stadium Booked Successfully", "success", "Print Acknowledgement Receipt", false, '', pA => {
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
                this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
            })
            return;
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
        this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray .modal-md' }));
    }

    /**
       * Method is used to shortlist selected townhalls.
       */
    confirmShortlist() {
        if (this.selectedShift.length > 0) {
            let shortListData = {
                resourceCode: this.filteredReponse.data.resourceCode,
                purposeOfBooking: this.stadiumSearchForm.get('purpose').value,
                startDate: this.filteredReponse.data.startDate,
                endDate: this.filteredReponse.data.endDate,
                appointments: this.selectedShift.map(shifts => shifts.uniqueId)
            }
            this.bookingService.shortListBookings(shortListData).subscribe(resp => {
                this.showStadiumSearchForm = false;
                this.stadiumApplicationForm.patchValue(resp.data);
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
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
    onTabChange(evt) {
        this.tabIndex = evt;
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
