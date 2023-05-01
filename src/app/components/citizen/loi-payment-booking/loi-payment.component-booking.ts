import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';

import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { ManageRoutes } from '../../../config/routes-conf';
import * as moment from 'moment'
import { CitizenConfig } from '../citizen-config';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionStorageService } from 'angular-web-storage';
import { OfflinePaymentComponent } from 'src/app/shared/components/offline-payment/offline-payment.component';
import { TicketingsService } from '../facilities/ticketings/shared-ticketing/services/ticketings.service';
import { TicketingConstants, TicketingUtils } from '../facilities/ticketings/config/ticketing-config';
import { BookingService } from '../facilities/bookings/shared-booking/services/booking-service.service';
import { BookingConstants } from '../facilities/bookings/config/booking-config';
import { Constants } from 'src/app/vmcshared/Constants';


@Component({
	selector: 'loi-payment-booking',
	templateUrl: './loi-payment.component-booking.html',
	styleUrls: ['./loi-payment.component-booking.scss']
})
export class LoiPaymentComponentBooking implements OnInit {

	@ViewChild("paymentGateway") paymentGateway: any;
	loiPaymentForm: FormGroup;
	applicationNumber;
	loiDate : any;
	uniqueId: string;
	id: number;
	resourceTypes: any;
	code: string;
	translateKey: string = 'LOI Payments';
	config: CitizenConfig = new CitizenConfig();
	loiDetails: any = [];
	ShowTable = false;
	showPayment = false;
	filterData: any;
	sum = 0;
	loiRecords: any = [];
	returnUrl : String = '';
	facilityBooking: String = '';

	bookingUtils: TicketingUtils = new TicketingUtils();

	ticketingConstants = TicketingConstants;

	bookingConstant = BookingConstants;
	constants = Constants;
	rupeeSign: string;


	constructor(
		private formService: FormsActionsService,
		private session: SessionStorageService,
		private router: Router,
		private commonService: CommonService,
		public bookingService: BookingService,
		private toastr: ToastrService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		public ticketingService: TicketingsService,
	) {

		this.route.paramMap.subscribe(param => {

			this.uniqueId = param.get('uniqueId');
			this.id = Number(param.get('id'));
			this.code = param.get('code');
			this.resourceTypes = param.get('id');
		});

		this.router.events
		.filter(e => e instanceof RoutesRecognized)
		.pairwise()
		.subscribe((event: any[]) => {
		  this.returnUrl = event[0].urlAfterRedirects;
		});
	}

	ngOnInit() {
		this.getLoiDetaiol();
		this.rupeeSign = this.constants.rupeeSymbol;
	}

	getLoiDetaiol() {
		this.formService.getLoiPaymentDetails(this.uniqueId).subscribe(res => {
			if (res.data.length > 0) {
				this.applicationNumber = res.data[0].applicationId;
				 this.loiDate = res.data[0].loiDate;
				this.loiDetails = res.data;
				this.loiRecords = this.loiDetails.filter((obj, pos, arr) => {
					return arr.map(mapObj => mapObj["loiNumber"]).indexOf(obj["loiNumber"]) === pos;
				})
			}
		}
			, err => {
				this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
			}
		);
		this.setBookingType();
	}

	onItemChange(event) {
		this.filterData = [];
		this.ShowTable = true;
		this.showPayment = true;
		this.sum = 0;
		let data = this.loiDetails.filter(element => element.loiNumber === event.target.defaultValue);
		this.filterData = data.reduce((r, { charges }) => {
			charges.forEach(o => r.push({ ...o }));
			return r;
		}, []);
		this.filterData.forEach(element => {
			this.sum += Number(element.amount)
		});

	}
	makePayment(loiNumber: any) {
		if(this.resourceTypes=='CHILDREN_THEATER'){
			this.bookingService.resourceType = 'childrenTheater';
			this.paymentRequestBooking(this.uniqueId);
		}if(this.resourceTypes=='SHOOTING_PERMISSION'){
			this.bookingService.resourceType = 'shootingPermission';
			this.paymentRequestBooking(this.uniqueId);
		}
		if(this.resourceTypes=='STADIUM'){
			this.bookingService.resourceType = 'stadium';
			this.paymentRequestBooking(this.uniqueId);
		}
		if(this.resourceTypes == 'PLANETARIUM_TICKETING'){
			this.ticketingService.resourceType = 'planetarium';
			this.paymentRequest(this.uniqueId);
		}

	}

	paymentRequestBooking(element) {
		this.bookingService.getTransactionDetails(element).subscribe(transactionData => {
		}, err => {
			if (err.status == 402) {
				  if(err.error.data.payableServiceType == "STADIUM_FEES" || err.error.data.payableServiceType == "STADIUM_DEPOSIT"){
				    this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway, null, null, null, {gatewayCustomerId: err.error.data.id, txtadditionalInfo1: err.error.resourceType, payableServiceType: err.error.data.payableServiceType});
				  }else{
				    this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway);
				  }
			} else if (err.error[0].code == this.bookingConstant.INVALID_BOOKING_STATUS) {
				this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "")
			} else {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			}
		})
	}

    paymentRequest(element) {
		this.ticketingService.getTransactionDetails(element).subscribe(transactionData => {
		}, err => {
		  if (err.status == 402) {
			//this.isLoadingResults = false;
			if (err.status == 402) {
			  // this.ticketingUtils.redirectToPayment(err, this.commonService, this.ticketingService);
			  this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway);

			}
		  } else if (err.error[0].code === this.ticketingConstants.INVALID_BOOKING_STATUS) {
			this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "")
		  } else {
			this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
		  }
		})
	  }

	redirectToPayment(apiCode: string, id: number, loiNumber) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.submitFormDataForLOI(id, loiNumber).subscribe(
			res => {
				this.toastr.success("No payment option");
				this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
			},
			err => {
				let retUrl = 'citizen/my-applications';
				if(this.returnUrl && this.returnUrl != ""){
					retUrl = this.returnUrl + '?apiCode='+ apiCode + '&id=' + id;
				}
				let retAfterPayment: string = environment.returnUrl;

				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
					payData.loiNumber = loiNumber;
					this.session.set('lioNumber', loiNumber);
					let html =
						`
					<div class="text-center">
						<h2>Total LOI Payment</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
						</div>
						<p>Rupees in words</p>
					</div>
					`
					if (this.commonService.fromAdmin()) {
						this.openOfflinePaymentComponent(payData,retUrl,apiCode,id);
					} else {
						this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
							this.paymentGateway.setPaymentDetailsFromActionBar(payData);
							this.paymentGateway.openModel();

						}, rj => {
						});
						return;
					}

				} else {
					this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
				}
			});
	}


	openOfflinePaymentComponent(payData,retUrl,apiCode,id) {
		const dialogConfig = new MatDialogConfig();
		const data = { payData: payData }
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = data;
		dialogConfig.width = "60%"
		const dialogRef = this.dialog.open(OfflinePaymentComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(offlinePayData => {
			if (offlinePayData) {
				offlinePayData.refNumber = payData.refNumber;
				offlinePayData.response = payData.response;
				offlinePayData.paymentStatus = "SUCCESS",
				offlinePayData.transactionId =  payData.transactionId,
				offlinePayData.payableServiceType = payData.serviceCode,
				offlinePayData.amount = payData.amount;
				offlinePayData.payGateway = "OFFLINE"


				this.formService.createPayment(offlinePayData).subscribe(resData => {
					const payRespData = resData.data.responseData;
					if(resData.paymentStatus = "Paid"){
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								this.router.navigate([ retUrl.split('?')[0] ], { queryParams: { apiCode: apiCode, id: id } });
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

	openErrorAlert(error){
		if(error & error.error[0]){
			this.commonService.openAlert("Error", "Error Occured for final submit : "
					 + error.error[0].message, "warning");
		}else{
			this.commonService.openAlert("Error", "Something went wrong","warning");
		}
	}

	setBookingType(){
// 	  if((this.resourceTypes == "TOWNHALL") || (this.resourceTypes = "AMPHI_THEATER")
// 	  || (this.resourceTypes == "STADIUM") || (this.resourceTypes == "ATITHIGRUH") || (this.resourceTypes = "CHILDREN_THEATER")
// 	  || (this.resourceTypes == "BAND_SERVICE") || (this.resourceTypes == "SWIMMING_POOL") || (this.resourceTypes == "SHOOTING_PERMISSION")){
//     	    this.facilityBooking = 'FACILITYBOOKING';
//     }else if( (this.resourceTypes == "PLANETARIUM_TICKETING") || (this.resourceTypes == "ZOO_ANIMAL_ADOPTION") ){
//         this.facilityBooking = 'ticketing';
//     }
    if(this.resourceTypes == 'TOWNHALL' || this.resourceTypes == 'AMPHI_THEATER'
    || this.resourceTypes == 'STADIUM' || this.resourceTypes == 'ATITHIGRUH'
    || this.resourceTypes == 'CHILDREN_THEATER' || this.resourceTypes == 'BAND_SERVICE'
    || this.resourceTypes == "SWIMMING_POOL" || this.resourceTypes == "SHOOTING_PERMISSION"){
      this.facilityBooking = 'FACILITYBOOKING';
    }else if(this.resourceTypes == "PLANETARIUM_TICKETING" || this.resourceTypes == "ZOO_ANIMAL_ADOPTION"){
      this.facilityBooking = 'ticketing';
    }
	}
}
