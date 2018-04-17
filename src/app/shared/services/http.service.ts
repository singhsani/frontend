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
/**
 * Import required angular Observable functions.
 */
import { Observable } from 'rxjs/Observable';


import { Subject } from 'rxjs/Subject';

/**
 * This class is use for perform all common http requests.
 */
@Injectable()
export class HttpService {
	public loading = new Subject<boolean>();
	
	constructor(
		private httpClient: HttpClient
	) {
	}

	/**
  	* Request options.
 	* @param headerOptions
  	* @returns {RequestOptionsArgs}
  	*/
	private requestOptions(headerOptions?: any): any {
		let options = {};
		if (headerOptions == null) {
			options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json'
				})
			}
		}else{
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
	get(url: string, body: any, options?: any): Observable<any> {

		this.requestInterceptor();
		return this.httpClient.post(this.getFullUrl(url), body, this.requestOptions(options))
		.catch(this.onCatch.bind(this))
		.do((res: Response) => {
			this.onSubscribeSuccess(res);
		}, (error: any) => {
			this.onSubscribeError(error);
		})
		.finally(() => {
			this.onFinally();
		});
	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param url - Additional request URL.
	 * @param body - POST method parameters
	 * @param options - Header(s) which will pass with particular request.
	 */
	post(url: string, body : any, options ? : any): Observable<any> {
		this.requestInterceptor();
		return this.httpClient.post(this.getFullUrl(url), body, this.requestOptions(options) )
		.catch(this.onCatch.bind(this))
		.do((res: Response) => {
			this.onSubscribeSuccess(res);
		}, (error: any) => {
			this.onSubscribeError(error);
		})
		.finally(() => {
			this.onFinally();
		});
	}

	/**
	 * This method is use for send POST http Request to API.
	 * @param url - Additional request URL.
	 * @param options - Header(s) which will pass with particular request.
	 */
	delete(url: string, options: any): Observable<any> {
		this.requestInterceptor();
		return this.httpClient.post(this.getFullUrl(url),  this.requestOptions(options))
		.catch(this.onCatch.bind(this))
		.do((res: Response) => {
			this.onSubscribeSuccess(res);
		}, (error: any) => {
			this.onSubscribeError(error);
		})
		.finally(() => {
			this.onFinally();
		});
	}

	/**
 	* Build API url.
 	* @param url
 	* @returns {string}
 	*/
	private getFullUrl(url: string): string {
		return environment.envAPIServer + url;
	}

	/**
   * Request interceptor.
   */
	private requestInterceptor(): void {
		this.loading.next(true);
	}

	/**
	 * Response interceptor.
	 */
	private responseInterceptor(): void {
		this.loading.next(false);
	}

	/**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
	private onCatch(error: any, caught: Observable<any>): Observable<any> {
		return Observable.of(error);
	}

	/**
	 * onSubscribeSuccess
	 * @param res
	 */
	private onSubscribeSuccess(res: Response): void {
		this.loading.next(false);
	}

	/**
	 * onSubscribeError
	 * @param error
	 */
	private onSubscribeError(error: any): void {
		this.loading.next(false);
	}

	/**
	 * onFinally
	 */
	private onFinally(): void {
		this.responseInterceptor();
	}
}