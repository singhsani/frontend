import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class FormsActionsService {

	requestURL: string;
	apiType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService, private session: SessionStorageService) {

	}

	/**
	 * This method is use to create new citizen app
	 */
	createFormData() {

		this.requestURL = `api/form/${this.apiType}/create`;

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
	 * This method is used to get citizen app data
	 * @param appId - citizen app id
	 */
	getFormData(appId):Observable<any> {

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
	getDataFromLookups(){

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

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createPayment(paymentData) {

		return this.http.post('api/servicePayment/pay', paymentData);

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
	getUserServices(){
		return this.http.get('api/user/citizenServices');
	}


}
