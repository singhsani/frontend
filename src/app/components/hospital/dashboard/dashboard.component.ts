import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { HospitalConfig } from '../hospital-config';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class HospitalDashboardComponent implements OnInit {

	userServicesList: any;
	config : HospitalConfig = new HospitalConfig;
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
		if (apiCode == 'HEL-BCR-HOSPITAL'){
			this.router.navigate([ManageRoutes.getFullRoute(apiCode), false, apiCode]);
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

	getAllServices(){
		this.formService.getUserServices().subscribe(
			res => {
				this.userServicesList = res.modules;
			},
			err => {
				
			}
		);
	}

	getIconImg(moduleCode: string) {
		switch (moduleCode) {
			case 'SHOP-ESTAB':
				return { card: 'yelloCard', icon: 'assets/icons/shop-estab.png' };
			case 'BIRTH-DEATH':
				return { card: 'redCard', icon: 'assets/icons/birth-death.png' };
			case 'FIRE':
				return { card: 'greenCard', icon: 'assets/icons/fire.png' };
			case 'MUTTON-FISH-POND':
				return { card: 'kyeBlueCard', icon: 'assets/icons/mutton-fish-pond.png' };
			case 'PROPERTY-TAX':
				return { card: 'grayCard', icon: 'assets/icons/property-tax.png' };
			default:
				break;
		}
	}

}