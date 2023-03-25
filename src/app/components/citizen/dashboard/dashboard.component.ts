import { PaginationService } from './../../../core/services/citizen/data-services/pagination.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShopAndEstablishmentService } from '../licences/shop-and-establishment/common/services/shop-and-establishment.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

	userServicesList: any;
	manageRoutes: any = ManageRoutes;
	services: any = [];
	isRecentApp: boolean = false;
	recentApp: any;
	showModuleServices = false;
	showBookingServices = false;
	// bookingsAndTicketings = [];
	bookingsAndTicketings: any = [
		{
			"id": 1,
			"uniqueId": null,
			"version": null,
			"code": "BOOKINGMODULE",
			"fieldView": "ALL",
			"fieldList": null,
			"name": "Booking/Ticketing Facilities",
			"gujName": "Booking Facilities",
			"services": [

				{
					"code": "MYBOOKING",
					"fieldView": "ALL",
					"name": "My Bookings",
					"gujName": "My Bookings",
					"appointmentRequired": false,
					"active": true
				},

				{
					"code": "TOWNHALLBOOK",
					"fieldView": "ALL",
					"name": "Townhall",
					"gujName": "ટાઉનહોલ",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "THEATERBOOK",
					"fieldView": "ALL",
					"name": "Amphi Theatre",
					"gujName": "એમ્ફી થિયેટર",
					"appointmentRequired": false,
					"active": true
				},
				// {
				// 	"code": "GUESTHOUSELIST",
				// 	"fieldView": "ALL",
				// 	"name": "Guest House",
				// 	"gujName": "અતિથિગૃહ",
				// 	"appointmentRequired": false,
				// 	"active": true
				// },
				{
					"code": "STADIUMBOOK",
					"fieldView": "ALL",
					"name": "Stadium",
					"gujName": "સ્ટેડિયમ",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "ATITHIGRUHBOOK",
					"fieldView": "ALL",
					"name": "Atithigruh",
					"gujName": "અતિથિગ્રહ",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "CHILDRENTHEATERBOOK",
					"fieldView": "ALL",
					"name": "Children Theatre",
					"gujName": "બાળકો થિયેટર",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "BOOKPERMISSION",
					"fieldView": "ALL",
					"name": "Shooting Permission",
					"gujName": "પરવાનગી",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "SWIMMINGPOOL",
					"fieldView": "ALL",
					"name": "Swimming Pool",
					"gujName": "સ્નાનાગાર",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "SWIMMINGPOOLRENEWAL",
					"fieldView": "ALL",
					"name": "Swimming Pool Renewal",
					"gujName": "સ્નાનાગાર",
					"appointmentRequired": false,
					"active": true
				},
				// {
				// 	"code": "SWIMMINGPOOLDASHBOARD",
				// 	"fieldView": "ALL",
				// 	"name": "Swimming-Pool-Dashboard",
				// 	"gujName": "સ્નાનાગાર",
				// 	"appointmentRequired": false,
				// 	"active": true
				// },
        {
					"code": "MYTICKETINGS",
					"fieldView": "ALL",
					"name": "My Ticketings",
					"gujName": "મારી ટિકિટિંગ્સ",
					"appointmentRequired": false,
					"active": true
				},
				// {
				// 	"code": "ZOO-DASHBOARD",
				// 	"fieldView": "ALL",
				// 	"name": "Zoo",
				// 	"gujName": "પ્રાણી સંગ્રહાલય",
				// 	"appointmentRequired": false,
				// 	"active": true
				// },
				{
					"code": "ZOOBOOK",
					"fieldView": "ALL",
					"name": "Zoo Ticket",
					"gujName": "પ્રાણી સંગ્રહાલય",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "ANIMAL-ADOPTION",
					"fieldView": "ALL",
					"name": "Animal Adoption",
					"gujName": "પ્રાણી સંગ્રહાલય",
					"appointmentRequired": false,
					"active": true
				},
				{
					"code": "PLANETARIUMBOOK",
					"fieldView": "ALL",
					"name": "Planetarium",
					"gujName": "પ્લાનેટેરિયમ",
					"appointmentRequired": false,
					"active": true
				},
				// {
				// 	"code": "BAND",
				// 	"fieldView": "ALL",
				// 	"name": "Band",
				// 	"gujName": "બેન્ડ",
				// 	"appointmentRequired": false,
				// 	"active": true
				// },
			]
		}
		// {
		// 	"id": 2,
		// 	"uniqueId": null,
		// 	"version": null,
		// 	"code": "TICKETINGSMODULE",
		// 	"fieldView": "ALL",
		// 	"fieldList": null,
		// 	"name": "Ticketing Facilities",
		// 	"gujName": "Ticketing Facilities",
		// 	"services": [
		// 		{
		// 			"code": "MYTICKETINGS",
		// 			"fieldView": "ALL",
		// 			"name": "My Ticketings",
		// 			"gujName": "મારી ટિકિટિંગ્સ",
		// 			"appointmentRequired": false,
		// 			"active": true
		// 		},
		// 		{
		// 			"code": "ZOO-DASHBOARD",
		// 			"fieldView": "ALL",
		// 			"name": "Zoo",
		// 			"gujName": "પ્રાણી સંગ્રહાલય",
		// 			"appointmentRequired": false,
		// 			"active": true
		// 		},
		// 		{
		// 			"code": "PLANETARIUMBOOK",
		// 			"fieldView": "ALL",
		// 			"name": "Planetarium",
		// 			"gujName": "પ્લાનેટેરિયમ",
		// 			"appointmentRequired": false,
		// 			"active": true
		// 		}
		// 	]
		// },
		// {
		// 	"id": 3,
		// 	"uniqueId": null,
		// 	"version": null,
		// 	"code": "BOOKINGMODULE",
		// 	"fieldView": "ALL",
		// 	"fieldList": null,
		// 	"name": "My Bookings",
		// 	"gujName": "My Bookings",
		// 	"services": [
		// 		{
		// 			"code": "CANCELBOOKING",
		// 			"fieldView": "ALL",
		// 			"name": "My Bookings",
		// 			"gujName": "My Bookings",
		// 			"appointmentRequired": false,
		// 			"active": true
		// 		}
		// 	]
		// }
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
		public commonService: CommonService,
		private shopAndEstablishmentService: ShopAndEstablishmentService

	) {
		this.getAllServices();
	}

	ngOnInit() {
		this.paginationService.apiType = 'myApps';
		this.paginationService.pageIndex = 1;
		this.paginationService.pageSize = 2;
		this.isRecentApp = true;
		// this.paginationService.getAllData().subscribe(data => {
		// 	if (data.totalRecords > 0) {
		// 		this.isRecentApp = true;
		// 		this.recentApp = data.data;
		// 	} else {
		// 		this.isRecentApp = false;
		// 		this.recentApp = [];
		// 	}
		// });

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiCode: string) {
		console.log("apiCode", apiCode);
		switch (apiCode) {
			case 'HEL-DR':

				this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
				this.formService.createFormData().subscribe(res => {
					let redirectUrl = ManageRoutes.getFullRoute(apiCode);
					this.router.navigate(['citizen/certificates/birth-death/deathReg', res.serviceFormId, apiCode]);
					// this.router.navigate([redirectUrl, , apiCode]);
				});
				break;
			case 'HEL-BCR':
			case 'HEL-DCR':
			case 'HEL-NRCBR':
			case 'HEL-NRCDR':
			case 'HEL-DUPBR':
			case 'HEL-DUPDR':
			case 'HEL-DUPMR':
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
			case 'FS-REVISED':
			case 'FS-REN':
			case 'FS-FINAL-HOSPITAL':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode), false, apiCode]);
				break;
			case 'HEL-WTRPIP-WRK-COMPL':
			case 'HEL-DRNGPIP-WRK-COMPL':
				// case 'HEL-WTR-DRAINAGE-DISCONNECTION':
				//case 'HEL-WTR-DRAINAGE-RECONNECTION':
				//case 'HEL-WTR-DRAINAGE-TRANS-CONNECTION':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode), apiCode]);
				break;
			case 'PAY_PROF_TAX':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)], { queryParams: { code: 'PROFESSIONAL' } });
				break;
			case 'PAY-PRO-TAX':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)], { queryParams: { code: 'PROPERTY-TAX' } });
				break;
			case 'PAY-WTR-TAX':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)], { queryParams: { code: 'WATER-TAX' } });
				break;
			case 'PRO-BILL-PRINTING':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)], { queryParams: { code: 'PROPERTY-TAX' } });
				break;
			case 'PRC_REG':
			case 'PRO-ASS':
			case 'PRO-EXT':
			case 'PRO-TRAN':
			case 'PRO-DUP':
			case 'PRO-NDU':
			case 'PRO-VAC':
			case 'PRO-ASSCER':
			case 'PRO-REFUND':
			case 'PRO-TAX-REBATE':
			case 'PRO-REVALUATION':
			case 'WTR-NEW':
			case 'WTR-DISCON':
			case 'WTR-TRXF-OWN':
			case 'WTR-CHNG-USG':
			case 'WTR-RECON':
			case 'WTR-PLUMB-LIC':
			case 'WTR-RNW-PLUMB-LIC':
			case 'PRO-TAX-TRAS-HISTORY':
			case 'PROPERTY_UPDATE_EMAIL_AND_MOBILE':
			case 'AFFORD-HOUSE-STATUS':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)]);
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
				console.log("res", res);
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


	/**
   * This method for download file
   */
	 downloadGuidLineDocumemnt(fileName: any) {

		 this.shopAndEstablishmentService.downloadGuidLineDocumemnt(fileName, 'application/pdf').subscribe(resp => {

		  var newBlob = new Blob([resp], { type: "application/pdf" });

		  // IE doesn't allow using a blob object directly as link href
		  // instead it is necessary to use msSaveOrOpenBlob
		  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(newBlob);
			return;
		  }
		  // For other browsers:
		  // Create a link pointing to the ObjectURL containing the blob.
		  const data = window.URL.createObjectURL(newBlob);

		  var link = document.createElement('a');
		  link.href = data;
		  link.download = fileName;
		  // this is necessary as link.click() does not work on the latest firefox
		  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

		  setTimeout(function () {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(data);
			link.remove();
		  }, 100);
		},

		  err => {
			this.toastr.error("Server Error");
		  })

	  }

	  ngAfterViewInit(){
		setTimeout(() => {
			var element : any = document.getElementsByClassName('mat-tab-label-active');
			if(element.length>0){
				const length = element.length
				for (let index = 0; index < length; index++) {
					element[0].classList.remove("mat-tab-label-active");
				}
			}
		}, 500);
		setTimeout(() => {
			var element : any = document.getElementsByClassName('mat-tab-label-active');
			if(element.length>0){
				const length = element.length
				for (let index = 0; index < length; index++) {
					element[0].classList.remove("mat-tab-label-active");
				}
			}
		}, 1000);
		setTimeout(() => {
			var element : any = document.getElementsByClassName('mat-tab-label-active');
			if(element.length>0){
				const length = element.length
				for (let index = 0; index < length; index++) {
					element[0].classList.remove("mat-tab-label-active");
				}
			}
		}, 1250);
		setTimeout(() => {
			var element : any = document.getElementsByClassName('mat-tab-label-active');
			if(element.length>0){
				const length = element.length
				for (let index = 0; index < length; index++) {
					element[0].classList.remove("mat-tab-label-active");
				}
			}
		}, 1500);
		setTimeout(() => {
			var element : any = document.getElementsByClassName('mat-tab-label-active');
			if(element.length>0){
				const length = element.length
				for (let index = 0; index < length; index++) {
					element[0].classList.remove("mat-tab-label-active");
				}
			}
		}, 2000);
	  }

	  openModule(event){
	      this.showModuleServices = true;

	  }

	  openBookingServices(event){
		  this.showBookingServices = true
	  }
}
