import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { filter } from 'rxjs-compat/operator/filter';

import { CommonService } from '../../../../../shared/services/common.service';




@Component({
	selector: 'app-town-hall-list',
	templateUrl: './town-hall-list.component.html',
	styleUrls: ['./town-hall-list.component.scss']
})
export class TownHallListComponent implements OnInit {


	@ViewChild('address') addressComp: any;

	/**
	 * language translate key.
	 */
	translateKey: string = 'townHallListScreen';

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
	public DateArray = [
		{ month: 'Jan', id: '01', monthName: 'January' },
		{ month: 'Fab', id: '02', monthName: 'February' },
		{ month: 'Mar', id: '03', monthName: 'March' },
		{ month: 'Apr', id: '04', monthName: 'April' },
		{ month: 'May', id: '05', monthName: 'May' },
		{ month: 'Jun', id: '06', monthName: 'June' },
		{ month: 'Jul', id: '07', monthName: 'July' },
		{ month: 'Aug', id: '08', monthName: 'August' },
		{ month: 'Sep', id: '09', monthName: 'September' },
		{ month: 'Oct', id: '10', monthName: 'October' },
		{ month: 'Nov', id: '11', monthName: 'November' },
		{ month: 'Dec', id: '12', monthName: 'December' },
	];



	filteredReponse: any;

	/**
	 * Available Dates for Shortlist.
	 */
	Dates: Array<any> = [];

	/**
	 * Bank Lookups
	 */

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];
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


	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router
	) {
		this.bookingService.resourceType = 'townhall';
	}

	/**
	 * Method Initializes first after constructor.
	 */
	ngOnInit() {

		/**
		 * Static headlines
		 */
		this.head_lines = `Online Town Hall Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municiple Corporation. You can
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
			}, err => {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			});
		}
	}

	/**
	 * TODO Catch All Error
	 */
	AllError: Array<any> = [];

	/**
	 * Method is used to get All Error from Response.
	 */
	getAllErrors(form) {
		for (let controls in form.controls) {
			let control = form.get(controls)
			if (control instanceof FormControl) {
				if (control.invalid) {
					let ErrData = {
						controlName: controls,
					}
					this.AllError.push(ErrData);
				}
			} else if (control instanceof FormGroup) {
				this.getAllErrors(control)
			} else if (control instanceof FormArray) {
				control.controls.forEach(c => {
					if (c instanceof FormGroup) {
						this.getAllErrors(c);
					}
				});
			}
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
				if (myArray[i].slotList[j].slotStatus == 'AVAILABLE') {
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
				shift.slotStatus = 'AVAILABLE';
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
						nestObj.slotStatus = 'AVAILABLE';
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
			let shortListData = {
				resourceCode: this.filteredReponse.data.resourceCode,
				purposeOfBooking: this.searchTownHallForm.get('purpose').value,
				startDate: this.filteredReponse.data.startDate,
				endDate: this.filteredReponse.data.endDate,
				appointments: this.selectedShift.map(shifts => shifts.uniqueId)
			}

			this.bookingService.shortListTownHall(shortListData).subscribe(resp => {

				this.showSearchForm = false;

				this.townHallApplicationForm.patchValue(resp.data);

				if (resp.data.status == 'PAYMENT_REQUIRED') {

					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {

						this.paymentObject = payResp;

						this.showPaymentReciept = true;
					})
				}
			}, (err) => {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			});

		} else {
			this.toster.show("Please Select shifts");
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
			 * form details
			 */
			id: null,
			idfcCode: null,
			refNumber: "2018-08JRI",
			remarks: null,
			status: null,
			uniqueId: null,
			version: 0,

			/**
			 * Applicant Details
			 */
			applicantAddress: this.fb.group(this.addressComp.addressControls()),
			applicantMobile: [null, [Validators.required]],
			applicantName: [null, [Validators.required]],
			relationshipWithOrg: [null, [Validators.required]],
			emailID: [null, [Validators.required, Validators.email]],
			confirmMobile: [null, [Validators.required]],
			confirmEmailID: [null, [Validators.required, Validators.email]],

			/**
			 * Bank Accoount Details
			 */
			accountHolderName: [null, [Validators.required]],
			accountNo: [null, [Validators.required]],
			bankName: this.fb.group({
				code: [null, [Validators.required]]
			}),
			ifscCode: [null, [Validators.required]],

			/**
			 * Booking Details
			 */
			bookingDate: [null, [Validators.required]],
			bookingFrom: [null, [Validators.required]],
			bookingPurposeMaster: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),

			bookingTo: [null, [Validators.required]],
			cancelledDate: null,
			expiryTime: null,

			policePerformanceLicense: null,

			programPurpose: [null, [Validators.required]],
			programShortDetails: [null, [Validators.required]],

			/**
			 * Organization Details
			 */
			orgTelephoneNo: [null, [Validators.required]],
			organizationAddress: this.fb.group(this.addressComp.addressControls()),
			organizationName: [null, [Validators.required]],
			organizationPresidentName: [null, [Validators.required]],
		})

	}

	/**
	 * Method is used to submit townhall application form.
	 */
	submitTownhallApplication() {
		this.bookingService.commonBookSlot(this.townHallApplicationForm.value).subscribe(resp => {

			/**
			 * Response Data here 
			 */
		}, (err) => {

			/**
			 * Catch error here for payment (402)
			 */
			if (err.status === 402) {
				this.bookingService.proceedForPayment(err.error.data);
			} else {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			}
		})
	}

	/**
	 * Method is used to match number and comfirm number.
	 */
	mobileNumberMatcher(): boolean{
		if (this.townHallApplicationForm.get('applicantMobile').value && this.townHallApplicationForm.get('confirmMobile').value){
			return this.townHallApplicationForm.get('applicantMobile').value.toString() == this.townHallApplicationForm.get('confirmMobile').value.toString();
		}

		return false
	}

	/**
	 * Method is used to match email and confirm email.
	 */
	emailMatcher(): boolean {
		if (this.townHallApplicationForm.get('emailID').value && this.townHallApplicationForm.get('confirmEmailID').value){
			return this.townHallApplicationForm.get('emailID').value.toString() == this.townHallApplicationForm.get('confirmEmailID').value.toString()
		}
		return false
	}

	/**
	 * Method is used to return Date in format (DD-MM-YYYY)
	 * @param date 
	 */
	returnProperDate(date: string) {
		let newDate = date.split("-");
		return newDate[2] + "-" + newDate[1] + "-" + newDate[0]
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
		let step1 = 6;
		let step2 = 16;
		let step3 = 36;
		let step4 = 41;
		let step5 = 42;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step2) {
			this.tabIndex = 1;
			return false;
		} else if (count <= step3) {
			this.tabIndex = 2;
			return false;
		} else if (count <= step4) {
			this.tabIndex = 3;
			return false;
		} else if (count <= step5) {
			this.tabIndex = 4;
			return false;
		} else if (count >= 58 && count <= 64) {
			this.tabIndex = 3;
		}

	}
}