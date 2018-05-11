import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HttpService } from '../../../../../shared/services/http.service';
import { ManageRoutes } from '../../../../../config/routes-conf';

@Component({
	selector: 'app-town-hall-list',
	templateUrl: './town-hall-list.component.html',
	styleUrls: ['./town-hall-list.component.scss']
})
export class TownHallListComponent implements OnInit {

	searchTownHallForm: FormGroup;
	townHalls: Array<any> = [];
	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'bookingDate', 'start', 'end', 'slotStatus'];

	constructor(
		private fb: FormBuilder,
		private httpService: HttpService,
		private toster: ToastrService,
		private router: Router
	) {

	}

	ngOnInit() {

		this.searchTownHallForm = this.fb.group({
			code: 'TOWNHALL-2',
			date: moment().add(1,'day').format("YYYY-MM-DD")
		});

		this.httpService.get('api/booking/townhall/list').subscribe(res => {
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
		let date = moment(this.searchTownHallForm.value.date).format("YYYY-MM-DD")
		let apiURL = 'api/booking/townhall/slots?resource=' + this.searchTownHallForm.value.code + '&date=' + date;
		this.httpService.get(apiURL).subscribe(res => {
			this.availableStots = res.data;
		}, err => {
			this.toster.error(err.error.error_description);
		});

	}

	bookSlots(uniqueId: string, index: number) {
		//this.router.navigate([ManageRoutes.getFullRoute('TOWNHALLBOOK')]);
		this.httpService.post("api/booking/townhall/slot/book", {
			uuid: uniqueId
		}).subscribe(res => {
			this.searchBooking()
		}, err => {
			this.toster.error(err.error.error_description);
		});
	}

}