import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Router,ActivatedRoute } from '@angular/router';

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
	@Output() stepReset = new EventEmitter<any>();

	apiType: string = '';

	constructor(
		private formService: FormsActionsService,
		private route: Router,
		private toastr: ToastrService) {
	}

	ngOnInit() {
		// set the apiType on initialize so can we do not need to write repeadtly
		this.apiType = this.form.get('apiType').value;
		this.formService.apiType = this.apiType;
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
		var count = 1;
		if (this.form.valid) {
			this.formService.submitFormData(this.form.get('serviceFormId').value).subscribe(res => {
				this.toastr.success(`${this.apiType} information successfully submit`);
			},
				err => {

				}
			);
		} else {
			console.log(this.form.controls);
			let count = 1;
			for (const key in this.form.controls) {
				if (this.form.get(key).invalid) {
					console.log(count);
					this.handleErrors.emit(count)
					break;
				}
				count++
			}
		}
	}

	/**
	 * this method is use for proceed to payment
	 */
	proceedToPayment() {
		this.route.navigate(['citizen/payment-gateway']);
	}

	/**
	 * This method is use for clear the form
	 */
	resetForm() {
		this.form.reset();
		this.stepReset.emit();
	}

}
