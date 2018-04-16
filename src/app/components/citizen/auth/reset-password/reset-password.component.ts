import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

	showWarning: boolean = false;

	resetPassForm: FormGroup;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param _appService - Declare App Service property.
	 * @param _route - Declare App ActivatedRoute property.
	 * @param router - Declare Routing Property.
	 * @param session - Declare Session Storage Module property.
	*/
	constructor(
		private _appService: AppService, private fb: FormBuilder,
		private _route: ActivatedRoute,
		private _router: Router, public session: SessionStorageService
	) {

	}

	/**
	   * This method is use for perform initialize time actions and get uniqueId, authentication code.
	*/
	ngOnInit() {

		this.resetPassForm = this.fb.group({
			code: '',
			password: '',
			confirmPassword: '',
			uniqueId: ''
		});

		//  get the values from queryparams
		this._route.queryParams.subscribe(params => {

			this.resetPassForm.get('uniqueId').setValue(params['uniqueId'] === null ? (this.session.get('user_info') && this.session.get('user_info').uniqueId) : params['uniqueId']);

			// if code value is exist then disabled field otherwise allow user to enter manually
			if (params['code'] != null && params['code'] != "" && params['code'] != undefined && params['code'] != 'undefined' && params['code'] != 'null') {
				this.resetPassForm.get('code').setValue(params['code']);
			} else {
				this.resetPassForm.get('code').setValue("");
			}

		});

	}

	/**
	 * This method is used to reset user password
	 * @param formVals - login form values property.
	 */
	onResetPassword(formVals: FormGroup) {

		if (this.resetPassForm.get('password').value !== this.resetPassForm.get('confirmPassword').value) {
			this.showWarning = true;
		} else {

			this._appService.resetPassword(formVals).subscribe(
				res => {

					this._router.navigate(['../login']);
				});
		}
	}
}
