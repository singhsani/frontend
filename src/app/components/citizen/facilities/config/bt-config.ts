import { CitizenConfig } from "../../citizen-config";
import { CommonService } from "../../../../shared/services/common.service";
import { BookingService } from "../bookings/shared-booking/services/booking-service.service";
import { FormGroup } from "@angular/forms";
import { environment } from "../../../../../environments/environment";
import { Router } from "@angular/router";
import { TicketingsService } from "../ticketings/shared-ticketing/services/ticketings.service";
import { SessionStorageService } from "angular-web-storage";


export class BTConstants {
    static DRAFT = "DRAFT";
    static SUBMITTED = "SUBMITTED";
    static APPROVED = "APPROVED";
    static REJECTED = "REJECTED";
    static BOOKED = "BOOKED";
    static CHECKED = "CHECKED";
    static CANCELLED = "CANCELLED";
    static EXPIRED = "EXPIRED";
    static BY_FORCE = "BY_FORCE";
    static BY_CITIZEN = "BY_CITIZEN";
    static PAYMENT_RECEIVED = "PAYMENT_RECEIVED";
    static PAYMENT_REQUIRED = "PAYMENT_REQUIRED";
    static DEPOSIT_REQUIRED = "DEPOSIT_REQUIRED";
    static PPL_REQUIRED = "PPL_REQUIRED";
    static CANCELLATION_REQUEST = "CANCELLATION_REQUEST";
    static CANCELLATION_APPROVED = "CANCELLATION_APPROVED";
    static AVAILABLE = 'AVAILABLE';
    static RESCHEDULED = "RESCHEDULED";
    static TEMPORARY_BLOCKED = "TEMPORARY_BLOCKED";
    static MOB_NO_MIS_MATCH_MESSAGE = "Mobile Number and Confirm Mobile Number should match";
    static EMAIL_MIS_MATCH_MESSAGE = "Email and Confirm Email should match";
    static FEILD_ERROR_TITLE = "Field Error";
    static ALL_FEILD_REQUIRED_MESSAGE = "Please fill all the required fields";
    static AGREE_MESSAGE = 'Should be agree with given bank details';
    static TERMS_AND_CONDITION_MESSAGE = 'Should Accept the terms and condition of form';
    static MY_BOOKINGS_URL = 'citizen/bookings/my-bookings';
    static MY_TICKETINGS_URL = 'citizen/ticketings/my-ticketings';
    static INVALID_BOOKING_STATUS = 'INVALID_BOOKING_STATUS';
}

export class BTConfig extends CitizenConfig {

    session: SessionStorageService = new SessionStorageService();

    constructor() {
        super();
    }

    /**
     * Method is used to approach common payment handling for booking
     * @param err - payment data
     * @param commonService -commmon service instance
     * @param bookingService - booking service instance
     * @param form - form
     * @param router router instance
     */
    redirectToPayment(err: any, commonService: CommonService, btService: BookingService | TicketingsService, form?: FormGroup, router?: Router) {

      let redirectURLAfterPayment = (btService instanceof TicketingsService) ? BTConstants.MY_TICKETINGS_URL : BTConstants.MY_BOOKINGS_URL

      let payData = this.proceedForPayment(err.error.data, redirectURLAfterPayment, btService.resourceType);
        commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, payData.html, cb => {
            window.location.href = environment.adminUrl + `payment-gateway?retUrl=${payData.payData.retUrl}&retPath=${payData.payData.retPath}`;
        }, rj => {
            let errHtml = `
						<div class="alert alert-danger">
							Please Complete Payment, Otherwise the application will be considered as in-complete
						</div>`
            commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
                window.location.href = environment.adminUrl + `payment-gateway?retUrl=${payData.payData.retUrl}&retPath=${payData.payData.retPath}?&printUrl=${payData.payData.printUrl}`;
            }, arj => {
                if (form && router) {
                    form.disable();
                    router.navigate([redirectURLAfterPayment]);
                }
            });
            return;
        });
    }

    /**
     * Method is used to perform payment and after storing data to localhost redirects to payment gateway.
     * @param data - Object Data
     */
    proceedForPayment(data: any, redirectionURL: string, resourceType?: string): any {
        let payData = {
            id: null,
            uniqueId: null,
            version: null,
            paymentType: data.paymentType,
            refNumber: data.refNumber,
            response: JSON.stringify({
                data: "paid",
                status: true
            }),
            resourceType: resourceType,
            transactionId: data.transactionId,
            paymentStatus: "SUCCESS",
            retUrl: environment.citizenUrl,
            retPath: 'citizen/payment-gateway-response',
            myApplicationUrl: redirectionURL,
            amount: data.amount
        };

		/**
		 * Storing Data to session.
		 */
        this.session.set('paymentData', JSON.stringify(payData));

		/**
		 * Generation of HTML of payment alert.
		 */
        return {
            payData: payData,
            html: `
				<div class="text-center">
					<h2>Total amount to be paid</h2>
					<div class="payAmount">
						<i class="fa fa-inr" aria-hidden="true">${payData.amount}</i>
					</div>
				</div>
                `
            };
    }

    /**
	 * used to disable specific date from calender.
	 */
    myFilter = (d: Date, disableDateList): boolean => {

        let date: any;
        let month: any;

        if (d.getDate().toString().length < 2) {
            date = '0' + d.getDate().toString()
        } else {
            date = d.getDate().toString()
        }

        if ((d.getMonth() + 1).toString().length < 2) {
            month = '0' + (d.getMonth() + 1).toString()
        } else {
            month = (d.getMonth() + 1).toString()
        }

        const day = d.getFullYear().toString() + "-" + month + "-" + date;

        return !disableDateList.includes(day);
    }

}
