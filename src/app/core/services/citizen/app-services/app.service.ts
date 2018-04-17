import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpService } from '../../../../shared/services/http.service';

@Injectable()

/**
 * Declare App Service Class
 */
export class AppService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param _router - Declare Router property.
	 * @param session - Declare Session Storage Module property.
	 * @param _http - Declare Http Service property.
	 */
	constructor(
		private _router: Router,
		public session: SessionStorageService,
		private _http: HttpService, private _session: SessionStorageService
	) { }

	/**
	 * This method will get User Authentication Token and Save to the Session Storage.
	 * @param loginData - User Information Data
	 */
	obtainAccessToken(loginData) {
		
		let params = new URLSearchParams();
		params.append('username', loginData.username);
		params.append('password', loginData.password);
		params.append('grant_type', 'password');
		params.append('userType', 'CZ');

		let headers = {
			'Content-type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic dmlzaGFsOnNlY3JldA=='
		};

		return this._http.post('authorize', params.toString(), headers);
	}

	/**
	 * This method will Register New User.
	 * @param registerData - User Information Data (Object).
	 */
	registerUser(registerData) {

		let headers = {
			'Content-type': 'application/json'
		};

		return this._http.post('public/user/citizen/register', registerData, headers);
	}

	/**
	 * This method is use for check User token is set or not.
	 * It will return True if Token is set otherwise, it will return false.
	 */
	checkCredentials() {
		if (this.session.get('access_token')) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * This method is use for perform user logout service.
	 */
	logout() {
		
		this.session.remove('access_token');
		this._router.navigate(['/citizen/auth/login']);
	}


    /**
	 * This method is used to perform user forget password operation.
	 * @param forgotPwdData - consist userType and userId.
	 */
	forgotPassword(forgotPwdData) {

		let headers = {
			'Content-type': 'application/json'
		};

		return this._http.post('public/user/forgetPassword', forgotPwdData, headers);
	}

	/**
	 * This method is used to perform user reset password operation.
	 * @param resetPasswordData - parameters to reset password.
	 */
	resetPassword(resetPasswordData) {

		let headers = {
			'Content-type': 'application/json'
		};

		return this._http.post('public/user/resetPassword', resetPasswordData, headers);
	}

	/**
	 * This method is used to verify user data.
	 */
	verifyUser(verifyUserData) {

		let headers = {
			'Content-type': 'application/json'
		};

		return this._http.post('public/user/verifyAccount/', verifyUserData ,headers);

	}
}