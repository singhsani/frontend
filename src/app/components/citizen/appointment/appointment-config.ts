import { CitizenConfig } from "../citizen-config";

export class AppointmentConfig extends CitizenConfig {

    /**
     * constants 
     */
    public  NOT_ALLOWED_TO_CANCEL_CODE = "NOT_ALLOWED_TO_CANCEL";
    public  NOT_ALLOWED_TO_CANCEL = "Not Allowed To Cancel, Appointment might be expired"
    public  APPOINTMENT_CANCELLAION_ERROR = "Appointment Cancellation Error"
    public  APPOINTMENT_SCHEDULE_ERROR = "Appointment Schedule Error"
    public  ONLY_ONE_APPOINTMENT_ALLOWED_CODE = "ONLY_ONE_APPOINTMENT_ALLOWED"
    public  ONLY_ONE_APPOINTMENT_ALLOWED_ERROR = "You can schedule only one appointment for application"
    public  ONLY_ONE_APPOINTMENT_ALLOWED_ERROR_MESSAGE = "Please delete the existing booked appointment inorder to reschedule new appointment"

    constructor() {
        super();
     }
}
