import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationService } from './../../services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-action-bar',
	templateUrl: './action-bar.component.html',
	styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

	translateKey: string = 'actionBarScreen';

	@Input() form: FormGroup;
	@Input() step: string;
	commonForm: FormGroup;

	@Output() handleErrors = new EventEmitter<any>();
	@Output() stepReset = new EventEmitter<any>();

	constructor(
		private formService: FormsActionsService,
		private route: Router, private fb: FormBuilder,
		private toastr: ToastrService) {
	}

	ngOnInit() {
		this.formService.apiType = this.form.get('apiType').value;
		this.commonFormControls();
	}

	/**
	 * This method is used for save form as draft using API
	 */
	saveAsDraft() {
		
		this.formService.saveFormData(this.form.value).subscribe(
			res => {
				console.log(res);
				this.toastr.success(`${this.form.value.serviceDetail.name} information successfully saved`);
			},
			err => {
				let count = 1;
				for (const key in this.form.controls) {
					if (key + '.' == err.error[0].property) {
						this.handleErrors.emit(count);
						break;
					}
					count++;
				}
			}
		);
	}

	/**
	 * This method is use for submit form using API
	 */
	onSubmit() {
		
		var count = 1;
		if (this.form.valid) {
			this.formService.submitFormData(this.form.get('serviceFormId').value).subscribe(res => {
				this.toastr.success(`${this.form.value.serviceDetail.name} information successfully submit`);
			},
				err => {

				}
			);
		} else {
			let count = 1;
			for (const key in this.form.controls) {
				if (this.form.get(key).invalid) {
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
		this.commonForm.patchValue(this.form.value);
		this.form.reset();
		this.form.patchValue(this.commonForm.value);
		this.stepReset.emit();
	}

	/**
	 * This method used to set common formControls in existing formGroups
	 */
	commonFormControls() {

		let formControlObj = {
			id: null,
			uniqueId: null,
			version: null,
			serviceFormId: null,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
			serviceName: null,
			fileNumber: null,
			pid: null,
			outwardNo: null,
			agree: false,
			paymentStatus: null,
			canEdit: true,
			canDelete: true,
			canSubmit: null,
			serviceDetail: {
				code: null,
				name: null,
				gujName: null,
				feesOnScrutiny: null
			}
		}

		/* started common form controls in existing formGroups*/
		_.forEach(formControlObj, (value, key) => {
			if (!_.isObject(value))
				this.form.addControl(key, new FormControl());
		});

		this.form.addControl('firstName', new FormControl('',[Validators.required, ValidationService.nameValidator]));
		this.form.addControl('middleName', new FormControl('', [Validators.required, ValidationService.nameValidator]));
		this.form.addControl('lastName', new FormControl('', [Validators.required, ValidationService.nameValidator]));
		this.form.addControl('contactNo', new FormControl('', [Validators.required, Validators.maxLength(10)]));
		this.form.addControl('email', new FormControl('', [Validators.required, ValidationService.emailValidator]));
		this.form.addControl('aadhaarNo', new FormControl('', [Validators.required, Validators.maxLength(12)]));
		this.form.addControl('serviceDetail', new FormGroup({
			code: new FormControl(),
			name: new FormControl(),
			gujName: new FormControl(),
			feesOnScrutiny: new FormControl()
		}));
		/* ended common form controls in existing formGroups*/

		this.commonForm = this.fb.group(formControlObj);

	}

}
