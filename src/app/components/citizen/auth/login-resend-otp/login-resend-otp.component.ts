import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-login-resend-otp',
  templateUrl: './login-resend-otp.component.html',
  styleUrls: ['./login-resend-otp.component.scss']
})
export class LoginResendOTPComponent implements OnInit {

  loading: boolean = false;
  userType = 'CITIZEN';
  userName:any;
  constructor(private appService: AppService,
		private router: Router,
		private fb: FormBuilder,
		private toster: ToastrService,
    private route: ActivatedRoute,
	  private commonService: CommonService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
			this.userName = params.username;
			});
     }

  onForgotPassword() {
		this.loading = true;
		let obj = {
      'userType' : this.userType,
      'userName' :this.userName
}


		this.appService.resendOTPLogin(obj).subscribe(
			res => {
				this.loading = false;
				/**
				 * Redirect to resend OTP password
				 */
				this.commonService.successAlert("Success", " OTP and Authentication Link re-sent on your registered Email ID and Mobile Number. Thank you.", "success");
        this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHVERIFY')],
					{ queryParams: { uniqueId: res.data.uniqueId } }
          );

			}, err => {
				this.loading = false;
				this.toster.error(err.error[0].code);
			});
	}

  onCancel(param: boolean) {
    this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
  }

}



