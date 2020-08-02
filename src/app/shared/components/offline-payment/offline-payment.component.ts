import { ManageRoutes } from '../../../config/routes-conf';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { CommonService } from '../../services/common.service';
import { ValidationService } from '../../services/validation.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OfflinePaymentService } from '../../services/offlinePayment.service';
import * as moment from 'moment';

@Component({
	selector: 'app-offline-payment',
	templateUrl: './offline-payment.component.html',
	styleUrls: ['./offline-payment.component.scss']
})
export class OfflinePaymentComponent implements OnInit, OnChanges {

	payData: any;

	payModes = [];

	bankList = [];

	paymentsForm: FormGroup;

	paymentModeSelect : String = "CASH";

	constructor(
		private session: SessionStorageService,
		private offlinePaymentService: OfflinePaymentService,
		private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) data,
		private dialogRef: MatDialogRef<OfflinePaymentComponent>) {
		this.payData = data.payData;
		
	}

	/**
	 * Method initialize other opertaions.
	 */
	ngOnInit() {

		this.offlinePaymentService.getLookups().subscribe(lookpsData => {
			if (lookpsData) {
				this.payModes = lookpsData.PAY_MODE;
				this.bankList = lookpsData.BANK_NAME_LIST;

			}
		});

		this.paymentsForm = this.fb.group({
			amount: [null, [Validators.required]],
			paymentMode: [null, [Validators.required]],
			bankName: [null],
			branchName: [null],
			chequeNumber: [null],
			chequeDate: [null],
			posTransactionId: [null],
			accountNumber: [null],
			accountHolderName: [null],
			remarks: [null]
		});

		this.paymentsForm.get("amount").setValue(this.payData.amount);
		this.paymentsForm.get('paymentMode').setValue(this.paymentModeSelect);
	}

	ngOnChanges() {

	}

	changePayMode() {
	
		if (this.paymentModeSelect == 'DD_BANKER_CHEQUE' ||
		this.paymentModeSelect == 'CHEQUE') {
			
		this.paymentsForm = this.fb.group({
			amount: [null, [Validators.required]],
			paymentMode: [null, [Validators.required]],
			bankName: [null,[Validators.required]],
			branchName: [null,[Validators.required]],
			chequeNumber: [null,[Validators.required]],
			chequeDate: [null,[Validators.required]],
			posTransactionId: [null],
			accountNumber: [null,[Validators.required]],
			accountHolderName: [null,[Validators.required]],
			remarks: [null]
		});

		} else if (this.paymentModeSelect == 'POS') {
			this.paymentsForm = this.fb.group({
				amount: [null, [Validators.required]],
				paymentMode: [null, [Validators.required]],
				bankName: [null],
				branchName: [null],
				chequeNumber: [null],
				chequeDate: [null],
				posTransactionId: [null,[Validators.required]],
				accountNumber: [null],
				accountHolderName: [null],
				remarks: [null]
			});
		} else if (this.paymentModeSelect == 'CASH'){
			
			this.paymentsForm = this.fb.group({
				amount: [null, [Validators.required]],
				paymentMode: [null, [Validators.required]],
				bankName: [null],
				branchName: [null],
				chequeNumber: [null],
				chequeDate: [null],
				posTransactionId: [null],
				accountNumber: [null],
				accountHolderName: [null],
				remarks: [null]
			});
		}

		this.paymentsForm.get("amount").setValue(this.payData.amount);
		this.paymentsForm.get('paymentMode').setValue(this.paymentModeSelect);
	}

	commonValidators() {

	}

	save() {
		if(this.paymentsForm.get('chequeDate').value){
			this.paymentsForm.get('chequeDate').setValue(moment(this.paymentsForm.get('chequeDate').value).format("YYYY-MM-DD"));
		}
	
		this.dialogRef.close(this.paymentsForm.value);
	}

	cancel() {
		this.dialogRef.close(null);
	}


}