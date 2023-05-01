import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import * as _ from 'lodash';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService as CommonService2} from 'src/app/shared/services/common.service';
import { CommonService } from 'src/app/shared/services/common.service';
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
	userNameId = new Date().getTime();
  userType = 'CITIZEN';


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
		private toster: ToastrService,
    private commonService2: CommonService2,
    private commonService: CommonService,
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

	guestUser() {
		const guestLoginData = { username: "cs_guest@guest.com", password: 123123 };
		this.guestLogin(guestLoginData);
	}

	guestLogin(guestLoginData) {
		this.session.remove('fromAdmin');
		this.appService.obtainAccessToken(guestLoginData).subscribe(
			res => {
				this.session.set('isGuestLogin', true);
				this.saveToken(res);
			},
			err => {
				if (err.error.error_description)
					this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * This method is use for get User Authenticated Token from oAuth2 API.
	 * @param formVals - login form values property.
	 */
	onLoginSubmit(formVals) {

		this.session.remove('fromAdmin');
		if (formVals.username) {
			formVals.username = _.trim(formVals.username);
		}

		this.isValidFlag = false;

		if (this.loginForm.valid) {
			this.loading = true;
			this.appService.obtainAccessToken(formVals).subscribe(
				res => {
					this.session.set('isGuestLogin', false);
					this.loading = false;
					this.saveToken(res);
				},
				err => {
					this.loading = false;
          //  if(err.error.error_description){
					// 	this.toster.error(err.error.error_description);}
          if(err.status !== 401){
            this.toster.error(err.error.error_description);

          }
					else{
              this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGINRESENDOTP')],
              { queryParams: { username: this.loginForm.get('username').value } }
            );
          }
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
