import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

	@Input() addressFormGroup: FormGroup;

	constructor(private fb: FormBuilder) { }

	ngOnInit() {

	}

	/**
	 * Method use to initialise form controls for address form group
	 */
	addressControls() {
		let addrObj = {
			addressType: null,
			houseNo: null,
			tenamentNo: null,
			buildingName: null,
			state: null,
			district: null,
			talukaName: null,
			pincode: null,
			addressLine1: [null, Validators.required],
			addressLine2: null,
			addressLine3: null,
			village: null
		}

		return addrObj;
	}


}
