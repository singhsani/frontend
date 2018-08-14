import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import * as _ from 'lodash';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ManageRoutes } from '../../../../config/routes-conf';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

/**
 * Declare LoginComponent class to handle login related functionalities.
 */
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	isValidFlag: boolean = false;
	loading: boolean = false;
	manageRoutes: any = ManageRoutes;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param appService - Declare App Service property.
	 * @param session - Declare session property
	 * @param router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	 */
	constructor(private appService: AppService,
		private session: SessionStorageService,
		private router: Router,
		private fb: FormBuilder,
		private toster: ToastrService
	) { }


	/**
	 * This method is use for perform initialize time actions.
	 */
	ngOnInit() {
		let accessToken = this.session.get("access_token");

        /**
		 * If Access Token is valid then redirect to Home Component.
		 */
		if (accessToken) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}

		this.loginForm = this.fb.group({
			username: [null, Validators.required],
			password: [null, Validators.required]
		});

	}

	/**
	 * This method is use for get User Authenticated Token from oAuth2 API.
	 * @param formVals - login form values property.
	 */
	onLoginSubmit(formVals) {

		if (formVals.username) {
			formVals.username = _.trim(formVals.username);
		}

		this.isValidFlag = false;

		if (this.loginForm.valid) {
			this.loading = true;
			this.appService.obtainAccessToken(formVals).subscribe(
				res => {
					this.loading = false;
					this.saveToken(res);
				},
				err => {
					this.loading = false;
					if (err.error.error_description)
						this.toster.error(err.error.error_description);
				}
			);
		} else {
			this.isValidFlag = true;
		}

	}

	/**
	 * This method will store Token to the Session Storage.
	 * @param token - User Authenticated Token.
	 */
	saveToken(token) {
		this.session.set('access_token', { 'token': token.access_token, now: +new Date, 'userType': token.userType }, token.expires_in, 's');
		this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
	}

}
