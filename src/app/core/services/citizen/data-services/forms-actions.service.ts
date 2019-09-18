import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from 'angular-web-storage';
import { HttpEventType } from '@angular/common/http';

@Injectable()
export class FormsActionsService {

	requestURL: string;
	apiType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {

	}

	/**
	 * This method is use to create new citizen app
	 */
	createFormData() {

		this.requestURL = `api/form/${this.apiType}/create`;

		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to get status after filter using registration number.
	 * @param filterData - filter data.
	 */
	getRegistrationStatus(filterData){
		this.requestURL = `api/form/${this.apiType}/search?applicationNumber=${filterData.applicationNumber}&correctionType=${filterData.typeOfCorrection.code}`;
		return this.http.get(this.requestURL);
	}

	/**
	 * This method is use to create new citizen resource
	 */
	createResourceData(resourceData) {

		this.requestURL = `api/${this.apiType}/create`;

		return this.http.post(this.requestURL, resourceData);
	}

	
	/**
	 * This method is used to get all payable service list.
	 */
	getPayableServiceList() {

		return this.http.get('public/guest/payableServices', '');
	}

	/**
	 * This method is used to perform all payable service actions.
	 */
	paymentServiceGet() {
		
		this.requestURL = `public/guest/${this.apiType}`;

		return this.http.get(this.requestURL);

	}

	/**
	 * - This method is used to make payment process
	 * @param reqData - payment dialog form data
	 */
	paymentServicePost(reqData) {
		
		this.requestURL = `api/servicePayment/${this.apiType}`;

		return this.http.post(this.requestURL, reqData);

	}

	/**
	 * This method is used to get citizen app data
	 * @param appId - citizen app id
	 */
	getFormData(appId): Observable<any> {

		this.requestURL = `api/form/${this.apiType}/get/${appId}`;

		return this.http.get(this.requestURL);
	}

	/**
	 * This method is use to save citizen app data
	 * @param formData - citizen app form data
	 */
	saveFormData(formData) {

		this.requestURL = `api/form/${this.apiType}/save`;

		return this.http.post(this.requestURL, formData);
	}

	/**
	 * This method is use to submit citizen form data to department
	 * @param appId - citizen app id
	 */
	submitFormData(appId) {

		this.requestURL = `api/form/${this.apiType}/submit/${appId}`;

		return this.http.post(this.requestURL, {});
	}

	/**
	 * This method is use to generate print receipt
	 * @param appId - citizen app id
	 */
	printReceipt(appId) {

		this.requestURL = `api/form/${this.apiType}/printReceipt/${appId}`;

		return this.http.get(this.requestURL, 'printReceipt');
	}

	/**
     * This method is use to generate print view
     * @param appId - citizen app id
     */
    printView(appId) {

        this.requestURL = `api/form/${this.apiType}/printView/${appId}`;

        return this.http.get(this.requestURL, 'printReceipt');
    }

	/**
	 * This method is use to display JSON format.
	 * @param appId - citizen app id
	 */
	viewJson(appId){
		
		let requestURL = `api/form/${this.apiType}/json/${appId}`;
		return this.http.get(requestURL);
	}

	/**
	 * This method is use to delete citizen record respective to id
	 * @param appId - citizen app id
	 */
	deleteFormData(appId) {

		this.requestURL = `api/form/${this.apiType}/delete/${appId}`;

		return this.http.delete(this.requestURL);
	}

	/**
	 * This method is use to get lookup data respective to api type
	 */
	getDataFromLookups() {

		this.requestURL = `api/form/${this.apiType}/lookups`;

		return this.http.get(this.requestURL);
	}

	/**
	 * This method is used to get user profile data
	 */
	getUserProfile() {

		return this.http.get('api/user/profile');
	}

	/**
	 * This method is used to update user profile data
	 */
	updateUserProfile(formData) {

		return this.http.post('api/user/update', formData);
	}

	createTokenforServicePayment(payData:any){

		this.requestURL = `public/payment/generateTokenUrl`;

		return this.http.post(this.requestURL, payData);
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createPayment(paymentData) {
		this.requestURL = `public/postPayment`;

		return this.http.post(this.requestURL, paymentData);
		//return this.http.post('api/servicePayment/pay', paymentData);
	}
	
	 /**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createLOIPayment(paymentData:any) {
		// {{HOST}}/api/booking/swimming/postFixedPayment
		let requestURL = `api/booking/swimming/postFixedPayment`;

		return this.http.post(requestURL, paymentData);
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	makePayment(transactionId) {

		return this.http.get(`api/form/${this.apiType}/pay/${transactionId}`);

	}

	/**
	 * This method is use for get user services
	 */
	getUserServices() {
		return this.http.get('api/user/citizenServices');
	}

	/**
	 * This method is use for get country lists
	 */
	getCountryLookUp() {
		// return this.http.get('public/lookup/countries', this.getCommonHeaders());
		return this.http.get('public/lookup/address', this.getCommonHeaders());
	}

	/**
	 * This method is use for get states lists
	 * @param countryId - Country Id
	 */
	getStateLookUp(countryId) {
		return this.http.get(`public/lookup/stateByCountryId/${countryId}`, this.getCommonHeaders());
	}

	/**
	 * This method is use for get cities lists
	 * @param stateId - state Id
	 */
	getCityLookUp(stateId) {
		return this.http.get(`public/lookup/citiesByStateId/${stateId}`, this.getCommonHeaders());
	}

	/**
	 * This method is use for get cities lists
	 * @param stateId - state Id
	 */
	paymentGatewayUrl(data) {
		return this.http.post('public/payment/generateTokenUrl', data, this.getCommonHeaders());
	}

	/**
	 * This method is use for get cities lists
	 * @param stateId - state Id
	 */
	getPaymentResponse(token) {
		return this.http.get(`public/payment/getTransactionDetails?rqst_token=${token}`, this.getCommonHeaders());
	}

	/**
	 * This method use to return headers for lookUp api
	 */
	getCommonHeaders() {

		let headers = {
			'Content-type': 'application/json'
		};
		return headers;
	}

	uploadProfilePic(formData: FormData, setProgress?: any, successResponse?: any) {

		this.http.uploadFilePost('api/user/upload/profile/pic', formData).subscribe(event => {
			switch (event.type) {
				case HttpEventType.Sent:
					break;
				case HttpEventType.ResponseHeader:
					break;
				case HttpEventType.UploadProgress:
					return setProgress(Math.round(100 * event.loaded / event.total));
				case HttpEventType.Response:
					return successResponse(event.body);
			}
		});
	}

	getDueDetails(num) {
		return this.http.get(`api/professional/receipt/search/${num}`);
	}

	saveTaxPaymentDetails(data){
		return this.http.post(`api/professional/taxPayment`, data);
	}

	printProfReceipt(refNumber) {
		this.requestURL = `api/professional/receipt/printReceipt/${refNumber}`;
		return this.http.get(this.requestURL, 'printReceipt');
	}

}
