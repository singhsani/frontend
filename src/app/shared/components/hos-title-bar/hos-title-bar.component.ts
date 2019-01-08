import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'app-hos-title-bar',
	templateUrl: './hos-title-bar.component.html',
	styleUrls: ['./hos-title-bar.component.scss']
})
export class HosTitleBarComponent implements OnInit {
	@Input() title: string;

	constructor(
		private router: Router,
	) { }

	ngOnInit() {
	}

	/**
	 * This method is redirect to route based on selected tab
	 * @param code - number
	 */
	navigateToRouteByIndex(code) {
		this.router.navigateByUrl(ManageRoutes.getFullRoute(code));
	}
}
