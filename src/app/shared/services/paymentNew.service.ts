import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';


import { SessionStorageService } from 'angular-web-storage';

import swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, Form } from '@angular/forms';
import { OfflinePaymentComponent } from '../components/offline-payment/offline-payment.component';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Router } from '@angular/router';
import { CommonService } from './common.service';


@Injectable({
	providedIn: 'root'
})
export class PaymentNewService {


	constructor(private session: SessionStorageService,
		private formService: FormsActionsService,
		private dialog: MatDialog,
		private commonService: CommonService) { }



	

	public paymentWithoutForm(err,paymentGateway){
		let retUrl: string = '/citizen/my-applications';
            let retAfterPayment: string = environment.returnUrl;
            if (err.status === 402) {
              let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
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
                paymentGateway.setPaymentDetailsFromActionBar(payData);
                paymentGateway.openModel();
              }, rj => {
                return;
              });
            } else {
              this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
            }
	}	



	// This payment method is used in the property tax module
	// TODO change all method to use this method 
	public payment(err, form: FormGroup, router: Router, paymentGateway) {
		let retUrl: string = '/citizen/my-applications';
		let retAfterPayment: string = environment.returnUrl;

		if (err.status === 402) {
			let moduleWithAppointment = form.getRawValue().serviceDetail.appointmentRequired;
			const data = err.error.data;
			if (moduleWithAppointment) {
				retUrl = `/citizen/appointmant/schedule-appointment/slot-booking/` + form.getRawValue().serviceFormId + `/` + form.getRawValue().serviceDetail.code + '?apiCode=' + data.serviceCode + '&id=' + data.serviceFormId;
			} else {
				retUrl = retUrl + '?apiCode=' + data.serviceCode + '&id=' + data.serviceFormId;
			}

			let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);

			if (this.commonService.fromAdmin()) {
				this.openOfflinePaymentComponent(form, payData, retUrl, data.serviceCode, data.serviceFormId, router);
			} else {

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
					paymentGateway.setPaymentDetailsFromActionBar(payData);
					paymentGateway.openModel();

				}, rj => {
					form.disable();
					return;
				});
				return;
			}
		}
	}

	openOfflinePaymentComponent(form: FormGroup, payData, retUrl, apiCode, id, router: Router) {
		const dialogConfig = new MatDialogConfig();
		const data = { payData: payData }
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = data;
		dialogConfig.width = "60%"
		const dialogRef = this.dialog.open(OfflinePaymentComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(offlinePayData => {
			if (offlinePayData) {
				offlinePayData.refNumber = form.get("uniqueId").value;
				offlinePayData.response = payData.response;
				offlinePayData.paymentStatus = "SUCCESS",
					offlinePayData.transactionId = payData.transactionId,
					offlinePayData.payableServiceType = payData.serviceCode,
					offlinePayData.amount = payData.amount;
				offlinePayData.payGateway = "OFFLINE"


				this.formService.createPayment(offlinePayData).subscribe(resData => {
					const payRespData = resData.data.responseData;
					if (resData.paymentStatus = "Paid") {
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								router.navigate([retUrl.split('?')[0]], { queryParams: { apiCode: apiCode, id: id } });
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

	openErrorAlert(error) {
		if (error & error.error[0]) {
			this.commonService.openAlert("Error", "Error Occured for final submit : "
				+ error.error[0].message, "warning");
		} else {
			this.commonService.openAlert("Error", "Something went wrong", "warning");
		}
	}

	public isGuestUser() {
		return this.commonService
	}


}
