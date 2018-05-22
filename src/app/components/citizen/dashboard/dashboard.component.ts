import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

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
		private toastr: ToastrService
	) {
		this.getAllServices();
	}

	ngOnInit() {

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiCode: string) {
		if (ManageRoutes.getApiTypeFromApiCode(apiCode)){
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.createFormData().subscribe(res => {
				let redirectUrl = ManageRoutes.getFullRoute(apiCode);
				this.router.navigate([redirectUrl, res.serviceFormId, apiCode]);
			});
		} else {
			// todo 
			this.toastr.error("Invalid API Code");
		}
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

	foods = [
		{value: '1', viewValue: 'Steak'},
		{value: '2', viewValue: 'Pizza'},
		{value: '3', viewValue: 'Tacos'}
	  ];

}