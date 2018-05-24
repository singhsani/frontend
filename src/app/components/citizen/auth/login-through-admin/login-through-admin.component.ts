import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../config/routes-conf';

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
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
	) { 
		this.route.paramMap.subscribe(param => {
			this.accessToken = param.get('authToken');
			this.apiCode = param.get('apiCode');
			this.saveToken();
			this.createRecord();
		});
	}

	ngOnInit() {
	}

	/**
	 * This method will store Token to the Session Storage.
	 */
	saveToken() {
		this.session.set('access_token', { 'token': this.accessToken, now: +new Date }, 999, 's');
		this.session.set('fromAdmin', 'fromAdmin', 999, 's');
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
