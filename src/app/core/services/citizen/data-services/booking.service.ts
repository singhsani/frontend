import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';



@Injectable()
export class BookingService {

	requestURL: string;
	resourceType: string;
	headers: any;
	apiType: string;
	pageSize: number;
	pageIndex: number;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService, private session: SessionStorageService, private commonService: CommonService) {}
	/**
	 * This method is use for get all resource
	 */
	getResourceList() {

		this.requestURL = `api/booking/${this.resourceType}/list`;

		return this.http.get(this.requestURL);

	}

	/**
	 * Method is used to get all available slot using api.
	 * @param filterData - filter data object.
	 */
	getAllSlots(filterData) {
		this.requestURL = `api/booking/${this.resourceType}/slotsAPI?resource=${filterData.resourceName}&startDate=${filterData.startDate}&endDate=${filterData.endDate}`;

		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to shortlist all selected shifts in townhall.
	 * @param shortListData - selected dates, shifts.
	 */
	shortListTownHall(shortListData) {
		this.requestURL = `api/booking/${this.resourceType}/shortlistAPI`;
		return this.http.post(this.requestURL, shortListData);
	}


	/**
	 * Method is used to search payment.
	 * @param searchPaymentData - Search Payment Data.
	 */
	searchPayment(refNumber) {

		this.requestURL = `api/booking/${this.resourceType}/getFees/${refNumber}`

		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to perform payment and after storing data to localhost redirects to payment gateway.
	 * @param data - Object Data
	 */
	proceedForPayment(data: any){
		let payData = {
			id: null,
			uniqueId: null,
			version: null,
			paymentType: data.paymentType,
			refNumber: data.refNumber,
			response: JSON.stringify({
				data: "paid",
				status: true
			}),
			transactionId: data.transactionId,
			paymentStatus: "SUCCESS",
			retUrl: "http://192.168.10.107:8080/vmcportal/",
			retPath: 'citizen/payment-gateway-response',
			myApplicationUrl: '/citizen/booking/cancel-booking'
		}

		/**
		 * Storing Data to session. 
		 */
		this.session.set('paymentData', JSON.stringify(payData));

		this.commonService.paymentAlert('', '', '', cb => {
			window.location.href = `http://192.168.10.107:8080/vmcadminportal/#/admin/payment-gateway?retUrl=${payData.retUrl}&retPath=${payData.retPath}`;
		});
	}

	/**
	 * Method is used to book slot (common).
	 * @param bookingInfo - booking information.
	 */
	commonBookSlot(bookingInfo) {
		this.requestURL = `api/booking/${this.resourceType}/bookAPI`;
		return this.http.post(this.requestURL, bookingInfo);
	}

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
	commonCancelBookedSlot(slotId, formData) {

		this.requestURL = `api/booking/${this.resourceType}/slot/cancel?uuid=${slotId}`;

		return this.http.post(this.requestURL, formData);
	}

	/**
	 * Method is used to print police performance license after rent payment.
	 * @param refNumber - Reference Number
	 */
	printPolicePerformanceLicense(refNumber) {
		this.requestURL = `api/booking/${this.resourceType}/certificate/${refNumber}`;
		return this.http.get(this.requestURL, 'printReceipt');
	}

	/**
	 * Method is used to print rent receipt.
	 * @param refNumber - Reference Number
	 */
	printReceipt(refNumber){
		this.requestURL = `api/booking/${this.resourceType}/printReceipt/${refNumber}`;
		return this.http.get(this.requestURL, 'printReceipt');
	}

	/**
	 * This method is use for get date wise slots for particular resource 
	 * @param resourceName - string
	 * @param startdate - YYYY-MM-DD
	 * @param enddate - YYYY-MM-DD
	 */
	getGuestHouseSlots(resourceName, startdate, enddate) {

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
	cancelBookedSlot(refNumber, formData) {

		this.requestURL = `api/booking/${this.resourceType}/cancelAPI?refNumber=${refNumber}`;

		return this.http.get(this.requestURL);
	}

	/**
	 * This method is used to get all form data with pagination using API
	 */
	getAllBookings(): Observable<any> {

		this.requestURL = `api/booking/${this.resourceType}/mybooking?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL);
	}

	/**
	 * This method is use to get lookup data respective to api type
	 */
	getDataFromLookups() {

		this.requestURL = `api/booking/${this.resourceType}/lookups`;

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

	shortListTheater(theaterObject) {
		console.log(theaterObject);
		this.requestURL = `api/booking/${this.resourceType}/slot/shortlistAPI?uniqueId=${theaterObject.uniqueId}`;
		return this.http.post(this.requestURL, theaterObject);
	}

	bookSlotAmphiTheater(bookingInfo) {
		this.requestURL = `api/booking/${this.resourceType}/slot/bookAPI`;
		return this.http.post(this.requestURL, bookingInfo);
	}





}
