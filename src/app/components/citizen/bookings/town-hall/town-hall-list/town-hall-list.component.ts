import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { filter } from 'rxjs-compat/operator/filter';

@Component({
	selector: 'app-town-hall-list',
	templateUrl: './town-hall-list.component.html',
	styleUrls: ['./town-hall-list.component.scss']
})
export class TownHallListComponent implements OnInit {

	@ViewChild('address') addressComp: any;
	

	/**
	 * town hall search form group.
	 */
	searchTownHallForm: FormGroup;

	townHallApplicationForm: FormGroup;

	showApplicationForm: boolean = false;

	showSearchForm: boolean = false;

	showPaymentReciept: boolean = false;

	paymentObject: any;
	


	/**
	 * language translate key.
	 */
	translateKey: string = 'townHallListScreen';

	/**
	 * Town hall form Lookups
	 */
	townHalls: Array<any> = [];
	purposes: Array<any> = [];
	selectedShift: Array<any> = [];


	filteredReponse: any;

	/**
	 * Available Dates for Shortlist.
	 */
	Dates: Array<any> = [];

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];


	disableDateList: Array<any> = ['2018-08-01', '2018-09-02', '2018-08-03', '2018-08-15'];

	/**
	 * used to disable specific date frm calender.
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

	head_lines: string;
	/**
	 * Flages
	 */

	guideLineFlag: boolean = true;

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router
	) {
		this.bookingService.resourceType = 'townhall';
	}

	ngOnInit() {

		

		//static data.
		this.head_lines = `Online Town Hall Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municiple Corporation. You can
		view the availiblity details of the town hall and select select one of multiple shifts for
		booking. The booking is confirmed on the successfull online payment of the rent amount
		for selected shift(s).`

		this.createTownHallAvailiblityForm();

		this.createTownHallBookingApplicationForm();
		

		
		

		this.getTownHallResourceList();

		this.purposes = [
			{ name: 'Natak', code: 'Natak' },
			{ name: 'Shsttriya Nrutya', code: 'Shsttriya Nrutya' },
			{ name: 'Ras Garbha', code: 'Ras Garbha' },
		];

	}

	createTownHallAvailiblityForm() {
		this.searchTownHallForm = this.fb.group({

			code: ['TOWNHALL-1', Validators.required],

			purpose: this.fb.group({
				code: [null, Validators.required],
				name: null
			}),

			startDate: [null, Validators.required],

			endDate: [null, Validators.required]

		});
	}

	getTownHallResourceList() {
		this.bookingService.getResourceList().subscribe(res => {
			this.townHalls = res.data;
			// if (res.data.length) {
			// 	this.searchTownHallForm.get('code').setValue(res.data[0].code);
			// 	this.searchBooking();
			// }
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * Method is used 
	 */
	searchBooking() {

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
			this.toster.error(err.error.message);
		});

	}

	/**
	 * Method is used to select available shift.
	 * @param shift - shift object.
	 * @param checked - checked event
	 * @param index - index of element
	 */
	selectShift(shift, checked, index) {
		if (checked) {
			let data = this.selectedShift.find(uniqueId => uniqueId == shift.uniqueId)
			if (!data) {
				this.selectedShift.push(shift.uniqueId)
			}
		} else {
			let data = this.selectedShift.findIndex(uniqueId => uniqueId == shift.uniqueId);
			if (data > -1) {
				this.selectedShift.splice(data, 1)
			}
		}
	}

	/**
	 * Method is used to shortlist all selected dates.
	 */
	shortlistShifts() {

		let shortListData = {
			resourceCode: this.filteredReponse.data.resourceCode,
			purposeOfBooking: this.searchTownHallForm.get('purpose').value,
			startDate: this.filteredReponse.data.startDate,
			endDate: this.filteredReponse.data.endDate,
			appointments: this.selectedShift
		}


		this.bookingService.shortListTownHall(shortListData).subscribe(resp => {

			this.showSearchForm = false;

			console.log(resp.data);

			this.townHallApplicationForm.patchValue(resp.data);


		}, (err) => {




			
			if(err.status == 402){

				this.bookingService.searchPayment(err.error.data.refNumber).subscribe(payResp => {

					this.paymentObject = payResp;

					this.showPaymentReciept = true;

				})
			}
		});
	}


	confirmPayment(){
		this.showPaymentReciept = false;
		this.showApplicationForm = true;
	}

	bookSlots(uniqueId: string, index: number) {

		this.bookingService.bookSlot(uniqueId, '').subscribe(res => {
			this.searchBooking();
		}, err => {
			this.toster.error(err.message);
		});
	}

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
			applicantMobile: null,
			applicantName: null,
			relationshipWithOrg: null,
			emailID: null,
			
			/**
			 * Bank Accoount Details
			 */
			accountHolderName: null,
			accountNo: null,
			bankName: null,
			
			/**
			 * Booking Details
			 */
			bookingDate: "20-06",
			bookingFrom: "20-07",
			bookingPurposeMaster: null,
			bookingTo: "20-11",
			cancelledDate: null,
			expiryTime: "2018-08-06 :47",
			policePerformanceLicense: null,
			programPurpose: null,
			programShortDetails: null,

			/**
			 * Organization Details
			 */
			orgTelephoneNo: null,
			organizationAddress: this.fb.group(this.addressComp.addressControls()),
			oraganizationName: null,
			organizationPresidentName: null,
		})

	}

	submitTownhallApplication(){

		this.bookingService.commonBookSlot(this.townHallApplicationForm.value).subscribe(resp => {
			console.log(resp);
			//redirect to payment gateway.
		})

	}

	/**
	 * Method is used to return Date in format (DD-MM-YYYY)
	 * @param date 
	 */
	returnProperDate(date: string) {
		let newDate = date.split("-");
		return newDate[2] + "-" + newDate[1] + "-" + newDate[0]
	}
}