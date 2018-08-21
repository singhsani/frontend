import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from './../../services/common.service';
import { ValidationService } from './../../services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'angular-web-storage';

@Component({
	selector: 'app-action-bar',
	templateUrl: './action-bar.component.html',
	styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit, OnChanges {

	translateKey: string = 'actionBarScreen';
	@Input() isstepper: boolean = true;
	@Input() step: string;
	@Input() form: FormGroup;
	@Input() uploadFiles: any;
	@Input() stepInfo: any;

	@Output() handleErrors = new EventEmitter<any>();
	@Output() tabIndex = new EventEmitter<any>();

	uploadFilesArray: Array<any> = []

	isSaveBtnDisabled: boolean = false;
	isSubmitBtnDisabled: boolean = false;
	isBtnsDisabled: boolean = true;

	constructor(
		private formService: FormsActionsService,
		private sessionStore: SessionStorageService,
		private router: Router, private fb: FormBuilder,
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

	ngOnChanges() {
		this.uploadFilesArray = this.uploadFiles;
	}

	/**
	 * Method is responsible to check required file upload.
	 */
	mandatoryFileCheck() {
		return new Promise<any>((resolve, reject) => {
			this.formService.getFormData(this.form.get('serviceFormId').value).subscribe(respData => {
				if (respData.attachments) {
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
				} else {
					resolve({ fileName: "", status: true })
				}
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
				this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully saved`);
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
		var count = 1;
		this.markFormGroupTouched(this.form);

		if (this.form.valid) {
			this.mandatoryFileCheck().then(data => {
				if (data.status) {
					this.formService.submitFormData(this.form.get('serviceFormId').value).subscribe(res => {

						if (res.success) {
							this.form.get('canEdit').setValue(false);
						}

						this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully submit`);
						this.isSubmitBtnDisabled = false;
						this.isBtnsDisabled = false;
						this.form.disable();
					},
						err => {
							this.isSubmitBtnDisabled = false;

							if (err.status === 402) {

								let paymentData = err.error.data;

								let payData = {
									id: null,
									uniqueId: null,
									version: null,
									refNumber: paymentData.serviceFormId,
									response: JSON.stringify({
										data: "paid",
										status: true
									}),
									transactionId: paymentData.transactionId,
									paymentStatus: "SUCCESS",

									retUrl: "http://192.168.10.107:8080/vmcportal/",
									retPath: 'citizen/payment-gateway-response',
									myApplicationUrl: '/citizen/my-applications'
								}

								this.sessionStore.set('paymentData', JSON.stringify(payData));

								this.commonService.paymentAlert('', '', '', cb => {
									//http://192.168.10.107:8080/vmcadminportal/
									window.location.href = `http://192.168.10.107:8080/vmcadminportal/#/admin/payment-gateway?retUrl=${payData.retUrl}&retPath=${payData.retPath}`;
								});

								return;
							}
						}
					);

				} else {
					this.commonService.openAlert("File Upload", "Please Upload Mandatory File ".concat(data.fileName), "warning");
					this.isSubmitBtnDisabled = false;
					return
				}
			});
		} else {
			this.isSubmitBtnDisabled = false;
			let count = 1;
			for (const key in this.form.controls) {
				if (this.form.get(key).invalid) {

					if (this.form.get('apiType').value == 'marriageReg') {
						let groomreligionChange = this.form.controls.groomReligion.get("code").value;
						let bridereligionChange = this.form.controls.brideReligion.get("code").value;
						if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {
							if (groomreligionChange != bridereligionChange) {
								this.handleErrors.emit(67);
								break;
							}
						}
					}

					this.handleErrors.emit(count);
					break;
				}
				count++;
			}

		}
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

		}

		/* started common form controls in existing formGroups*/
		_.forEach(formControlObj, (value, key) => {
			if (!_.isObject(value))
				this.form.addControl(key, new FormControl());
		});

		//temp condition

		this.form.addControl('firstName', new FormControl('', [ValidationService.nameValidator]));
		this.form.addControl('middleName', new FormControl('', ValidationService.nameValidator));
		this.form.addControl('lastName', new FormControl('', [ValidationService.nameValidator]));
		this.form.addControl('aadhaarNo', new FormControl('', Validators.maxLength(12)));
		this.form.addControl('contactNo', new FormControl('', [Validators.maxLength(10)]));
		this.form.addControl('email', new FormControl('', [ValidationService.emailValidator]));

		this.form.addControl('serviceDetail', new FormGroup({
			code: new FormControl(),
			name: new FormControl(),
			gujName: new FormControl(),
			feesOnScrutiny: new FormControl()
		}));
		/* ended common form controls in existing formGroups*/

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