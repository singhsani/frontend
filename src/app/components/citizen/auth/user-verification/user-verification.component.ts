import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-userverification',
	templateUrl: './user-verification.component.html',
	styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {

	verifyForm: FormGroup;

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
		private toster: ToastrService
	) {

	}

	/**
	 * Initialize page content.
	 */
	ngOnInit() {


		this.verifyForm = this.fb.group({
			uniqueId: '',
			code: ['', Validators.required]
		});

		//  get the values from queryparams
		this.route.queryParams.subscribe(params => {

			this.verifyForm.get('uniqueId').setValue(params['uniqueId']);

			// if code value is exist then disabled field otherwise allow user to enter manually
			if (params['code'] != null && params['code'] != "" && params['code'] != undefined && params['code'] != 'undefined' && params['code'] != 'null') {

				this.verifyForm.get('code').setValue(params['code']);
				this.verifyForm.get('code').disable();
			} else {
				this.verifyForm.get('code').setValue('');
				this.verifyForm.get('code').enable();
			}

		});
	}

	/**
	 * Method is used to verify user data after registration.
	 */
	verifyUser(formVals: FormGroup) {

		if ((!this.verifyForm.get('uniqueId').value) || (!this.verifyForm.get('code').value)) {
			this.toster.warning("Link is not valid try again");
		} else {
			this.appService.verifyUser(formVals.getRawValue()).subscribe(
				res => {
					this.toster.success("Successfully Authenticated");
					this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
				});
		}
	}
}
