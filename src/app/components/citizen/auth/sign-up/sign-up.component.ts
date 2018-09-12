import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validator, Validators, AbstractControl } from '@angular/forms';

import { ValidationService } from './../../../../shared/services/validation.service';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { MatInput } from '@angular/material/input';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	regForm: FormGroup;
	manageRoutes: any = ManageRoutes;

	@ViewChild('firstname') nameInput: MatInput;


	/**
	 * Constructor to declare defualt propeties of class
	 * @param appService - Declare App Service property.
	 * @param router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private appService: AppService,
		private toster: ToastrService
	) { }

	ngOnInit() {

		this.regForm = this.fb.group({
			firstName: [null, [Validators.required, ValidationService.nameValidator]],
			lastName: [null, [Validators.required, ValidationService.nameValidator]],
			email: [null, [Validators.required, ValidationService.emailValidator]],
			cellNo: [null, Validators.required],
			password: [null, Validators.required],
			confirmPassword: [null, Validators.required],
			userType: "CITIZEN",
			registerBy: null,

			/* add extra fields */
			buildingName: null,
			streetName: null,
			landmark: null,
			area: null,
			state: null,
			district: null,
			city: null,
			pincode: null,
			country: null,
			profilePic: null,
			middleName: null,
			birthDate: null,
			gender: null

		}, { validator: this.matchingPasswords('password', 'confirmPassword') });

		this.nameInput.focus();
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
					this.regForm.get('confirmPassword').setErrors({ mismatchedPasswords: true });
					return {
						mismatchedPasswords: true
					};
				}else{
					this.regForm.get('confirmPassword').setErrors(null);
				}
			}
		}
	}


	/**
	 * This method is used to register a new user.
	 * @param formVals - signup form values property.
	 */
	onSignUp(formVals) {

		if (formVals.email) {
			formVals.email = _.trim(formVals.email);
		}

		this.appService.registerUser(formVals).subscribe(
			res => {
				this.toster.success("We have sent a authentication link on your email");
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHVERIFY')],
					{ queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			},
			err => {
				if (err.error[0])
					this.toster.error(err.error[0].code);
			}
		);
	}

}

