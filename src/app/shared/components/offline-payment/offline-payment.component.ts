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

	paymentModeSelect: String = "CASH";

	responseObject: any = null;
	resMerchant: any = null;

	refno: boolean = false;

	IsposDetails: boolean = false;

	isPosPaymentAPPROVE: boolean = false;

	isUpdatePos: boolean = false;

	paymentTYpe: any = null;

	wordAmount: any;
	minDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
  maxDates = moment().add(3, 'months').format('YYYY-MM-DD');

	maxDate = new Date();
	constructor(
		private session: SessionStorageService,
		private offlinePaymentService: OfflinePaymentService,
		private fb: FormBuilder,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) data,
		private dialogRef: MatDialogRef<OfflinePaymentComponent>,
		private commonService: CommonService) {
		this.payData = data.payData;

	}

	/**
	 * Method initialize other opertaions.
	 */
	ngOnInit() {
		this.wordAmount = this.commonService.getToWords(this.payData.amount);
		if (this.payData.payableServiceType == "SHOP-ESTAB-LIC-NEW") {
			this.offlinePaymentService.getShopLookups().subscribe(lookupsData => {
				if (lookupsData) {
					this.payModes = lookupsData.PAY_MODE;
					this.bankList = lookupsData.BANK_NAME_LIST;
				}
			})
		}
		else if(this.payData.payableServiceType == "HEL-MR"){
		    this.offlinePaymentService.getLookupsForMarriage().subscribe(lookupsData => {
      				if (lookupsData) {
      					this.payModes = lookupsData.PAY_MODE;
      					this.bankList = lookupsData.BANK_NAME_LIST;
      				}
      			})
		}
		else {
			this.offlinePaymentService.getLookups().subscribe(lookpsData => {
				if (lookpsData) {
					this.payModes = lookpsData.PAY_MODE;
					this.bankList = lookpsData.BANK_NAME_LIST;

				}
			});
		}
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
				bankName: [null, [Validators.required]],
				branchName: [null, [Validators.required]],
				chequeNumber: [null, [Validators.required]],
				chequeDate: [null, [Validators.required]],
				posTransactionId: [null],
				accountNumber: [null, [Validators.required]],
				accountHolderName: [null, [Validators.required]],
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
				posTransactionId: [null],
				accountNumber: [null],
				accountHolderName: [null],
				remarks: [null],
				incomeImei: [null],
				depositImei: [null],
				depositMerchantid: [null],
				incomeMerchantid: [null],
			});

			this.PosPayment();
		} else if (this.paymentModeSelect == 'CASH') {

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


	PosPayment() {

		this.offlinePaymentService.getPortalUserPosDetails().subscribe(respData => {
			this.resMerchant = respData;

			if (this.resMerchant.depositMerchantid) {
				this.IsposDetails = true;
			} else {
				this.IsposDetails = false;
			}
		})

	}

	GetCloudBasedTxnStatus(payData) {

		if (this.responseObject == null) {
			this.commonService.openAlert("Warning", "Please complete Transaction", "warning");
			return false;
		}
		if (this.responseObject.PlutusTransactionReferenceID <= 0) {
			this.commonService.openAlert("Warning", "Please complete Transaction", "warning");
			return false;
		}
		let obj = null;

		if (this.paymentTYpe == 'Deposit') {
			obj = {
				'PlutusTransactionReferenceID': this.responseObject.PlutusTransactionReferenceID,
				'MerchantStorePosCode': this.resMerchant.depositMerchantid,
				'UserID': '',
				'IMEI': this.resMerchant.depositImei,
			}
		} else {
			obj = {
				'PlutusTransactionReferenceID': this.responseObject.PlutusTransactionReferenceID,
				'MerchantStorePosCode': this.resMerchant.incomeMerchantid,
				'UserID': '',
				'IMEI': this.resMerchant.incomeImei,
			}
		}
		this.offlinePaymentService.GetCloudBasedTxnStatus(obj).subscribe(respData => {


			if (respData.ResponseCode == 0) {
				this.paymentsForm.get('posTransactionId').setValue(this.responseObject.PlutusTransactionReferenceID);
				this.dialogRef.close(this.paymentsForm.value);
			} else {
				this.commonService.openAlert("Warning", "Please Complate Transaction", "warning");
				return false;
			}
		})
	}

	generateNumber() {

		if (this.paymentTYpe == null) {
			this.commonService.openAlert("Warning", "Please Select Income Type", "warning");
			return false;
		}
		if (!this.resMerchant.depositMerchantid) {
			this.commonService.openAlert("Warning", "Please Update Merchant Details", "warning");
			return false;
		}

		let obj = null;

		if (this.paymentTYpe == 'Deposit') {
			obj = {
				'TransactionNumber': this.payData.refNumber,
				'MerchantStorePosCode': this.resMerchant.depositMerchantid,
				'InvoiceNumber': this.payData.refNumber,
				'Amount': this.paymentsForm.get('amount').value * 100,
				'UserID': '',
				'IMEI': this.resMerchant.depositImei,
			}
		} else {
			obj = {
				'TransactionNumber': this.payData.refNumber,
				'MerchantStorePosCode': this.resMerchant.incomeMerchantid,
				'InvoiceNumber': this.payData.refNumber,
				'Amount': this.paymentsForm.get('amount').value * 100,
				'UserID': '',
				'IMEI': this.resMerchant.incomeImei,
			}
		}

		this.offlinePaymentService.posPaymentNumberGet(obj).subscribe(respData => {
			this.responseObject = respData;
			if (respData.PlutusTransactionReferenceID > 0) {
				this.refno = true;

			} else {
				this.refno = false;
			}
		})
	}

	posModeChange(value) {
		this.paymentTYpe = value.label;
	}

	changePosPayment() {

		this.isUpdatePos = true;
		if (this.resMerchant.incomeMerchantid)

			this.paymentsForm.get('incomeMerchantid').setValue(this.resMerchant.incomeMerchantid);
		this.paymentsForm.get('depositMerchantid').setValue(this.resMerchant.depositMerchantid);
		this.paymentsForm.get('incomeImei').setValue(this.resMerchant.incomeImei);
		this.paymentsForm.get('depositImei').setValue(this.resMerchant.depositImei);

	}

	UpdatePosPayment() {

		if (this.paymentsForm.get('incomeImei').value == null) {
			this.commonService.openAlert("Warning", "Enter MerchantId ", "warning");
			return false;
		} else if (this.paymentsForm.get('incomeImei').value == null) {
			this.commonService.openAlert("Warning", "Enter IMEI ", "warning");
			return false;
		}

		let obj = {
			'incomeMerchantid': this.paymentsForm.get('incomeMerchantid').value,
			'depositMerchantid': this.paymentsForm.get('depositMerchantid').value,
			'incomeImei': this.paymentsForm.get('incomeImei').value,
			'depositImei': this.paymentsForm.get('depositImei').value

		}
		this.offlinePaymentService.posDetailsUpdate(obj).subscribe(respData => {
			this.resMerchant = respData;
			this.isUpdatePos = false;
			if (this.resMerchant.depositMerchantid) {
				this.IsposDetails = true;
			} else {
				this.IsposDetails = false;
			}
			//this.getPostNumber(respData);
		})
	}

	save() {

		if(this.paymentModeSelect == 'CASH'){
			this.dialogRef.close(this.paymentsForm.value);
		}

		if (this.paymentsForm.get('chequeDate').value) {
			this.paymentsForm.get('chequeDate').setValue(moment(this.paymentsForm.get('chequeDate').value).format("YYYY-MM-DD"));
			this.dialogRef.close(this.paymentsForm.value);
		}

		if (this.paymentModeSelect == 'POS') {
			this.GetCloudBasedTxnStatus('');

		}


	}

	cancel() {
		this.dialogRef.close(null);
		this.router.navigate(['citizen/my-applications']);
	}


}
