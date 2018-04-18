import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { HttpService } from '../../../../shared/services/http.service';
import { AppService } from './app.service';

/**
 * This class is use for check User is authenticated or Not.
 */
@Injectable()
export class AuthService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param router - Declare router object.
	 * @param httpService - Declare common HTTP service Object.
	 * @param appService - Declare common App service object.
	 */
	constructor(private router: Router,
		public httpService: HttpService,
		private appService: AppService) {

	}

	/**
	 * This method will return True or False based on User Login or Not.
	 */
	isLoggedIn() {
		if (this.appService.checkCredentials()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * This method is use for call user logout service.
	 */
	logout() {
		this.appService.logout();
	}
}
