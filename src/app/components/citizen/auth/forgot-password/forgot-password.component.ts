import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPassForm: FormGroup;
	manageRoutes: any = ManageRoutes;

	/**
	 * 
	 * @param appService - Declare App Service property.
	 * @param fb - Declare formbuilder property.
	 * @param router - Declare Routing Property.
	 */
	constructor( private fb: FormBuilder, private route: ActivatedRoute,
		private router: Router, private appService: AppService) {

	}

	ngOnInit() {
		this.forgotPassForm = this.fb.group({
			email: '',
			cellNo: '',
			userType: 'CITIZEN'
		});
	}

	/**
	  * This method is use to send otp for set a new password.
	  * @param formVals - Forgot password form values property.
	*/
	onForgotPassword(formVals: FormGroup) {

		this.appService.forgotPassword(formVals).subscribe(
			res => {
				/**
				 * Redirect to reset password
				 */
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHRESETPASS')], { queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			});
	}

}
