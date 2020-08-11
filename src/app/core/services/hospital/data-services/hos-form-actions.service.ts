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

	getChartData() {
		this.requestURL = `api/user/chartDetails`;
		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to get status after filter using registration number.
	 * @param filterData - filter data.
	 */
	getRegistrationStatus(filterData) {
		this.requestURL = `api/form/${this.apiType}/search?applicationNumber=${filterData.applicationNumber}&correctionType=${filterData.typeOfCorrection.code}`;
		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to get status after filter using registration number from newgen.
	 * @param filterData - filter data.
	 */
	getRegistrationStatusFromNewgen(filterData) {
		this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
		return this.http.post(this.requestURL, filterData);
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
		this.requestURL = `public/postPayment`;

		return this.http.post(this.requestURL, paymentData);

		//return this.http.post('api/servicePayment/pay', paymentData);
	}

	createTokenforServicePayment(payData: any) {

		this.requestURL = `public/payment/generateTokenUrl`;

		return this.http.post(this.requestURL, payData);
	}

	/**
		 * This method is use for get cities lists
		 * @param stateId - state Id
		 */
	getPaymentResponse(token) {
		return this.http.get(`public/payment/getTransactionDetails?rqst_token=${token}`, this.getCommonHeaders());
	}

	getCommonHeaders() {

		let headers = {
			'Content-type': 'application/json'
		};
		return headers;
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
	 * This method is use to delete citizen record respective to id
	 * @param appId - citizen app id
	 */
	deleteFormData(appId) {

		this.requestURL = `api/form/${this.apiType}/delete/${appId}`;

		return this.http.delete(this.requestURL);
	}

	deleteChildData(id, childId) {
		this.requestURL = `api/form/${this.apiType}/child/` + id + `/delete/` + childId;
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
	 * This method is used to get user profile data
	 */
	getUserProfileHospal() {

		return this.http.get('api/user/hospital/profile');
	}

	/**
	 * This method is used to update Hospital profile
	 */
	updateHospitalInfo(hospitalData) {
		this.requestURL = `api/user/hospital/update`;
		return this.http.post(this.requestURL, hospitalData);
	}

	/**
	 * This method is use for get user services
	 */
	getUserServices() {
		return this.http.get('api/user/citizenServices');
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	makePayment(transactionId) {

		return this.http.get(`api/form/${this.apiType}/pay/${transactionId}`);

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
	 * This method is use to display JSON format.
	 * @param appId - citizen app id
	 */
	viewJson(appId) {

		let requestURL = `api/form/${this.apiType}/json/${appId}`;
		return this.http.get(requestURL);
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
	 * this method is used to get the ccavenue payment page
	 */
	ccAvenueMakePayment(payData) {
		this.requestURL = `public/ccpayment/getPaymentPage`;
		return this.http.post(this.requestURL, payData);
	}

		/**
	 * This method is used to get billdesk page
	 * @param paymentData -pass payment data here.
	 */
	getBillDeskPage(paymentData) {
		this.requestURL = `public/billdeskpayment/getPage`;
		return this.http.post(this.requestURL, paymentData);
	}

	getBirthAffidavit(){
		this.requestURL = 'api/form/birthReg/getAffidavit';
		return this.http.get(this.requestURL,'printReceipt');
	}

}
