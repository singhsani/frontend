import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-action-bar',
	templateUrl: './action-bar.component.html',
	styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

	@Input()
	form: FormGroup;

	@Input()
	step: string;

	@Output() handleErrors = new EventEmitter<any>();

	apiType: string = '';
	serviceFormId: number = 0;

	constructor(private formService: FormsActionsService, private toastr: ToastrService) {
	}

	ngOnInit() {
		// set the apiType and formId on initialize so can we do not need to write repeadtly
		this.apiType = this.form.get('apiType').value;
		this.formService.apiType = this.apiType;
		this.serviceFormId = this.form.get('serviceFormId').value;
	}

	/**
	 * This method is used for save form as draft using API
	 */
	saveAsDraft() {

		this.formService.saveFormData(this.form.value).subscribe(res => {
			this.toastr.success(`${this.apiType} information successfully saved`);
		});

	}

	/**
	 * This method is use for submit form using API
	 */
	onSubmit() {

		if (this.form.valid) {
			this.formService.submitFormData(this.serviceFormId).subscribe(res => {
				this.toastr.success(`${this.apiType} information successfully submit`);
			},
				err => {
					
				}
			);

		} else {
			this.handleErrors.emit(this.form.valid);
		}

	}

	/**
	 * this method is use for proceed to payment
	 */
	proceedToPayment() {

	}

}
