import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class BookingService {

	requestURL: string;
	resourceType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {

	}

	/**
	 * This method is use for get all resource
	 */
	getResourceList(){

		this.requestURL = `api/booking/${this.resourceType}/list`;

		return this.http.get(this.requestURL);

	}

	/**
	 * This method is use for get date wise slots for particular resource 
	 * @param resourceName - string
	 * @param date - YYYY-MM-DD
	 */
	getAllSlots(resourceName, date){
		
		this.requestURL = `api/booking/${this.resourceType}/slots?resource=${resourceName}&date=${date}`;

		return this.http.get(this.requestURL);

	}

	/**
	 * This method is use for get date wise slots for particular resource 
	 * @param resourceName - string
	 * @param startdate - YYYY-MM-DD
	 * @param enddate - YYYY-MM-DD
	 */
	getGuestHouseSlots(resourceName, startdate, enddate){
		
		this.requestURL = `api/booking/${this.resourceType}/slots?resource=${resourceName}&date=${startdate}&enddate=${enddate}`;

		return this.http.get(this.requestURL);

	}

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
	bookSlot(slotId, formData) {

		this.requestURL = `api/booking/${this.resourceType}/slot/book?uuid=${slotId}`;

		return this.http.post(this.requestURL, formData);
	}
	
	/**
	 * This method is use for book slot
	 * @param resource - string
	 * @param fromDate - YYYY/mm/dd
	 * @param toDate - YYYY/mm/dd
	 */
	bookGuestHouseSlot(resource, fromDate, toDate, formData?) {

		this.requestURL = `api/booking/${this.resourceType}/book?resourceCode=${resource}&fromDate=${fromDate}&toDate=${toDate}`;

		return this.http.post(this.requestURL, formData);
	}

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
	cancelBookedSlot(slotId, formData) {

		this.requestURL = `api/booking/${this.resourceType}/slot/cancel?uuid=${slotId}`;

		return this.http.post(this.requestURL, formData);
	}

	/**
	 * This method is use for get my bookings
	 */
	getMyBookings(){
		
		this.requestURL = `api/booking/${this.resourceType}/mybooking`;

		return this.http.get(this.requestURL);

	}

	/**
	 * This method is use to get lookup data respective to api type
	 */
	getDataFromLookups() {

		this.requestURL = `api/form/${this.resourceType}/lookups`;

		return this.http.get(this.requestURL);
	}


	/**
	 * Method is used to get all booked list from api
	 * @param date - desired date.
	 * @param resourceCode - resource code for band.
	 */
	getBookedBands(date, resourceCode) {
		this.requestURL = `api/booking/${this.resourceType}/getBookedSlot?bookingDate=${date}&resourceCode=${resourceCode}`;
		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to shortlist bands. 
	 * @param startDate - date of band booking.
	 * @param startTime - start time
	 * @param endTime - end time
	 * @param resourceCode - resource code
	 */
	shortListBands(startDate, startTime, endTime, resourceCode) {
		this.requestURL = `api/booking/${this.resourceType}/shortListSlot?startDate=${startDate}&startTime=${startTime}&endTime=${endTime}&resourceCode=${resourceCode}`;
		return this.http.post(this.requestURL, '');
	}

	/**
	 * Method is used to confirm band booking.
	 * @param formData - pass complete band form.
	 */
	confirmBandBooking(formData) {
		this.requestURL = `api/booking/${this.resourceType}/bookSlot`;
		return this.http.post(this.requestURL, formData);
	}

	/**
	 * Method is used to make payment for band booking.
	 * @param transactionId - payment transaction id.
	 */
	makePaymentService(transactionId) {
		this.requestURL = `api/booking/${this.resourceType}/pay/${transactionId}`;
		return this.http.get(this.requestURL);
	}
	


}
