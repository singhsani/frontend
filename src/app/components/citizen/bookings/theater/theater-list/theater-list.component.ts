import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';

@Component({
	selector: 'app-theater-list',
	templateUrl: './theater-list.component.html',
	styleUrls: ['./theater-list.component.scss']
})
export class TheaterListComponent implements OnInit {

	searchTheaterForm: FormGroup;
	theaters: Array<any> = [];
	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router
	) {
		this.bookingService.resourceType = 'amphiTheater';
	}

	ngOnInit() {

		this.searchTheaterForm = this.fb.group({
			code: '',
			date: moment().add(1,'day').format("YYYY-MM-DD")
		});

		this.bookingService.getResourceList().subscribe(res => {
			this.theaters = res.data;
			if (res.data.length) {
				this.searchTheaterForm.get('code').setValue(res.data[0].code);
				this.searchBooking();
			}
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	searchBooking() {
		let resourceName = this.searchTheaterForm.value.code;
		let date = moment(this.searchTheaterForm.value.date).format("YYYY-MM-DD");
		this.bookingService.getAllSlots(resourceName, date).subscribe(res => {
			this.availableStots = res.data;
		}, err => {
			this.toster.error(err.error.message);
		});

	}

	bookSlots(uniqueId: string, index: number) {

		this.bookingService.bookSlot(uniqueId, '').subscribe(res => {
			this.searchBooking();
		}, err => {
			this.toster.error(err.message);
		});
	}

}
