import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";

/**
 * Import required angular Observable functions.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as _ from 'lodash';

import { Configuration } from "../../core/constants/app.constants";

/**
 * This class is use for perform all common http requests.
 */
@Injectable()
export class HttpService {

	/**
	 * The URL set in this Variable with API Server address.
	 */
	private actionUrl: string;

	/**
	 * The Headers - Which is/are sent with request.
	 */
	private headers: Headers;

	/**
	 * The Options - Other options sent with request.
	 */
	private options: RequestOptions;

	/**
	 * The commonHeaders - Declare common headers for all http requests.
	 */
	private commonHeaders: any;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param _http - Declare common Http service property.
	 * @param _conf - Declare configuration variable property.
	 */
	constructor(
		public _httpClient: HttpClient,
		private _conf: Configuration
	) {

		this.actionUrl = _conf.ServerWithApiUrl;

		/**
		 * Example - To set Predefined Common Header for All Requests.
		 */
	}

	/**
	 * This method is use for send GET http Request to API.
	 * @param requestURI - Additional request URL.
	 * @param headers  - Header(s) which will pass with particular request.
	 */
	get(requestURI: string, headers: any): Observable<any> {

		let combineHeaders = _.merge(this.commonHeaders, headers);

		const options = { headers: new HttpHeaders(combineHeaders) };

		return this._httpClient.get(this.actionUrl + requestURI, options);

	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param requestURI - Additional request URL.
	 * @param data - POST method parameters
	 * @param headers - Header(s) which will pass with particular request.
	 */
	post(requestURI: string, data: any, headers: any): Observable<any> {

		let combineHeaders = _.merge(this.commonHeaders, headers);

		const options = { headers: new HttpHeaders(combineHeaders) };

		return this._httpClient.post(this.actionUrl + requestURI, data, options);
	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param requestURI - Additional request URL.
	 * @param headers - Header(s) which will pass with particular request.
	 */
	delete(requestURI: string, headers: any): Observable<any> {

		let combineHeaders = _.merge(this.commonHeaders, headers);

		const options = { headers: new HttpHeaders(combineHeaders) };

		return this._httpClient.delete(this.actionUrl + requestURI, options);
	}
}