import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';

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
	constructor(private fb: FormBuilder, private formService: FormsActionsService) { }

	ngOnInit() {

		this.userProfileForm = this.fb.group({
			uniqueId: '',
			firstName: '',
			lastName: '',
			email: '',
			cellNo: '',
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
	onSubmitProfile(formVals: FormGroup){

	}

}
