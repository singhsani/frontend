import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
	selector: 'control-messages',
	template: `<mat-error *ngIf="errorMessage !== null">{{errorMessage}}</mat-error>`,
	styles: [`.mat-error { position: absolute; bottom: -15px; left: 0;font-size: 11px;}`]
})
export class ControlMessagesComponent {

	@Input() control: FormControl;
	@Input() errorMsg: string = '';

	constructor() { }

 /**
     * This method is use to return validation errors
     */
  get errorMessage() {
	if(!this.errorMsg){
		for (let propertyName in this.control.errors) {
			if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
				return ValidationService.getValidatorErrorMessage(this.getName(this.control), propertyName, this.control.errors[propertyName]);
			}
		}

		return null;
	}else{
		return this.errorMsg;
	}
}

set errorMessage(temp :string){
	this.errorMessage = temp;
}

	/**
	 * This method used to find the control name
	 * @param control - AbstractControl
	 */
	private getName(control: AbstractControl): string | null {
		let group = <FormGroup>control.parent;

		if (!group) {
			return null;
		}

		let name: string;

		Object.keys(group.controls).forEach(key => {
			let childControl = group.get(key);

			if (childControl !== control) {
				return;
			}

			if (key === 'code')
				name = 'this field';
			else
				name = key;
		});

		return name;
	}

}
