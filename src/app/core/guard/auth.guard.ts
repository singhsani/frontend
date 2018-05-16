import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppService } from './../services/citizen/app-services/app.service';
import { ManageRoutes } from '../../config/routes-conf';

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
		private appService: AppService,
		private router: Router
	) { }

	/**
	 * This method execute and check before user access any route, that particular user is authenticated or not.
	 * If User is authenticate this method will return true otherwise, it will return false.
	 * @param state - common route parameter
	 */
	canActivate(next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		return this.isValidate();
	}

	canLoad(): boolean {
		return this.isValidate();
	}

	isValidate() {
		if (this.appService.isLoggedIn()) {
			return true;
		} else {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
			return false;
		}

	}
}
