import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPassForm: FormGroup;

	/**
	 * 
	 * @param _appService - Declare App Service property.
	 * @param fb - Declare formbuilder property.
	 * @param router - Declare Routing Property.
	 */
	constructor(private fb: FormBuilder, private _route: ActivatedRoute,
				private _router: Router, private _appService: AppService
	) { }


	ngOnInit() {
		this.forgotPassForm = this.fb.group({
			email: '',
			cellNo: '',
			userType: 'CZ'
		});
	}

	/**
	  * This method is use to send otp for set a new password.
	  * @param formVals - Forgot password form values property.
	*/
	onForgotPassword(formVals: FormGroup) {

		this._appService.forgotPassword(formVals).subscribe(
			res => {
				/**
				 * Redirect to reset password
				 */
				this._router.navigate(['citizen/auth/reset-password'], { queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			});
	}

}
