import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';
import { HosHttpService } from '../../../../shared/services/hos-http.service';

@Injectable()
export class HosFormActionsService {

	requestURL: string;
	apiType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HosHttpService, private session: SessionStorageService) {

	}

	/**
	 * This method is use to create new citizen app
	 */
	createFormData() {

		this.requestURL = `api/form/${this.apiType}/create`;

		return this.http.get(this.requestURL);
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createPayment(paymentData) {

		return this.http.post('api/servicePayment/pay', paymentData);

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
	 * This method is use for get user services
	 */
	getUserServices(){
		return this.http.get('api/user/citizenServices');
	}

}
