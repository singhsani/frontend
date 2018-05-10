import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	userServicesList: any;
	manageRoutes: any = ManageRoutes;
	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
	 */
	constructor(
		private router: Router,
		private formService: FormsActionsService,
	) {
		this.getAllServices();
	}

	ngOnInit() {

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiCode: string) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.createFormData().subscribe(res => {
			let redirectUrl = ManageRoutes.getFullRoute(apiCode);
			this.router.navigate([redirectUrl, res.serviceFormId, apiCode]);
		});
	}

	getAllServices(){
		this.formService.getUserServices().subscribe(
			res => {
				this.userServicesList = res.modules;
			},
			err => {
				console.log(err);
			}
		);
	}

}