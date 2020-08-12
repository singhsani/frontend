import { ValidationService } from './../../../../shared/services/validation.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { CommonService } from '../../../../shared/services/common.service';

import { HosAppService } from './../../../../core/services/hospital/app-services/hos-app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-hospital-register',
	templateUrl: './hospital-register.component.html',
	styleUrls: ['./hospital-register.component.scss']
})
export class HospitalRegisterComponent implements OnInit {

	regForm: FormGroup;
	manageRoutes: any = ManageRoutes;
	arrHospitalType: any;

	issingupbtn : boolean = false;
	loading: boolean = false;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param appService - Declare App Service property.
	 * @param router - Declare routing property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private appService: HosAppService,
		private toster: ToastrService,
		private commonService: CommonService
	) {

	}

	ngOnInit() {

		this.regForm = this.fb.group({
			hospitalName: [null, Validators.required],
			hospitalType: this.fb.group({
				id: 1,
				code: [null, [Validators.required]],
				name: null
			}),
			nursingHome: 'false',
			userDetail: this.fb.group({
				firstName: [null, [Validators.required, ValidationService.nameValidator]],
				lastName: [null, [Validators.required, ValidationService.nameValidator]],
				email: [null, [Validators.required, ValidationService.emailValidator]],
				cellNo: null,
				password: [null, Validators.required],
				confirmPassword: [null, Validators.required]
			}),
			addressLine1: [null, Validators.required],
			addressLine2: [null, Validators.required],
			city: [{ value: 'Vadodara', disabled: true }, Validators.required],
			state: [{ value: 'Gujarat', disabled: true }, Validators.required],
			country: [{ value: 'India', disabled: true }, Validators.required],


		}, { validator: this.matchingPasswords('password', 'confirmPassword') });

		this.appService.getHosUserLookups().subscribe(
			res => {
				this.arrHospitalType = res.data;
			}
		);
	}

	/**
	 * This method used to compare passwords
	 * @param passwordKey - Password
	 * @param confirmPasswordKey - Confirm Password
	 */
	matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
		return (group: FormGroup): { [key: string]: any } => {
			let password = group.get('userDetail').get(passwordKey);
			let confirmPassword = group.get('userDetail').get(confirmPasswordKey);

			if (confirmPassword.value) {
				if (password.value !== confirmPassword.value) {
					this.regForm.get('userDetail').get('confirmPassword').setErrors({ mismatchedPasswords: true });
					return { mismatchedPasswords: true };
				} else {
					this.regForm.get('userDetail').get('confirmPassword').setErrors(null);
				}
			}
		}
	}

	/**
	 * This method is used to register a new user.
	 * @param formVals - signup form values property.
	 */
	onSignUp(formVals: FormGroup) {

		if (this.regForm.valid) {
			this.loading = true;
			this.issingupbtn = true;
		}
		this.appService.registerUser(formVals.getRawValue()).subscribe(
			res => {
				this.loading = false;
				this.issingupbtn = false;
				// this.toster.success("Your application for hospital registration is submitted to Vadodara Municipal Corporation Health Department. For more update you can check your registered mail ID. Thank you for the Registration");
				this.commonService.openAlert("Success", "Your application for hospital registration is submitted to Vadodara Municipal Corporation Health Department. For more update you can check your registered mail ID. Thank you for the Registration", "success");
				this.regForm.reset();
				this.router.navigate(['hospital/auth/login']);
			},
			error => {
				this.loading = false;
				this.issingupbtn = false;
                if (error.error && error.error.length) {
                  this.commonService.openAlert("Warning", error.error[0].message, "warning");
                }
            }
		)}

}
