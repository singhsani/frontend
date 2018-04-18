import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs/Rx';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

@Injectable()
export class FormsActionsService {

	requestURL: string;
	apiType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param session - Declare Session Storage Module property.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService, 
				private session: SessionStorageService) { 

	}

	/**
	 * This method is use to create new citizen app
	 */
	createFormData() {

		this.requestURL = `api/form/${this.apiType}/create`;

		return this.http.get(this.requestURL, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is use to create new citizen resource
	 */
	createResourceData(resourceData) {

		this.requestURL = `api/${this.apiType}/create`;

		return this.http.post(this.requestURL, resourceData, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createPayment(paymentData) {

		return this.http.post('api/servicePayment/pay', paymentData, this.getHeadersWithAuthToken());

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
	getFormData(appId) {

		this.requestURL = `api/form/${this.apiType}/get/${appId}`;

		return this.http.get(this.requestURL, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is use to save citizen app data
	 * @param formData - citizen app form data
	 */
	saveFormData(formData) {
		this.requestURL = `api/form/${this.apiType}/save`;

		return this.http.post(this.requestURL, formData, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is use to submit citizen form data to department
	 * @param formData - citizen form data 
	 * @param appId - citizen app id
	 */
	submitFormData(appId) {
		this.requestURL = `api/form/${this.apiType}/submit/${appId}`;

		return this.http.post(this.requestURL, {}, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is use to delete citizen record respective to id
	 * @param appId - citizen app id
	 */
	deleteFormData(appId) {

		this.requestURL = `api/form/${this.apiType}/delete/${appId}`;

		return this.http.delete(this.requestURL, this.getHeadersWithAuthToken());
	}

	/**
	 * This method is use to return common headers
	 */
	getHeadersWithAuthToken() {
		let headers =
			{
				"Authorization": "Bearer " + this.session.get("access_token").token,
				"Content-Type": "application/json"
			};
		return headers;
	}


}
