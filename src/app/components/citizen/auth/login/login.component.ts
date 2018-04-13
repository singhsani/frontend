import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

import * as _ from 'lodash';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';

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
	
	/**
	 * Constructor to declare defualt propeties of class
	 * @param _appService - Declare App Service property.
	 * @param _session - Declare session property
	 * @param _router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	 */
	constructor(
		private _appService: AppService,
		private _session: SessionStorageService,
		private _router: Router, private fb: FormBuilder
	) { }


	/**
	 * This method is use for perform initialize time actions.
	 */
	ngOnInit() {
		let accessToken = this._session.get("access_token");

        /**
		 * If Access Token is valid then redirect to Home Component.
		 */
		if (accessToken) {
			this._router.navigate(['../../citizen']);
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

		this._appService.obtainAccessToken(formVals).subscribe(
			res => {
				/**
				 * Save Access Token.
				 */
				this.saveToken(res);
			});
	}

	/**
	 * This method will store Token to the Session Storage.
	 * @param token - User Authenticated Token.
	 */
	saveToken(token) {
		this._session.set('access_token', { 'token': token.access_token, now: +new Date }, token.expires_in, 's');
		this._router.navigate(['../../citizen']);
	}

}
