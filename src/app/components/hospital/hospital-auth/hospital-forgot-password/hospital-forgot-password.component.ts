import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import { ValidationService } from './../../../../shared/services/validation.service';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';

@Component({
  selector: 'app-hospital-forgot-password',
  templateUrl: './hospital-forgot-password.component.html',
  styleUrls: ['./hospital-forgot-password.component.scss']
})
export class HospitalForgotPasswordComponent implements OnInit {

	forgotPassForm: FormGroup;
	loading: boolean = false;
	issingupbtn : boolean = false;
	/**
	 * 
	 * @param appService - Declare App Service property.
	 * @param fb - Declare formbuilder property.
	 * @param router - Declare Routing Property.
	 */
	constructor( 
		private fb: FormBuilder,
		private toaster: ToastrService,
		private route: ActivatedRoute,
		private router: Router, 
		private appService: AppService
	) {

	}

	ngOnInit() {
		this.forgotPassForm = this.fb.group({
			email: [null, [Validators.required, ValidationService.emailValidator]],
			//cellNo: '',
			userType: 'HOSPITAL'
		});
	}

	/**
	  * This method is use to send otp for set a new password.
	  * @param formVals - Forgot password form values property.
	*/
	onForgotPassword(formVals: FormGroup) {

		if (this.forgotPassForm.valid) {
			this.loading = true;
			this.issingupbtn = true;
		}
		this.appService.forgotPassword(formVals).subscribe(
			res => {
				/**
				 * Redirect to reset password
				 */
				this.loading = false;
				this.issingupbtn = false;
				this.router.navigate(['/hospital/auth/reset-password'], { queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			}, err => {
				this.loading = false;
				this.issingupbtn = false;
				this.toaster.error(err.error[0].code);
			});
	}

}
