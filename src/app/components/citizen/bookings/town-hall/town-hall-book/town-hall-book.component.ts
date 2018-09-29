import { Component, OnInit } from '@angular/core';



@Component({
	selector: 'app-town-hall-book',
	templateUrl: './town-hall-book.component.html',
	styleUrls: ['./town-hall-book.component.scss']
})
export class TownHallBookComponent implements OnInit {
	//townHallBookingForm: FormGroup;

	constructor(
		// private fb: FormBuilder,
		// private httpService: HttpService,
		// private toster: ToastrService
	) {

	}

	ngOnInit() {
		// this.townHallBookingForm = this.fb.group({
		// 	code: 'TOWNHALL-2',
		// 	date: moment().format("YYYY-MM-DD")
		// });
	}
}