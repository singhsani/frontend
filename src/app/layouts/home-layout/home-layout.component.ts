import { CountryService } from './../../shared/services/country.service';
import { ManageRoutes } from './../../config/routes-conf';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppService } from './../../core/services/citizen/app-services/app.service';
import { CommonService } from './../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../core/services/citizen/data-services/forms-actions.service';
import { Router } from "@angular/router";
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-home-layout',
	templateUrl: './home-layout.component.html',
	styleUrls: ['./home-layout.component.scss']
})

/**
 * Declare HomeLayoutComponent for handle Dashboard Layout functionalities.
 */
export class HomeLayoutComponent implements OnInit {
	@ViewChild('snav') snav;
	mobileQuery: MediaQueryList;
	profileObj: any = {};
	fromAdmin: boolean = false;
	isExpanded: boolean = true;
	manageRoutes: any = ManageRoutes;
	tabIndex: number = 0;
	showMenu: boolean = true;
	
	links = [
		{
			'linkName': 'Dashboard',
			'linkCode': 'CITIZENDASHBOARD',
			'icon': 'apps'
		},
		{
			'linkName': 'My Applications',
			'linkCode': 'CITIZENMYAPPS',
			'icon': 'description'
		},
		/* {
			'linkName': 'My Profile',
			'linkCode': 'CITIZENMYPROFILE',
			'icon': 'face'
		},
		{
			'linkName': 'Resource',
			'linkCode': 'CITIZENMYRESOURCE',
			'icon': 'web_asset'
		}, */
		{
			'linkName': 'Payable Services',
			'linkCode': 'CITIZENPAYABLESERVICES',
			'icon': '&#x20B9;'
		},
		{
			'linkName': 'Transactions',
			'linkCode': 'CITIZENMYTRANSACTIONS',
			'icon': 'low_priority'
		},
		/* {
			'linkName': 'Booking',
			'linkCode': 'test'
		},
		{
			'linkName': 'Cancel Booking',
			'linkCode': 'test'
		} */
	];
	activeLink = this.links[0].linkName;

	subscription: Subscription;
	
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private media: MediaMatcher,
		private appService: AppService,
		private session: SessionStorageService,
		private formService: FormsActionsService,
		public commonService: CommonService,
		private router: Router,
		private countryService: CountryService
	) {
		
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	private _mobileQueryListener: () => void;

	ngOnInit() {
		
		this.fromAdmin = this.commonService.fromAdmin();
		this.getUserProfile();

		// get the profile data when user gets update his profie
		this.subscription = this.commonService.profileSubject.subscribe(res => {
			this.profileObj = res;
		});

		this.countryService.countriesData.subscribe(data => { });

		if(this.commonService.isGuestUser()){
			this.links = [
				{
					'linkName': 'Dashboard',
					'linkCode': 'CITIZENDASHBOARD',
					'icon': 'apps'
				},
				{
					'linkName': 'Payable Services',
					'linkCode': 'CITIZENPAYABLESERVICES',
					'icon': '&#x20B9;'
				}
			];
		}

		if(this.commonService.fromAdmin()){

			this.links = [
				{
					'linkName': 'Dashboard',
					'linkCode': 'CITIZENDASHBOARD',
					'icon': 'apps'
				},
				{
					'linkName': 'My Applications',
					'linkCode': 'CITIZENMYAPPS',
					'icon': 'description'
				},
				{
					'linkName': 'Payable Services',
					'linkCode': 'CITIZENPAYABLESERVICES',
					'icon': '&#x20B9;'
				},
				{
					'linkName': 'Transactions',
					'linkCode': 'CITIZENMYTRANSACTIONS',
					'icon': 'low_priority'
				}
			];

		}
	}

	onLogout() {
		this.appService.logout();
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
		this.subscription.unsubscribe();
	}

	selectLanguage(language: string) {
		this.session.set('currentLanguage', language);
	}

	/**
	 * This method is use to toggle side nav on mobile view
	 */
	toggleSideNav() {
		if (this.mobileQuery.matches) {
			this.snav.opened = false;
		}
	}

	/**
	 * This method is use to open side nav on mobile view
	 */
	openSideNav() {
		if (this.mobileQuery.matches) {
			this.isExpanded = true;
			this.snav.opened = true;
		}
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {
			this.profileObj = res.data;
		});
	}

	/**
	 * * This method is redirect to route based on selected tab
	 * @param code - EVENT
	 */
	navigateToRoute(code){
		this.router.navigateByUrl(ManageRoutes.getFullRoute(this.links[code.index].linkCode));
	}

	/**
	 * This method is redirect to route based on selected tab
	 * @param code - number
	 */
	navigateToRouteByIndex(code){
		this.router.navigateByUrl(ManageRoutes.getFullRoute(this.links[code].linkCode));
	}

	/**
	 * This method is check current activate route and set tab based on it.
	 */
	activateTab(){
		_.forEach(this.links, (link, id) => {
			const menuUrl = this.router.url.split('?')[0];
			if('/'+ManageRoutes.getFullRoute(link.linkCode) == menuUrl){
				this.tabIndex = id;
				this.showMenu = true;
				return false;
			} else {
				this.showMenu = false;
			}
		});
	}
}
