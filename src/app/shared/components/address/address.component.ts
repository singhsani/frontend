import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ValidationService } from './../../services/validation.service';

import * as _ from 'lodash';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

	@Input() addressFormGroup: FormGroup;

	translateKey: string = 'addressScreen';
	countryListArray: any = [];
	stateListArray: any = [];
	cityListArray: any = [];

	editMode: boolean = false;

	constructor(
		private formService: FormsActionsService
	) { }

	ngOnInit() {
		this.editMode = true;
		this.getCountryLists();
	}

	/**
	 * Method use to initialise form controls for address form group
	 */
	addressControls() {
		let addrObj = {
			id: null,
			uniqueId: null,
			version: null,
			addressType: null,
			buildingName: [null, [Validators.maxLength(60)]],
			streetName: [null, Validators.maxLength(60)],
			landmark: [null, Validators.maxLength(100)],
			area: [null, Validators.maxLength(60)],
			state: [null, [Validators.required, Validators.maxLength(60)]],
			district: [null, [Validators.required, Validators.maxLength(60)]],
			city: [null, [Validators.required, Validators.maxLength(60)]],
			country: [null, [Validators.required, Validators.maxLength(60)]],
			pincode: [null, [Validators.required, Validators.maxLength(6)]],

		}

		return addrObj;
	}

	/**
	 * This method is use for change the country
	 * @param name - name of country
	 */
	onCountryChange(name: string) {
		if (name) {
			this.addressFormGroup.get('state').setValue(null);
			this.addressFormGroup.get('city').setValue(null);

			this.getStateLists(name);
		}
	}

	/**
	 * This method is use for change the state
	 * @param name - name of state
	 */
	onStateChange(name: string) {
		if (name) {
			this.addressFormGroup.get('city').setValue(null);
			this.getCityLists(name);
		}
	}

	/**
	 * This method is use to get country list using api
	 */
	getCountryLists() {

		this.formService.getCountryLookUp().subscribe(res => {
			
			this.countryListArray = _.cloneDeep(res.data);

			setTimeout(() => {
				if (this.editMode && this.addressFormGroup.get('country').value) {
					this.getStateLists(this.addressFormGroup.get('country').value);
				}
			}, 300);

		})
	}

	/**
	 * This method is use to get state list using api
	 * @param name - country name
	 */
	getStateLists(name) {

		let obj = _.filter(this.countryListArray, { 'name': name })[0];

		this.formService.getStateLookUp(obj.id).subscribe(res => {

			this.stateListArray = _.cloneDeep(res.data);

			if (this.editMode && this.addressFormGroup.get('state').value) {
				this.getCityLists(this.addressFormGroup.get('state').value);

			}
		})
	}

	/**
	 * This method is use to get city list using api
	 * @param name - state name
	 */
	getCityLists(name) {

		let obj = _.filter(this.stateListArray, { 'name': name })[0];

		this.formService.getCityLookUp(obj.id).subscribe(res => {
			this.cityListArray = _.cloneDeep(res.data);
		})
	}


}
