import { FormControl, FormGroup, FormArray } from "@angular/forms";
import * as moment from 'moment';
import { ComponentConfig } from "../../component-config";


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
export class BookingUtils extends ComponentConfig{

}

