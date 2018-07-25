import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
@Component({
	selector: 'app-title-bar',
	template: `<div class="titleBar">
					<div class="container clearfix">
					<a mat-button (click)="navigateToRouteByIndex('CITIZENDASHBOARD')">
						<mat-icon>arrow_back</mat-icon>
					</a>
					<h1>{{title}}</h1>
					</div>
				</div>`,
	styles: [` `]
})
export class TitleBarComponent implements OnInit {

	@Input()title: string;

	constructor(
		private router: Router,
	) { }

	ngOnInit() {
	}

	/**
	 * This method is redirect to route based on selected tab
	 * @param code - number
	 */
	navigateToRouteByIndex(code){
		this.router.navigateByUrl(ManageRoutes.getFullRoute(code));
	}

}
