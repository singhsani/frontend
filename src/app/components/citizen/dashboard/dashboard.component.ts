import { PaginationService } from './../../../core/services/citizen/data-services/pagination.service';
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
	isRecentApp: boolean = false;
	recentApp: any;
	bookingsAndTicketings: any = [
		{
			"id": 1,
			"uniqueId": null,
			"version": null,
			"code": "BOOKINGMODULE",
			"fieldView": "ALL",
			"fieldList": null,
			"name": "Booking Facilities",
			"gujName": "Booking Facilities",
			"services": [
				{
					"code": "TOWNHALLLIST",
					"fieldView": "ALL",
					"name": "Town Hall",
					"gujName": "ટાઉનહોલ",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "GUESTHOUSELIST",
					"fieldView": "ALL",
					"name": "Guest House",
					"gujName": "અતિથિગૃહ",
					"appointmentRequired": false,
					"active": true
				}
			]
		},
		{
			"id": 2,
			"uniqueId": null,
			"version": null,
			"code": "BOOKINGMODULE",
			"fieldView": "ALL",
			"fieldList": null,
			"name": "Ticketing Facilities",
			"gujName": "Ticketing Facilities",
			"services": [
				{
					"code": "ZOO",
					"fieldView": "ALL",
					"name": "Zoo",
					"gujName": "પ્રાણી સંગ્રહાલય",
					"appointmentRequired": false,
					"active": false
				}
			]
		},
		{
			"id": 3,
			"uniqueId": null,
			"version": null,
			"code": "BOOKINGMODULE",
			"fieldView": "ALL",
			"fieldList": null,
			"name": "My Bookings",
			"gujName": "My Bookings",
			"services": [
				{
					"code": "CANCELBOOKING",
					"fieldView": "ALL",
					"name": "My Bookings",
					"gujName": "My Bookings",
					"appointmentRequired": false,
					"active": true
				}
			]
		}
	];

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
	 */
	constructor(
		private router: Router,
		private formService: FormsActionsService,
		private toastr: ToastrService,
		private paginationService: PaginationService,
	) {
		this.getAllServices();
	}

	ngOnInit() {
		this.paginationService.apiType = 'myApps';
		this.paginationService.pageIndex = 1;
		this.paginationService.pageSize = 2;
		this.paginationService.getAllData().subscribe(data => {
			if (data.totalRecords > 0) {
				this.isRecentApp = true;
				this.recentApp = data.data;
			} else {
				this.isRecentApp = false;
				this.recentApp = [];
			}
		});

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiCode: string) {

		switch (apiCode) {
			case 'HEL-BCR':
			case 'HEL-DCR':
			case 'HEL-NRCBR':
			case 'HEL-NRCDR':
			case 'HEL-DUPBR':
			case 'HEL-DUPDR':
			case 'SHOP-REN':
			case 'SHOP-TRAF':
			case 'SHOP-CAN':
			case 'SHOP-DUP':
			case 'MF-REN':
			case 'MF-TRA':
			case 'MF-DUP':
			case 'MF-CAN':
			case 'APL-REN':
			case 'APL-TRA':
			case 'APL-CAN':
			case 'APL-DUP':
			case 'FL-REN':
			case 'FL-MODIFY':
			case 'FL-DUP':
			case 'FS-FINAL':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode),false, apiCode]);
			break;
			default:
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
				break;
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