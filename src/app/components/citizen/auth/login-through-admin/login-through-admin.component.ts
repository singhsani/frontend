import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
	selector: 'app-login-through-admin',
	templateUrl: './login-through-admin.component.html',
	styleUrls: ['./login-through-admin.component.scss']
})
export class LoginThroughAdminComponent implements OnInit {

	accessToken: string;
	apiCode: string;

	constructor(
		private session: SessionStorageService,
		public router: Router,
		public route: ActivatedRoute,
		public commonService: CommonService,
		private formService: FormsActionsService,
	) { }

	ngOnInit() {
		this.route.queryParams.subscribe(param => {

			if (param) {
				this.accessToken = param['authToken'];
				this.apiCode = param['apiCode'];
				if (this.accessToken && this.apiCode) {
					this.saveToken(this.apiCode);
					
				} else {
					this.commonService.openAlert('Error', 'Access Token Not Available', 'warning');
				}
			} else {
				this.router.navigate(['/404']);
			}
		});
	}

	/**
	 * This method will store Token to the Session Storage.
	 */
	saveToken(apiCode) {
		this.session.set('access_token', { 'token': this.accessToken, now: +new Date }, 999999, 's');
		this.session.set('fromAdmin', 'fromAdmin', 999999, 's');
		
		switch (apiCode) {
			case 'PEC_REG':
			case 'PRC_REG':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)]);
				break;
			default:
				this.createRecord();
				break;
		}
		
	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord() {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {
			let redirectUrl = ManageRoutes.getFullRoute(this.apiCode);
			this.router.navigate([redirectUrl, res.serviceFormId, this.apiCode]);
		});
	}
}
