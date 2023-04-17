import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
	selector: 'app-userverification',
	templateUrl: './user-verification.component.html',
	styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {

	verifyForm: FormGroup;
	loading: boolean = false;
	emailobj : any;
	userType = 'CITIZEN';

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param appService - Declare App Service property.
	 * @param route - Declare App ActivatedRoute property.
	 * @param router - Declare Routing Property.
	*/
	constructor(
		private appService: AppService,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private commonService: CommonService,
		private toster: ToastrService
	) {

	}

	/**
	 * Initialize page content.
	 */
	ngOnInit() {


		this.verifyForm = this.fb.group({
			uniqueId: '',
			code: [null, Validators.maxLength(5)]
		});

		//  get the values from queryparams
		this.route.queryParams.subscribe(params => {
			this.emailobj = params.email;
			this.verifyForm.get('uniqueId').setValue(params['uniqueId']);

			// if code value is exist then disabled field otherwise allow user to enter manually
			if (params['code'] != null && params['code'] != "" && params['code'] != undefined && params['code'] != 'undefined' && params['code'] != 'null') {

				//this.verifyForm.get('code').setValue(params['code']);
				//this.verifyForm.get('code').disable();
			} else {
				//this.verifyForm.get('code').setValue('');
				//this.verifyForm.get('code').enable();
			}

		});
	}

	/**
	 * Method is used to verify user data after registration.
	 */
	verifyUser(formVals: FormGroup) {

if(this.verifyForm.valid){
			this.appService.verifyUser(formVals.getRawValue()).subscribe(
				res => {
					this.toster.success("Successfully Authenticated");
					this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
				},
				err => {
					this.toster.error("Please enter valid OTP to signup OR use latest OTP received in Email/SMS to signup");
				});
			}

	}

	onForgotPassword() {
		this.loading = true;
		let obj = {
      'userType' : this.userType,
     'uniqueId': this.verifyForm.get('uniqueId').value
}


		this.appService.resendOTP(obj).subscribe(
			res => {
				this.loading = false;
				/**
				 * Redirect to reset password
				 */
				this.commonService.successAlert("Success", " OTP and Authentication Link re-sent on your registered Email ID and Mobile Number. Thank you.", "success");

			}, err => {
				this.loading = false;
				this.toster.error(err.error[0].code);
			});
	}
}
