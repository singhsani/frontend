import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  requestURL: string;
  resourceType: string;
  moduleName: string = 'booking';
  headers: any;
  apiType: string;
  pageSize: number;
  pageIndex: number;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
  constructor(public http: HttpService) { }

	/**
	 * This method is use for get all resource
	 */
  getResourceList() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/list`;
    return this.http.get(this.requestURL);
  }

  loadGuideLine() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/guideline`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

	/**
	 * Method is used to get all available slot using api.
	 * @param filterData - filter data object.
	 */
  getAllSlots(filterData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slotsAPI?resource=${filterData.resourceName}&startDate=${filterData.startDate}&endDate=${filterData.endDate}`;
    return this.http.get(this.requestURL);
  }

	/**
	 * Method is used to shortlist all selected shifts in townhall.
	 * @param shortListData - selected dates, shifts.
	 */
  shortListBookings(shortListData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/shortlistAPI`;
    return this.http.post(this.requestURL, shortListData);
  }

	/**
	 * Cancel Town hall api.
	 * @param data - json data
	 */
  cancelTownHall(data: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/cancelAPI`;
    return this.http.post(this.requestURL, data);
  }

	/**
	 * Method is used to search payment.
	 * @param searchPaymentData - Search Payment Data.
	 */
  searchPayment(refNumber) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getFees/${refNumber}`;
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
	 * Method is used to book slot (common).
	 * @param bookingInfo - booking information.
	 */
  commonBookSlot(bookingInfo) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slot/bookAPI`;
    return this.http.post(this.requestURL, bookingInfo);
  }

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
  commonCancelBookedSlot(slotId, formData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slot/cancel?uuid=${slotId}`;
    return this.http.post(this.requestURL, formData);
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
	 * Method is used to print rent receipt.
	 * @param refNumber - Reference Number
	 */
  printReceipt(refNumber, type: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/printReceipt?refNumber=${refNumber}&serviceType=${type}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

	/**
	 * Method Is used to print acknowledgement receipt
	 * @param refNumber - reference number
	 */
  printAcknowledgementReceipt(refNumber: string) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/print/acknowledgement/${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt');
  }

  // Part Should be common in future
	/**
	 * This method is use for get date wise slots for particular resource
	 * @param resourceName - string
	 * @param startdate - YYYY-MM-DD
	 * @param enddate - YYYY-MM-DD
	 */
  getGuestHouseSlots(resourceName, startdate, enddate) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slots?resource=${resourceName}&date=${startdate}&enddate=${enddate}`;
    return this.http.get(this.requestURL);
  }

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
  bookSlot(slotId, formData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slot/book?uuid=${slotId}`;
    return this.http.post(this.requestURL, formData);
  }

	/**
	 * This method is use for book slot
	 * @param resource - string
	 * @param fromDate - YYYY/mm/dd
	 * @param toDate - YYYY/mm/dd
	 */
  bookGuestHouseSlot(resource, fromDate, toDate, formData?) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/book?resourceCode=${resource}&fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.post(this.requestURL, formData);
  }

	/**
	 * This method is use for book slot
	 * @param slotId - string
	 * @param formData - form data
	 */
  cancelBookedSlot(refNumber, formData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/cancelAPI?refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

	/**
	 * This method is used to get all form data with pagination using API
	 */
  getAllBookings(refNumber?: string): Observable<any> {
    if (!refNumber) {
      refNumber = ""
    }
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/mybooking?page=${this.pageIndex}&limit=${this.pageSize}&refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

	/**
	 * This method is use to get lookup data respective to api type
	 */
  getDataFromLookups() {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/lookups`;
    return this.http.get(this.requestURL);
  }

	/**
	 * This method is use to get lookup data respective to api type
	 */
  getBankNames() {
    this.requestURL = `api/bankMaster/get/active/all`;
    return this.http.get(this.requestURL);
  }

	/**
	 * Method is used to get all booked list from api
	 * @param date - desired date.
	 * @param resourceCode - resource code for band.
	 */
  getBookedBands(date, resourceCode) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/getBookedSlot?bookingDate=${date}&resourceCode=${resourceCode}`;
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
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/shortListSlot?startDate=${startDate}&startTime=${startTime}&endTime=${endTime}&resourceCode=${resourceCode}`;
    return this.http.post(this.requestURL, '');
  }

	/**
	 * Method is used to confirm band booking.
	 * @param formData - pass complete band form.
	 */
  confirmBandBooking(formData) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/bookSlot`;
    return this.http.post(this.requestURL, formData);
  }

	/**
	 * Method is used to make payment for band booking.
	 * @param transactionId - payment transaction id.
	 */
  makePaymentService(transactionId) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/pay/${transactionId}`;
    return this.http.get(this.requestURL);
  }

  shortListTheater(theaterObject) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slot/shortlistAPI?uniqueId=${theaterObject.uniqueId}`;
    return this.http.post(this.requestURL, theaterObject);
  }

  bookSlotAmphiTheater(bookingInfo) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/slot/bookAPI`;
    return this.http.post(this.requestURL, bookingInfo);
  }

	/**
	 * This methos for display json on myBooking list
	 * @param refNumber
	 */
  displayJson(refNumber: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/json/${refNumber}`;
    return this.http.get(this.requestURL);
  }

  //swimming pool api
  /**
	 * This methos for display json on myBooking list
	 */
  filterPoolCode(poolCode: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/filter/batchCode/${poolCode}`;
    return this.http.get(this.requestURL);
  }

  filterBatchCode(data) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/filter/batchName/${data.batchCode}/${data.poolName}/${data.category}/${data.birthDate}`;
    return this.http.get(this.requestURL);
  }

  countBatch(data) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/BatchCount?poolName=${data.poolName}&category=${data.category}&batchfor=${data.batchfor}&batchTimming=${data.batchTimming}`;
    return this.http.get(this.requestURL);
  }

  filterBatchDuration(categotyCode: any,poolName:any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/filter/batchDuration/${categotyCode}/${poolName}`;
    return this.http.get(this.requestURL);
  }
  // api/booking/swimming/submit

  /**
	 * This method is used to get user profile data
	 */
  getUserProfile() {
    return this.http.get('api/user/profile');
  }

  // api/booking/swimming/download/download/{fileName}

  downloadGuidLineDocumemnt(filename: any, type: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/download/${filename}`;
    // return this.http.get(this.requestURL);
    return this.http.getUploadedFile(this.requestURL, type);

  }
  /**
   * This method for save form data and get refNumber
   */
  saveDraftform(formInfo: any, resourceCode: any) {
    // api/booking/swimming/save?resourceCode=LALBAUG_SWIMMING_POOL
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/save?resourceCode=${resourceCode}`;
    return this.http.post(this.requestURL, formInfo);
  }

  /**
   * this method for submit form data
   */
  submitFormData(formInfo: any) {
    this.requestURL = `api/${this.moduleName}/${this.resourceType}/book`;
    return this.http.post(this.requestURL, formInfo);
  }

  searchRenewSwimmingPool(poolNumber:any){
    // {{HOST}}/api/booking/swimmingrenewal/searchBySwimmnerNumber/{{REF_NUM}}
    this.requestURL = `api/${this.moduleName}/swimming/searchBySwimmnerNumber/${poolNumber}`;
    return this.http.get(this.requestURL);

  }

  /*Below service is use for atithigruh */
  atithigruhList() {
    return this.http.get(`api/booking/${this.resourceType}/list`);
  }

  generateReference(data){
    return this.http.post('api/booking/atithigruh/saveAdvanceBooking', data);
  }

  calculateFees(refNumber){
    this.requestURL = `api/booking/atithigruh/calculateFees/${refNumber}`;
    return this.http.get(this.requestURL);
  }

  submitAdvanceBooking(data){
    this.requestURL = `api/booking/atithigruh/submitAdvanceBookingRequest`;
    return this.http.post(this.requestURL, data, 'printReceipt');
  }
  /*Services end for atithigruh */

     // {{HOST}}/api/booking/swimming/printSwimmingReceipt?refNumber={{REF_NUM}}&serviceType=SWIMMING_POOL_FEES
     printSwimmingReceipt(refNumber:any, type: string) {
      this.requestURL = `api/${this.moduleName}/${this.resourceType}/printSwimmingReceipt?refNumber=${refNumber}&serviceType=${type}`;
      return this.http.get(this.requestURL, 'printReceipt');
    }

   /*
    * search by refNumber
    */
    searchByRefNumber(refNumber:any){
        this.requestURL = `api/${this.moduleName}/${this.resourceType}/search/${refNumber}`;
        return this.http.get(this.requestURL);
    }

  /**
 * Method is used to cancel advance booking if payment is not done.
 * @param refNumber - Reference Number
 */
  cancelAdvanceBookingIfPymentNotDone(refNumber: string) {
    this.requestURL = `api/booking/${this.resourceType}/cancelAdvanceApplication?refNumber=${refNumber}`;
    return this.http.get(this.requestURL);
  }

  /**
     * This method is used to send sms after completion of  payment
     * @param refNumber
     * @param eventType
     */
    sendSms(refNumber:any,eventType:any){
      this.requestURL = `api/booking/${this.resourceType}/sendSms?refNumber=${refNumber}&eventType=${eventType}`;
      return this.http.get(this.requestURL);
    }

/**
     * This method is used to send Mail after completion of payment to user
     * @param refNumber
     * @param eventType
     */
    sendMail(refNumber: any,eventType: any){
      this.requestURL = `api/booking/${this.resourceType}/sendMail?refNumber=${refNumber}&eventType=${eventType}`;
      return this.http.get(this.requestURL);

    }

    // this method is uded to print swimming LOI receipt
  printReceiptSwimming(refNumber: any) {
    this.requestURL = `api/booking/swimming/printReceiptLOI?refNumber=${refNumber}`;
    return this.http.get(this.requestURL, 'printReceipt')
   }
  /**
     * This method is used to send sms on submit
     * @param refNumber
     * @param eventType
     */
  sendSmsForSwimming(refNumber:any,eventType:any){
    this.requestURL = `api/booking/${this.resourceType}/sendSms?refNumber=${refNumber}&eventType=${eventType}`;
    return this.http.get(this.requestURL);
  }

  /**
     * This method is used to send Mail on submit
     * @param refNumber
     * @param eventType
     */
    sendMailForSwimming(refNumber: any,eventType: any){
      this.requestURL = `api/booking/${this.resourceType}/sendMail?refNumber=${refNumber}&eventType=${eventType}`;
      return this.http.get(this.requestURL);

    }

    /* This is used for deposit Refund Request */
    depositRefundRequest(refNumber: any){
      this.requestURL = `api/booking/${this.resourceType}/depositRefundRequest?refNumber=${refNumber}`;
      return this.http.post(this.requestURL,'');
    }

    cancellationApproveReport(refNumber: any) {
      this.requestURL = `api/booking/${this.resourceType}/cancellationApproveReport?refNumber=${refNumber}`;
      return this.http.get(this.requestURL,'printReceipt');
    }

    getBase64StringURL(refNumber: string) {
        this.requestURL = `api/booking/${this.resourceType}/getLoiDocument/${refNumber}`;
        return this.http.get(this.requestURL);
    }

    getStadiumRateData(){
      this.requestURL = `api/booking/stadium/getFeesDetail`;
      return this.http.get(this.requestURL);
    }

    cancelAcknowledgement(refNumber: string,serviceType: string){
      if(serviceType == 'STADIUM'){
        this.requestURL = `api/booking/stadium/refundAcknowledgment?refNumber=${refNumber}`;
      } else if(serviceType == 'CHILDREN_THEATER'){
        this.requestURL = `api/booking/childrenTheater/cancellationAcknowledgment?refNumber=${refNumber}`;
      }
        return this.http.get(this.requestURL,'printReceipt');
    }

    getFeesStructure(){
      this.requestURL = `api/booking/${this.resourceType}/getFeesStructure?resourceType=${this.resourceType}`;
      return this.http.get(this.requestURL);
    }

    getAvailableStots(filterData) {
      this.requestURL = `api/${this.moduleName}/${this.resourceType}/availlableSlots?resource=${filterData}`;
      return this.http.get(this.requestURL);
    }

    getGardenList(zone) {
      this.requestURL = `api/${this.moduleName}/${this.resourceType}/listOfGarden?zone=${zone}`;
      return this.http.get(this.requestURL);
    }

    getZoneListForShooting() {
      this.requestURL = `api/${this.moduleName}/${this.resourceType}/zoneListForShooting`;
      return this.http.get(this.requestURL);
    }

    getSlotAvillable(refNumber){
      return this.http.post(`api/booking/${this.resourceType}/getSlotAvailable`,refNumber);
    }
}
