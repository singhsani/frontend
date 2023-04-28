import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, RouteConfigLoadStart, NavigationCancel, NavigationEnd } from '@angular/router';

import { CommonService } from './shared/services/common.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

/**
 * Declare common App component
 */
export class AppComponent {

	isRoutingChange:boolean = false;
	isLoading:boolean = false;

	constructor(private router: Router, private commonService: CommonService) {

		this.router.events
			.subscribe((event) => {
				if (event instanceof NavigationStart) {
					this.isRoutingChange = true;
					this.isLoading = true;

					this.commonService.loading.next({ loading: true });
				}
				else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
					this.isRoutingChange = false;
					this.isLoading = false;
					this.commonService.loading.next({ loading: false });
					window.scroll(0,0);
				}
			});

	}

}
