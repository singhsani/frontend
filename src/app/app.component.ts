import { CommonService } from './shared/services/common.service';
import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

/**
 * Declare common App component
 */
export class AppComponent {

	constructor(private router: Router, private commonService: CommonService) {

		router.events.subscribe(event => {
			if (event instanceof RouteConfigLoadStart) {
				this.commonService.loading.next({ loading: true });
			}
		});

		router.events.subscribe(event => {
			if (event instanceof RouteConfigLoadEnd) {
				this.commonService.loading.next({ loading: false });
			}
		});
	}
}
