import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../../shared/services/http.service';

@Injectable()
export class PaginationService {

	requestURL: string;
	headers: any;
	apiType: string;
	pageSize: number;
	pageIndex: number;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {
	}

	/**
	 * This method is used to get all form data with pagination using API
	 */
	getAllData(): Observable<manageData> {

		this.requestURL = `api/user/${this.apiType}?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL);
	}

	/**
	 * methosd is used to search data using different input.
	 * @param filterData - filter data.
	 */
	getSearchDataWithPagination(filterData): Observable<manageData> {
		switch (this.apiType) {
			case "duplicateBirthReg": {
				this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
				break;
			}
			case "duplicateDeathReg": {
				this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
				break;
			}
			case "NRCBirth": {
				this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
				break;
			}
			case "NRCDeath": {
				this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
				break;
			}
			case "duplicateMarriageReg": {
				this.requestURL = `api/form/${this.apiType}/searchFromNewgen`;
				break;
			}
		}
		return this.http.post(this.requestURL,filterData);
		// its get api but when newgen api is come its recode as a post with 'filter data body' add

		// if (this.apiType == 'duplicateBirthReg') {
		// 	this.requestURL = `api/form/${this.apiType}/search?childName=${filterData.name}&birthDate=${filterData.date}&page=${this.pageIndex}&limit=${this.pageSize}`;
		// } else if (this.apiType == 'duplicateDeathReg') {
		// 	this.requestURL = `api/form/${this.apiType}/search?deathRegNumber=${filterData.regNumber}&deathDate=${filterData.date}&page=${this.pageIndex}&limit=${this.pageSize}`;
		// } else if (this.apiType == 'NRCBirth') {
		// 	this.requestURL = `api/form/${this.apiType}/search?childName=${filterData.name}&fatherName=${filterData.fatherName}&motherName=${filterData.motherName}&birthDate=${filterData.date}&regNumber=${filterData.regNumber}&page=${this.pageIndex}&limit=${this.pageSize}`;
		// } else if (this.apiType == 'NRCDeath') {
		// 	this.requestURL = `api/form/${this.apiType}/search?deceasedName=${filterData.name}&fatherHusbandName=${filterData.fatherName}&regNumber=${filterData.regNumber}&page=${this.pageIndex}&limit=${this.pageSize}`;
		// }
	}

	/**
	 * This method is used to get all citizen resource data with pagination using API
	 */
	getAllResourceData(): Observable<manageData> {

		this.requestURL = `api/${this.apiType}/myResources/?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL);
	}

	getAllPaymentsData(): Observable<manageData> {

		this.requestURL = `api/user/myPayments?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL);

	}

}

export class manageData {
	success: boolean;
	list: boolean;
	totalRecords: number;
	data: any;
}
