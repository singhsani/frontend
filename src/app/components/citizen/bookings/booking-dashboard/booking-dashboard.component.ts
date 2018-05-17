import { Component, OnInit } from '@angular/core';
import { ManageRoutes } from '../../../../config/routes-conf';

@Component({
	selector: 'app-booking-dashboard',
	templateUrl: './booking-dashboard.component.html',
	styleUrls: ['./booking-dashboard.component.scss']
})
export class BookingDashboardComponent implements OnInit {

	manageRoutes:any = ManageRoutes;

	constructor() { }

	ngOnInit() {
	}

}
