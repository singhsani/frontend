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
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { OfflinePaymentComponent } from '../offline-payment/offline-payment.component';

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
	@Input('paymentGateway') paymentGateway: any;

	@Output() handleErrors = new EventEmitter<any>();
	@Output() tabIndex = new EventEmitter<any>();
	@Output() handleOnSaveAndNext = new EventEmitter<any>();

	uploadFilesArray: Array<any> = []

	isSaveBtnDisabled: boolean = false;
	isSubmitBtnDisabled: boolean = false;
	isBtnsDisabled: boolean = true;

	public applicantName: string
	public mobileNo: string;
	public email: string;
	constructor(
		private formService: FormsActionsService,
		private sessionStore: SessionStorageService,
		private router: Router, private fb: FormBuilder,
		private toastr: ToastrService,
		private session: SessionStorageService,
		private commonService: CommonService,
		private dialog: MatDialog) {
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
		if(this.formService.apiType == 'MFLicense' || this.formService.apiType == 'APLicense' || this.formService.apiType == 'APLRenewal'|| this.formService.apiType == 'APLTransfer' || this.formService.apiType == 'shop' || this.formService.apiType == 'shop-transfer' || this.formService.apiType == 'vendor' || this.formService.apiType == 'MFTransfer' || this.formService.apiType == 'MFRenewal' || this.formService.apiType == 'vehicle' || this.formService.apiType == 'pecForm' || this.formService.apiType == 'waterTankerSupply' || this.formService.apiType =='gasConnectionNoc' || this.formService.apiType == 'electricConnectionNoc' || this.formService.apiType == 'fireCertificate'  || this.formService.apiType == 'shop-intimation-to-certification' || this.formService.apiType == 'contractor' || this.formService.apiType == 'marriageReg' || this.formService.apiType == 'duplicateMarriageReg'){
			if (this.isstepper) {
				this.tabIndex.emit(this.stepInfo.next);
			}
				this.isSaveBtnDisabled = true;
				this.formService.saveFormData(this.form.getRawValue()).subscribe(
					res => {
						this.form.patchValue(res);
						this.isSaveBtnDisabled = false;
						this.handleOnSaveAndNext.emit(res);
						if(res.serviceType == "VENDOR_REG" && this.stepInfo.step == 'final'){
							this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully saved`);
						}
					},
					err => {
						this.onSaveError(err);
					}
				);
		
		}
		else{
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
	}

	getUserDetailsAndSubmit() {
		this.tabIndex.emit(this.stepInfo.next)
		if (this.form.valid && (this.commonService.isGuestUser() || this.commonService.fromAdmin())) {
			this.mandatoryFileCheck().then(data  =>  {

				if(data.status){

					if(this.checkForIAgress()) {
						this.openDialogBox().subscribe(details => {
							if (details) {
								this.setUserData(details)
								this.onSubmit()
							}
			
						})
					}
					
		
				}
				else if(data.status == false){
					this.commonService.openAlert("File Upload", "Please Upload Mandatory File ".concat(data.fileName), "warning");
					this.isSubmitBtnDisabled = false;
					return
				}

		 })
		
			
		} else {
			this.onSubmit();
			

		}
	}


	/**
	 * This method is use for submit form using API
	 */
	onSubmit() {
		this.isSubmitBtnDisabled = true;
		var count = 1;
		this.markFormGroupTouched(this.form);
		

		if (this.commonService.fromAdmin() || this.commonService.isGuestUser()) {
			// TODO save contact number in java
			for (const field in this.form.controls) { // 'field' is a string
				if (!this.form.get(field).valid) {
					console.log(field);
				}; // 'control' is a FormControl  

			}
			if(!this.form.get("contactNo").valid){
				this.form.get("contactNo").setValue("1234567890");
			}
		}

		this.printFormInvalidControl(this.form, "");
		
		// for (const field in this.form.controls) { // 'field' is a string
		// 	if (!this.form.get(field).valid) {
		// 		console.log(field);
		// 	}; // 'control' is a FormControl  

		// }

		
		if (this.form.valid) {

			// if((this.form.get('apiType').value == "shopLicense" || this.form.get('apiType').value == 'shopRenwalLic') && !this.form.get('agree').value){
			// 	this.commonService.openAlert("Field Error", "Please agree condition of form", 'warning');
			// 	this.isSubmitBtnDisabled = false;
			// 	return;
			// }


			this.mandatoryFileCheck().then(data => {
				if (data.status) {

					if(this.checkForIAgress()) {
						this.saveForm()
					} 

					
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
					// if (this.form.get('apiType').value == 'marriageReg') {
					// 	let groomreligionChange = this.form.controls.groomReligion.get("code").value;
					// 	let bridereligionChange = this.form.controls.brideReligion.get("code").value;
					// 	if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {
					// 		if (groomreligionChange != bridereligionChange) {
					// 			this.handleErrors.emit(67);
					// 			break;
					// 		}
					// 	}
					// }

					if(this.form.get('apiType').value == 'shop' || 
					this.form.get('apiType').value == 'shop-transfer' || this.form.get('apiType').value == 'afhForm' || this.form.get('apiType').value == 'vendor' || this.form.get('apiType').value == 'marriageReg' || this.form.get('apiType').value == 'shop-intimation-to-certification') {
						this.handleErrors.emit(key);
						break;
					}


					
					this.handleErrors.emit(count);
					break;
				}
				count++;
			}
		}
	}

	printFormInvalidControl(form,indent) {
		for (const field in form.controls) { // 'field' is a string
			if (!form.get(field).valid) {
				console.log(indent + field);
				const innerForm =form.get(field) as FormGroup;
				if(innerForm && innerForm.controls ) {
					this.printFormInvalidControl(innerForm, indent + " ");	
				} 	
				
			}; // 'control' is a FormControl  

		}
	}

	saveForm() {
		// call save api before submit 
		this.formService.saveFormData(this.form.getRawValue()).subscribe(
			res => {
				this.form.patchValue(res);
				this.isSaveBtnDisabled = false;
				if (this.isstepper) {
					this.tabIndex.emit(this.stepInfo.next);
				}
				this.handleOnSaveAndNext.emit(res);

				// call submit Api
				this.formService.submitFormData(this.form.get('serviceFormId').value).subscribe(
					res => {
						if (res.success) {
							this.form.get('canEdit').setValue(false);
						}
						this.toastr.success(`${this.form.getRawValue().serviceDetail.name} information successfully submit`);
						this.isSubmitBtnDisabled = false;
						this.isBtnsDisabled = false;
						this.form.disable();
						if(this.form.getRawValue().serviceDetail.code == "SHOP-ESTAB-LIC-NEW"  || this.form.getRawValue().serviceDetail.code == "SHOP-ESTAB-TRANSFER" || this.form.getRawValue().serviceDetail.code == "SHOP-ESTAB-INTI-TO-CER"){
							const url = '/citizen/my-applications' +'?id=' +this.form.getRawValue().serviceFormId + '&apiCode=' +this.form.getRawValue().serviceCode
							this.router.navigateByUrl(url);
						}
						else if (this.commonService.isGuestUser()) {
							this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENDASHBOARD"));
						} else {
							this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
						}

					},
					err => {
						this.isSubmitBtnDisabled = false;
						let retUrl: string = '/citizen/my-applications';
						let retAfterPayment: string = environment.returnUrl;

						if (err.status === 402) {
							let moduleWithAppointment = this.form.getRawValue().serviceDetail.appointmentRequired;
							const data = err.error.data;
							if (moduleWithAppointment) {
								retUrl = `/citizen/appointmant/schedule-appointment/slot-booking/` + this.form.getRawValue().serviceFormId + `/` + this.form.getRawValue().serviceDetail.code + '?apiCode='+ data.serviceCode + '&id=' + data.serviceFormId;
							} else {
								retUrl = retUrl + '?apiCode='+ data.serviceCode + '&id=' + data.serviceFormId;
							}

							let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
							
							if (this.commonService.fromAdmin()) {
								if(data.isPaymentReceipt) {
									const url = '/citizen/my-applications' + 
									'?printPaymentReceipt=' + data.isPaymentReceipt + 
									'&apiCode=' + data.serviceCode +
									'&id=' + data.serviceFormId;

									this.router.navigateByUrl(url);
							 
									// this.router.navigate([ '/citizen/my-applications' ], 
									// { queryParams: { printPaymentReceipt : true,apiCode: data.serviceCode, id: data.serviceFormId } });
									
								} else {
									this.openOfflinePaymentComponent(payData,retUrl,data.serviceCode,data.serviceFormId);
								}
							} else {
								
								let words = this.commonService.getToWords(payData.amount);
								let html =
									`
							<div class="text-center">
								<h2>Total Fee Pay</h2>
								<div class="payAmount">
									<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
								</div>
								<p>Rupees in words</p>`
									+ words + `
							</div>
							`

								this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
									this.paymentGateway.setPaymentDetailsFromActionBar(payData);
									this.paymentGateway.openModel();
									// this.formService.createTokenforServicePayment(payData).subscribe(resp => {
									// 	window.open(resp.data, "_self");
									// }, err => {
									// 	this.toastr.error(err.error.message);
									// })

								}, rj => {
									this.router.navigate(['citizen/my-applications']);
									this.form.get('canEdit').setValue(false);
									this.isSubmitBtnDisabled = false;
									this.isBtnsDisabled = false;
									this.form.disable();
									return;

									// let errHtml = `			
									// 	<div class="alert alert-danger">
									// 		Please Complete Payment, Otherwise the application will be considered as in-complete
									// 	</div>`
									// this.commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
									// 	this.formService.createTokenforServicePayment(payData).subscribe(resp => {
									// 		window.open(resp.data, "_self");
									// 	}, err => {
									// 		this.toastr.error(err.error.message);
									// 	})

									// }, arj => {
									// 	this.form.get('canEdit').setValue(false);
									// 	this.isSubmitBtnDisabled = false;
									// 	this.isBtnsDisabled = false;
									// 	this.form.disable();
									// })
									// return;
								});
								return;

							}

						} else {
							this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
						}
					}
				);
			},
			err => {
				this.isSubmitBtnDisabled = false;
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

	openDialogBox() {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {};

		const dialogRef = this.dialog.open(ApplicantDetailsComponent, dialogConfig);

		return dialogRef.afterClosed()

	}

	setUserData(details) {
		this.applicantName = details.applicantName;
		this.mobileNo = details.cellNo;
		this.email = details.email
		this.form.addControl('applicantName', new FormControl('', Validators.required));
		this.form.get('applicantName').setValue(this.applicantName);
		if (this.form.get('mobileNo')) {
			this.form.get('mobileNo').setValue(this.mobileNo);
		} else if (this.form.get('contactNo')) {
			this.form.get('contactNo').setValue(this.mobileNo);
		} else {
			this.form.addControl('mobileNo', new FormControl('', Validators.required));
			this.form.get('mobileNo').setValue(this.mobileNo);
		}

		this.form.get('email').setValue(this.email)
	}

	getUserDetailsAndPayAndScheduleMeeting() {
		console.log("Action Bar Component")

		if(this.form.get('isNriMarriage').value == false){

            this.form.get('groomPassportNumber').clearValidators();
            this.form.get('groomCountryName').clearValidators();
            this.form.get('groomVisaNumber').clearValidators();
            this.form.get('groomVisaFrom').clearValidators();
            this.form.get('groomVisaTo').clearValidators();
            this.form.get('groomSocialSecurityNumber').clearValidators();
            this.form.get('groomEligibility').clearValidators();
            this.form.get('groomDesignation').clearValidators();
            this.form.get('groomCompanyName').clearValidators();
            this.form.get('groomCompanyPhoneNumber').clearValidators();
            this.form.get('groomPhoneNumber').clearValidators();
            this.form.get('groomEmail').clearValidators();
            this.form.get('nriGroomAddress').clearValidators();
            this.form.get('groomCompanyAddress').clearValidators();
            
			this.form.get('groomNriStatus').clearValidators();
			this.form.get('groomNriFirstWitnessFirstName').clearValidators();
			this.form.get('groomNriFirstWitnessLastName').clearValidators();
			this.form.get('groomNriFirstWitnessAddress').clearValidators();
			this.form.get('groomNriFirstWitnessBirthDate').clearValidators();
			this.form.get('groomNriSecondWitnessFirstName').clearValidators();
			this.form.get('groomNriSecondWitnessLastName').clearValidators();
			this.form.get('groomNriSecondWitnessAddress').clearValidators();
			this.form.get('groomNriSecondWitnessBirthDate').clearValidators();

            this.form.get('groomParentsAddress').clearValidators();
            this.form.get('groomParentsAddressResidence').clearValidators();
            this.form.get('brideParentsAddress').clearValidators();
            this.form.get('brideParentsAddressResidence').clearValidators();
            this.form.get('priestAddressResidence').clearValidators();
        }

		if (this.checkForIAgress()) {
			if (this.form.valid && (this.commonService.isGuestUser() || this.commonService.fromAdmin())) {
				this.openDialogBox().subscribe(details => {
					if (details) {
						this.setUserData(details);
						this.payAndScheduleAppointment();
					}

				})

			} else {
				this.payAndScheduleAppointment();
			}
		}

	}


	openOfflinePaymentComponent(payData,retUrl,apiCode,id) {
		const dialogConfig = new MatDialogConfig();
		const data = { payData: payData }
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = data;
		dialogConfig.width = "60%"
		const dialogRef = this.dialog.open(OfflinePaymentComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(offlinePayData => {
			if (offlinePayData) {
				offlinePayData.refNumber = this.form.get("uniqueId").value;
				offlinePayData.response = payData.response;
				offlinePayData.paymentStatus = "SUCCESS",
				offlinePayData.transactionId =  payData.transactionId,
				offlinePayData.payableServiceType = payData.serviceCode,
				offlinePayData.amount = payData.amount;
				offlinePayData.payGateway = "OFFLINE"


				this.formService.createPayment(offlinePayData).subscribe(resData => {
					const payRespData = resData.data.responseData;
					if(resData.paymentStatus = "Paid"){
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								this.router.navigate([ retUrl.split('?')[0] ], { queryParams: { apiCode: apiCode, id: id } });
							}
						});						
					}
				}, error => {
					this.openErrorAlert(error);
				})
			}
		}, error => {
			this.openErrorAlert(error);
		})



	}

	openErrorAlert(error){
		if(error && error.error[0]) {
			this.commonService.openAlert("Error", "Error Occured for final submit : "
					 + error.error[0].message, "warning");
		} else {
			this.commonService.openAlert("Error", "Something went wrong","warning");
		}
	}


	printView(apiCode: string, apiName: string, id: number) {
		
		if(apiCode == 'SHOP-ESTAB-TRANSFER'){
			this.formService.apiType = 'shop';
	 	}else{
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		 }
	
		this.formService.printView(id).subscribe(
			htmlResponse => {
				
				let printWindow: any = window.open();
				setTimeout(() => {
					printWindow.document.body.innerHTML = htmlResponse;
					printWindow.print();
					printWindow.close();
				}, 100);
			},
			err => {
				//this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	// Bug #14031 check I agree after the document upload
	checkForIAgress() {
		if ((this.form.get('apiType').value == "shop" || this.form.get('apiType').value == "shop-transfer" || this.form.get('apiType').value == "shop-intimation-to-certification") && !this.form.get('agree').value) {
			this.commonService.openAlert("Field Error", "Should be agree with given details", 'warning');
			this.isSubmitBtnDisabled = false;
			return false;
		}else if (this.form.get('apiType').value == "vendor" && !this.form.get('acceptAndCondition').value) {
			this.commonService.openAlert("Field Error", "Should be agree with given details", 'warning');
			this.isSubmitBtnDisabled = false;
			return false;
		}
		return true;
	}



}