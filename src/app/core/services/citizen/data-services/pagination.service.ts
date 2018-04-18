import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';

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
	 * @param session - Declare Session Storage Module property.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService,
				private session: SessionStorageService ) {
	}

	/**
	 * This method is used to get all form data with pagination using API
	 */
	getAllData(): Observable<manageData> {

		this.headers = {
			"Authorization": "Bearer " + this.session.get("access_token").token,
			"Content-Type": "application/json"
		}

		this.requestURL = `api/user/${this.apiType}?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL, this.headers);
	}

	/**
	 * This method is used to get all citizen resource data with pagination using API
	 */
	getAllResourceData(): Observable<manageData> {

		this.headers = {
			"Authorization": "Bearer " + this.session.get("access_token").token,
			"Content-Type": "application/json"
		}

		this.requestURL = `api/${this.apiType}/myResources/?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL, this.headers);
	}

	getAllPaymentsData(): Observable<manageData> {

		this.headers = {
			"Authorization": "Bearer " + this.session.get("access_token").token,
			"Content-Type": "application/json"
		}

		this.requestURL = `api/user/myPayments?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this.http.get(this.requestURL, this.headers);

	}

}

export class manageData {
	success: boolean;
	list: boolean;
	totalRecords: number;
	data: any;
}
