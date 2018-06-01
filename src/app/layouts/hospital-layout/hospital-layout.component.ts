import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { HosAppService } from './../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';
import { HosFormActionsService } from '../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../shared/services/common.service';

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

	constructor(private changeDetectorRef: ChangeDetectorRef,
		private media: MediaMatcher,
		private appService: HosAppService,
		private session: SessionStorageService,
		private formService: HosFormActionsService,
		private commonService: CommonService
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

}
