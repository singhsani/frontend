import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { FormsActionsService } from '../../../../../../../core/services/citizen/data-services/forms-actions.service';

export interface BookingDetails {
	administrationCharges: string
	bookingDate: string
	electricCharges: any
	endTime: string
	gstAmount: any
	id: number
	rent: number
	shiftType: string
	showTax: number
	startTime: string
	subTotal: number
	total: string
	uniqueId: number
	version: number
}

@Component({
	selector: 'app-townhall-book',
	templateUrl: './townhall-book.component.html',
	styleUrls: ['./townhall-book.component.scss']
})
export class TownHallBookComponent implements OnInit {

	@ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
	@ViewChild('address') addressComp: any;
	@ViewChild('appAddress') appAddressComp: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	bookingConstants = BookingConstants;
	bookingUtils: BookingUtils;

	/**
	 * language translate key.
	 */
	translateKey: string = 'townHallCitizenScreen';

	/**
	 * form groups.
	 */
	searchTownHallForm: FormGroup;
	townHallApplicationForm: FormGroup;

	/**
	 * Town hall form Lookups
	 */
	townHalls: Array<any> = [];
	purposes: Array<any> = [];
	selectedShift: Array<any> = [];
	// BankOptions: Array<any> = [];

	paymentObject: any;

	/**
	 * steps labels
	 */
	stepLabel1: string = 'Organization Details'
	stepLabel2: string = 'Applicant Details'
	stepLabel3: string = 'Bank Account Details'

	tabIndex: number = 0;

	/**
	 * Minimum start date.
	 */
	startMinDate = moment(new Date()).add(1, 'day').toISOString();

	/**
	 * Minimum end date.
	 */
	endMinDate = moment(new Date()).add(1, 'day').toISOString();

	filteredReponse: any;

	/**
	 * Available Dates for Shortlist.
	 */
	Dates: Array<any> = [];
	endMaxDate:any = new Date();

	/**
	 * Bank Lookups
	 */

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

	bookingDetailsDataSource = new MatTableDataSource<BookingDetails>([]);

	// disableDateList: Array<any> = ['2018-08-01', '2018-09-02', '2018-08-03', '2018-08-15'];

	/**
	 * Used to show headlines.
	 */
	head_lines: string;

	/**
	 * Flages
	 */
	guideLineFlag: boolean = true;
	showApplicationForm: boolean = false;
	showSearchForm: boolean = false;
	showPaymentReciept: boolean = false;
	isLoadingResults: boolean = false;
	show:boolean = false;

	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router,
		private CD: ChangeDetectorRef,
		protected formService: FormsActionsService,
		protected toaster: ToastrService
	) {
		this.bookingUtils = new BookingUtils(formService, toaster);
		this.bookingService.resourceType = this.bookingConstants.TOWNHALL_RESOURCE_TYPE;
	}

	/**
	 * Method Initializes first after constructor.
	 */
	ngOnInit() {
		/**
		 * Static headlines
		 */
		this.head_lines = `Online Town Hall Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municpal Corporation. You can
		view the availiblity details of the town hall and select select one of multiple shifts for
		booking. The booking is confirmed on the successfull online payment of the rent amount
		for selected shift(s).`;
		this.createTownHallAvailiblityForm();
		this.createTownHallBookingApplicationForm();
		this.getTownHallResourceList();
		this.bookingLookups();
		/**
		 * Subscribe start date changes
		 */
		this.searchTownHallForm.controls.startDate.valueChanges.subscribe(data => {
			this.searchTownHallForm.controls.endDate.reset();
			this.endMinDate = data;
			return;
		});
	}


	loadGuideLine() {
		this.bookingService.loadGuideLine().subscribe(resp => {
			const w = window.open('about:blank');
			w.document.open();
			w.document.title = "Townhall Guide Line"
			w.document.write(resp);
			w.document.close();
		})
	}

	/**
	 * Method is used to create town hall search form.
	 */
	createTownHallAvailiblityForm() {
		this.searchTownHallForm = this.fb.group({
			code: [null, [Validators.required]],
			purpose: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
			startDate: [null, Validators.required],
			endDate: [null, Validators.required]
		});
	}

	/**
	 * Method is used to create townhall booking application form.
	 */
	createTownHallBookingApplicationForm() {
		console.log("hello");
		this.townHallApplicationForm = this.fb.group({
			/**
			 * Organization Details
			 */
			//
			organizationName: [null, [Validators.required]],
			orgTelephoneNo: [null, [Validators.required]],
			organizationPresidentName: [null, [Validators.required]],
			organizationAddress: this.fb.group(this.addressComp.addressControls()),
			gstNo :[null,ValidationService.gstNoValidator],
			programmeName : [null],
			/**
			 * Applicant Details
			 */
			applicantName: [null, [Validators.required]],
			applicantMobile: [null, [Validators.required]],
			confirmMobile: [null, [Validators.required]],
			emailID: [null, [Validators.required, ValidationService.emailValidator]],
			confirmEmailID: [null, [Validators.required, ValidationService.emailValidator]],
			relationshipWithOrg: [null, [Validators.required]],
			applicantAddress: this.fb.group(this.appAddressComp.addressControls()),
			/**
			 * Bank Accoount Details
			 */
			// bankName: this.fb.group({
			// 	code: [null, [Validators.required]]
			// }),
			// accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
			// accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
			// ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
			/**
			 * Booking Details
			 */
			programShortDetails: [null, [Validators.required]],
			programPurpose: [null, [Validators.required]],
			termsCondition: null,
			agree: null,
			/**
			 * form details
			 */
			id: null,
			idfcCode: null,
			refNumber: null,
			remarks: null,
			status: null,
			uniqueId: null,
			version: 0,
			bookingDate: [null, [Validators.required]],
			// bookingFrom: [null, [Validators.required]],
			// bookingTo: [null, [Validators.required]],
			cancelledDate: null,
			expiryTime: null,
			policePerformanceLicense: null,
			bookingPurposeMaster: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			})
		});
	}

	/**
	 * This method use for set the date in form controls
	 * @param date get the selected date value
	 */
	onDateChange(date) {
        let futureMonth = moment(date).add(3, 'month');
        this.endMaxDate = moment(futureMonth).format("YYYY-MM-DD");
	}

	/**
	 * Method is used to get all townhall resources list.
	 */
	getTownHallResourceList() {
		this.bookingService.getResourceList().subscribe(res => {
			this.townHalls = res.data;
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * Method is used to get all lookups
	 */
	bookingLookups() {
		this.bookingService.getDataFromLookups().subscribe(resp => {
			this.purposes = resp.PURPOSE;
			// this.BankOptions = resp.BANK;
		});
	}

	/**
	 * Method is used to get available slot wise townhalls.
	 */
	searchBooking() {
		this.selectedShift = [];
		if (this.searchTownHallForm.valid) {
			this.isLoadingResults = true;
			/**
		     * Filter Object to get list of available dates.
		     */
			let filterData = {
				resourceName: this.searchTownHallForm.get('code').value,
				startDate: moment(this.searchTownHallForm.get('startDate').value).format("YYYY-MM-DD"),
				endDate: moment(this.searchTownHallForm.get('endDate').value).format("YYYY-MM-DD"),
			}
			/**
			 * calling api to get all available slots.
			 */
			this.bookingService.getAllSlots(filterData).subscribe(resp => {
				this.filteredReponse = resp;
				let temp = resp.data.scheduleList;
				if (temp) {
					this.Dates = temp.sort((a, b) => {
						if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
							return 1
						} else {
							return -1
						}
					});

				} else {
					this.commonService.openAlertFormSaveValidation('Warning!', "Schedule List Not Found", 'warning');
				}
				this.availableStots = resp.data;
				this.isLoadingResults = false;
			}, err => {
				this.isLoadingResults = false;
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			});
		} else {
			this.bookingUtils.getAllErrors(this.searchTownHallForm);
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning', '', cb => {
				window.scrollTo(0, 0);
			})
		}
	}

	/**
	 * Method is used to shortlist all selected dates.
	 */
	shortlistShifts() {
		this.selectedShift.sort((a, b) => {
			if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
				return 1;
			} else {
				return -1;
			}
		});
	}

	/**
	 * Method is used to shortlist selected townhalls.
	 */
	confirmShortlist() {
		if (this.selectedShift.length > 0) {
			this.isLoadingResults = true;
			let shortListData = {
				resourceCode: this.filteredReponse.data.resourceCode,
				purposeOfBooking: this.searchTownHallForm.get('purpose').value,
				startDate: this.filteredReponse.data.startDate,
				endDate: this.filteredReponse.data.endDate,
				appointments: this.selectedShift.map(shifts => shifts.uniqueId)
			}
			this.bookingService.shortListBookings(shortListData).subscribe(resp => {
				this.showSearchForm = false;
				this.townHallApplicationForm.patchValue(resp.data);
				this.addressComp.getCountryLists();
				this.appAddressComp.getCountryLists();
				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						this.bookingDetailsDataSource.data = payResp.data.bookingDetails as BookingDetails[];
						this.CD.detectChanges();
						this.showPaymentReciept = true;
						this.CD.detectChanges();
						this.bookingDetailsDataSource.paginator = this.paginator;
						this.paginator.pageSize = 5;
						this.paginator.pageIndex = 0;
						this.isLoadingResults = false;
					});
				}
			}, (err) => {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				this.isLoadingResults = false;
			});
		} else {
			this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
		}
	}

	onChangePurposeOfBooking(event){
   
		if(event=='NATAK'){
		  this.show=true;
		  this.townHallApplicationForm.get('programmeName').setValidators([Validators.required]);
		}else{
		  this.show = false;
		}
	
	  }
	/**
	 * Method is used to submit townhall application form.
	 */
	submitTownhallApplication() {
		let errCount = this.bookingUtils.getAllErrors(this.townHallApplicationForm);
		if (this.townHallApplicationForm.invalid) {
			this.handleErrorsOnSubmit(errCount);
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
			return;
		}
		else if (!this.bookingUtils.matcher(this.townHallApplicationForm, 'emailID', 'confirmEmailID') || !this.bookingUtils.matcher(this.townHallApplicationForm, 'applicantMobile', 'confirmMobile')) {
			this.handleErrorsOnSubmit(7);
			this.commonService.openAlert("Field Error", !this.bookingUtils.matcher(this.townHallApplicationForm, 'emailID', 'confirmEmailID') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
			return;
		} else if (!this.townHallApplicationForm.get('agree').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
			return;
		} else if (!this.townHallApplicationForm.get('termsCondition').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
			return;
		} else {
			this.isLoadingResults = true;
			this.bookingService.commonBookSlot(this.townHallApplicationForm.value).subscribe(resp => {
			}, (err) => {
				this.isLoadingResults = false;
				if (err.status == 402) {
					this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway ,this.townHallApplicationForm, this.router);
					// this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService, this.townHallApplicationForm, this.router);
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
		/**
		 * No Of controls on perticular tab
		 */
		let step1 = 4;
		let step2 = 11;
		let step3 = 17;

		/**
		 * Redirection
		 */
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
        this.townHallApplicationForm.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
        this.townHallApplicationForm.get('emailID').setValue(resp.data.email);
        this.townHallApplicationForm.get('applicantMobile').setValue(resp.data.cellNo);
      },
      err => {
        this.toster.error("Server Error");
      });
    this.townHallApplicationForm.get('applicantAddress').get('country').setValue('INDIA');
    this.townHallApplicationForm.get('applicantAddress').get('state').setValue('GUJARAT');
    this.townHallApplicationForm.get('applicantAddress').get('city').setValue('Vadodara');
  }
}
