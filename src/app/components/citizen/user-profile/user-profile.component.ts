import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { ValidationService } from './../../../shared/services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import * as moment from 'moment';
import { HttpService } from '../../../shared/services/http.service';
import { HttpEventType } from '@angular/common/http';
import { CountryService } from '../../../shared/services/country.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	@ViewChild('profilePicfileInput') profilePicfileInput: any;
	/**
	 * Declare userProfile formgroup property
	 */
	userProfileForm: FormGroup;

	countryListArray: any = [];
	stateListArray: any = [];
	cityListArray: any = [];

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form Service property.
	 * @param fb - Declare formbuilder property.
	*/
	constructor(
		private fb: FormBuilder,
		private formService: FormsActionsService,
		private toaster: ToastrService,
		private commonService: CommonService,
		private httpService: HttpService,
		private countryService:CountryService
	) { }

	// Marriage date 
	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	progress: { percentage: number } = { percentage: 0 }

	ngOnInit() {

		this.userProfileForm = this.fb.group({
			uniqueId: '',
			firstName: [null, [Validators.required, ValidationService.nameValidator]],
			middleName:[null, [ValidationService.nameValidator]],
			lastName: [null, [Validators.required, ValidationService.nameValidator]],
			email: [{ value: null, disabled: true }],
			cellNo: [{ value: null, disabled: true }],
			userType: '',
			status: '',
			birthDate: [null, Validators.required],
			gender: [null, [Validators.required]],
			profilePic: null,

			buildingName: [null, [Validators.maxLength(60), ValidationService.buildingNameValidator]],
			streetName: [null, Validators.maxLength(60)],
			landmark: [null, Validators.maxLength(100)],
			area: [null, Validators.maxLength(60)],
			state: [null, [Validators.maxLength(60)]],
			district: [null, [Validators.maxLength(60)]],
			city: [null, [Validators.maxLength(60)]],
			country: [null, [Validators.maxLength(60)]],
			pincode: [null, [Validators.maxLength(6)]]
		});

		this.getUserProfile();
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {
			this.userProfileForm.patchValue(res.data);
			this.getCountryLists();
		});
	}

	/**
	 * This method used to update profile
	 * @param formVals - user profile formGroup value
	 */
	onSubmitProfile(formVals: FormGroup) {
		this.formService.updateUserProfile(formVals.getRawValue()).subscribe(res => {
			this.userProfileForm.patchValue(res.data);
			this.toaster.success('Your profile has been updated successfully');
			this.commonService.profileSubject.next(res.data);
		});
	}
	/**
	 * This method is change date format.
	 */
	dateFormat(date, controlType) {
		this.userProfileForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}


	uploadProfilePic(event) {
		let selectedFiles = event.target.files;
		if (selectedFiles && selectedFiles.length) {
			let fileType = selectedFiles[0].type;
			if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/gif') {

				if (selectedFiles[0].size > 512000) {

					this.commonService.openAlert("Warning", "File Size should be less than 512 KB", "warning");

				} else {
					
					let reader = new FileReader();
					reader.onload = (e: any) => {
						this.userProfileForm.get('profilePic').setValue(e.target.result);
					}
					reader.readAsDataURL(selectedFiles[0]);
					this.profilePicfileInput.nativeElement.value = "";
				}
			} else {
				this.commonService.openAlert("Warning", "Please Select only image file", "warning");
			}

		}
	}

	/**
	 * This method is use to get country list using api
	 */
	getCountryLists() {
		this.countryService.countriesData.subscribe(data=>{
			this.countryListArray = _.cloneDeep(data);
			setTimeout(() => {
				if (this.userProfileForm.get('country').value) {
					this.getStateLists(this.userProfileForm.get('country').value);
				}
			}, 300);
		});
	}

	/**
	 * This method is use to get state list using api
	 * @param name - country name
	 */
	getStateLists(name) {
		let obj = _.filter(this.countryListArray, { 'name': name })[0];

		this.formService.getStateLookUp(obj.id).subscribe(res => {
			this.stateListArray = _.cloneDeep(res.data);

			if (this.userProfileForm.get('state').value) {
				this.getCityLists(this.userProfileForm.get('state').value);

			}
		});
	}

	/**
	 * This method is use to get city list using api
	 * @param name - state name
	 */
	getCityLists(name) {
		let obj = _.filter(this.stateListArray, { 'name': name })[0];

		this.formService.getCityLookUp(obj.id).subscribe(res => {
			this.cityListArray = _.cloneDeep(res.data);
		});
	}

	/**
	 * This method is use for change the country
	 * @param name - name of country
	 */
	onCountryChange(name: string) {
		if (name) {
			this.getStateLists(name);
		}

		this.userProfileForm.get('state').setValue(null);
		this.userProfileForm.get('city').setValue(null);
	}

	/**
	 * This method is use for change the state
	 * @param name - name of state
	 */
	onStateChange(name: string) {
		if (name) {
			this.getCityLists(name);
		}
		this.userProfileForm.get('city').setValue(null);

	}

}
