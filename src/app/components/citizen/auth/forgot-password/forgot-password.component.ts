import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';

import { ValidationService } from './../../../../shared/services/validation.service';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPassForm: FormGroup;
	isValidFlag: boolean = false;
	loading: boolean = false;
	manageRoutes: any = ManageRoutes;
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
		private commonService: CommonService,
		private appService: AppService
	) {

	}

	ngOnInit() {
		this.forgotPassForm = this.fb.group({
			email: [null, [Validators.required, ValidationService.emailValidator]],
			//cellNo: '',
			userType: 'CITIZEN'
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
	  * This method is use to send otp for set a new password.
	  * @param formVals - Forgot password form values property.
	*/
	onForgotPassword(formVals: FormGroup) {


        if (this.forgotPassForm.valid) {
            this.loading = true;
            this.issingupbtn = true;

        let obj ={
            email: this.forgotPassForm.get('email').value,
           userType : this.forgotPassForm.get('userType').value,
           url  : environment.envAPIServer + 'citizen/auth/reset-password?'
        }
        this.appService.forgotPassword(obj).subscribe(
            res => {
                this.loading = false;
                /**
                 * Redirect to reset password
                 */
                this.successAlert("Success", "For OTP and Password reset link, please check your registered email ID and mobile number. Thank you", "success");
                let url = this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHRESETPASS')],
                // { queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp,email : this.forgotPassForm.get('email').value } }
                { queryParams: { uniqueId: res.data.uniqueId} });

          }, err => {
                this.loading = false;
                this.issingupbtn = false;
                this.toaster.error(err.error[0].code);
            })
        } else {
            this.isValidFlag = true;
        };
    }
}
