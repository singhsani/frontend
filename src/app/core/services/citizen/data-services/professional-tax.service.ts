import { Injectable } from '@angular/core';

import { HttpService } from './../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
	providedIn: 'root'
})
export class ProfessionalTaxService {

	requestURL: string;
	apiType: string;
	isAddress: boolean = false;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(
		private http: HttpService,
		private session: SessionStorageService
	) { }


	/**
	   * This method is use to get lookup data respective to api type
	   */
	getDataFromLookups() {

		this.requestURL = `api/${this.apiType}/lookups`;

		return this.http.get(this.requestURL);
	}

	/**
	   * This method is use to save citizen app data
	   * @param formData - vehicle app form data
	   */
	pftSaveFormData(formData) {

		this.requestURL = `api/${this.apiType}/create`;

		return this.http.post(this.requestURL, formData);
	}

	/**
	   * This method is use for check isExistPropertyNo or not 
	   * @param propertyNo - entered propertNo
	   */
	isExistPropertyNoCheck(propertyNo) {
		return this.http.get(`api/property/professional/getByPropertyNo?censusNo=${propertyNo}`);
	}

	/**
	 * This method is used to update PRC Form if rc date change in existing PRC Form
	 * @param prcNumber - reference number
	 * @param rcDate - New rcDate
	 */
	updatePrcForm(prcNumber, rcDate) {
		return this.http.get(`api/prcForm/update/form/${prcNumber}/date/${rcDate}`);
	}

	/**
	 * This method use for get all bank names
	 */
	saveSummary(summaryData) {
		return this.http.post('api/prcForm/update/summery', summaryData);
	}

	/**
	 * This method is use for get existing data
	 * @param num - prc/pec number
	 */
	getSearchDetails(num, flag?) {
		if (flag)
			return this.http.get(`api/professional/search/${num}/${flag}`);
		else
			return this.http.get(`api/professional/search/${num}`);
	}

	getVerifyNumber(type, num) {
		return this.http.get(`api/professional/verify/regNumber?type=${type}&regNo=${num}`);
	}
	/**
	 * This method is use for get employee tax rate json
	 */
	getEmployeeSlabRate() {
		return this.http.get('api/slabMaster/get/active/all');
	}

	/**
	 * This method is use for get all entries
	 */
	getAllEntries() {
		return this.http.get('api/entryMaster/get/active/all');
	}

	/**
	 * This method use for get subentries on basis of entry code
	 * @param entryCode - Selected entry code
	 */
	getAllSubEntries(entryCode) {
		return this.http.get(`api/subEntryMaster/get/active/all/${entryCode}`);
	}

	/**
	 * This method use for get all costitutions list
	 */
	getAllConstitution() {
		return this.http.get('api/constitutionMaster/get/active/all');
	}

	/**
	 * This method use for getall profession of constitution
	 */
	getAllProfessionConst() {
		return this.http.get('api/profConstMaster/get/active/all');
	}

	/**
	   * This method use for get all ward numbers
	   */
	getAllWardNos() {
		return this.http.get('api/pecForm/wardList');
	}

	getAllBlockNos(parentId) {
		return this.http.get(`api/pecForm/blockList?parentId=${parentId}`);
	}
	/**
	 * This method use for get all bank names
	 */
	getBankNames() {
		return this.http.get('api/bankMaster/get/active/all');
	}

	/**
	   * This method use for get all document
	   */
	getAllDocuments() {
		return this.http.get('api/pecForm/doc/list');
	}

	saveReceiptDetails(formData) {
		return this.http.post(`api/professional/receipt/save`, formData);
	}

	getAllSlabMaster() {
        return this.http.get('api/form/pecForm/slabList');
    }
}
