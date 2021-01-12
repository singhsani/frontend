import { BTConfig, BTConstants } from '../../config/bt-config';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Ticketing Module Constants
 */
export class TicketingConstants extends BTConstants {
  static AGREE_MESSAGE = 'Should be agree with given bank details';
  static TERMS_AND_CONDITION_MESSAGE = 'Should Accept the terms and condition of form';
  // static TICKETING_FILE_UPLOAD_URL = 'api/attachment/ticketing/upload';
  static TICKETING_FILE_UPLOAD_URL = 'api/attachment/booking/upload';
  static SELECT_RESOURCE_MESSAGE = 'Should be select resource first';
  static AVAILABLE_SEATS = 'Seats are available';
  static NOT_AVAILABLE = 'Seats are not available';
  static ALL_FEILD_REQUIRED_MESSAGE = "Select required feild";
  static PAYMENT_REQUIRED = "PAYMENT_REQUIRED";
  static REJECTED = "REJECTED";

  // static MY_TICKETINGS_URL = 'ticketings/dashboard'

}

/**
 * Ticketing Module Utils
 */
export class TicketingUtils extends BTConfig {

  constructor(public formService?: FormsActionsService,
    public toastr?: ToastrService
) {
    super();
  }

}
