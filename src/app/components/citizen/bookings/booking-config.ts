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
    BOOKINGS_FILE_UPLOAD_URL = 'api/attachment/booking/upload',
    MY_BOOKINGS_URL = 'citizen/bookings/my-bookings'
}

/**
 * Booking Module Utils
 */
export class BookingUtils extends ComponentConfig{

    bookingConstants  = BookingConstants;

    constructor(){
        super();
    }

    /**
	 * Selection Parts is being started from  here.
	 */
    filterMonths(Dates): Array<any> {
        return this.DateArray.filter(month => Dates.find(d => d.key.split('-')[1] == month.id));
    }

    /**
       * Used to get shifts of perticular month
       * @param id - month id
       */
    filterAcc(id, Dates) {
        return Dates.filter(t => t.key.split('-')[1] == id);
    }

    /**
     * Method is used to check all date wise shifts in month.
     * @param month - perticular month object.
     * @param Dates - Date array
     */
    checkedAllinMonth(month, Dates) {
        let myArray = this.filterAcc(month.id, Dates);
        for (let i = 0; i < myArray.length; i++) {
            for (let j = 0; j < myArray[i].slotList.length; j++) {
                if (myArray[i].slotList[j].slotStatus == this.bookingConstants.AVAILABLE) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Method is used to disable the checkbox(for perticular month) if status is not available.
     * @param month - month
     * @param Dates - Date array
     */
    checkAllDisabledInmonth(month, Dates) {
        let myArray = this.filterAcc(month.id, Dates);
        for (let i = 0; i < myArray.length; i++) {
            for (let j = 0; j < myArray[i].slotList.length; j++) {
                if (myArray[i].slotList[j].slotStatus == this.bookingConstants.AVAILABLE || myArray[i].slotList[j].slotStatus == this.bookingConstants.CHECKED) {
                    return false;
                }
            }
        }
        return true;
    }


    /**
	 * Method is used to select all shifts in perticular month.
	 * @param checked - checked event
	 * @param month - perticular month
     * @param Dates - Dates 
	 * @param i - index
	 */
    selectAllShiftsInMonth(checked, month, Dates, selectedShift, i): void {
        if (checked) {
            this.filterAcc(month.id, Dates).forEach(obj => {
                selectedShift = selectedShift.concat(obj.slotList.filter(status => status.slotStatus == this.bookingConstants.AVAILABLE).map((data) => {
                    data.slotStatus = this.bookingConstants.CHECKED;
                    return data;
                }))
            })
        } else {
            this.filterAcc(month.id, Dates).forEach(obj => {
                obj.slotList.forEach(nestObj => {
                    let index = selectedShift.findIndex(myData => myData.uniqueId == nestObj.uniqueId);
                    if (index > -1) {
                        nestObj.slotStatus = this.bookingConstants.AVAILABLE;
                        selectedShift.splice(index, 1)
                    }
                })
            })
        }
        return selectedShift;
    }

    /**
	 * Method is used to remove selected townhalls.
	 * @param shift - shift with details
	 * @param index - index
	 */
    removeSelectedShift(shift, selectedShift, index) {
        return this.selectShift(shift, false, selectedShift);
    }

    /**
    * Method is used to select available shift.
    * @param shift - shift object.
    * @param checked - checked event
    */
    selectShift(shift, checked, selectedShift) {
        if (checked) {
            let data = selectedShift.find(uniqueId => uniqueId == shift.uniqueId)
            if (!data) {
                shift.slotStatus = this.bookingConstants.CHECKED;
                selectedShift.push(shift);
            }
        } else {
            let data = selectedShift.findIndex(uniqueId => uniqueId.uniqueId == shift.uniqueId);
            if (data > -1) {
                shift.slotStatus = this.bookingConstants.AVAILABLE;
                selectedShift.splice(data, 1);
            }
        }
        return selectedShift;
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

