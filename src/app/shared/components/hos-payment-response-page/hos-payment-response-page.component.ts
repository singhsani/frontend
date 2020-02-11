import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SessionStorageService } from 'angular-web-storage';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { ManageRoutes } from './../../../config/routes-conf';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-hos-payment-response-page',
	templateUrl: './hos-payment-response-page.component.html',
	styleUrls: ['./hos-payment-response-page.component.scss']
})
export class HosPaymentResponsePageComponent implements OnInit {


	responseObj: any = {};
	dispTime: number = 10;
	interval: any;
	paymentStatus: any;
	dispData: any;

	/**
	 * constructor
	 * @param router - router.
	 * @param formService - form service.
	 * @param sessionStore - session storage.
	 * @param route - route service.
	 */
	constructor(
		private router: Router,
		private formService: HosFormActionsService,
		private sessionStore: SessionStorageService,
		private toastr: ToastrService,
		private route: ActivatedRoute,
		private formActionsService: FormsActionsService) {
		this.dispData = JSON.parse(this.sessionStore.get('paymentData'));
	}

	/**
	 * Method initializes first.
	 */
	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			// if (param && param.rqst_token) {
			// 	this.gatewayResponse(param.rqst_token);
			// } else {
			// 	this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
			// }
			if (param && param.order_id) {
				this.gatewayResponse(param.order_id);
			} else if (param && param.txtRefNo) {
				this.getBillDeskTransactionDetails(param.txtRefNo);
			} else {
				this.router.navigate([ManageRoutes.getFullRoute('HOSPITALDASHBOARD')]);
			}
		});
	}

	/**
	 * This method is used to get billDesk transation details
	 * @param txtRefNo - transaction reference number
	 */
	getBillDeskTransactionDetails(txtRefNo) {
		if (txtRefNo != 'NA') {
			this.formActionsService.getBillDeskTransactionDetails(txtRefNo).subscribe(res => {
				this.responseObj = res.data;

				if (res.success) {

					if (this.responseObj.authStatus == '0300') {

						this.responseObj.mer_amount = this.responseObj.txnAmount;
						this.responseObj.order_id = this.responseObj.customerID;
						this.responseObj.bank_ref_no = this.responseObj.txnReferenceNo;
						this.responseObj.trans_date = this.responseObj.txnDate

						this.paymentStatus = _.upperCase(this.responseObj.authStatus);
						this.postSessionData(this.dispData, 'BILLDESK', this.responseObj);
					} else {
						this.redirectToHome();
					}
					this.clearSession();
				}
				else {
					this.toastr.error('Transaction failed');
					this.redirectToHome();
				}
			});
		}
	}

	gatewayResponse(token) {
		// this.formService.getPaymentResponse(token).subscribe(res => {
		// 	this.responseObj = res.data;

		// 	if (res.success) {

		// 		if (this.responseObj.txn_msg == 'failure') {
		// 			this.redirectToHome();
		// 		} else {
		// 			this.paymentStatus = _.upperCase(this.responseObj.txn_msg);
		// 			this.postSessionData(this.dispData);
		// 		}
		// 		this.clearSession();
		// 	}
		// 	else {
		// 		this.toastr.error('Transaction failed');
		// 		this.redirectToHome();
		// 	}
		// });

		this.formActionsService.getCCAvenuePaymentResponse(token).subscribe(res => {
			this.responseObj = res.data;

			if (res.success) {

				if (this.responseObj.order_status == 'Success') {
					this.paymentStatus = _.upperCase(this.responseObj.order_status);
					this.postSessionData(this.dispData, 'CCAVENUE', this.responseObj);
				} else {
					this.redirectToHome();
				}
				this.clearSession();
			}
			else {
				this.toastr.error('Transaction failed');
				this.redirectToHome();
			}
		});

	}

	/**
	 * Post data for post payment 
	 * @param data : json
	 */
	postSessionData(data, payGateway, responseObj?) {
		let payData = {
			id: null,
			uniqueId: null,
			version: null,
			refNumber:data.refNumber ? data.refNumber : null,
			resourceType: data.resourceType ? data.resourceType : null,
			response: JSON.stringify({
				data: "paid",
				status: true
			}),
			transactionId: data.transactionId,
			paymentStatus: this.paymentStatus,
			payableServiceType: data.payableServiceType,
			amount: responseObj ? responseObj.mer_amount : 0,
			payGateway : payGateway
		}
		
		if (payGateway == 'BILLDESK') {
			payData.refNumber = data.txnReferenceNo;
			payData.transactionId =  data.txnReferenceNo;
			payData.payableServiceType = data.additionalInfo2;
			payData.amount =  data.txnAmount;
		}

		this.formService.createPayment(payData).subscribe(payResp => {
			const payRespData = payResp.data.responseData;

			if (payRespData.fileStatus == "PAYMENT_RECEIVED") {

				this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(payRespData.serviceDetail.code);
				this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
					if (res) {
						setTimeout(() => {
							this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
						}, 10000);

						this.interVal();
					}
				});
			}
			// if (payRespData.status == "DEPOSIT_REQUIRED") { //for booking module

			else {
				setTimeout(() => {
					this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
				}, 10000);

				this.interVal();
			}

		},
			err => {
				this.toastr.error('Internal server error');
			});
	}


	redirectToHome() {
		setTimeout(() => {
			this.router.navigate([ManageRoutes.getFullRoute('HOSPITALMYAPPS')]);
		}, 10000);

		this.interVal();
	}
	/**
	 * method is used to redirect to my application page.
	 */
	redirectToMyApplication(myApplicationUrl, refNumber = undefined, resourceType = undefined, serviceType = undefined) {
		if (refNumber && resourceType && serviceType) {
			this.router.navigateByUrl(myApplicationUrl + `?refNumber=${refNumber}&resourceType=${resourceType}&serviceType=${serviceType}`);
		} else {
			this.router.navigateByUrl(myApplicationUrl);
		}
	}

	/**
	 * method is used to clear session data.
	 */
	clearSession() {
		this.sessionStore.remove('paymentData');
	}
	/**
	  * Method is used to increase time interval.
	  */
	interVal() {
		/**
		 * setting time interval.
		 */
		setInterval(() => {
			this.dispTime = this.dispTime - 1
		}, 1000)

	}

}
