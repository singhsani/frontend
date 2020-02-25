import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

import { ManageRoutes } from './../../../config/routes-conf';

@Component({
	selector: 'app-title-bar',
	template: `<div class="titleBar">
					<div class="container clearfix position-relative">
					<ul class="breadcrumbNav clearfix">
						<li>
							<a mat-button class="backArrow" (click)="navigateToRouteByIndex('CITIZENDASHBOARD')">
								<mat-icon>arrow_back</mat-icon>
							</a>
						</li>
						<li>
							<a (click)="navigateToRouteByIndex('CITIZENDASHBOARD')">
								Home
							</a>
						</li>
						<li>{{title}}</li>
						<ng-content></ng-content>
					</ul>
					
					</div>
				</div>
`,
	styles: [` `]
})
export class VmcTitleBarComponent implements OnInit {

	@Input() title: string;

	constructor(
		private router: Router,
		private location: Location
	) { }

	ngOnInit() {
	}

	/**
	 * This method is redirect to route based on selected tab
	 * @param code - number
	 */
	navigateToRouteByIndex(code) {
		this.router.navigateByUrl(ManageRoutes.getFullRoute(code));
	}

	onBackArrowClick(){
		this.location.back();
	}

}
