import { FormControl, FormGroup, FormArray } from "@angular/forms";
import * as moment from "moment";

export class Configuration {

    /**
     * constants 
     */
    public static ALL_FEILD_REQUIRED_MESSAGE = "Please fill all the required feilds";
    public static NOT_ALLOWED_TO_CANCEL_CODE = "NOT_ALLOWED_TO_CANCEL";
    public static NOT_ALLOWED_TO_CANCEL = "Not Allowed To Cancel, Appointment might be expired"
    public static APPOINTMENT_CANCELLAION_ERROR = "Appointmet Cancellation Error"
    public static APPOINTMENT_SCHEDULE_ERROR = "Appointmet Schedule Error"
    public static ONLY_ONE_APPOINTMENT_ALLOWED_CODE = "ONLY_ONE_APPOINTMENT_ALLOWED"
    public static ONLY_ONE_APPOINTMENT_ALLOWED_ERROR = "You can schedule only one appointment for application"


    constructor() { }

    /**
     * Method Is used to get propper error from code
     * @param errorMessage - pass error code
     */
    getProperErrorMessage(errorMessage: string): string {
        return errorMessage.split("_").join(" ");
    }

    /**
     * Method is used to get all validation error
     * @param form - pass form for validation
     */
    getAllErrors(form) {
        this.markAsTouched(form);
        let count = 0;
        for (const key in form.controls) {
            if (form.get(key).invalid) {
                break;
            }
            count++;
        }
        return count;
    }

    /**
     * Mark form as touched
     * @param form -pass form
     */
    markAsTouched(form) {
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

    /**
     * get proper daty as date given
     */
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
        if (date) {
            let newDate = date.split(" ")[0].split("-");
            return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
        }
        return null;
    }

}
