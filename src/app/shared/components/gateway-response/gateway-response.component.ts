import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from './../../../config/routes-conf';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { BookingConstants, BookingUtils } from 'src/app/components/citizen/facilities/bookings/config/booking-config';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { isThisTypeNode } from 'typescript';


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
	serviceType: any;
	paidAmount: number;
	balanceAmount: number;

	/**
	 * Common for all bookings
	 */
	bookingConstant = BookingConstants;
	bookingUtils: BookingUtils = new BookingUtils();
	refNumber: any;
	paybleServiceType: any;
	serviceName : string;

	constructor(
		private formService: FormsActionsService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private sessionStore: SessionStorageService
	) {
		this.dispData = JSON.parse(this.sessionStore.get('paymentData'));
		if(this.dispData.resourceType == 'amphiTheater' && this.dispData.txtadditionalInfo1 == 'amphiTheater' ){
			this.serviceName = 'amphiTheatre'
		}
		else if(this.dispData.resourceType == 'atithigruh' && (this.dispData.txtadditionalInfo1 == 'atithigruh' || this.dispData.txtadditionalInfo1 == 'ATITHIGRUH')){
			this.serviceName = 'Atithigruh'
		}
		else if(this.dispData.resourceType == 'swimming' && this.dispData.txtadditionalInfo1 == 'SWIMMING_POOL'){
			this.serviceName = 'Swimming Pool'
		}else if(this.dispData.resourceType == 'stadium' && (this.dispData.txtadditionalInfo1 == 'stadium' || this.dispData.txtadditionalInfo1 == 'STADIUM')){
      this.serviceName = 'Stadium'
    }
		else{
			this.serviceName = this.dispData.txtadditionalInfo1 ? this.dispData.txtadditionalInfo1 :this.dispData.resourceType ?
								this.dispData.resourceType : this.serviceType ? this.serviceType : this.dispData.payableServiceType;
		}
		console.log('this.dispData', this.dispData);
	}
	Tickting: String[] = [
		'zoo',
		'zooanimaladoption',
		'planetarium'
	];
	Booking: String[] = [
		'townhall',
		'amphiTheater',
		'stadium',
		'childrenTheater',
		'atithigruh',
		'shootingPermission'
	];

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
				console.log(res);
				this.responseObj = res.data;
				this.responseObj['getway'] = "BILLDESK";
				if (res.success) {

					if (this.responseObj.authStatus == '0300') {
						this.responseObj.mer_amount = this.responseObj.txnAmount;
						this.paidAmount = Math.floor(this.responseObj.mer_amount);

						this.responseObj.order_id = this.responseObj.order_id;
						this.responseObj.bank_ref_no = this.responseObj.transactionid;
						this.responseObj.trans_date = moment(this.responseObj.trans_date).format('DD-MM-YYYY');
						this.paymentStatus = "SUCCESS";
						this.postSessionData(this.dispData, 'BILLDESK', this.responseObj);
						//this.sendEventForMail(this.refNumber, this.responseObj.payableServiceType);
					} else {
						this.responseObj.mer_amount = this.responseObj.txnAmount;
						this.paidAmount = Math.floor(this.responseObj.mer_amount);

						this.responseObj.order_id = this.responseObj.order_id;
						this.responseObj.bank_ref_no = this.responseObj.transactionid;
						this.responseObj.trans_date = moment(this.responseObj.trans_date).format('DD-MM-YYYY');
						// this.redirectToHome();
						setTimeout(() => {
							this.redirectToHomeFail();
							//this.redirectToMyApplication(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'),res.data.responseData.refNumber );
						}, 10000);
						this.interVal();
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
			this.responseObj = res.data[0];
			this.responseObj['getway'] = "CCAVENUE";
			console.log(res);
			if (res.success) {
				//this.responseObj = this.responseObj[this.responseObj.length - 1];
				if (this.responseObj.order_status == 'Success') {
					this.paymentStatus = _.upperCase(this.responseObj.order_status);
					this.paidAmount = Math.floor(this.responseObj.mer_amount);
					this.postSessionData(this.dispData, 'CCAVENUE', this.responseObj);
					this.sendEventForMail(this.refNumber, this.paybleServiceType);
				} else {
					this.paymentStatus = _.upperCase(this.responseObj.order_status);
					// this.redirectToHome();
					setTimeout(() => {
						this.redirectToHomeFail();
						//this.redirectToMyApplication(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'),res.data.responseData.refNumber );
					}, 10000);
					this.interVal();
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
		this.refNumber = data.refNumber;
		this.paybleServiceType = data.payableServiceType;
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
			payData.amount = data.txnAmount;
		}

		if (data.payableServiceType == "PAY_PROF_TAX") {
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
		} else if (data.payableServiceType == 'PAY-PRO-TAX') {
			payData.amount = Number(data.amount);
			this.formService.savePropertyTaxPaymentDetails(payData).subscribe(res => {
				if (res) {

					downloadFile(res, "collection-" + Date.now() + ".pdf", 'application/pdf');
					setTimeout(() => {
						this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'));
						//this.redirectToMyApplication(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'),res.data.responseData.refNumber );
					}, 10000);
					this.interVal();


				}
				//this.redirectToHome();
			});

		} else if (data.payableServiceType == 'PAY-WTR-TAX') {

			this.waterPostPayment(payData, data);


		} else {
			if (this.isSearchanble == "true") {
				setTimeout(() => {
					this.redirectToMyApplication('/citizen/my-applications', this.dispData.refNumber, payData.resourceType, this.dispData.payableServiceType);
				}, 10000);

				this.interVal();
			} else {
				this.formService.createPayment(payData).subscribe(payResp => {
					const payRespData = payResp.data.responseData;
					this.serviceType = payResp.data.responseData.payableServiceType;
					//	This methods are used to send SMS and Email ater booking payment for Amphi Theater as
					//  discussed with B A team.It can be applied for all module letter.

					if (payRespData.serviceType == "FS_ELECTRIC_CONNECTION_NOC" || payRespData.serviceType == "FS_FIRE_CERTIFICATE" || payRespData.serviceType == "FS_GAS_CONNECTION_NOC") { //for Fire Services
						{
						   setTimeout(() => {
							   const url = '/citizen/my-applications' + '?id=' + payRespData.serviceFormId + '&apiCode=' + payRespData.serviceDetail.code
							   this.router.navigateByUrl(url);
						   }, 11000);
						   }
						   this.interVal();
						 }
					if (payRespData.fileStatus == "PAYMENT_RECEIVED") {
						this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(payRespData.serviceDetail.code);
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								if (this.formService.apiType == 'APLicense' || this.formService.apiType == 'APLRenewal' || this.formService.apiType == 'APLTransfer' ||
								this.formService.apiType == 'MFLicense' || this.formService.apiType == 'MFRenewal' || this.formService.apiType == 'MFTransfer') {
									setTimeout(() => {
										const url = '/citizen/my-applications' + '?id=' + payRespData.serviceFormId + '&apiCode=' + payRespData.serviceDetail.code
										this.router.navigateByUrl(url);
									}, 10000);

									this.interVal();
								}else {									setTimeout(() => {
										this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
									}, 10000);

									this.interVal();
								}
							}

						});
					}
					else {
						setTimeout(() => {
							this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
						}, 10000);

						this.interVal();
					}
					/* EMAIL */
					this.sendEventForMail(this.refNumber, this.serviceType);
				},
					err => {
						this.toastr.error('Internal server error');
					});
			}


		}
	}

	waterPostPayment(payData, data) {
		payData.amount = Number(data.amount);
		this.formService.saveWaterTaxPaymentDetails(payData).subscribe(res => {
			if (res) {

				downloadFile(res, "collection-" + Date.now() + ".pdf", 'application/pdf');
				setTimeout(() => {
					this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'));
					//this.redirectToMyApplication(ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS'),res.data.responseData.refNumber );
				}, 10000);
				this.interVal();


			}
			//this.redirectToHome();
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
		clearInterval(this.interval);
	}

	redirectToHomeFail() {
		if (this.paymentStatus != "SUCCESS") {
			if (this.dispData.resourceType == "zoo" || this.dispData.resourceType == "zooanimaladoption" || this.dispData.resourceType == "planetarium") {
				this.router.navigate([this.bookingConstant.MY_TICKETINGS_URL]);
			} else if ((this.dispData.resourceType == "townhall") || (this.dispData.resourceType == "amphiTheater") || (this.dispData.resourceType == "stadium") || (this.dispData.resourceType == "childrenTheater") || (this.dispData.resourceType == "atithigruh") || (this.dispData.resourceType == "shootingPermission")) {
				this.router.navigate([this.bookingConstant.MY_BOOKINGS_URL]);
			} else {
				// setTimeout(() => {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
				// }, 10000);
			}
			this.interVal();
		}
	}

	redirectToHome() {
		if (this.dispData.payableServiceType == "PROFESSIONAL_TAX" ) {

			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYTRANSACTIONS')]);

		} else if ((this.dispData.payableServiceType == "STADIUM_FEES") || (this.dispData.payableServiceType == "STADIUM_DEPOSIT") || (this.dispData.payableServiceType == "SWIMMING_POOL_FEES")) {

			this.router.navigate([this.bookingConstant.MY_BOOKINGS_URL]);

		} else if (this.dispData.payableServiceType == "SHOP-ESTAB-LIC-NEW" || this.paybleServiceType == "SHOP-ESTAB-TRANSFER" || this.dispData.payableServiceType == "HEL-BCR"  || this.dispData.payableServiceType =="HEL-DCR"
			|| this.dispData.payableServiceType == "HEL-DUPDR" || this.dispData.payableServiceType =="HEL-DUPBR") {

			this.redirectToMyApplication(this.dispData.myApplicationUrl, undefined, undefined, undefined);


		} else if ((this.dispData.resourceType == "townhall") || (this.dispData.resourceType == "amphiTheater") || (this.dispData.resourceType == "stadium") || (this.dispData.resourceType == "childrenTheater") || (this.dispData.resourceType == "atithigruh") || (this.dispData.resourceType == "shootingPermission")) {

			this.router.navigate([this.bookingConstant.MY_BOOKINGS_URL]);

		}
		else if (this.serviceType == "ZOO_TICKETING_FEES" || this.serviceType == "ZOO_ANIMAL_ADOPTION_FEES" || this.serviceType == "PLANETARIUM_TICKETING_FEES") {

			this.router.navigate([this.bookingConstant.MY_TICKETINGS_URL]);

		} else if (this.dispData.payableServiceType == "APL-TRA" || this.paybleServiceType == "APL-TRA" || this.dispData.payableServiceType == "APL-REN" || this.paybleServiceType == "APL-REN" || this.dispData.payableServiceType == "APL-DUP" || this.paybleServiceType == "APL-DUP" || this.paybleServiceType == "APL-LIC" || this.dispData.payableServiceType == "APL-LIC") {

			this.redirectToMyApplication(this.dispData.myApplicationUrl, undefined, undefined, undefined);
		} else if(this.dispData.payableServiceType == "MF-DUP" || this.paybleServiceType == "MF-DUP" || this.dispData.payableServiceType == "MF-TRA" || this.paybleServiceType == "MF-TRA" || this.dispData.payableServiceType == "MF-REN" || this.paybleServiceType == "MF-REN" || this.dispData.payableServiceType == "MF-LIC" || this.paybleServiceType == "MF-LIC"){
			this.redirectToMyApplication(this.dispData.myApplicationUrl, undefined, undefined, undefined);
		}
		else if(this.dispData.payableServiceType == "HEL-MR" || this.dispData.payableServiceType == 'HEL-DUPMR')
		{
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
		}

		else if(this.dispData.payableServiceType == "FS-ELE" || this.dispData.payableServiceType == "FS_FIRE_CERTIFICATE"|| this.dispData.payableServiceType == "FS-GAS" || this.dispData.payableServiceType == "FS-WATER")
		{
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
		}
		else if(this.dispData.payableServiceType == "AFFORD_HOUSE_FEES"){
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
		}
		else {
			setTimeout(() => {
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
			}, 10000);
		}

		// this.interVal();
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
			if (this.Tickting.includes(this.resourceType)) {
				this.formService.sendMailTicketing(refNumber, this.resourceType, eventType).subscribe(resp => {
				}, err => {
					this.toastr.error("Something went wrong");
				})
			} else if (this.Booking.includes(this.resourceType)) {
				this.formService.sendMailBooking(refNumber, this.resourceType, eventType).subscribe(resp => {
				}, err => {
					this.toastr.error("Something went wrong");
				})
			} else {
				return;
			}

		} else {
			this.toastr.error("Invalid request");
		}
	}

	sendEventForMail(refNumber: any, serviceType: any) {
		if (serviceType == 'ATITHIGRUH_FEES') {
			this.sendMail(refNumber, "PAYMENT");
		} else if (serviceType == 'FORM_CHARGES') {
			this.sendMail(refNumber, "FORMCHARGES");
		} else if (serviceType == 'ATITHIGURH_DEPOSIT') {
			this.sendMail(refNumber, "BOOKED");
		} else if (serviceType == 'AMPHI_FEES') {
			this.sendMail(refNumber, "BOOKED");
		} else {
			this.sendMail(refNumber, "PAYMENT");
		}
	}
}

