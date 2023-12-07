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

import { Observable ,  Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../config/routes-conf';

/**
 * This class is use for perform all common http requests.
 */
@Injectable()
export class HttpService {

	constructor(private httpClient: HttpClient,
		private tostr: ToastrService,
		private router : Router,
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
			} else {
				if (!this.session.get("access_token")) {
					this.tostr.error("Session Expired Please Login Again!");
					this.router.navigate([ManageRoutes.getFullRoute('CITIZENAUTHLOGIN')]);
					return;
				}
			}

		} else if(headerOptions == 'printReceipt'){
			options = {
				headers: new HttpHeaders({
					"Authorization": "Bearer " + this.session.get("access_token").token,
					"Content-Type": "application/json"
				}), responseType: 'text'
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
	 * This method is use for send POST form data to API.
	 * @param url - Additional request URL.
	 * @param body - POST method parameters
	 * @param options - Header(s) which will pass with particular request.
	 */
	postFormData(url: string, formData: any, options?: any): Observable<any> {
		return this.uploadFilePost(url,formData,options).map(data=>data.body);
	}

	/**
	 * This method is use for send POST http Request to API for upload file.
	 * @param url - Additional request URL.
	 * @param body - POST method parameters
	 * @param options - Header(s) which will pass with particular request.
	 */
	uploadFilePost(url: string, body: any, options?: any): Observable<any> {

		const req = new HttpRequest('POST', this.getFullUrl(url), body, {
			reportProgress: true,
			headers: new HttpHeaders().set("Authorization", "Bearer " + this.session.get("access_token").token)
		});

		return this.httpClient.request(req);
	}

	getUploadedFile(url:string,type?:string){
		let headers = new HttpHeaders().append("Authorization", "Bearer " + this.session.get("access_token").token)
		return this.httpClient.get(this.getFullUrl(url), {responseType: 'arraybuffer',headers:headers});
	}

	deleteUploadedFile(url:string){
		const req = new HttpRequest('DELETE', this.getFullUrl(url), {
			reportProgress: true,
			headers: new HttpHeaders().set("Authorization", "Bearer " + this.session.get("access_token").token)
		});
		return this.httpClient.request(req);
	}

	/**
 	* Build API url.
 	* @param url
 	* @returns {string}
 	*/
	private getFullUrl(url: string): string {
		return environment.envAPIServer + url;
	}
	
	getReportPDF(url: string, param: any) {
		let headers = new HttpHeaders().append("Authorization", "Bearer " + this.session.get("access_token").token)
		return this.httpClient.get(this.getFullUrl(url), { params: param, responseType: 'arraybuffer', headers: headers });
	}

}