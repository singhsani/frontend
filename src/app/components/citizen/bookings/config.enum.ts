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
    CHECKED = "CHECKED",
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
    INVALID_BOOKING_STATUS = "INVALID_BOOKING_STATUS",
    ALL_FEILD_REQUIRED_MESSAGE="Please fill all the required feilds",
    SELECT_SHIFT_MESSAGE="Please Select shift",
    MOB_NO_MIS_MATCH_MESSAGE ="Mobile Number and Confirm Mobile Number should match",
    EMAIL_MIS_MATCH_MESSAGE ="Email and Confirm Email should match",
    TOWNHALL_RESOURCE_TYPE ="townhall",
    STADIUM_RESOURCE_TYPE = "stadium",


}

/**
 * Booking Module Utils
 */
export class BookingUtils{

    public DateArray = [
        { month: 'Jan', id: '01', monthName: 'January' },
        { month: 'Fab', id: '02', monthName: 'February' },
        { month: 'Mar', id: '03', monthName: 'March' },
        { month: 'Apr', id: '04', monthName: 'April' },
        { month: 'May', id: '05', monthName: 'May' },
        { month: 'Jun', id: '06', monthName: 'June' },
        { month: 'Jul', id: '07', monthName: 'July' },
        { month: 'Aug', id: '08', monthName: 'August' },
        { month: 'Sep', id: '09', monthName: 'September' },
        { month: 'Oct', id: '10', monthName: 'October' },
        { month: 'Nov', id: '11', monthName: 'November' },
        { month: 'Dec', id: '12', monthName: 'December' },
    ];

    constructor(){}

    getProperErrorMessage(errorMessage: string): string {
        return errorMessage.split("_").join(" ");
    }

    getAllErrors(form) {
        this.markAsTouched(form);
        let count = 0;
        for (const key in form.controls) {
            if(form.get(key).invalid){
                break;
            }
            count++;
        }
        return count;
    }

    markAsTouched(form){
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
        if(date){
            let newDate = date.split(" ")[0].split("-");
            return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
        }
        return null;
    }

    /**
     * Method is used to match two cotrols of form.
     * @param form - form group
     * @param c1 - control 1
     * @param c2 - control 2
     */
    matcher(form: FormGroup, c1: string, c2: string): boolean{
        return form.get(c1).value == form.get(c2).value
    }
}

