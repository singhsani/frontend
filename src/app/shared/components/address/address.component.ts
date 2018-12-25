import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ValidationService } from './../../services/validation.service';

import * as _ from 'lodash';
import { CountryService } from '../../services/country.service';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnChanges {

	@Input() addressFormGroup: FormGroup;
	@Input() requiredFeilds: boolean;
	@Input() isDisplayGujFields: boolean = false;
	@Input() formType: string = null;

	translateKey: string = 'addressScreen';
	countryListArray: any = [];
	stateListArray: any = [];
	cityListArray: any = [];
	isBuildinAreaReq: boolean = false;

	editMode: boolean = false;

	constructor(
		private formService: FormsActionsService,
		private countryService: CountryService
	) { }

	ngOnInit() {
		this.editMode = true;
		this.getCountryLists();
	}

	ngOnChanges() {
		if (this.requiredFeilds) {
			this.addressFormGroup.get('state').setValidators([Validators.required]);
			this.addressFormGroup.get('buildingName').setValidators([ValidationService.buildingNameValidator]);
			this.addressFormGroup.get('city').setValidators([Validators.required]);
			this.addressFormGroup.get('country').setValidators([Validators.required]);
			this.addressFormGroup.get('pincode').setValidators([Validators.required,Validators.minLength(6),Validators.maxLength(6)]);
		} else {
			this.addressFormGroup.get('state').clearValidators();
			this.addressFormGroup.get('city').clearValidators();
			this.addressFormGroup.get('country').clearValidators();
			this.addressFormGroup.get('pincode').clearValidators();
		}

		/*If in your module need buildname & area require then pass module name from component in Input property */
		if (this.formType == 'PFT') {
			this.isBuildinAreaReq = true;
			this.addressFormGroup.get('buildingName').setValidators([Validators.required]);
			this.addressFormGroup.get('area').setValidators([Validators.required]);
		}else{
			/*If no need of buildname & area require then this logic works */
			this.isBuildinAreaReq = false;
			this.addressFormGroup.get('buildingName').clearValidators();
			this.addressFormGroup.get('area').clearValidators();
		}

		/* After perform set or remove validator action this will update value and validity */
		this.addressFormGroup.get('buildingName').updateValueAndValidity();
		this.addressFormGroup.get('area').updateValueAndValidity();
		this.addressFormGroup.get('pincode').updateValueAndValidity();
		this.addressFormGroup.get('country').updateValueAndValidity();
		this.addressFormGroup.get('city').updateValueAndValidity();
		this.addressFormGroup.get('state').updateValueAndValidity();
		
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
			state: [null, [Validators.maxLength(60)]],
			district: [null, [Validators.maxLength(60)]],
			city: [null, [Validators.maxLength(60)]],
			country: [null, [Validators.maxLength(60)]],
			pincode: [null, [Validators.maxLength(6)]],

			buildingNameGuj: [null, [Validators.maxLength(180)]],
			streetNameGuj: [null, [Validators.maxLength(180)]],
			landmarkGuj: [null, [Validators.maxLength(300)]],
			areaGuj: [null, [Validators.maxLength(180)]],
			stateGuj: [null, [Validators.maxLength(180)]],
			districtGuj: [null, [Validators.maxLength(180)]],
			cityGuj: [null, [Validators.maxLength(180)]],
			countryGuj: [null, [Validators.maxLength(180)]]

		}

		return addrObj;
	}

	/**
	 * This method is use for change the country
	 * @param name - name of country
	 */
	onCountryChange(name: string) {
		if (name) {
			this.getStateLists(name);
		}

		this.stateListArray = [];
		this.cityListArray = [];
		this.addressFormGroup.get('state').setValue(null);
		this.addressFormGroup.get('city').setValue(null);
	}

	/**
	 * This method is use for change the state
	 * @param name - name of state
	 */
	onStateChange(name: string) {
		if (name) {
			this.getCityLists(name);
		}

		this.cityListArray = [];
		this.addressFormGroup.get('city').setValue(null);

	}

	/**
	 * This method is use to get country list using api
	 */
	getCountryLists() {

		this.countryService.countriesData.subscribe(data => {
			this.countryListArray = _.cloneDeep(data);
			setTimeout(() => {
				if (this.editMode && this.addressFormGroup.get('country').value) {
					this.getStateLists(this.addressFormGroup.get('country').value);
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

		this.formService.getStateLookUp(obj.code).subscribe(res => {

			this.stateListArray = _.cloneDeep(res.data);

			if (this.editMode && this.addressFormGroup.get('state').value) {
				this.getCityLists(this.addressFormGroup.get('state').value);

			}
		});
	}

	/**
	 * This method is use to get city list using api
	 * @param name - state name
	 */
	getCityLists(name) {

		let obj = _.filter(this.stateListArray, { 'name': name })[0];

		this.formService.getCityLookUp(obj.code).subscribe(res => {
			this.cityListArray = _.cloneDeep(res.data);
		});
	}

	/**
	 * Gujarati Look Up Converter.
	 * @param selectedValue - selected value from dropdown
	 * @param controlName - control name of form
	 * @param lookupName - passed lookup array
	 */
	getGujNameFromLookup(selectedValue: string, controlName: string, lookupName: Array<any>) {
		if (this.isDisplayGujFields) {
			if (lookupName && lookupName.length) {
				let dataObj = lookupName.find((obj) => obj.name === selectedValue);
				if (dataObj && dataObj.gujName) {
					this.addressFormGroup.get(controlName).setValue(dataObj.gujName);
				} else {
					this.addressFormGroup.get(controlName).setValue('');
				}
			}
		}
	}

}
