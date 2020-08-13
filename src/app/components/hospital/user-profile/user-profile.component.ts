import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { ValidationService } from './../../../shared/services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ComponentConfig } from './../../component-config';
import { CountryService } from '../../../shared/services/country.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { HosFormActionsService } from 'src/app/core/services/hospital/data-services/hos-form-actions.service';
import { HosAppService } from 'src/app/core/services/hospital/app-services/hos-app.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	/**
	 * Declare userProfile formgroup property
	 */
	userProfileForm: FormGroup;
	public config = new ComponentConfig;

	arrHospitalType: any;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form Service property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private fb: FormBuilder,
		private formService: HosFormActionsService,
		private commonService: CommonService,
		private appService: HosAppService,
		private toaster: ToastrService,
	) { }

	
	ngOnInit() {

		this.userProfileForm = this.fb.group({
			uniqueId: '',
			hospitalName: [null, [Validators.required]],
			hospitalType: this.fb.group({
				id: 1,
				code: [null, [Validators.required]],
				name: null
			}),
			addressLine1: [null, [Validators.required]],
			addressLine2: [null],
			userDetail: this.fb.group({
				uniqueId : '',
				firstName: [null, [Validators.required, ValidationService.nameValidator]],
				lastName: [null, [Validators.required, ValidationService.nameValidator]],
				email: [null, [Validators.required, ValidationService.emailValidator]],
				cellNo: null
			}),
		});

		this.appService.getHosUserLookups().subscribe(
			res => {
				this.arrHospitalType = res.data;
			}
		);

		this.getUserProfile();
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfileHospal().subscribe(res => {
			this.userProfileForm.patchValue(res.data);
		});
	}

	/**
	 * This method is used to register update hospital user.
	 * @param formVals - signup form values property.
	 */
	onSubmitProfile(formVals: FormGroup) {
		this.formService.updateHospitalInfo(formVals.getRawValue()).subscribe(
			res => {
				this.userProfileForm.patchValue(res.data);
				this.toaster.success('Your profile has been updated successfully');
				this.commonService.profileSubject.next(res.data.userDetail);
			}
			// err => {
			// 	this.toster.error(err.error[0].code);
			// });
		)}


}
