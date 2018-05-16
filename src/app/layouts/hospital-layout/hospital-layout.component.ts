import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { HosAppService } from './../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
	selector: 'app-hospital-layout',
	templateUrl: './hospital-layout.component.html',
	styleUrls: ['./hospital-layout.component.scss']
})
export class HospitalLayoutComponent implements OnInit {

	@ViewChild('snav') snav;
	mobileQuery: MediaQueryList;

	constructor(private changeDetectorRef: ChangeDetectorRef,
		private media: MediaMatcher,
		private appService: HosAppService,
		private session: SessionStorageService) {

		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	private _mobileQueryListener: () => void;

	ngOnInit() {
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

}
