import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';

/**
 * Import required angular Observable functions.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { AuthService } from '../services/citizen/app-services/auth.service';// auth service

/**
 * AuthGuard Class to handle Authentication of application.
 */
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param authService - Declare authentication service Object.
	 * @param router - Declare router object.
	 */
	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	/**
	 * This method execute and check before user access any route, that particular user is authenticated or not.
	 * If User is authenticate this method will return true otherwise, it will return false.
	 * @param route - common route parameter
	 */
	canActivate( route: ActivatedRouteSnapshot ): boolean {

		/**
		 * Check user is authenticated or not from Authenticate Service
		 */
		return this.isValidate();
	}

	canLoad() :boolean {
		return this.isValidate();
		
	}

	isValidate(){
		if (this.authService.isLoggedIn()) {
			return true;
		} else {
			this.router.navigate(['/citizen/auth/login']);
			return false;
		}
	}
}
