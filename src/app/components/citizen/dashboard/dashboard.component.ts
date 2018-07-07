import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	userServicesList: any;
	manageRoutes: any = ManageRoutes;
	services: any = [];

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

		/**
		 * catch application which should not be created by default.
		 */
		if (apiCode == 'HEL-BCR' || apiCode == 'HEL-DCR' || apiCode == 'HEL-NRCBR' || apiCode == 'HEL-NRCDR' || apiCode == 'HEL-DUPBR' || apiCode == 'HEL-DUPDR') {
			let redirectUrl = ManageRoutes.getFullRoute(apiCode);
			this.router.navigate([redirectUrl, false, apiCode]);
		} else {
			if (ManageRoutes.getApiTypeFromApiCode(apiCode)) {
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

	}

	getAllServices() {
		this.formService.getUserServices().subscribe(
			res => {
				this.userServicesList = res.modules;
				_.forEach(res.modules, (value, key) => {
					_.forEach(value.services, (value1, key1) => {
						this.services.push(value1);
					});
				});
			},
			err => {
				console.log(err);
			}
		);
	}

	getIconImg(moduleCode: string) {
		switch (moduleCode) {
			case 'SHOP-ESTAB':
				return 'assets/icons/shop-estab.png';
			case 'BIRTH-DEATH':
				return 'assets/icons/birth-death.png';
			case 'FIRE':
				return 'assets/icons/fire.png';
			case 'MUTTON-FISH-POND':
				return 'assets/icons/mutton-fish-pond.png';
			case 'PROPERTY-TAX':
				return 'assets/icons/property-tax.png';
			default:
				break;
		}
	}

	getIconClass(moduleCode: string) {
		switch (moduleCode) {
			case 'SHOP-ESTAB':
				return 'yelloCard';
			case 'BIRTH-DEATH':
				return 'redCard';
			case 'FIRE':
				return 'greenCard';
			case 'MUTTON-FISH-POND':
				return 'kyeBlueCard';
			case 'PROPERTY-TAX':
				return 'grayCard';
			default:
				break;
		}
	}
}