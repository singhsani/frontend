import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { ROUTESLIST } from '../../../config/routes-conf';
import * as _ from 'lodash';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
	 */
	constructor(
		private router: Router,
		private formService: FormsActionsService
	) {}

	ngOnInit() {

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiType: string, apiCode: string) {
		this.formService.apiType = apiType;
		this.formService.createFormData().subscribe(res => {
			let redirectUrl = _.get(ROUTESLIST, `${apiCode}.full`);
			this.router.navigate([redirectUrl, res.serviceFormId]);
		});
	}

}