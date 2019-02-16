import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    requestURL: string;
    apiType: string;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
    constructor(
        private http: HttpService) { }


	/**
	 * This method is used to get lookup data for vehicle type dropdown
	 */
    getVehicletaxLookups() {
        this.requestURL = `api/vehicleType/get/active/all`;
        return this.http.get(this.requestURL);
    }

	/**
	 * This method is used to get lookup data for Billing Period dropdown
	 */
    getBillingPeriodLookups() {
        this.requestURL = `api/financialYear/get/active/all`;
        return this.http.get(this.requestURL);
    }

	/**
	 * This method is used to get lookup data for ward dropdown
	 */
    getWardLookup() {
        this.requestURL = `api/vehicle/data`;
        return this.http.get(this.requestURL);
    }

	/**
	 * This method is used to get lookup data for purchasing type dropdown
	 */
    getPurchasingTypeLookup() {
        this.requestURL = `api/purchasingType/get/active/all`;
        return this.http.get(this.requestURL);
    }

	/**
	 * This method is used to get form data using engine no.
	 */
    getDataFromEngineNo(engineNo) {

        this.requestURL = `api/vehicle/vehicleDetailsByEngineNo/${engineNo}`;
        return this.http.get(this.requestURL);
    }

	/**
	 * - This method is used to make payment process
	 * @param reqData - payment dialog form data
	 */
    paymentServicePost(reqData) {
        this.requestURL = `api/servicePayment/servicePayment`;
        return this.http.post(this.requestURL, reqData);
    }


	/**
	 * This method is used to get Vehicle Details By Engine And Receipt No.
	 */
    getVehicleDetailsByEngineAndReceiptNo(obj) {
        this.requestURL = `api/vehicle/getVehicleDetails?engineNo=${obj.engineNo}&receiptNo=${obj.receiptNo}`;
        return this.http.get(this.requestURL);
    }

	/**
	 * This method is used to get citizen app data
	 * @param appId - vehicle app id
	 */
    getFormData(appId): Observable<any> {

        this.requestURL = `api/${this.apiType}/get/${appId}`;

        return this.http.get(this.requestURL);
    }

	/**
	 * This method is use to save citizen app data
	 * @param formData - vehicle app form data
	 */
    saveFormData(formData) {

        this.requestURL = `api/${this.apiType}/save`;

        return this.http.post(this.requestURL, formData);
    }

    /**
     * - This method is used to make payment
     * @param id - vehicle id
     */
    paymentDetails(id) {
        return this.http.get(`api/${this.apiType}/paymentDetail/${id}`);
    }

    /**
     * This method is use to generate print receipt
     * @param appId - vehicle app id
     */
    printReceipt(appId) {

        this.requestURL = `api/${this.apiType}/printReceipt/${appId}`;

        return this.http.get(this.requestURL, 'printReceipt');
    }

    /**
	 * This method is used to creat payments for payable services
	 * @param formData -form data.
	 */
    calculateTax(formData) {
        return this.http.post(`api/${this.apiType}/calculateFee`, formData);
    }

    /**
	 * This method is used to get the vehicle tax details for payment
	 * @param vehicleId - vehicle id
	 */
    getVehicleTaxForPayment(vehicleId) {
        this.requestURL = `api/vehicle/bill/${vehicleId}`;
        return this.http.get(this.requestURL);
    }

    /**
	 * This method is used to get the vehicle lookups
	 */
    getVehicleLookups() {
        this.requestURL = `api/vehicle/lookups`;
        return this.http.get(this.requestURL);
    }
    /**
     * Thi method is used to submit vehicle tax form
     * @param reqData - form data
     */
    saveVehicleTaxFormData(reqData) {
        this.requestURL = `api/vehicle/process-payment`;
        return this.http.post(this.requestURL, reqData);
    }

    /**
    * This method use for get all document
    */
    getAllDocuments() {
        return this.http.get('api/vehicle/doc/list');
    }

}
