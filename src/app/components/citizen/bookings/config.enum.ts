import { FormControl, FormGroup, FormArray } from "@angular/forms";
import * as moment from 'moment';


/**
 * Booking Module Constants
 */
export enum BookingConstants {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    BOOKED = "BOOKED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
    DEPOSIT_REQUIRED = "DEPOSIT_REQUIRED",
    CANCELLATION_REQUEST = "CANCELLATION_REQUEST",
    CANCELLATION_APPROVED = "CANCELLATION_APPROVED",
    AVAILABLE = "AVAILABLE",
    RESCHEDULED = "RESCHEDULED",
    TEMPORARY_BLOCKED = "TEMPORARY_BLOCKED",
    TOWNHALL_DEPOSIT = "TOWNHALL_DEPOSIT",
    TOWNHALL_FEES = "TOWNHALL_FEES",
    BY_FORCE = "BY_FORCE",
    BY_CITIZEN = "BY_CITIZEN",
    INVALID_BOOKING_STATUS = "INVALID_BOOKING_STATUS"
}

/**
 * Booking Module Utils
 */
export class BookingUtils{

    constructor(){}

    getProperErrorMessage(errorMessage: string): string {
        return errorMessage.split("_").join(" ");
    }

    getAllErrors(form) {
        for (let controls in form.controls) {
            let control = form.get(controls)
            if (control instanceof FormControl) {
                control.markAsTouched();
                control.updateValueAndValidity();
            } else if (control instanceof FormGroup) {
                this.getAllErrors(control)
            } else if (control instanceof FormArray) {
                control.controls.forEach(c => {
                    if (c instanceof FormGroup) {
                        this.getAllErrors(c);
                    }
                });
            }
        }
    }

    getDay(date: string): string {

        let Days: Array<any> = [
            { day: 'Sunday', code: 0 },
            { day: 'Monday', code: 1 },
            { day: 'Tuesday', code: 2 },
            { day: 'Wednesday', code: 3 },
            { day: 'Thursday', code: 4 },
            { day: 'Friday', code: 5 },
            { day: 'Saturday', code: 6 },
        ];

        return Days.find(day => day.code == moment(date).day()).day;
    }

    /**
	 * Method is used to return Date in format (DD-MM-YYYY)
	 * @param date - string date
	 */
    returnProperDate(date: string) {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0]
    }
}

