import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validator, Validators, AbstractControl } from '@angular/forms';

import { ValidationService } from './../../../../shared/services/validation.service';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { MatInput } from '@angular/material/input';
import { CommonService } from 'src/app/shared/services/common.service';
import swal from 'sweetalert2';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	issingupbtn : boolean = false;
	regForm: FormGroup;
	manageRoutes: any = ManageRoutes;
	loading: boolean = false;

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
		private commonService: CommonService,
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

	imageUrls(type: string) {
		if (type === 'warning') {
			return "assets/icons/warning.svg";
		} else if (type === 'success') {
			return "assets/icons/done.svg";
		} else if (type === 'info') {
			return "assets/icons/info.svg";
		} else if (type === 'error') {
			return "assets/icons/error.svg";
		} else if (type === 'question') {
			return "assets/icons/question.svg";
		}
	}
	
	successAlert(title: string, message: string, type: string) {

		let options = {
      title:title,
			text: message,
			type: type,
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
      width: 400,
      height:8,
      imageWidth: 70,
      imageHeight: 65,
      padding: '2em',
		}

		swal(options as any);
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

		if (this.regForm.valid) {
			this.loading = true;
			this.issingupbtn = true;
		this.appService.registerUser(formVals).subscribe(
			res => {
				this.loading = false;
				this.successAlert("Success", "For OTP and authentication link, please check your registered email ID and mobile number. Thank you for the registration.", "success");
				//this.toster.success("We have sent a authentication link on your email");
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHVERIFY')],
					// { queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp , email : this.regForm.get('email').value } }
          { queryParams: { uniqueId: res.data.uniqueId } }
          );
			},
			err => {
				this.loading = false;
				if (err.error[0])
				this.issingupbtn = false;
					this.toster.error(err.error[0].code);
			}
		);
	} else {
		//this.issingupbtn = true;
	}
	}

}

