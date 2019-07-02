import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'app-hos-title-bar',
	template: `<div class="titleBar">
  <div class="container clearfix">
    <ul class="breadcrumbNav clearfix">
      <li>
        <a mat-button class="backArrow" (click)="navigateToRouteByIndex('HOSPITALDASHBOARD')" >
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
      <div class="float-right">
    <button class="btn btn-warning mr-2" type="button" data-toggle="modal" data-target="#gujModal">
      How to type in Gujarati?
    </button>
  </div>
    </ul>
  </div>
</div>

<div class="modal" id="gujModal">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">

			<!-- Modal Header -->
			<div class="modal-header">
				<h4 class="modal-title">
					 {{'gujarati_typing_confused'| translate: translateKey}}
				</h4>
			</div>

			<!-- Modal body -->
			<div class="modal-body">
				<div class="embed-responsive embed-responsive-16by9 m-1 row">
					<video class="embed-responsive-item col-md-12" controls>
						<source src="assets/videos/Gujarati_Demo.mp4" type="video/mp4">
						<source src="assets/videos/Gujarati_Demo.ogv" type="video/ogg">
					</video>
				</div>
			</div>

			<!-- Modal footer -->
			<div class="modal-footer">
				<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
			</div>

		</div>
	</div>
</div>`,
	styles: [``]
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
