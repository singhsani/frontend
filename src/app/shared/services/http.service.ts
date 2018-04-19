import { Injectable } from '@angular/core';

import {
	HttpClient,
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpHeaders
} from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { SessionStorageService } from 'angular-web-storage';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/**
 * This class is use for perform all common http requests.
 */
@Injectable()
export class HttpService {

	constructor(private httpClient: HttpClient,
		private session: SessionStorageService) {
	}

	/**
  	* Request options.
 	* @param headerOptions
  	* @returns {RequestOptionsArgs}
  	*/
	private requestOptions(headerOptions?: any): any {
		let options = {};

		if (headerOptions == null) {

			// if token is present then set the headers with auth token
			if (this.session.get("access_token")) {
				options = {
					headers: new HttpHeaders({
						"Authorization": "Bearer " + this.session.get("access_token").token,
						"Content-Type": "application/json"
					})
				}
			}

		} else {
			options = {
				headers: new HttpHeaders(headerOptions)
			}
		}
		return options;
	}

	/**
	 * This method is use for send GET http Request to API.
	 * @param url - Additional request URL.
	 * @param body - params.
	 * @param options  - Header(s) which will pass with particular request.
	 */
	get(url: string, options?: any): Observable<any> {

		return this.httpClient.get(this.getFullUrl(url), this.requestOptions(options))
	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param url - Additional request URL.
	 * @param body - POST method parameters
	 * @param options - Header(s) which will pass with particular request.
	 */
	post(url: string, body: any, options?: any): Observable<any> {

		return this.httpClient.post(this.getFullUrl(url), body, this.requestOptions(options))
	}

	/**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
	put(url: string, body: any, options?: any): Observable<any> {

		return this.httpClient.put(this.getFullUrl(url), body, this.requestOptions(options))

	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param url - Additional request URL.
	 * @param options - Header(s) which will pass with particular request.
	 */
	delete(url: string, options?: any): Observable<any> {

		return this.httpClient.delete(this.getFullUrl(url), this.requestOptions(options))

	}

	/**
 	* Build API url.
 	* @param url
 	* @returns {string}
 	*/
	private getFullUrl(url: string): string {
		return environment.envAPIServer + url;
	}

}