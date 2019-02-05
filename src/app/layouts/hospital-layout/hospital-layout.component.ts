import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ManageRoutes } from './../../config/routes-conf';
import { Router } from "@angular/router";

import { HosAppService } from './../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';
import { HosFormActionsService } from '../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../shared/services/common.service';
import * as _ from 'lodash';


@Component({
	selector: 'app-hospital-layout',
	templateUrl: './hospital-layout.component.html',
	styleUrls: ['../home-layout/home-layout.component.scss']
})
export class HospitalLayoutComponent implements OnInit {

	@ViewChild('snav') snav;
	mobileQuery: MediaQueryList;
	profileObj: any = {};
	isExpanded: boolean = true;
	tabIndex: number = 0;
	showMenu: boolean = true;


	links = [
		{
			'linkName': 'Dashboard',
			'linkCode': 'HOSPITALDASHBOARD',
			'icon': 'apps'
		},
		{
			'linkName': 'My Applications',
			'linkCode': 'HOSPITALMYAPPS',
			'icon': 'description'
		},
	];
	activeLink = this.links[0].linkName;

	constructor(private changeDetectorRef: ChangeDetectorRef,
		private router: Router,		
		private media: MediaMatcher,
		private appService: HosAppService,
		private session: SessionStorageService,
		private formService: HosFormActionsService,
		public commonService: CommonService
	) {

		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	private _mobileQueryListener: () => void;

	ngOnInit() {
		this.getUserProfile();

		// get the profile data when user gets update his profie
		this.commonService.profileSubject.subscribe(res => {
			this.profileObj = res;
		})
	}

	onLogout() {
		this.appService.logout();
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
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
	navigateToRoute(code) {
		this.router.navigateByUrl(ManageRoutes.getFullRoute(this.links[code.index].linkCode));
	}

	/**
	 * This method is redirect to route based on selected tab
	 * @param code - number
	 */
	navigateToRouteByIndex(code) {
		this.router.navigateByUrl(ManageRoutes.getFullRoute(this.links[code].linkCode));
	}

	/**
	 * This method is check current activate route and set tab based on it.
	 */
	activateTab() {
		_.forEach(this.links, (link, id) => {
			if ('/' + ManageRoutes.getFullRoute(link.linkCode) == this.router.url) {
				this.tabIndex = id;
				this.showMenu = true;
				return false;
			} else {
				this.showMenu = false;
			}
		});
	}

}
