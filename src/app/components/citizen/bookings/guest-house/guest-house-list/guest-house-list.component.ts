import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../shared-booking/services/booking-service.service';
//import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';

@Component({
	selector: 'app-guest-house-list',
	templateUrl: './guest-house-list.component.html',
	styleUrls: ['./guest-house-list.component.scss']
})
export class GuestHouseListComponent implements OnInit {

	translateKey: string = 'guestHouseScreen';

	searchGuestHouseForm: FormGroup;
	guestHouses: Array<any> = [];
	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router
	) {
		this.bookingService.resourceType = 'guesthouse';
	}

	ngOnInit() {

		this.searchGuestHouseForm = this.fb.group({
			code: '',
			startDate: moment().format("YYYY-MM-DD"),
			endDate: moment().format("YYYY-MM-DD")
		});

		this.bookingService.getResourceList().subscribe(res => {
			this.guestHouses = res.data;
			if (res.data.length) {
				this.searchGuestHouseForm.get('code').setValue(res.data[0].code);
				//this.searchBooking();
			}
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	searchBooking() {
		let resourceName = this.searchGuestHouseForm.value.code;
		let startdate = moment(this.searchGuestHouseForm.value.startDate).format("YYYY-MM-DD");
		let enddate = moment(this.searchGuestHouseForm.value.endDate).format("YYYY-MM-DD");

		this.bookingService.getGuestHouseSlots(resourceName, startdate, enddate).subscribe(res => {
			this.availableStots = res.data;
		}, err => {
			this.toster.error(err.error.message);
		});

	}

	bookSlots() {

		let resourceName = this.searchGuestHouseForm.value.code;
		let startdate = moment(this.searchGuestHouseForm.value.startDate).format("YYYY-MM-DD");
		let enddate = moment(this.searchGuestHouseForm.value.endDate).format("YYYY-MM-DD");
		this.bookingService.bookGuestHouseSlot(resourceName, startdate, enddate, '').subscribe(res => {
			//this.searchBooking();
			this.toster.success("Selected Guest House has been booked");
		}, err => {
			this.toster.error(err.message);
		});
	}

}
