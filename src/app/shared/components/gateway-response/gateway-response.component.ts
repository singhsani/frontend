import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { ManageRoutes } from './../../../config/routes-conf';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';

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

	constructor(
		private formService: FormsActionsService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private sessionStore: SessionStorageService
	) { this.dispData = JSON.parse(this.sessionStore.get('paymentData')); }

	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			if (param && param.rqst_token) {
				this.gatewayResponse(param.rqst_token);
			} else {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
			}
		});

	}

	gatewayResponse(token) {
		this.formService.getPaymentResponse(token).subscribe(res => {
			this.responseObj = res.data;
			
			if (res.success) {
			
				if (this.responseObj.txn_msg == 'failure') {
					this.redirectToHome();
				} else {
					this.paymentStatus = _.upperCase(this.responseObj.txn_msg);
					this.postSessionData(this.dispData);
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
	postSessionData(data) {
		let payData = {
			id: null,
			uniqueId: null,
			version: null,
			refNumber: data.refNumber ? data.refNumber : null,
			resourceType: data.resourceType ? data.resourceType : null,
			response: JSON.stringify({
				data: "paid",
				status: true
			}),
			transactionId: data.transactionId,
			paymentStatus: this.paymentStatus,
			payableServiceType: data.payableServiceType
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

	redirectToHome() {
		setTimeout(() => {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
		}, 10000);

		this.interVal();
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

