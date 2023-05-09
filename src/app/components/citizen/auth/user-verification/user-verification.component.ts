import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import swal from 'sweetalert2';

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
				this.successAlert("Success", " OTP and authentication link re-sent on your registered email ID and mobile number. Thank you.", "success");

			}, err => {
				this.loading = false;
				this.toster.error(err.error[0].code);
			});
	}
}
