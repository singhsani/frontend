import { CommonService } from './../../../shared/services/common.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';
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
	myControl: FormControl = new FormControl();
	modesOfPayment: any = ['CASH', 'Check/DD', 'Card'];
	currPaySerData: any;
	isSearchBtnDisplay: boolean = true;

	constructor(
		private dialog: MatDialog,
		private formService: FormsActionsService,
		private router: Router,
		private fb: FormBuilder,
		private commonService: CommonService
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
			refNumber: [null, [Validators.required]],
			amount: [null, [Validators.required]],
			payableServices: this.fb.group({
				code: [null, Validators.required]
			}),
			paymentMode: this.fb.group({
				code: [null, Validators.required]
			}),
			bankName: [null, Validators.required],
			branchName: [null, Validators.required],
			checkDdNumber: [null, Validators.required],
			acNo: [null, Validators.required],
			acHolderName: [null, Validators.required],
			checkDdDate: [null, Validators.required],
			cardNo: [null, Validators.required],
			nameOnCard: [null, Validators.required],
			CVV: [null, Validators.required],
			cardExpiry: [null, Validators.required],
			transNo: [null, Validators.required]
		});
	}

	/**
	 * 
	 * @param payData - json data as payment data.
	 */
	makePayment(payData) {
		this.formService.apiType = 'servicePayment';

		let paymentData = {
			"refNumber": payData.refNumber,
			"amount": payData.amount,
			"serviceType": payData.payableServices.code,
			"bankName": payData.bankName,
			"branchName": payData.branchName,
			"chequeDate": payData.checkDdDate,
			"paymentMode": payData.paymentMode.code,
			"transactionId": payData.transNo
		}

		this.commonService.submitAlert('Payment Confirmation', "Are you sure?", 'warning', '', performDelete => {

			this.formService.paymentServicePost(paymentData).subscribe(respData => {

				this.dialog.closeAll();

				this.commonService.openAlert('Payment Successful', '', 'success',
					'<p> Id : ' + respData.id + '</p><br>' +
					'<p> Amount : ' + respData.amount + '</p><br>' +
					'<p> Reference Number : ' + respData.refNumber + '</p><br>' +
					'<p> Service : ' + respData.serviceName + '</p><br>' +
					'<p> Status : ' + respData.paymentStatus + '</p><br>',
					cb => {
					}
				)

				this.paymentsForm.markAsPristine();
				this.paymentsForm.markAsUntouched();
				this.paymentsForm.reset();
			});
		})
	}

	/**
	 * Method is used to get all payable services list from api.
	 */
	getPayableServicesList() {
		this.formService.apiType = 'payableServices';
		this.formService.paymentServiceGet().subscribe(respData => {
			this.PayableServices = respData.list;

			if(this.paymentsForm.get('payableServices').get('code')){
				this.showHideSearchable(this.paymentsForm.get('payableServices').get('code').value);
			}
		})
	}

	/**
	 * This method is used for show hide searchable option
	 * @param searchable - boolean (true/false)
	 */
	showHideSearchable(paySerCode) {

		this.currPaySerData = _.filter(this.PayableServices, { 'code': paySerCode })[0];

	}

	/**
	 * - This method is used to get the type of tax and referance number and get the amount from the API
	 */
	getAmountData() {

		let serviceType = this.paymentsForm.get('payableServices').get('code').value;
		let refNumber = this.paymentsForm.get('refNumber').value;

		this.formService.apiType = 'searchPayment';

		let resData = {
			refNumber: refNumber,
			serviceType: serviceType
		}

		this.formService.paymentServicePost(resData).subscribe(
			res => {
				if (this.currPaySerData.fixAmount) {
					this.paymentsForm.get('amount').setValue(res.amount);
					this.paymentsForm.get('amount').disable();
				} else {
					this.paymentsForm.get('amount').setValue(res.amount);
				}
			}
		);
	}

}
