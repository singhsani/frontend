import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';

@Component({
	selector: 'app-town-hall-list',
	templateUrl: './town-hall-list.component.html',
	styleUrls: ['./town-hall-list.component.scss']
})
export class TownHallListComponent implements OnInit {


	searchTownHallForm: FormGroup;

	/**
	 * Town hall form Lookups
	 */
	townHalls: Array<any> = [];
	purposes: Array<any> = [];

	Dates: Array<any> = [
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'booked',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'temp',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'available',
			},
			shift2: {
				status: 'booked',
			},
			shift3: {
				status: 'temp',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'booked',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'temp',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'available',
			},
			shift2: {
				status: 'booked',
			},
			shift3: {
				status: 'temp',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'booked',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'temp',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'available',
			},
			shift2: {
				status: 'booked',
			},
			shift3: {
				status: 'temp',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'booked',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'temp',
			},
			shift2: {
				status: 'available',
			},
			shift3: {
				status: 'booked',
			}
		},
		{
			date: moment(new Date()).format("YYYY-MM-DD"),
			shift1: {
				status: 'available',
			},
			shift2: {
				status: 'booked',
			},
			shift3: {
				status: 'temp',
			}
		}
	];

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];

	translateKey: string = 'townHallListScreen';

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

		this.head_lines = `Online Town Hall Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municiple Corporation. You can
		view the availiblity details of the town hall and select select one of multiple shifts for
		booking. The booking is confirmed on the successfull online payment of the rent amount
		for selected shift(s).`

		this.createTownHallAvailiblityForm();

		this.getTownHallResourceList();

		this.purposes = [
			{ name: 'Natak', code: 'Natak' },
			{ name: 'Shsttriya Nrutya', code: 'Shsttriya Nrutya' },
			{ name: 'Ras Garbha', code: 'Ras Garbha' },
		];
	}

	createTownHallAvailiblityForm() {
		this.searchTownHallForm = this.fb.group({

			code: 'TOWNHALL-1',

			purpose: this.fb.group({
				code: null,
				name: null
			}),

			startDate: moment().add(1, 'day').format("YYYY-MM-DD"),
			endDate: moment().add(1, 'day').format("YYYY-MM-DD")

		});
	}

	getTownHallResourceList() {
		this.bookingService.getResourceList().subscribe(res => {
			this.townHalls = res.data;
			if (res.data.length) {
				this.searchTownHallForm.get('code').setValue(res.data[0].code);
				this.searchBooking();
			}
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	searchBooking() {
		let resourceName = this.searchTownHallForm.value.code;
		let date = moment(this.searchTownHallForm.value.date).format("YYYY-MM-DD");
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

	returnProperDate(date: string){
		let newDate = date.split("-");
		return newDate[2] + "-" + newDate[1] + "-" + newDate[0]
	}
}