import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-hos-title-bar',
  template: `<div class="titleBar">
					<div class="container clearfix">
					<ul class="breadcrumbNav clearfix">
						<li>
							<a mat-button class="backArrow" (click)="navigateToRouteByIndex('HOSPITALDASHBOARD')">
								<mat-icon>arrow_back</mat-icon>
							</a>
						</li>
						<li>
							<a mat-button (click)="navigateToRouteByIndex('HOSPITALDASHBOARD')">
								Home
							</a>
						</li>
						<li>{{title}}</li>
				      <ng-content></ng-content>

					</ul>

					</div>
				</div>
`,
  styles: ['']
})
export class HosTitleBarComponent implements OnInit {

  @Input() title: string;

  constructor(
    private router: Router,
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

}
