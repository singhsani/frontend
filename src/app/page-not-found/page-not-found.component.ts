import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from './../shared/services/common.service';
import { ManageRoutes } from '../config/routes-conf';

@Component({
	selector: 'app-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

	constructor(
		private commonService: CommonService,
		private router: Router
	) { }

	ngOnInit() { }

	/**
	 * This method use for redirect to home
	 */
	redirectToHome() {
		if (this.commonService.getUserType() === 'HOSPITAL') {
			this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
		} else {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
	}

}
