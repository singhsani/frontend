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
			addressType: [],
			houseNo: ['', [Validators.required, Validators.maxLength(5)]],
			tenamentNo: ['', [Validators.maxLength(60)]],
			buildingName: ['', [Validators.maxLength(60)]],
			state: ['', [Validators.required, Validators.maxLength(60)]],
			district: ['', [Validators.required, Validators.maxLength(60)]],
			talukaName: ['', [Validators.required, Validators.maxLength(60)]],
			pincode: ['', [Validators.maxLength(6)]],
			addressLine1: ['', [Validators.maxLength(60)]],
			addressLine2: ['', [Validators.maxLength(60)]],
			addressLine3: ['', [Validators.maxLength(60)]],
			village: ['', [Validators.maxLength(60)]]
		}

		return addrObj;
	}


}
