import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';

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
		private toster: ToastrService
	) {

	}

	ngOnInit() {

		this.regForm = this.fb.group({
			hospitalName: null,
			hospitalType: null,
			nursingHome: true,
			userDetail: this.fb.group({
				firstName: null,
				lastName: null,
				email: null,
				cellNo: null,
				password: null,
				confirmPassword: null
			})
		})
	}

	/**
	 * This method is used to register a new user.
	 * @param formVals - signup form values property.
	 */
	onSignUp(formVals: FormGroup) {

		console.log(formVals);
		this.appService.registerUser(formVals).subscribe(
			res => {
				this.router.navigate(['hospital/auth/login']);
			});
	}

}
