import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { ManageRoutes } from './../../../config/routes-conf';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { BookingConstants, BookingUtils } from 'src/app/components/citizen/facilities/bookings/config/booking-config';


@Component({
	selector: 'app-gateway-response',
	templateUrl: './gateway-response.component.html',
	styleUrls: ['./gateway-response.component.scss']
})
export class GatewayResponseComponent implements OnInit {

	responseObj: any = {};
	dispTime: number = 10;
	interval: any;
	paymentStatus: any;
	dispData: any;
	isSearchanble: string = "";
	resourceType: String;

	/**
	 * Common for all bookings
	 */
	bookingConstant = BookingConstants;
	bookingUtils: BookingUtils = new BookingUtils();

	constructor(
		private formService: FormsActionsService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private sessionStore: SessionStorageService
	) {
		this.dispData = JSON.parse(this.sessionStore.get('paymentData'));
		console.log('this.dispData', this.dispData);
	}

	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			// if (param && param.rqst_token) {
			if (param && param.order_id) {

				var token = param.order_id + '&order_status=' + param.order_status;
				this.gatewayResponse(token, param.searchable);
			} else if (param && param.txtRefNo) {
				this.getBillDeskTransactionDetails(param.txtRefNo);
			} else {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
			}
		});
	}

	/**
	 * This method is used to get billDesk transation details
	 * @param txtRefNo - transaction reference number
	 */
	getBillDeskTransactionDetails(txtRefNo) {

		if (txtRefNo != 'NA') {
			this.formService.getBillDeskTransactionDetails(txtRefNo).subscribe(res => {
				this.responseObj = res.data;

				if (res.success) {

					if (this.responseObj.authStatus == '0300') {
						this.responseObj.mer_amount = Number(this.responseObj.txnAmount);
						this.responseObj.order_id = this.responseObj.customerID;
						this.responseObj.bank_ref_no = this.responseObj.txnReferenceNo;
						this.responseObj.trans_date = this.responseObj.txnDate
						this.paymentStatus = "SUCCESS";
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

	/**
	 * This method is used to get cc avenue transation details
	 * @param token - token from api
	 */
	gatewayResponse(token, isSearchanble) {

		// this.formService.getPaymentResponse(token).subscribe(res => {
		this.isSearchanble = isSearchanble;
		if (isSearchanble == "true") {
			this.dispData.serviceType = this.dispData.payableServiceType;
			this.formService.apiType = 'servicePayment';
			this.formService.paymentServicePost(this.dispData).subscribe(respData => {
			});
		}

		this.formService.getCCAvenuePaymentResponse(token).subscribe(res => {
			this.responseObj = res.data;
			if (res.success) {
				this.responseObj = this.responseObj[this.responseObj.length - 1];
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
	 * @param payGateway: selected payment gateway
	 * @param responseObj: transaction details
	 */
	postSessionData(data, payGateway, responseObj?) {
		this.resourceType = data.resourceType;
		let payData = {
			id: null,
			uniqueId: null,
			version: null,
			loiNumber: this.sessionStore.get('lioNumber'),
			refNumber: data.refNumber ? data.refNumber : null,
			resourceType: data.resourceType ? data.resourceType : null,
			response: JSON.stringify({
				data: "paid",
				status: true
			}),
			transactionId: responseObj.bank_ref_no,
			paymentStatus: this.paymentStatus,
			payableServiceType: data.payableServiceType,
			amount: responseObj ? responseObj.mer_amount : 0,
			payGateway: payGateway
		}

		if (payGateway == 'BILLDESK') {
			//payData.refNumber = data.txnReferenceNo;
			//payData.transactionId = data.txnReferenceNo;
			payData.payableServiceType = data.additionalInfo2;
			payData.amount = Number(data.txnAmount);
		}

		if (data.payableServiceType == "PROFESSIONAL_TAX") {
			payData.amount = Number(data.amount);
			this.formService.saveTaxPaymentDetails(payData).subscribe(res => {
				if (res && res.data) {

					setTimeout(() => {
						this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS') + '?refNumber=' + res.data.responseData.refNumber);
						//this.redirectToMyApplication(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'),res.data.responseData.refNumber );
					}, 10000);

					this.interVal();


				}
				//this.redirectToHome();
			});
		} else {
			if (this.isSearchanble == "true") {
				setTimeout(() => {
					this.redirectToMyApplication('/citizen/my-applications', this.dispData.refNumber, payData.resourceType, this.dispData.payableServiceType);
				}, 10000);

				this.interVal();
			} else {
				this.formService.createPayment(payData).subscribe(payResp => {
					const payRespData = payResp.data.responseData;

					//	This methods are used to send SMS and Email ater booking payment for Amphi Theater as
					//  discussed with B A team.It can be applied for all module letter.
					if (payRespData.payableServiceType == "AMPHI_FEES") {
						// For SMS
						this.sendSms(this.dispData.refNumber, this.bookingConstant.SUBMIT);
						// For Email
						this.sendMail(this.dispData.refNumber, this.bookingConstant.SUBMIT);
					}
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


		}
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
		clearInterval(this.interval);
	}

	redirectToHome() {
		if (this.dispData.payableServiceType == "PROFESSIONAL_TAX") {
			setTimeout(() => {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS')]);
			}, 10000);
		} else {
			setTimeout(() => {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
			}, 10000);
		}

		this.interVal();
	}

	redirectToMyApps() {
		if (this.dispData.payableServiceType == "PROFESSIONAL_TAX") {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS')]);
		} else {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
		}
		clearInterval(this.interval);
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
		this.interval = setInterval(() => {
			this.dispTime = this.dispTime - 1
		}, 1000)

	}
	/**
	 * This method is used to send  sms after completion of booking payment
	 * @param refNumber 
	 */
	sendSms(refNumber: any, eventType: any) {
		if (refNumber) {
			this.formService.sendSms(refNumber, this.resourceType, eventType).subscribe(resp => {
			}, err => {
				this.toastr.error("Something went wrong");
			})
		} else {
			this.toastr.error("Invalid request");
		}
	}

	/**
		   * Method is used to send mail on submit
		   * @param refNumber 
		   */
	sendMail(refNumber: any, eventType: any) {
		if (refNumber) {
			this.formService.sendMail(refNumber, this.resourceType, eventType).subscribe(resp => {
			}, err => {
				this.toastr.error("Something went wrong");
			})
		} else {
			this.toastr.error("Invalid request");
		}
	}
}

