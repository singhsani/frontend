import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

@Injectable()
export class FormsActionsService {
	public NBCtoDuplicateBirth: BehaviorSubject<any> = new BehaviorSubject('');
	public NDCtoDuplicateDeath: BehaviorSubject<any> = new BehaviorSubject('');

	requestURL: string;
	apiType: string;
	resourceType: string;


	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService,
		private commonService: CommonService,
		private httpClient: HttpClient,private https: HttpClient) {

	}

	/**
	 * This method is use to create new citizen app
	 */
	createFormData() {
       
		this.requestURL = `api/form/${this.apiType}/create`;
		if (this.commonService.fromAdmin()) {
			this.requestURL = `api/form/${this.apiType}/admin-create?fromAdmin=${this.commonService.fromAdmin()}`;
		}


		return this.http.get(this.requestURL);
	}

	/**
	 * Method is used to get status after filter using registration number.
	 * @param filterData - filter data.
	 */
	getRegistrationStatus(filterData) {
		this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
		return this.http.post(this.requestURL, filterData);
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
	 * This method is use to submit citizen form data to department
	 * @param appId - citizen app id
	 */
	submitFormDataForLOI(appId, lOiNumber) {

		this.requestURL = `api/form/${this.apiType}/submit/${appId}/${lOiNumber}`;

		return this.http.post(this.requestURL, {});
	}
	getQueryData(id: any) {
		this.requestURL = `api/form/${this.apiType}/getAllQueries/${id}`;
		return this.http.get(this.requestURL)
	}


	/**
	 * This method is use to generate print receipt
	 * @param appId - citizen app id
	 */
	printReceipt(appId) {

		this.requestURL = `api/form/${this.apiType}/printReceipt/${appId}`;

		return this.http.get(this.requestURL, 'printReceipt');
	}

	printPaymentReceipt(appId){
		this.requestURL = `api/form/${this.apiType}/printReceiptForPayment?id=${appId}`;
		return this.http.get(this.requestURL,'printReceipt');
	}
	printPaymentReceiptForShop(appId){
		this.requestURL = `api/form/${this.apiType}/printReceiptForPaymentForShop?id=${appId}`;
		return this.http.get(this.requestURL,'printReceipt');
	}
	printAfterReschedule(appId){
		this.requestURL = `api/form/${this.apiType}/printReceiptAfterReschedule?id=${appId}`;
		return this.http.get(this.requestURL,'printReceipt');
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
	viewJson(appId) {

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

	createTokenforServicePayment(payData: any) {

		this.requestURL = `public/payment/generateTokenUrl`;

		return this.http.post(this.requestURL, payData);
	}

	/**
	 * this method is used to get the ccavenue payment page
	 */
	ccAvenueMakePayment(payData) {
		this.requestURL = `public/ccpayment/getPaymentPage`;
		return this.http.post(this.requestURL, payData);
	}

	/**
	 * This method is used to creat payments for payable services
	 * @param paymentData -pass payment data here.
	 */
	createPayment(paymentData) {
		console.log('paymentData in forms-action.service', paymentData);
		this.requestURL = `public/postPayment`;

		return this.http.post(this.requestURL, paymentData);
		//return this.http.post('api/servicePayment/pay', paymentData);
	}

	/**
	 * This method is used to get billdesk page
	 * @param paymentData -pass payment data here.
	 */
	getBillDeskPage(paymentData) {
		this.requestURL = `public/billdeskpayment/getPage`;
		return this.http.post(this.requestURL, paymentData);
	}


	/**
	* This method is used to creat payments for payable services
	* @param paymentData -pass payment data here.
	*/
	createLOIPayment(paymentData: any) {
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
	 * This method is use get transaction details from ccavenue
	 * @param token - token
	 */
	getCCAvenuePaymentResponse(token) {
		return this.http.get(`public/ccpayment/getCCAvenueTransactionDetails?order_id=${token}`, this.getCommonHeaders());
	}

	/**
	 * This method is use get transaction details from ccavenue
	 * @param msg - msg
	 */
	sendBillDeskPaymentResponse(msg) {
		return this.http.get(`public/billdeskpayment/responseFromBillDesk?msg=${msg}`, this.getCommonHeaders());
	}

	/**
	 * This method is use get transaction details from billdesk
	 * @param txtRefNo - transaction reference no
	 */
	getBillDeskTransactionDetails(txtRefNo) {
		return this.http.get(`public/billdeskpayment/getBillDeskTransactionDetails?txtRefNo=${txtRefNo}`, this.getCommonHeaders());
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
		return this.http.get(`api/professional/receipt/citizen/search/${num}`);
	}

	saveTaxPaymentDetails(data) {
				return this.http.post(`api/professional/taxPayment`, data);
	}



	savePropertyTaxPaymentDetails(data: any) {
		return this.httpClient.post(`${Constants.assessmentModuleApiUrl}collection/citizen-payment`, data,
			{ responseType: 'arraybuffer' })
			.pipe(map((response: any) => response))
	}

	saveWaterTaxPaymentDetails(data: any) {
		return this.httpClient.post(`${Constants.baseApiWaterUrl}collection/citizen-payment`, data,
			{ responseType: 'arraybuffer' })
			.pipe(map((response: any) => response))
	}

	printProfReceipt(refNumber) {
		this.requestURL = `api/professional/receipt/printReceipt/${refNumber}`;
		return this.http.get(this.requestURL, 'printReceipt');
	}

	redirectToDuplicateBirth(data: string) {
		setTimeout(() => {
			this.NBCtoDuplicateBirth.next(data);
		}
			, 1000);
	}

	// public NBCtoDuplicateBirth: BehaviorSubject<string> = new BehaviorSubject('');
	/**
	 * This method get value 
	 */
	getNBCtoDuplicateBirth(): Observable<any> {
		return this.NBCtoDuplicateBirth.asObservable();
	}
	/**
	 * This method set value
	 */
	setNBCtoDuplicateBirth(data: any) {
		this.NBCtoDuplicateBirth.next(data);
	}
	/**
	 * This method get value 
	 */
	getNDCtoDuplicateDeath(): Observable<any> {
		return this.NDCtoDuplicateDeath.asObservable();
	}
	/**
	 * This method set value
	 */
	setNDCtoDuplicateDeath(data: any) {
		this.NDCtoDuplicateDeath.next(data);
	}

	getWaterPipelineConnectionStatusAndOthersList(workOrderNo: any, applicationNo: any) {
		return this.http.get(`api/form/wtrPipeConnWorkCompletion/searchWaterPipelineApplications?workOrderNo=${workOrderNo}&applicationNo=${applicationNo}`)
	}

	getWtrPipAppsByWaterPipelineConnection(waterPipelineConnectionId: any) {
		return this.http.get(`api/form/wtrPipeConnWorkCompletion/getWtrPipAppsByWaterPipelineConnection?waterPipelineConnectionId=${waterPipelineConnectionId}`);
	}

	getDrainagePipelineConnectionStatusAndOthersList(workOrderNo: any, applicationNo: any) {
		return this.http.get(`api/form/drngPipeConnWorkCompletion/searchDrainagePipelineApplications?workOrderNo=${workOrderNo}&applicationNo=${applicationNo}`)
	}

	getDrngPipAppsByDrainagePipelineConnection(drainagePipelineConnectionId: any) {
		return this.http.get(`api/form/drngPipeConnWorkCompletion/getDrngPipAppsByDrainagePipelineConnection?drainagePipelineConnectionId=${drainagePipelineConnectionId}`);
	}
	getLoiPaymentDetails(appId) {
		return this.http.get(`api/loidetail/list?appId=${appId}`);
	}

	getBase64StringURL(refNumber: string) {
        this.requestURL = `api/form/${this.apiType}/getLoiDocument/${refNumber}`;
        return this.http.get(this.requestURL);
    }
	
	saveOfflinePayment(serviceId, paymentData) {
		this.requestURL = `api/form/${this.apiType}/offlinePayment/${serviceId}`;
		return this.http.post(this.requestURL, paymentData);
	}

	getCitizenForm(reqData) {
		this.requestURL = `api/user/${this.apiType}`;
		return this.http.post(this.requestURL, reqData);
	}
	saveCustomCallApi(apiName: any, noofCopies: any, asonDate: any, occupierId: any,serviceApplicationId : any) {
		this.requestURL = `api/form/${this.apiType}/${apiName}?noofCopies=${noofCopies}&asonDate=${asonDate}&occupierId=${occupierId}&propertyServiceApplicationId=${serviceApplicationId}`;
		return this.http.post(this.requestURL, {});
	}

	saveNoDueCertificate(apiName: any, noofCopies: any, asonDate: any, occupierId: any, propertyBasicId: any, serviceFormId : any) {
		this.requestURL = `api/form/${this.apiType}/${apiName}?noofCopies=${noofCopies}&asonDate=${asonDate}&occupierId=${occupierId}&propertyBasicId=${propertyBasicId}&propertyServiceApplicationId=${serviceFormId}`;
		return this.http.post(this.requestURL, {});
	}

	/**
	 * This method is used to send sms after completion of booking payment.
	 * @param refNumber 
	 */
	sendSms(refNumber: any, resourceType: any, eventType: any) {
		this.requestURL = `api/booking/${resourceType}/sendSms?refNumber=${refNumber}&eventType=${eventType}`;
		return this.http.get(this.requestURL);
	}

	/**
	 * This method is used to send Mail after completion of payment to user
	 * @param refNumber 
	 */
	sendMailBooking(refNumber: any, resourceType: any, eventType: any) {
		this.requestURL = `api/booking/${resourceType}/sendMail?refNumber=${refNumber}&eventType=${eventType}`;
		return this.http.get(this.requestURL);

	}

	sendMailTicketing(refNumber: any, resourceType: any, eventType: any) {
		this.requestURL = `api/ticketing/${resourceType}/sendMail?refNumber=${refNumber}&eventType=${eventType}`;
		return this.http.get(this.requestURL);

	}

	cancelReceiptForShop(fileNumber) {
		this.requestURL = `api/form/shop/resonForCancel?fileNumebr=${fileNumber}`;
		return this.http.get(this.requestURL, 'printReceipt');
	}

	setUserData(details, applicationNumber: any) {

		var applicantDetalis = {

			applicantName: details.applicantName,
			emailId: details.email,
			mobileNo: details.cellNo,
			applicationNo: applicationNumber
		}
		return this.saveApplicantDetails(applicantDetalis);

	}

	saveApplicantDetails(data:any){
		this.requestURL = `api/form/propertyAssessment/saveApplicantDetails`;
		return this.http.post(this.requestURL, data);
	  }

	saveDuplicateBill(apiName: any, data: any) {
		this.requestURL = `api/form/${this.apiType}/${apiName}`;
		return this.http.post(this.requestURL, data);

	}

	printPaymentAckReceipt(appId,url){
		this.requestURL = `${url}?id=${appId}`;
		return this.http.get(this.requestURL,'printReceipt');
	}

	getCertificatOrLiglePrint(data: any,id: any){
		this.requestURL = `api/form/marriageReg/legalprint/${data}/${id}`;
		return this.http.get(this.requestURL,'printReceipt');
	}

	getCertificatOrLiglePrintForDuplicateMrg(data: any,id: any){
		this.requestURL = `api/form/duplicateMarriageReg/legalprint/${data}/${id}`;
		return this.http.get(this.requestURL,'printReceipt');
	}

	// for Vendor Registration when Deposit Received 
	nonRefundableCollection(serviceFormId) {
		this.requestURL = `api/form/vendor/collectionAmount/${serviceFormId}`;
		return this.http.get(this.requestURL, 'printReceipt');
	  }

	//for Contrctor Registration when Deposit Received

	nonRefundableCollections(serviceFormId) {
		this.requestURL = `api/form/contractor/collectionAmount/${serviceFormId}`;
		return this.http.get(this.requestURL, 'printReceipt');
	  }

	/**
	 * This method is use to deposit payment  citizen side in Contractor Registration 
	 * @param appId - citizen app id
	 */
	 contractorDepositePayment(appId) {
		this.requestURL = `api/form/${this.apiType}/depositPaymentCitizenSide/${appId}`;

		return this.http.post(this.requestURL, {});
	}  
	getWardZoneFirstLevel(level: any, key: any) {
		return this.http.post(`master/wardzoneMst/searchByLevel?levelOrderSeq=${level}&moduleKey=${key}`,
		  { observe: 'response' })
		  .pipe(map((response: any) => response))
	  }
	
	  getWardZone(data: any) {
		return this.https.post(`${Constants.baseApiUrl}wardzoneMst/search`, data,
		  { observe: 'response' })
		  .pipe(map((response: any) => response))
	  }

}
