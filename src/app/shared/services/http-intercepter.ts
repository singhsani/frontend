import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';

/**
 * Import Observables.
 */
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor() { }

	/**
	 * 
	 * @param req - parameter to handle http request
	 * @param next - parameter for http handler
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();

		console.log("___Sending request with intercepter___");

		/**
		 * Handle newly created request with updated header (if given)
		 */
		return next.handle(req).do((event: HttpEvent<any>) => {
			/**
			  * Sucessfull Http Response Time.
			  */
			if (event instanceof HttpResponse) {

				const elapsed = Date.now() - started;
				console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);

			}

		}, (err: any) => {
			/**
			   * redirect to the error_handler route according to error status or error_code
			   * or show a modal
			   */

			if (err instanceof HttpErrorResponse) {

				console.log(err);

				if (err.status === 500) {
					alert(err.message);

				} else if (err.status === 400) {
					alert(err.message);
				}
			}
		});
	}
}
