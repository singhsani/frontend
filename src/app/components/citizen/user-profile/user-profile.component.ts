import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { ValidationService } from './../../../shared/services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';

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

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form Service property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private fb: FormBuilder,
		private formService: FormsActionsService,
		private toaster: ToastrService,
		private commonService: CommonService
	) 
	{ }

	ngOnInit() {

		this.userProfileForm = this.fb.group({
			uniqueId: '',
			firstName: [null, [Validators.required, ValidationService.nameValidator]],
			lastName: [null, [Validators.required, ValidationService.nameValidator]],
			email: [{ value: null, disabled: true }],
			cellNo: [{ value: null, disabled: true }],
			userType: '',
			status: ''
		});

		this.getUserProfile();
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {

			this.userProfileForm.setValue(res.data);
		});
	}

	/**
	 * This method used to update profile
	 * @param formVals - user profile formGroup value
	 */
	onSubmitProfile(formVals: FormGroup) {
		this.formService.updateUserProfile(formVals.getRawValue()).subscribe(res => {
			this.toaster.success('Your profile has been updated successfully');
			this.commonService.profileSubject.next(res.data);
		});
	}

}
