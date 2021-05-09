import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

	resetPassForm: FormGroup;
	emailobj : any;
	userType = 'CITIZEN';

	loading: boolean = false;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param appService - Declare App Service property.
	 * @param route - Declare App ActivatedRoute property.
	 * @param router - Declare Routing Property.
	 * @param session - Declare Session Storage Module property.
	*/
	constructor(
		private appService: AppService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private commonService: CommonService,
		private toaster: ToastrService,
		private session: SessionStorageService) {

	}

	/**
	   * This method is use for perform initialize time actions and get uniqueId, authentication code.
	*/
	ngOnInit() {

		this.resetPassForm = this.fb.group({
			code: ['', Validators.required],
			password: [null, Validators.required],
			confirmPassword: [null, Validators.required],
			uniqueId: ''
		}, { validator: this.matchingPasswords('password', 'confirmPassword') });

		//  get the values from queryparams
		this.route.queryParams.subscribe(params => {

			this.resetPassForm.get('uniqueId').setValue(params['uniqueId'] === null ? (this.session.get('user_info') && this.session.get('user_info').uniqueId) : params['uniqueId']);
			this.emailobj = params.email;
			
			// if code value is exist then disabled field otherwise allow user to enter manually
			if (params['code'] != null && params['code'] != "" && params['code'] != undefined && params['code'] != 'undefined' && params['code'] != 'null') {
				//this.resetPassForm.get('code').setValue(params['code']);
				//this.resetPassForm.get('code').disable();
			} else {
				//this.resetPassForm.get('code').setValue("");
				//this.resetPassForm.get('code').enable();
			}

		});

	}

	onForgotPassword() {
		this.loading = true;
		let obj = {'email':this.emailobj,
					'userType' : this.userType
		}

		this.appService.forgotPassword(obj).subscribe(
			res => {
				this.loading = false;
				/**
				 * Redirect to reset password
				 */
				this.commonService.successAlert("Success", "For OTP and reset link update you can check your registered mail ID and Mobile number. Thank you.", "success");
				
			}, err => {
				this.loading = false;
				this.toaster.error(err.error[0].code);
			});
	}

	/**
	 * This method used to compare passwords
	 * @param passwordKey - Password
	 * @param confirmPasswordKey - Confirm Password
	 */
	matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
		return (group: FormGroup): { [key: string]: any } => {
			let password = group.controls[passwordKey];
			let confirmPassword = group.controls[confirmPasswordKey];

			if (confirmPassword.value) {
				if (password.value !== confirmPassword.value) {
					this.resetPassForm.get('confirmPassword').setErrors({ mismatchedPasswords: true });
					return {
						mismatchedPasswords: true
					};
				} else {
					this.resetPassForm.get('confirmPassword').setErrors(null);
				}
			}
		}
	}


	/**
	 * This method is used to reset user password
	 * @param formVals - login form values property.
	 */
	onResetPassword(formVals: FormGroup) {

		this.appService.resetPassword(formVals.getRawValue()).subscribe(
			res => {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
		});
	}
}
