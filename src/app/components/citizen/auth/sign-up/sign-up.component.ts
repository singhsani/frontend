import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	regForm: FormGroup;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param _appService - Declare App Service property.
	 * @param _router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private _router: Router,
		private fb: FormBuilder,
		private _appService: AppService
	) { }

	ngOnInit() {
		this.regForm = this.fb.group({
			firstName: '',
			lastName: '',
			email: '',
			cellNo: '',
			password: '',
			confirmPassword: '',
			userType: "CZ",
			registerBy: null
		});
	}

	/**
	 * This method is used to register a new user.
	 * @param formVals - signup form values property.
	 */
	onSignUp(formVals: FormGroup) {

		this._appService.registerUser(formVals).subscribe(
			res => {

				/**
				 * Redirect to verify User Component.
				*/
				alert("We have sent a authentication link on your email");
				this._router.navigate(['../user-verify'],
					{ queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			});
	}

}

