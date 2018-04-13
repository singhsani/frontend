import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from './../../core/services/citizen/app-services/auth.service';

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
		private media: MediaMatcher, private authService: AuthService
	) {

		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	private _mobileQueryListener: () => void;

	ngOnInit() {
	}

	onLogout() {
		this.authService.logout();
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}
}
