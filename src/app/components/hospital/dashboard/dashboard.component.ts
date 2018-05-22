import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class HospitalDashboardComponent implements OnInit {

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
		private formService: HosFormActionsService,
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
				
			}
		);
	}

}