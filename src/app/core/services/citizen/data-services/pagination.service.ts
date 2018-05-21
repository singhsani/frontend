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
