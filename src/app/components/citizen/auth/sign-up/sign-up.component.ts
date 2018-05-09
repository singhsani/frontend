import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	regForm: FormGroup;
	manageRoutes: any = ManageRoutes;

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
	) {

	}

	ngOnInit() {
		this.regForm = this.fb.group({
			firstName: '',
			lastName: '',
			email: '',
			cellNo: '',
			password: '',
			confirmPassword: '',
			userType: "CITIZEN",
			registerBy: null
		});
	}

	/**
	 * This method is used to register a new user.
	 * @param formVals - signup form values property.
	 */
	onSignUp(formVals: FormGroup) {

		this.appService.registerUser(formVals).subscribe(
			res => {
				this.toster.success("We have sent a authentication link on your email");
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHVERIFY')],
					{ queryParams: { uniqueId: res.data.uniqueId, code: res.data.cellOtp } });
			});
	}

}

