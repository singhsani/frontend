import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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

				this.paymentStatus = res.success;
				
				this.postSessionData(this.dispData);

				this.clearSession();
			}
			else {
				this.toastr.error('Transaction failed');

				setTimeout(() => {
					this.redirectToHome();
				}, 10000);

				this.interval = setInterval(() => {
					this.dispTime = this.dispTime - 1
				}, 1000);
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
			setTimeout(() => {
				this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
			}, 10000);

			this.interVal();
		},
		err => {
			this.toastr.error('Internal server error');
		});
	}

	// redirectToMyApplication() {
	// 	clearInterval(this.interval);
	// 	this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
	// }

	  /**
   * method is used to redirect to my application page.
   */
  redirectToMyApplication(myApplicationUrl,refNumber = undefined, resourceType = undefined, serviceType = undefined) {
    if(refNumber && resourceType && serviceType){
      this.router.navigateByUrl(myApplicationUrl + `?refNumber=${refNumber}&resourceType=${resourceType}&serviceType=${serviceType}`);
    } else {
      this.router.navigateByUrl(myApplicationUrl);
    }
  }

	redirectToHome() {
		this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
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

