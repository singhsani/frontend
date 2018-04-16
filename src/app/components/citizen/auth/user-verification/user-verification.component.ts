import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';

@Component({
	selector: 'app-userverification',
	templateUrl: './user-verification.component.html',
	styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {

	verifyForm: FormGroup;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param _appService - Declare App Service property.
	 * @param _route - Declare App ActivatedRoute property.
	 * @param _router - Declare Routing Property.
	*/
	constructor(
		private _appService: AppService,
		private _route: ActivatedRoute,
		private _router: Router, private fb: FormBuilder
	) { }

	/**
	 * Initialize page content.
	 */
	ngOnInit() {


		this.verifyForm = this.fb.group({
			uniqueId: '',
			code: ''
		});

		//  get the values from queryparams
		this._route.queryParams.subscribe(params => {

			this.verifyForm.get('uniqueId').setValue(params['uniqueId']);

			// if code value is exist then disabled field otherwise allow user to enter manually
			if (params['code'] != null && params['code'] != "" && params['code'] != undefined && params['code'] != 'undefined' && params['code'] != 'null') {

				this.verifyForm.get('code').setValue(params['code']);
			} else {
				this.verifyForm.get('code').setValue('');
			}

		});
	}

	/**
	 * Method is used to verify user data after registration.
	 */
	verifyUser(formVals: FormGroup) {

		if ((!this.verifyForm.get('uniqueId').value) || (!this.verifyForm.get('code').value)) {
			this.showAlert("Link is not valid try again")
		} else {
			this._appService.verifyUser(formVals).subscribe(
				res => {

					this.showAlert("Successfully Authenticated");
					/**
					 * Redirect to Reset Password Content
					 */
					this._router.navigate(['/login']);
				});
		}
	}

	/**
	 * Method is used to show alert for different situation.
	 * @param message - message is to be passed to alert.
	 */
	showAlert(message: string) {
		alert(message);
	}

}
