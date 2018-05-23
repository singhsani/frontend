import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppService } from './../../core/services/citizen/app-services/app.service';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../core/services/citizen/data-services/forms-actions.service';

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

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private media: MediaMatcher,
		private appService: AppService,
		private session: SessionStorageService,
		private formService: FormsActionsService,
	) {

		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}
	
	private _mobileQueryListener: () => void;
	
	ngOnInit() {
		this.getUserProfile();
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
	toggleSideNav(){
		if(this.mobileQuery.matches){
			this.snav.opened = false;
		}
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {
			document.getElementById('userName').innerHTML = res.data.firstName + ' ' + res.data.lastName;
		});
	}
}
