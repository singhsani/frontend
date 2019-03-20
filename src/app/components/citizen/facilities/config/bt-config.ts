import { CitizenConfig } from "../../citizen-config";
import { CommonService } from "../../../../shared/services/common.service";
import { BookingService } from "../bookings/shared-booking/services/booking-service.service";
import { FormGroup } from "@angular/forms";
import { environment } from "../../../../../environments/environment";
import { Router } from "@angular/router";


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
    static CANCELLATION_REQUEST = "CANCELLATION_REQUEST";
    static CANCELLATION_APPROVED = "CANCELLATION_APPROVED";
    static AVAILABLE = "AVAILABLE";
    static RESCHEDULED = "RESCHEDULED";
    static TEMPORARY_BLOCKED = "TEMPORARY_BLOCKED";
    static MOB_NO_MIS_MATCH_MESSAGE = "Mobile Number and Confirm Mobile Number should match";
    static EMAIL_MIS_MATCH_MESSAGE = "Email and Confirm Email should match";
    static FEILD_ERROR_TITLE = "Feild Error";
    static ALL_FEILD_REQUIRED_MESSAGE = "Please fill all the required feilds";
    static AGREE_MESSAGE = 'Should be agree with given bank details';
    static TERMS_AND_CONDITION_MESSAGE = 'Should Accept the terms and condition of form';
    static MY_BOOKINGS_URL = 'citizen/bookings/my-bookings';
}

export class BTConfig extends CitizenConfig {

    /**
     * Method is used to approach common payment handling for booking
     * @param err - payment data
     * @param commonService -commmon service instance
     * @param bookingService - booking service instance
     * @param form - form
     * @param router router instance
     */
    redirectToPayment(err: any, commonService: CommonService, bookingService: BookingService, form?: FormGroup, router?: Router) {
        let payData = bookingService.proceedForPayment(err.error.data);
        commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, payData.html, cb => {
            window.location.href = environment.adminUrl + `admin/payment-gateway?retUrl=${payData.payData.retUrl}&retPath=${payData.payData.retPath}`;
        }, rj => {
            let errHtml = `			
						<div class="alert alert-danger">
							Please Complete Payment, Otherwise the application will be considered as in-complete
						</div>`
            commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
                window.location.href = environment.adminUrl + `admin/payment-gateway?retUrl=${payData.payData.retUrl}&retPath=${payData.payData.retPath}?&printUrl=${payData.payData.printUrl}`;
            }, arj => {
                if (form && router) {
                    form.disable();
                    router.navigate([BTConstants.MY_BOOKINGS_URL]);
                }
            });
            return;
        });
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