import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
	selector: 'control-messages',
	template: `<mat-error *ngIf="errorMessage !== null">{{errorMessage}}</mat-error>`,
	styles: [`.mat-error { margin-top: -20px !important;font-size: 15px !important;}`]
})
export class ControlMessagesComponent {

	@Input() control: FormControl;

	constructor() { }

	/**
	 * This method is use to return validation errors
	 */
	get errorMessage() {
		for (let propertyName in this.control.errors) {
			if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
				return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
			}
		}

		return null;
	}

}
