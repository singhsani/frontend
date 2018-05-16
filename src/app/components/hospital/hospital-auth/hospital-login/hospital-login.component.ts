import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import * as _ from 'lodash';

import { HosAppService } from './../../../../core/services/hospital/app-services/hos-app.service';
import { ToastrService } from 'ngx-toastr';
import { ManageRoutes } from '../../../../config/routes-conf';

@Component({
	selector: 'app-hospital-login',
	templateUrl: './hospital-login.component.html',
	styleUrls: ['./hospital-login.component.scss']
})
export class HospitalLoginComponent implements OnInit {

	loginForm: FormGroup;
	manageRoutes: any = ManageRoutes;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param appService - Declare App Service property.
	 * @param session - Declare session property
	 * @param router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	 */
	constructor(private appService: HosAppService,
		private session: SessionStorageService,
		private router: Router,
		private fb: FormBuilder,
		private toster: ToastrService
	) { }


	/**
	 * This method is use for perform initialize time actions.
	 */
	ngOnInit() {

		let accessToken = this.session.get("hos_access_token");

        /**
		 * If Access Token is valid then redirect to Home Component.
		 */
		if (accessToken) {
			this.router.navigate(['/hospital/dashboard']);
		}

		this.loginForm = this.fb.group({
			username: '',
			password: ''
		});

	}

	/**
	 * This method is use for get User Authenticated Token from oAuth2 API.
	 * @param formVals - login form values property.
	 */
	onLoginSubmit(formVals: FormGroup) {

		this.appService.obtainAccessToken(formVals).subscribe(
			res => {
				this.saveToken(res);
			},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * This method will store Token to the Session Storage.
	 * @param token - User Authenticated Token.
	 */
	saveToken(token) {
		this.session.set('hos_access_token', { 'token': token.access_token, now: +new Date, 'userType': token.userType }, token.expires_in, 's');
		this.router.navigate(['/hospital/dashboard']);
	}

}
