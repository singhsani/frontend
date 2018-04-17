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
	 * @param _session - Declare Session Storage Module property.
	 * @param _http - Declare Http Service property.
	 */
	constructor(
		private _http: HttpService,
		private _session: SessionStorageService
	) {
	}

	/**
	 * This method is used to get all form data with pagination using API
	 */
	getAllData(): Observable<manageData> {

		this.headers = {
			"Authorization": "Bearer " + this._session.get("access_token").token,
			"Content-Type": "application/json"
		}

		this.requestURL = `api/user/${this.apiType}?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this._http.get(this.requestURL, this.headers);
	}

	/**
	 * This method is used to get all citizen resource data with pagination using API
	 */
	getAllResourceData(): Observable<manageData> {

		this.headers = {
			"Authorization": "Bearer " + this._session.get("access_token").token,
			"Content-Type": "application/json"
		}

		this.requestURL = `api/${this.apiType}/myResources/?page=${this.pageIndex}&limit=${this.pageSize}`;

		return this._http.get(this.requestURL, this.headers);
	}

}

export class manageData {
	success: boolean;
	list: boolean;
	totalRecords: number;
	data: any;
}
