import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { CommonService } from './../../services/common.service';
import { ValidationService } from './../../services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from '../../../../environments/environment';

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
	@Output() handleOnSaveAndNext = new EventEmitter<any>();

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

	/**
	 * Method initialize other opertaions.
	 */
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
							resolve({ fileName: el.labelName ? el.labelName : el.documentLabelEn, status: false });
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
				this.handleOnSaveAndNext.emit(res);
				this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully saved`);
			},
			err => {
				this.onSaveError(err);
			}
		);
	}

	/**
	 * This method is use for submit form using API
	 */
	onSubmit() {
		this.isSaveBtnDisabled = true;
		this.formService.saveFormData(this.form.getRawValue()).subscribe(
			res => {
				this.form.patchValue(res);
				if (this.isstepper) {
					this.tabIndex.emit(this.stepInfo.next);
				}
				this.handleOnSaveAndNext.emit(res);

				// call submit api after form save successfully
				//this.isSubmitBtnDisabled = true;
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
								this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
							},
								err => {
									this.isSubmitBtnDisabled = false;
									let retUrl: string = '/citizen/my-applications';
									if (err.status === 402) {
										if (this.form.getRawValue().serviceDetail.appointmentRequired) {
											retUrl = `/citizen/appointmant/schedule-appointment/slot-booking/` + this.form.getRawValue().serviceFormId + `/` + this.form.getRawValue().serviceDetail.code;
										}

										let payData = this.commonService.storePaymentInfo(err.error.data, retUrl);
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
											})
											return;
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
			},
			err => {
				this.isSaveBtnDisabled = false;
				this.onSaveError(err);
			}
		);



	}

	/**
	 * Method is used to perform appointment.
	 */
	payAndScheduleAppointment() {
		//citizen/appointmant/schedule-appointment/slot-booking/45/HEL-MR

		this.isSaveBtnDisabled = true;
		this.formService.saveFormData(this.form.getRawValue()).subscribe(saveResp => {
			this.form.patchValue(saveResp);
			this.isSaveBtnDisabled = false;
			if (this.isstepper) {
				this.tabIndex.emit(this.stepInfo.next);
			}
			this.handleOnSaveAndNext.emit(saveResp);
			//this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully saved`);
			this.onSubmit();
		},
			err => {
				this.onSaveError(err);
			})
	}

	/**
	 * Method Is used to throw error on save.
	 * @param err - Error Response.
	 */
	onSaveError(err: any) {
		this.markFormGroupTouched(this.form);
		this.isSaveBtnDisabled = false;
		let count = 1;
		for (const key in this.form.controls) {
			if (err.error[0] && key == err.error[0].property) {
				this.handleErrors.emit(count);
				break;
			}
			count++;
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
			agree: null,
			paymentStatus: null,
			canEdit: null,
			canDelete: null,
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
			feesOnScrutiny: new FormControl(),
			appointmentRequired: new FormControl(),
			serviceUploadDocuments: this.fb.array([])
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