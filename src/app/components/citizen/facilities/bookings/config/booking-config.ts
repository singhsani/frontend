
import { BTConfig, BTConstants } from "../../config/bt-config";
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';


/**
 * Booking Module Constants
 */
export class BookingConstants extends BTConstants {
    static TOWNHALL_DEPOSIT = "TOWNHALL_DEPOSIT";
    static TOWNHALL_FEES = "TOWNHALL_FEES";
    static SELECT_SHIFT_MESSAGE="Please Select shift";
    static SELECT_SLOT_MESSAGE="Please Select slot";
    static TOWNHALL_RESOURCE_TYPE ="townhall";
    static STADIUM_RESOURCE_TYPE = "stadium";
    static CT_RESOURCE_TYPE ="childrenTheater";
    static ATITHIGRUH_RESOURCE_TYPE ="atithigruh";
    static SHOOTING_PERMISSION_PLACE = "shootingPermission";
    static BOOKINGS_FILE_UPLOAD_URL = 'api/attachment/booking/upload';
    static SUBMIT ="SUBMIT";
    static CANCEL ="CANCEL";
    static COMPLETED='COMPLETED';
    static REFUND_REQUEST='REFUND_REQUEST';
    static REFUND_APPROVED='REFUND_APPROVED';
    static STADIUM_DEPOSIT = 'STADIUM_DEPOSIT';
    static AMPHI_RESOURCE_TYPE = 'amphiTheater';
    static FORM_CHARGES = 'FORM_CHARGES';
    static SWIMMING_POOL_ADMISSION_FEES='SWIMMING_POOL_ADMISSION_FEES';
    static BLOCKED = 'BLOCKED';
    static PARTIALLY_BOOKED='PARTIALLY_BOOKED';
}

/**
 * Booking Module Utils
 */
export class BookingUtils extends BTConfig {

    bookingConstants  = BookingConstants;

    constructor(public formService?: FormsActionsService,
        public toastr?: ToastrService
     ) {
         super(formService, toastr);
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
                shift.slotStatus == 'HOLIDAY' ?   shift.slotStatus :shift.slotStatus == 'FESTIVAL' ?   shift.slotStatus :  shift.slotStatus = this.bookingConstants.CHECKED;
                //shift.slotStatus = this.bookingConstants.CHECKED;
                selectedShift.push(shift);
            }
        } else {
            let data = selectedShift.findIndex(uniqueId => uniqueId.uniqueId == shift.uniqueId);
            if (data > -1) {
                shift.slotStatus == 'HOLIDAY' ?   shift.slotStatus :shift.slotStatus == 'FESTIVAL' ? shift.slotStatus  :  shift.slotStatus = this.bookingConstants.AVAILABLE;
               //shift.slotStatus = this.bookingConstants.AVAILABLE;
                selectedShift.splice(data, 1);
            }
        }
        return selectedShift;
    }

    /**
     * Get invalid form control key
     * @param form - form group
     */
    getInvalidFormControlKey(form) {
        this.markAsTouched(form);
        for (const key in form.controls) {
            if (form.get(key).invalid) {
                console.log("Invalid from control key",key);
                return key;
            }
        }
    }



}

