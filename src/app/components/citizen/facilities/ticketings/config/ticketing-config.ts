import { BTConfig, BTConstants } from '../../config/bt-config';

/**
 * Ticketing Module Constants
 */
export class TicketingConstants extends BTConstants {
  static AGREE_MESSAGE = 'Should be agree with given bank details';
  static TERMS_AND_CONDITION_MESSAGE = 'Should Accept the terms and condition of form';
}

/**
 * Ticketing Module Utils
 */
export class TicketingUtils extends BTConfig {

  constructor() {
    super();
  }
}
