import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class TicketingsService {

  requestURL: string;
  resourceType: string;
  headers: any;
  apiType: string;
  pageSize: number;
  pageIndex: number;

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
	 * This method is used to get form data 
	*/
  getFormData() {
    // api/ticketing/planetarium/list
    this.requestURL = `api/ticketing/${this.resourceType}/list`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to book planetarium tickets
	*/
  bookPlanetariumTickets(ticketingInfo,resourceCode) {
    this.requestURL = `api/ticketing/${this.resourceType}/book/?resourceCode=${resourceCode}`;
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
    this.requestURL = `api/ticketing/${this.resourceType}/adoptionRequest/?resourceCode=SARDARBAUGHZOO_ANIMALADOPTION`;
    return this.http.post(this.requestURL, animalAdoptionRequestForm);
  }

  /**
	 * Method Is used to get animal adoption fees
	*/
  getAnimalAdoptionFeesList() {
    this.requestURL = `api/ticketing/${this.resourceType}/getAnimalAdoptionFeesList`;
    return this.http.get(this.requestURL);
  }

  // METHODS FOR ANIMAL ADOPTION MODULE OF ZOO MODULE ENDS HERE

  /**
	 * Method Is used to print acknowledgement receipt
	 * @param refNumber - reference number
	 */
  printAcknowledgementReceipt(refNumber: string) {
    this.requestURL = `api/ticketing/${this.resourceType}/print/acknowledgement/${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
  * Method Is used to print zoo visiting tickets after successful payment
  * @param refNumber - reference number
  */
  printTicketingReceipt(refNumber: string, serviceType: string) {
    this.requestURL = `api/ticketing/${this.resourceType}/printTicket/${refNumber}/${serviceType}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
	 * This method is used to get all Ticketing Data with pagination using API
	*/
  getAllTicketing(refNumber?: string): Observable<any> {
    if (!refNumber) {
      refNumber = ""
    }
    this.requestURL = `api/ticketing/${this.resourceType}/myticketing?page=${this.pageIndex}&limit=${this.pageSize}&refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

  /**
	 * Method is used to get transaction details
	 * @param refNumber - reference number.
	 */
  getTransactionDetails(refNumber) {
    this.requestURL = `api/ticketing/${this.resourceType}/getTransactionDetail?refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

}
