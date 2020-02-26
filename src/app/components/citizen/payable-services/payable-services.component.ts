import { ValidationService } from './../../../shared/services/validation.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../shared/services/common.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';

import * as _ from 'lodash';

@Component({
	selector: 'app-payable-services',
	templateUrl: './payable-services.component.html',
	styleUrls: ['./payable-services.component.scss']
})
export class PayableServicesComponent implements OnInit {

	translateKey: string = "addTransctionScreen";

	paymentsForm: FormGroup;
	PayableServices: Object[];
	currPaySerData: any;
	isRecordExists: boolean = false;
	payModeArr: Array<any> = [
		{ name: 'Net Banking', code: 'NETBANKING' }, { name: 'Debit / Credit Card banking', code: 'CARDBANKING' }
	];
	placeholder: string = 'Reference Number';

	constructor(
		private dialog: MatDialog,
		private formService: FormsActionsService,
		private fb: FormBuilder,
		private toaster: ToastrService,
		private commonService: CommonService,
	) {
		this.getPayableServicesList();
		this.createPayementControls();
	}

	ngOnInit() {

	}

	/**
	 * This method is used to initialize controls for payement form
	 */
	createPayementControls() {
		this.paymentsForm = this.fb.group({
			refNumber: [null, Validators.required],
			amount: [0, ValidationService.amountValidator],
			payableServices: this.fb.group({
				code: [null, Validators.required]
			}),
			payMode: this.fb.group({
				code: null
			})
		});
	}

	/**
	 * 
	 * @param payData - json data as payment data.
	 */
	makePayment(payData) {

		if (this.paymentsForm.get('amount').value < 0 || !this.paymentsForm.get('amount').value) {
			this.commonService.openAlert("Warning", "Please enter some amount", "warning");
			return;
		}

		if (this.paymentsForm.get('amount').invalid) {
			this.markFormGroupTouched(this.paymentsForm);
			this.commonService.openAlert("Warning", "Please enter valid amount", "warning");
			return;
		}

		if (!this.paymentsForm.get('payMode.code').value) {
			this.commonService.openAlert("Warning", "Select payment mode", "warning");
			return;
		}

		let obj = {
			payableServiceType: payData.payableServices.code,
			refNumber: payData.refNumber,
			amount: payData.amount,
			paymentMode: payData.payMode.code,
		 	returnUrl: environment.returnUrl
		}

		this.formService.paymentGatewayUrl(obj).subscribe(res => {
			window.open(res.data, "_self");
		});

		// this.formService.apiType = 'servicePayment';

		// let paymentData = {
		// 	"refNumber": payData.refNumber,
		// 	"amount": payData.amount,
		// 	"serviceType": payData.payableServices.code,
		// }

		// this.commonService.submitAlert('Payment Confirmation', "Are you sure?", 'warning', '', performDelete => {

		// 	this.formService.paymentServicePost(paymentData).subscribe(respData => {

		// 		this.dialog.closeAll();

		// 		this.commonService.openAlert('Payment Successful', '', 'success',
		// 			'<p> Id : ' + respData.id + '</p><br>' +
		// 			'<p> Amount : ' + respData.amount + '</p><br>' +
		// 			'<p> Reference Number : ' + respData.refNumber + '</p><br>' +
		// 			'<p> Service : ' + respData.serviceName + '</p><br>' +
		// 			'<p> Status : ' + respData.paymentStatus + '</p><br>',
		// 			cb => {
		// 			});

		// 		this.paymentsForm.markAsPristine();
		// 		this.paymentsForm.markAsUntouched();
		// 		this.isRecordExists = false;
		// 		this.paymentsForm.reset();
		// 	});
		// })
	}

	/**
	 * Method is used to get all payable services list from api.
	 */
	getPayableServicesList() {
		this.formService.apiType = 'payableServices';
		this.formService.paymentServiceGet().subscribe(respData => {
			this.PayableServices = respData.list;

			if (this.paymentsForm.get('payableServices').get('code')) {
				this.showHideSearchable(this.paymentsForm.get('payableServices').get('code').value);
			}
		})
	}

	/**
	 * This method is used for show hide searchable option
	 * @param searchable - boolean (true/false)
	 */
	showHideSearchable(paySerCode) {

		if (paySerCode === 'PROFESSIONAL_TAX')
			this.placeholder = 'EC / RC Number';
		else
			this.placeholder = 'Reference Number';

		this.isRecordExists = false;
		this.paymentsForm.get('amount').setValue(null);
		this.paymentsForm.get('refNumber').setValue(null);
		this.currPaySerData = _.filter(this.PayableServices, { 'code': paySerCode })[0];
	}

	/**
	 * - This method is used to get the type of tax and referance number and get the amount from the API
	 */
	getAmountData() {

		if (this.paymentsForm.invalid) {
			this.markFormGroupTouched(this.paymentsForm);
			this.commonService.openAlert("Warning", "Enter all the required information", "warning");
			return;
		}

		let serviceType = this.paymentsForm.get('payableServices').get('code').value;
		let refNumber = this.paymentsForm.get('refNumber').value;

		this.formService.apiType = 'searchPayment';

		let resData = {
			refNumber: refNumber,
			serviceType: serviceType
		}

		this.isRecordExists = false;
		this.paymentsForm.get('amount').setValue(null);

		this.formService.paymentServicePost(resData).subscribe(
			res => {
				if (res) {
					this.isRecordExists = true;

					if (this.currPaySerData.fixAmount) {
						this.paymentsForm.get('amount').setValue(res.amount);
						this.paymentsForm.get('amount').disable();
					} else {
						this.paymentsForm.get('amount').setValue(res.amount);
					}
				} else {
					this.toaster.warning('No record found !');
				}

			}
		);
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
				}
				// FormControl
				control.markAsTouched();
			});
		}
	}


}
