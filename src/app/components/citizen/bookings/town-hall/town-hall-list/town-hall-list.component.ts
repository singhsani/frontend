import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { BookingConstants, BookingUtils } from '../../config.enum';
import { ValidationService } from '../../../../../shared/services/validation.service';

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
	selector: 'app-town-hall-list',
	templateUrl: './town-hall-list.component.html',
	styleUrls: ['./town-hall-list.component.scss']
})
export class TownHallListComponent implements OnInit {


	@ViewChild('address') addressComp: any;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	bookingConstants = BookingConstants;
	bookingUtils: BookingUtils = new BookingUtils();

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
	BankOptions: Array<any> = [];

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

	/**
	 * Used to get slots month wise [very important].
	 */
	public DateArray = this.bookingUtils.DateArray



	filteredReponse: any;

	/**
	 * Available Dates for Shortlist.
	 */
	Dates: Array<any> = [];

	/**
	 * Bank Lookups
	 */

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

	bookingDetailsDataSource = new MatTableDataSource<BookingDetails>([]);

	disableDateList: Array<any> = ['2018-08-01', '2018-09-02', '2018-08-03', '2018-08-15'];

	/**
	 * used to disable specific date from calender.
	 */
	myFilter = (d: Date): boolean => {

		let date: any;
		let month: any;

		if (d.getDate().toString().length < 2) {
			date = '0' + d.getDate().toString()
		} else {
			date = d.getDate().toString()
		}

		if ((d.getMonth() + 1).toString().length < 2) {
			month = '0' + (d.getMonth() + 1).toString()
		} else {
			month = (d.getMonth() + 1).toString()
		}

		const day = d.getFullYear().toString() + "-" + month + "-" + date;

		return !this.disableDateList.includes(day);
	}

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



	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router,
		private CD: ChangeDetectorRef
	) {
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
		for selected shift(s).`

		this.createTownHallAvailiblityForm();

		this.createTownHallBookingApplicationForm();

		this.getTownHallResourceList();

		this.bookingLookups();
	}

	/**
	 * Method is used to change start date.
	 * @param event - date event.
	 */
	changeStartDate(event) {
		this.endMinDate = moment(event.target.value).add(1, 'day').toISOString();
		this.searchTownHallForm.get('endDate').setValue(this.endMinDate);
	}

	/**
	 * Method is used to get all lookups
	 */
	bookingLookups() {
		this.bookingService.getDataFromLookups().subscribe(resp => {
			this.purposes = resp.PURPOSE;
			this.BankOptions = resp.BANK;
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
			startDate: [moment(new Date()).add(1, 'day').toISOString(), Validators.required],
			endDate: [moment(new Date()).add(1, 'day').toISOString(), Validators.required]
		});
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
				this.Dates = temp.sort((a, b) => {
					if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
						return 1
					} else {
						return -1
					}
				});
				this.availableStots = resp.data;

				this.isLoadingResults = false;

			}, err => {
				this.isLoadingResults = false;

				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			});
		} else {
			this.bookingUtils.getAllErrors(this.searchTownHallForm);
			this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning', '', cb => {
				window.scrollTo(0, 0);
			})
		}
	}


	/**
	 * Selection Parts is being started from  here.
	 */
	filterMonths(): Array<any> {
		return this.DateArray.filter(month => this.Dates.find(d => d.key.split('-')[1] == month.id));
	}

	/**
	 * Method is used to check all date wise shifts in month.
	 * @param month - perticular month object.
	 */
	checkedAllinMonth(month) {
		let myArray = this.filterAcc(month.id);
		for (let i = 0; i < myArray.length; i++) {
			for (let j = 0; j < myArray[i].slotList.length; j++) {
				if (myArray[i].slotList[j].slotStatus == this.bookingConstants.AVAILABLE) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Method is used to select available shift.
	 * @param shift - shift object.
	 * @param checked - checked event
	 */
	selectShift(shift, checked) {

		if (checked) {
			let data = this.selectedShift.find(uniqueId => uniqueId == shift.uniqueId)
			if (!data) {
				shift.slotStatus = 'CHECKED';
				this.selectedShift.push(shift);
			}
		} else {
			let data = this.selectedShift.findIndex(uniqueId => uniqueId.uniqueId == shift.uniqueId);
			if (data > -1) {
				shift.slotStatus = this.bookingConstants.AVAILABLE;
				this.selectedShift.splice(data, 1);
			}
		}
	}

	/**
	 * Used to get shifts of perticular month
	 * @param id - month id
	 */
	filterAcc(id) {
		return this.Dates.filter(t => t.key.split('-')[1] == id);
	}

	/**
	 * Method is used to select all shifts in perticular month.
	 * @param checked - checked event
	 * @param month - perticular month
	 * @param i - index
	 */
	selectAllShiftsInMonth(checked, month, i): void {
		if (checked) {
			this.filterAcc(month.id).forEach(obj => {
				this.selectedShift = this.selectedShift.concat(obj.slotList.filter(status => status.slotStatus == 'AVAILABLE').map((data) => {
					data.slotStatus = 'CHECKED';
					return data;
				}))
			})
		} else {
			this.filterAcc(month.id).forEach(obj => {
				obj.slotList.forEach(nestObj => {
					let index = this.selectedShift.findIndex(myData => myData.uniqueId == nestObj.uniqueId);
					if (index > -1) {
						nestObj.slotStatus = this.bookingConstants.AVAILABLE;
						this.selectedShift.splice(index, 1)
					}
				})
			})
		}
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

				if (resp.data.status == this.bookingConstants.PAYMENT_REQUIRED) {

					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp;
						this.bookingDetailsDataSource.data = payResp.bookingDetails as BookingDetails[];
						this.CD.detectChanges();
						this.showPaymentReciept = true;
						this.CD.detectChanges();
						this.bookingDetailsDataSource.paginator = this.paginator;
						this.paginator.pageSize = 5;
						this.paginator.pageIndex = 0;
						this.isLoadingResults = false;
					})
				}
			}, (err) => {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				this.isLoadingResults = false;
			});
		} else {
			this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
		}
	}

	/**
	 * Method is used to shortlist all selected dates.
	 */
	shortlistShifts() {
		this.selectedShift = this.selectedShift.sort((a, b) => {
			if ((new Date(a.start.split(' ')[0]).getTime()) >= (new Date(b.start.split(' ')[0]).getTime())) {
				return 1;
			} else {
				return -1;
			}
		});
	}

	/**
	 * Method is used to remove selected townhalls.
	 * @param shift - shift with details
	 * @param index - index
	 */
	removeSelectedShift(shift, index) {
		this.selectShift(shift, false);
	}


	/**
	 * Used to show booking detaiis
	 */
	confirmPayment() {
		this.showPaymentReciept = false;
		this.showApplicationForm = true;
	}


	/**
	 * Method is used to create townhall booking application form.
	 */
	createTownHallBookingApplicationForm() {

		this.townHallApplicationForm = this.fb.group({

			/**
			 * Organization Details
			 */
			organizationName: [null, [Validators.required]],
			orgTelephoneNo: [null, [Validators.required]],
			organizationPresidentName: [null, [Validators.required]],
			organizationAddress: this.fb.group(this.addressComp.addressControls()),

			/**
			 * Applicant Details
			 */
			applicantName: [null, [Validators.required]],
			applicantMobile: [null, [Validators.required]],
			confirmMobile: [null, [Validators.required]],
			emailID: [null, [Validators.required, Validators.email]],
			confirmEmailID: [null, [Validators.required, Validators.email]],
			relationshipWithOrg: [null, [Validators.required]],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),


			/**
			 * Bank Accoount Details
			 */
			bankName: this.fb.group({
				code: [null, [Validators.required]]
			}),
			accountHolderName: [null, [Validators.required]],
			accountNo: [null, [Validators.required]],
			ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],

			/**
			 * Booking Details
			 */
			programShortDetails: [null, [Validators.required]],
			programPurpose: [null, [Validators.required]],

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
			bookingFrom: [null, [Validators.required]],
			bookingTo: [null, [Validators.required]],
			cancelledDate: null,
			expiryTime: null,
			policePerformanceLicense: null,
			bookingPurposeMaster: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
		})

	}

	/**
	 * Method is used to submit townhall application form.
	 */
	submitTownhallApplication() {
		let errCount = this.bookingUtils.getAllErrors(this.townHallApplicationForm);
		if (this.townHallApplicationForm.invalid) {
			this.handleErrorsOnSubmit(errCount);
			this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
			return;
		}
		else if (!this.emailMatcher() || !this.mobileNumberMatcher()) {
			this.handleErrorsOnSubmit(7);
			this.commonService.openAlert("Feild Error", !this.emailMatcher() ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
			return;
		} else {
			this.isLoadingResults = true;
			this.bookingService.commonBookSlot(this.townHallApplicationForm.value).subscribe(resp => {

				/**
				 * Response Data here 
				 */
			}, (err) => {
				this.isLoadingResults = false;
				if (err.status == 402) {
					this.bookingService.proceedForPayment(err.error.data);
				} else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
					this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
						this.router.navigate(['citizen/booking/cancel-booking'])
					})
				} else {
					this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				}
			})
			return;
		}
	}

	/**
	 * Method is used to match number and comfirm number.
	 */
	mobileNumberMatcher(): boolean {
		if (this.townHallApplicationForm.get('applicantMobile').value && this.townHallApplicationForm.get('confirmMobile').value) {
			return this.townHallApplicationForm.get('applicantMobile').value.toString() == this.townHallApplicationForm.get('confirmMobile').value.toString();
		}
		return false
	}

	/**
	 * Method is used to match email and confirm email.
	 */
	emailMatcher(): boolean {
		if (this.townHallApplicationForm.get('emailID').value && this.townHallApplicationForm.get('confirmEmailID').value) {
			return this.townHallApplicationForm.get('emailID').value.toString() == this.townHallApplicationForm.get('confirmEmailID').value.toString()
		}
		return false
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
}