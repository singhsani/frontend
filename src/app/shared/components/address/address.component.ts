import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { ValidationService } from './../../services/validation.service';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

	@Input() addressFormGroup: FormGroup;
	// @Input() readOnly: boolean;

	translateKey: string = 'addressScreen';

	constructor() { }

	ngOnInit() {  }

	/**
	 * Method use to initialise form controls for address form group
	 */
	addressControls() {
		let addrObj = {
			// id: null,
			// uniqueId: null,
			// version: null,
			// addressType: [''],
			// houseNo: ['', [Validators.required, Validators.maxLength(5)]],
			// tenamentNo: ['', Validators.maxLength(60)],
			// buildingName: ['', Validators.maxLength(60)],
			// state: ['Gujrat', [Validators.required, Validators.maxLength(60)]],
			// district: ['Vadodara', [Validators.required, Validators.maxLength(60)]],
			// talukaName: ['', [Validators.required, Validators.maxLength(60)]],
			// pincode: ['', [Validators.maxLength(6), Validators.minLength(6)]],
			// addressLine1: ['', Validators.maxLength(60)],
			// addressLine2: ['', Validators.maxLength(60)],
			// addressLine3: ['', Validators.maxLength(60)],
			// village: ['', Validators.maxLength(60)]

			id: null,
			uniqueId: null,
			version: null,
			addressType: null,
			buildingName: [null, [Validators.maxLength(60), ValidationService.buildingNameValidator]],
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


}
