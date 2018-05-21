
import { ManageRoutes } from './../../../../config/routes-conf';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

import { Observable } from 'rxjs';


import 'url-search-params-polyfill';

import { HttpService } from '../../../../shared/services/http.service';

@Injectable()

/**
 * Declare App Service Class
 */
export class HosAppService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param router - Declare Router property.
	 * @param session - Declare Session Storage Module property.
	 * @param http - Declare Http Service property.
	 */
	constructor(private router: Router,
		private session: SessionStorageService,
		private http: HttpService) {

	}

	/**
	 * This method will get User Authentication Token and Save to the Session Storage.
	 * @param loginData - User Information Data
	 */
	obtainAccessToken(loginData) {

		let params = new URLSearchParams();
		params.append('username', loginData.username + ':HOSPITAL');
		params.append('password', loginData.password);
		params.append('grant_type', 'password');

		let headers = {
			'Content-type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic dmlzaGFsOnNlY3JldA=='
		};

		return this.http.post('authorize', params.toString(), headers);
	}

	/**
	 * This method will Register New User.
	 * @param registerData - User Information Data (Object).
	 */
	registerUser(registerData) {

		return this.http.post('public/user/hospital/register', registerData, this.getCommonHeaders());
	}

	/**
   * This method is used to perform user forget password operation.
   * @param forgotPwdData - consist userType and userId.
   */
	forgotPassword(forgotPwdData) {

		return this.http.post('public/user/forgetPassword', forgotPwdData, this.getCommonHeaders());
	}

	/**
	 * This method is used to perform user reset password operation.
	 * @param resetPasswordData - parameters to reset password.
	 */
	resetPassword(resetPasswordData) {

		return this.http.post('public/user/resetPassword', resetPasswordData, this.getCommonHeaders());
	}

	/**
	 * This method is used to verify user data.
	 */
	verifyUser(verifyUserData) {

		return this.http.post('public/user/verifyAccount/', verifyUserData, this.getCommonHeaders());
	}

	/**
 * This method will return True or False based on User Login or Not.
 */
	isLoggedIn() {
		if (this.session.get('hos_access_token')) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * This method is use for call user logout service.
	 */
	logout() {
		this.session.remove('hos_access_token');
		this.router.navigate(['hospital/auth/login']);
	}

	/**
	 * This method use to return headers to all api
	 */
	getCommonHeaders() {

		let headers = {
			'Content-type': 'application/json'
		};
		return headers;
	}
}