import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/validation.service';

import * as _ from 'lodash';

@Component({
	selector: 'app-hos-action-bar',
	templateUrl: './hos-action-bar.component.html',
	styleUrls: ['./hos-action-bar.component.scss']
})
export class HosActionBarComponent implements OnInit, OnChanges {

	translateKey: string = 'actionBarScreen';

	@Input() form: FormGroup;
	@Input() step: string;
	commonForm: FormGroup;
	@Input() uploadFiles: any;


	isSaveBtnDisabled: boolean = false;
	isSubmitBtnDisabled: boolean = false;


	isBtnsDisabled: boolean = true;
	uploadFilesArray: Array<any> = []

	@Output() handleErrors = new EventEmitter<any>();
	@Output() stepReset = new EventEmitter<any>();

	constructor(
		private formService: HosFormActionsService,
		private route: Router, private fb: FormBuilder,
		private toastr: ToastrService,
		private commonService: CommonService) {
	}

	ngOnInit() {
		this.formService.apiType = this.form.get('apiType').value;
		this.commonFormControls();
		this.uploadFilesArray = this.uploadFiles;

		setTimeout(() => {
			if (this.form.value.hasOwnProperty('canEdit') && !this.form.value.canEdit && this.form.value.canEdit != null) {
				this.form.disable();
				this.isBtnsDisabled = false;
			}
		}, 600);

	}

	/**
	 * Method is responsible to check required file upload.
	 */
	mandatoryFileCheck() {
		return new Promise<any>((resolve, reject) => {
			this.formService.getFormData(this.form.get('serviceFormId').value).subscribe(respData => {
				let tempArray = [];
				respData.attachments.forEach(element => {
					tempArray.push(element.fieldIdentifier);
				});
				this.uploadFilesArray.forEach(el =>{
					if(tempArray.indexOf(el.fieldIdentifier) === -1){
						resolve({ fileName: el.labelName, status: false });
						return;
					}
				});
				resolve({fileName:"",status:true});
			})
		})
	}

	/**
	 * Method to capture change event.
	 */
	ngOnChanges() {
		this.uploadFilesArray = this.uploadFiles;
	}

	/**
	 * This method is used for save form as draft using API
	 */
	saveAsDraft() {
		console.log(this.form.value)

		this.isSaveBtnDisabled = true;

		this.formService.saveFormData(this.form.getRawValue()).subscribe(
			res => {
				this.form.patchValue(res);
				this.isSaveBtnDisabled = false;
				document.getElementById('matStepperNextBtn').click();
				this.toastr.success(`${this.form.value.serviceDetail.name} information successfully saved`);
			},
			err => {
				this.markFormGroupTouched(this.form);

				this.isSaveBtnDisabled = false;
				let count = 1;
				for (const key in this.form.controls) {
					if (key == err.error[0].property) {
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

		this.isSubmitBtnDisabled = true;
		this.markFormGroupTouched(this.form);

		var count = 1;

		if (this.form.valid) {
			this.mandatoryFileCheck().then(data => {
				if (data.status) {
					this.formService.submitFormData(this.form.get('serviceFormId').value).subscribe(res => {
						if (res.success) {
							this.form.get('canEdit').setValue(false);
						}

						this.toastr.success(`${this.form.value.serviceDetail.name} information successfully submit`);
						this.isSubmitBtnDisabled = false;
						this.isBtnsDisabled = false;
						this.form.disable();
					},
						err => {
							this.isSubmitBtnDisabled = false;
							if (err.status === 402) {
								this.commonService.paymentAlert('', '', '', cb => {
									this.formService.makePayment(err.error.data.transactionId).subscribe(res => {
										this.toastr.success('Your payment has been processed successfully');
									});
								});
							}
						}
					);
				} else {
					this.commonService.openAlert("File Upload", "Please Upload Mandatory File ".concat(data.fileName), "warning");
					this.isSubmitBtnDisabled = false;
					return
				}

			})

		} else {
			this.isSubmitBtnDisabled = false;
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

		//temp condition
		if (this.form.get('apiType').value != 'marriageReg') {

			this.form.addControl('firstName', new FormControl('', [Validators.required, ValidationService.nameValidator]));
			this.form.addControl('middleName', new FormControl('', [ ValidationService.nameValidator]));
			this.form.addControl('lastName', new FormControl('', [Validators.required, ValidationService.nameValidator]));
			this.form.addControl('contactNo', new FormControl('', [Validators.required, Validators.maxLength(10)]));
			this.form.addControl('email', new FormControl('', [Validators.required, ValidationService.emailValidator]));
			this.form.addControl('aadhaarNo', new FormControl('', [Validators.maxLength(12)]));
		}

		this.form.addControl('serviceDetail', new FormGroup({
			code: new FormControl(),
			name: new FormControl(),
			gujName: new FormControl(),
			feesOnScrutiny: new FormControl()
		}));
		/* ended common form controls in existing formGroups*/

		this.commonForm = this.fb.group(formControlObj);

	}

	/**
	 * Marks all controls in a form group as touched
	 * @param formGroup - The group to caress
	*/
	markFormGroupTouched(formGroup: FormGroup) {
		if (Reflect.getOwnPropertyDescriptor(formGroup, 'controls')) {
			(<any>Object).values(formGroup.controls).forEach(control => {
				if (control instanceof FormGroup) {
					// FormGroup
					this.markFormGroupTouched(control);
				} else if (control instanceof FormArray) {
					control.controls.forEach(c => {
						if (c instanceof FormGroup)
							this.markFormGroupTouched(c);
					});
				}
				// FormControl
				control.markAsTouched();
			});
		}
	}
}
