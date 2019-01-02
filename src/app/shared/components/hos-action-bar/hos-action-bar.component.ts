import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/validation.service';
import { SessionStorageService } from 'angular-web-storage';

import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-hos-action-bar',
	templateUrl: './hos-action-bar.component.html',
	styleUrls: ['./hos-action-bar.component.scss']
})
export class HosActionBarComponent implements OnInit, OnChanges {

	translateKey: string = 'actionBarScreen';

	@Input() isstepper: boolean = true;	
	@Input() form: FormGroup;
	@Input() step: string;
	commonForm: FormGroup;
	@Input() uploadFiles: any;
	@Input() stepInfo: any;

	isSaveBtnDisabled: boolean = false;
	isSubmitBtnDisabled: boolean = false;
	isBtnsDisabled: boolean = true;

	uploadFilesArray: Array<any> = []

	@Output() handleErrors = new EventEmitter<any>();
	@Output() stepReset = new EventEmitter<any>();
	@Output() tabIndex = new EventEmitter<any>();


	constructor(
		private sessionStore: SessionStorageService,
		private formService: HosFormActionsService,
		private fb: FormBuilder,
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
				this.uploadFilesArray.forEach(el => {
					if (tempArray.indexOf(el.fieldIdentifier) === -1) {
						resolve({ fileName: el.labelName, status: false });
						return;
					}
				});
				resolve({ fileName: "", status: true });
			})
		})
	}

	/**
	 * Method use to emit tab index
	 * str- back or next string
	 */
	nextOrPrevious(str) {
		if (str === 'back')
			this.tabIndex.emit(this.stepInfo.back);
		else
			this.tabIndex.emit(this.stepInfo.next);
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

		this.isSaveBtnDisabled = true;

		this.formService.saveFormData(this.form.getRawValue()).subscribe(
			res => {
				this.form.patchValue(res);
				this.isSaveBtnDisabled = false;
				if (this.isstepper) {
					this.tabIndex.emit(this.stepInfo.next);
				}
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
								let retUrl: string = '/hospital/my-applications';
								let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, 'hospital/payment-gateway-response' );
								let html =
									`
								<div class="text-center">
									<h2>Total Fee Pay</h2>
									<div class="payAmount">
										<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
									</div>
									<p>Rupees in words</p>
								</div>
								`
								this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
									window.location.href = environment.adminUrl + `#/admin/payment-gateway?retUrl=${payData.retUrl}&retPath=${payData.retPath}`;
								}, rj => {
									let errHtml = `			
										<div class="alert alert-danger">
											Please Complete Payment, Otherwise the application will be considered as in-complete
										</div>`
									this.commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
										window.location.href = environment.adminUrl + `#/admin/payment-gateway?retUrl=${payData.retUrl}&retPath=${payData.retPath}`;
									}, arj => {
										this.form.get('canEdit').setValue(false);
										//this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully submit`);
										this.isSubmitBtnDisabled = false;
										this.isBtnsDisabled = false;
										this.form.disable();
										return;
									})
									return;
								});
								return;
							}
						});
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

		this.form.addControl('firstName', new FormControl('', [ValidationService.nameValidator]));
		this.form.addControl('middleName', new FormControl('', [ValidationService.nameValidator]));
		this.form.addControl('lastName', new FormControl('', [ValidationService.nameValidator]));
		this.form.addControl('contactNo', new FormControl('', [Validators.maxLength(10)]));
		this.form.addControl('email', new FormControl('', [ValidationService.emailValidator]));
		this.form.addControl('aadhaarNo', new FormControl('', [Validators.maxLength(12)]));

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
