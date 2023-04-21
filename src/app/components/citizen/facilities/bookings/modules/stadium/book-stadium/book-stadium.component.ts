import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
//import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import * as _ from 'lodash';

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
    bookingUtils: BookingUtils;

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
    applicationDetails : FormGroup;
    bankDetails : FormGroup;

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
    // BANKS: Array<any> = [];
    PURPOSES: Array<any> = [];
    CANCELLATION_TYPE: Array<any> = [];

    displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

    displayedColumnsFeeDetails: string[] = ['sno', 'programmePurpose', 'bookingRent', 'administrativeCharge', 'gst', 'deposit'];
    dataSource: Array<any> = [];

    startMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    endMinDate: Date = moment(new Date()).add(1, 'day').toDate();
    maxEndDate:any;
    totalAmount: number=0;
    Total: number=0;

    public formControlNameToTabIndex = new Map();
    constructor(private bookingService: BookingService,
        private router: Router,
        private _fb: FormBuilder, private toster: ToastrService,
        private modalService: BsModalService,
        private commonService: CommonService,
        protected toastr: ToastrService,
        protected formService: FormsActionsService) {
        this.bookingUtils = new BookingUtils(formService, toastr);
        this.bookingService.resourceType = this.bookingConstants.STADIUM_RESOURCE_TYPE;
    }

    ngOnInit() {
        /**
             * Static headlines
             */
        this.head_lines = `Online Stadium Booking facility is the convenient and
		easy way to book the Stadium of Vadodara Municipal Corporation. You can
    view the availability details of the stadium and select booking date.
    The booking is confirmed on the successfull online payment of the rent, administration charges, GST and deposit amount
    for selected date.`;

        this.createStadiumAvailiblityForm();
        this.createStadiumApplicationForm();
        this.getLookUpData();
        this.getResourceList();
        this.getFeesStructure();
        this.setFormControlToTabIndexMap();
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
     * This method is used to set endDate 3 months after the selected start date
     * @param date - selected start date
     */
    onDateChange(date){
        this.Dates = [];
        let futureMonth = moment(date).add(3, 'month');
        this.maxEndDate = moment(futureMonth).format("YYYY-MM-DD");
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
        /* Applicant Details */
        this.applicationDetails = this._fb.group({
            applicantName: [null, [Validators.required, Validators.maxLength(100)]],
            applicantMobile: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            confirmMobile: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            emailId: [null, [Validators.required, ValidationService.emailValidator]],
            confirmEmailId: [null, [Validators.required, ValidationService.emailValidator]],
            panCard:[null, ValidationService.panValidator],
            gstNo:[null, ValidationService.gstNoValidator],
            attachment: [null],
            applicantAddress: this._fb.group(this.addressComp.addressControls()),
            eventFromDate: null,
            eventToDate: null,
            programmePurpose: null,
        }),

        /* Bank Details */
        this.bankDetails = this._fb.group({
            bankName: this._fb.group({
              code: [null, [Validators.required]],
              name: null
            }),
            accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
            accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
            ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
            eventDetails: [null, Validators.required],
            termsCondition: null,
            agree: null,
        }),
        this.stadiumApplicationForm = this._fb.group({
            // accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
			// accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
            // applicantAddress: this._fb.group(this.addressComp.addressControls()),
            // applicantMobile: null,
            // confirmMobile: null,
            // applicantName: null,
            // attachment: null,
            // panCard:[null, ValidationService.panValidator],
            // gstNo:[null, ValidationService.gstNoValidator],
            // bankName: this._fb.group({
            //     code: [null, [Validators.required]],
            //     name: null
            // }),
            bookingDate: null,
            bookingFrom: null,
            // eventDetails: [null, Validators.required],
            bookingPurposeMaster: this._fb.group({
                code: [null, [Validators.required]],
                name: null
            }),
            bookingTo: null,
            cancelledDate: null,
            concessionPercentage: 0,
            concessionRequired: false,
			// emailId: [null, [Validators.required, ValidationService.emailValidator]],
			// confirmEmailId: [null, [Validators.required, ValidationService.emailValidator]],
            id: 3,
            // ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
            refNumber: null,
            resourceCode: null,
            resourceType: null,
            scheduleList: [],
            status: null,
            uniqueId: null,
            version: 0,
            termsCondition: null,
            agree: null,
            eventFromDate: null,
            eventToDate: null,
            // programmePurpose: null,
        });
        this.commonService.createCloneAbstractControl(this.applicationDetails,this.stadiumApplicationForm);
		this.commonService.createCloneAbstractControl(this.bankDetails,this.stadiumApplicationForm);		
    }

    /**
     * Getting lookup data for Stadium booking.
     */
    getLookUpData() {
        this.bookingService.getDataFromLookups().subscribe(resp => {
            // this.BANKS = resp.BANK;
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
            this.stadiumSearchForm.get('code').setValue(resp.data[0].name);
            this.stadiumSearchForm.get('code').disable();
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
                //resourceName: this.stadiumSearchForm.get('code').value,
                resourceName: this.STADIUMS[0].code,
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
            this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
        }
    }

    /**
     * Method is used to submit stadium application form.
     */
    submitStadiumApplication(): void {
      let errCount = this.bookingUtils.getAllErrors(this.stadiumApplicationForm);
        if (this.stadiumApplicationForm.invalid) {
            // this.handleErrorsOnSubmit(errCount);
            this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
            return;
        }
        else if (!this.bookingUtils.matcher(this.applicationDetails, 'emailId', 'confirmEmailId') || !this.bookingUtils.matcher(this.applicationDetails, 'applicantMobile', 'confirmMobile')) {
            // this.handleErrorsOnSubmit(7);
            this.commonService.openAlert("Field Error", !this.bookingUtils.matcher(this.applicationDetails, 'emailId', 'confirmEmailId') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
            return;
        } else if (!this.bankDetails.get('agree').value) {
            this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
            return;
        } else if (!this.bankDetails.get('termsCondition').value) {
            this.commonService.openAlert("Field Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
            return;
        } else {
            this.bookingService.commonBookSlot(this.stadiumApplicationForm.value).subscribe(resp => {
                if (resp.data.status == this.bookingConstants.SUBMITTED) {
                    this.commonService.commonAlert("Stadium Booking", "Your Application has been submitted.", "success", "Print Acknowledgement Receipt", false, '', pA => {
                        this.bookingService.printAcknowledgementReceipt(resp.data.refNumber).subscribe(acknowledgementHTML => {
                            let sectionToPrint: any = document.getElementById('sectionToPrint');
                            sectionToPrint.innerHTML = acknowledgementHTML;
                            let refNumber = this.stadiumApplicationForm.get('refNumber').value;
                          
                            setTimeout(() => {
                                window.print();
                                this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
                            },300);
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

                this.applicationDetails.get('programmePurpose').setValue(resp.data.bookingPurposeMaster.name);
                this.applicationDetails.get('programmePurpose').disable();
                this.showStadiumSearchForm = false;
                this.applicationDetails.patchValue(resp.data);
                this.bankDetails.patchValue(resp.data);
                this.stadiumApplicationForm.patchValue(resp.data);
                this.addressComp.getCountryLists();
                if (resp.data.status == this.bookingConstants.DRAFT) {
                    this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
                        this.applicationDetails.get('eventFromDate').setValue(payResp.data.EVENT_DATE_FROM);
                        this.applicationDetails.get('eventFromDate').disable();
                        this.applicationDetails.get('eventToDate').setValue(payResp.data.EVENT_DATE_TO);
                        this.applicationDetails.get('eventToDate').disable();
                        this.paymentObject = payResp.data;
                        this.Total=(parseFloat(this.paymentObject.RENT_FEES.replace(',', ''))+parseFloat(this.paymentObject.ADMINISTRATIVE_CHARGE.replace(',', ''))+parseFloat(this.paymentObject.GST.replace(',', '')));
                        this.totalAmount = (parseFloat(this.paymentObject.RENT_FEES.replace(',', ''))+parseFloat(this.paymentObject.GST.replace(',', ''))+parseFloat(this.paymentObject.DEPOSIT_FEES.replace(',', ''))+parseFloat(this.paymentObject.ADMINISTRATIVE_CHARGE.replace(',', '')));
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
    // handleErrorsOnSubmit(count) {
    //     let step1 = 4;
    //     let step2 = 11;
    //     let step3 = 17;
    //     if (count < step1) {
    //         this.tabIndex = 0;
    //         return false;
    //     } else if (count < step2) {
    //         this.tabIndex = 1;
    //         return false;
    //     } else if (count < step3) {
    //         this.tabIndex = 2;
    //         return false;
    //     }
    // }

    handleErrorsOnSubmit(controlName) {
        const key = this.bookingUtils.getInvalidFormControlKey(controlName);
        const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 1;
        if (index) {
          this.tabIndex = index -1 ;
          return false;
        }
      }

      /**
       * Get user data
       */
      getUserProfile() {
        this.bookingService.getUserProfile().subscribe(resp => {
            this.applicationDetails.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
            this.applicationDetails.get('applicantMobile').setValue(resp.data.cellNo);
            this.applicationDetails.get('confirmMobile').setValue(resp.data.cellNo);
            this.applicationDetails.get('emailId').setValue(resp.data.email);
            this.applicationDetails.get('confirmEmailId').setValue(resp.data.email);
          },
          err => {
            this.toster.error("Server Error");
          });
        this.applicationDetails.get('applicantAddress').get('country').setValue('INDIA');
        this.applicationDetails.get('applicantAddress').get('state').setValue('GUJARAT');
        this.applicationDetails.get('applicantAddress').get('city').setValue('Vadodara');
      }

      getFeesStructure(){
          this.bookingService.getFeesStructure().subscribe(res =>{
          if(!res.success){
            this.commonService.openAlert("Error", res.message, "warning")
           }
          this.dataSource = res.data
          });
        }

      covertReadableString(headerName: string) {
        var  str = _.startCase(headerName);
       return (headerName == "RELIGION_BASE_SEMINAR_CULTURAL") ? "RELIGION BASE/SEMINAR/CULTURAL" : str;
     }
     checkValidation(controlName,isSubmitted){
		if(controlName.invalid){
			this.handleErrorsOnSubmit(controlName)
		}else{
			const organizationalAry = Object.keys(controlName.value);
			organizationalAry.forEach(element => {
				this.stadiumApplicationForm.get(element).setValue(controlName.get(element).value);
			});
			this.commonService.setValueToFromControl(controlName,this.stadiumApplicationForm);
			this.tabIndex= this.tabIndex +1;
			if(isSubmitted){
				this.submitStadiumApplication(); 
			}
		}
	}

    setFormControlToTabIndexMap() {

        // First tab
        this.formControlNameToTabIndex.set('applicantName', 1)
        this.formControlNameToTabIndex.set('applicantMobile', 1)
        this.formControlNameToTabIndex.set('confirmMobile', 1)
        this.formControlNameToTabIndex.set('emailId', 1)
        this.formControlNameToTabIndex.set('confirmEmailId', 1)
        this.formControlNameToTabIndex.set('panCard', 1)
        this.formControlNameToTabIndex.set('gstNo', 1)
        this.formControlNameToTabIndex.set('applicantAddress',1)
    
    
        // second tab
        this.formControlNameToTabIndex.set('bankName', 2)
        this.formControlNameToTabIndex.set('accountHolderName', 2)
        this.formControlNameToTabIndex.set('accountNo', 2)
        this.formControlNameToTabIndex.set('ifscCode', 2)
        this.formControlNameToTabIndex.set('eventDetails',2)
        this.formControlNameToTabIndex.set('termsCondition',2)
        this.formControlNameToTabIndex.set('agree',2)
      }
}
