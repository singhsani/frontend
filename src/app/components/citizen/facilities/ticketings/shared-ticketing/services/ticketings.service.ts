import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable()
export class TicketingsService {

  requestURL: string;
  resourceType: string;

  constructor(
    private http: HttpService
  ) { }

  /**
	 * This method is use to get lookup data respective to api type
	 */
  getDataFromLookups() {
    this.requestURL = `api/ticketing/${this.resourceType}/lookups`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to book zoo tickets
	*/
  bookZooTickets(ticketingInfo) {
    this.requestURL = `api/ticketing/${this.resourceType}/book/?resourceCode=SARDARBAUGHZOO`;
    return this.http.post(this.requestURL, ticketingInfo);
  }

  /**
	 * This method is used to get ticketing rates for visiting zoo
	*/
  getZooVisitingRates() {
    this.requestURL = `api/ticketing/${this.resourceType}/rateList`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to get total amount to be paid for visiting zoo
	*/
  getTotalAmount(refNumber: string) {
    this.requestURL = `api/ticketing/${this.resourceType}/getFees/${refNumber}`;
    return this.http.get(this.requestURL);
  }


  // METHODS FOR ANIMAL ADOPTION MODULE OF ZOO MODULE

  animalAdoptionRequest(animalAdoptionRequestForm) {
    this.requestURL = `api/booking/${this.resourceType}/adoptionRequest/?resourceCode=SARDARBAUGHZOO_ANIMALADOPTION`;
    return this.http.post(this.requestURL, animalAdoptionRequestForm);
  }

  /**
	 * Method Is used to get animal adoption fees
	*/
  getAnimalAdoptionFeesList() {
    this.requestURL = `api/booking/${this.resourceType}/getAnimalAdoptionFeesList`;
    return this.http.get(this.requestURL);
  }

  // METHODS FOR ANIMAL ADOPTION MODULE OF ZOO MODULE ENDS HERE

  /**
	 * Method Is used to print acknowledgement receipt
	 * @param refNumber - reference number
	 */
  printAcknowledgementReceipt(refNumber: string) {
    this.requestURL = `api/booking/${this.resourceType}/print/acknowledgement/${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
  * Method Is used to print zoo visiting tickets after successful payment
  * @param refNumber - reference number
  */
 printZooTicketingReceipt(refNumber: string, serviceType: string) {
  this.requestURL = `api/ticketing/${this.resourceType}/printTicket/${refNumber}/${serviceType}`;
  return this.http.get(this.requestURL, 'printReceipt');
}

}
