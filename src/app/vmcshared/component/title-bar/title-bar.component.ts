import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

import { ManageRoutes } from './../../../config/routes-conf';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
	selector: 'app-title-bar',
	template: `<div [ngClass]="{'iframeTitleBar': fromAdmin,
	          'titleBar': !fromAdmin }">
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

	fromAdmin : boolean = false;


	constructor(
		private router: Router,
		private location: Location,
		private commonService : CommonService
	) { }

	ngOnInit() {
		this.fromAdmin = this.commonService.fromAdmin();
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
