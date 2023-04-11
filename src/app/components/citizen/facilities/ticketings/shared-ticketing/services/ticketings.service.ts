import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class TicketingsService {

  requestURL: string;
  moduleName:string = 'ticketing';
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
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/lookups`;
    return this.http.get(this.requestURL);
  }

  /**
   * this api for guideline
   */
  loadGuideLine() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/guideline`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
	 * This method is used to book zoo tickets
	*/
  bookZooTickets(ticketingInfo) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/book/?resourceCode=SAYAJIBAUGHZOO`;
    return this.http.post(this.requestURL, ticketingInfo);
  }

  /**
	 * This method is used to get form data
	*/
  getListData() {
    // api/ticketing/planetarium/list
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/list`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to book planetarium tickets
	*/
  bookPlanetariumTickets(ticketingInfo, resourceCode) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/book/?resourceCode=${resourceCode}`;
    return this.http.post(this.requestURL, ticketingInfo);
  }
  /**
	 * This method is used to save draft data
	*/
  saveDraftTickets(ticketingInfo, resourceCode) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/save/?resourceCode=${resourceCode}`;
    return this.http.post(this.requestURL, ticketingInfo);
  }

  /**
 * This method is used to book special show tickets
 */
  specialShowTicketsBooking(ticketingInfo, resourceCode) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/bookSpecialShow/?resourceCode=${resourceCode}`;
    return this.http.post(this.requestURL, ticketingInfo);
  }

  /**
    * This method is used to check seats
    */
   getPlanetariumShowAvailability(resourceCode:any,showLangulage:any,visitingDate:any,totalVisitor:any, showCategory : any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/checkAvailableSeats?resourceCode=${resourceCode}&showLangulage=${showLangulage}&visitingDate=${visitingDate}&totalVisitor=${totalVisitor}&showCategory=${showCategory}`;
    return this.http.get(this.requestURL);
  }
  // api/${this.moduleName}/planetarium/checkAvailableSeats-
  /**
    * This method is used to book planetarium tickets
    */
  getPlanetariumShowTimeSlot(date, resourceCode?) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slotsAPI?resource=${resourceCode}&startDate=${date}&endDate=${date}`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to get ticketing rates for visiting zoo
	*/
  getZooVisitingRates() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/rateList`;
    return this.http.get(this.requestURL);
  }

  /**
	 * This method is used to get total amount to be paid for visiting zoo
	*/
  getTotalAmount(refNumber: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getFees/${refNumber}`;
    return this.http.get(this.requestURL);
  }


  // METHODS FOR ANIMAL ADOPTION MODULE OF ZOO MODULE
  animalAdoptionRequest(animalAdoptionRequestForm) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/adoptionRequest/?resourceCode=SAYAJIBAUGHZOO_ANIMALADOPTION`;
    return this.http.post(this.requestURL, animalAdoptionRequestForm);
  }

  /**
	 * Method Is used to get animal adoption fees
	*/
  getAnimalAdoptionFeesList() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getAnimalAdoptionFeesList`;
    return this.http.get(this.requestURL);
  }

  /**
	 * Method Is used to print acknowledgement receipt
	 * @param refNumber - reference number
	 */
  printAcknowledgementReceipt(refNumber: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/print/acknowledgement/${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
  * Method Is used to cerfitrcaate
  * @param refNumber - reference number
  */
  printCertificate(ids: any) {
  this.requestURL = `api/${this.moduleName}/${this.resourceType}/printAdoptionCertificate?Id=${ids}`;
  return this.http.get(this.requestURL, 'printReceipt');
    }

  /**
  * Method Is used to print zoo visiting tickets after successful payment
  * @param refNumber - reference number
  */
  printTicketingReceipt(refNumber: string, serviceType: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/printTicket/${refNumber}/${serviceType}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  sendMailAndSMS(refNumber: string, serviceType: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/sendMailAndSendSMS/${refNumber}/${serviceType}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  /**
	 * This method is used to get all Ticketing Data with pagination using API
	*/
  getAllTicketing(refNumber?: string): Observable<any> {
    if (!refNumber) {
      refNumber = ""
    }
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/myticketing?page=${this.pageIndex}&limit=${this.pageSize}&refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

  /**
	 * Method is used to get transaction details
	 * @param refNumber - reference number.
	 */
  getTransactionDetails(refNumber) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getTransactionDetail?refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

	/**
	 * Method is used to print police performance license after rent payment.
	 * @param refNumber - Reference Number
	 */
  printPolicePerformanceLicense(refNumber) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/certificate/${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  	/**
	 * This methos for display json on myBooking list
	 * @param refNumber
	 */
  displayJson(refNumber: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/json/${refNumber}`;
    return this.http.get(this.requestURL);
  }

  /**
	 * Cancel request .
	 * @param data - json data
	 */
  cancelTicketing(data: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/cancelAPI`;
    return this.http.post(this.requestURL, data);
  }

  /**
	 * This method is used to get user profile data
	 */
	getUserProfile() {

		return this.http.get('api/user/profile');
  }
   /**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	postFixedPayment(paymentData:any) {
		let requestURL = `api/${this.moduleName}/${this.resourceType}/postFixedPayment`;

		return this.http.post(requestURL, paymentData);

  }

  getBase64StringURL(refNumber: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getLoiDocument/${refNumber}`;
    return this.http.get(this.requestURL);
  }

  animalAdoptionCount(data:any) {
		let requestURL = `api/${this.moduleName}/${this.resourceType}/updateAnimalCount?animalName=${data.animalName}&animalCount=${data.animalCount}&adoptionAnimalCount=${data.adoptionAnimalCount}`;
		return this.http.post(requestURL, data);

  }
}
