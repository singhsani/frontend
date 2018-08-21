import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { SessionStorageService } from 'angular-web-storage';
import { BookingService } from '../../../../core/services/citizen/data-services/booking.service';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
	selector: 'app-cancel-booking',
	templateUrl: './cancel-booking.component.html',
	styleUrls: ['./cancel-booking.component.scss']
})
export class CancelBookingComponent implements OnInit {

	searchBookingsForm: FormGroup;
	resources: Array<any> = [];
	bookingList: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'status', 'action'];
	translateKey: string = 'cancelBookingScreen';

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router,
		private session: SessionStorageService,
		private commonService: CommonService
	) {
		let resourcesList = [
			{
				type: 'townhall',
				name: 'Townhall'
			},
			{
				type: 'stadium',
				name: 'Stadium'
			},
			{
				type: 'amphiTheater',
				name: 'Amphi Theater'
			},
			{
				type: 'guesthouse',
				name: 'Guest House'
			}
		]
		this.resources = resourcesList;
	}

	ngOnInit() {

		this.searchBookingsForm = this.fb.group({
			resourceType: 'townhall',
		});

		this.bookingService.resourceType = this.searchBookingsForm.get('resourceType').value;

		this.getAllBooking();
	}

	getAllBooking() {

		this.bookingService.resourceType = this.searchBookingsForm.get('resourceType').value;

		this.bookingService.getMyBookings().subscribe(
			res => {
				this.bookingList = res.data;
			},
			err => {
				this.toster.error(err.error.message);
			}
		);

		console.log(this.bookingList);

	}

	cancelBooking(refNumber: string) {


		this.commonService.submitAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.bookingService.cancelBookedSlot(refNumber, '').subscribe(res => {
				this.toster.success('Booking has been Cancelled');
				this.getAllBooking();
			}, err => {
				this.toster.error(err.error.message);
			});
		});
	}

	diffr(date) {
		var now = moment(new Date());
		var end = moment(date);
		return end.diff(now, 'minutes');
	}

	/**
	 * This method is use to get respective class name based on application status.
	 * @param filestatus - Application Status
	 */
	getRowClass(data: any) {

		let className = '';

		if (this.diffr(data.slot.end) <= 0)
			className = 'bg-info';
		if (data.status == 'Booked' && (this.diffr(data.slot.end) > 0))
			className = 'bg-warning';
		if (data.status == 'Cancelled')
			className = 'bg-danger';

		return className;
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
