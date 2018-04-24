import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpEvent,
	HttpHeaders,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
	HttpHandler,
	HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { CommonService } from './common.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private commonService: CommonService, private router: Router) {

	}

    /**
     * 
     * @param req - parameter to handle http request
     * @param next - parameter for http handler
     */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();
        /**
         * Handle newly created request with updated header (if given)
         */
		return next.handle(req).do((event: HttpEvent<any>) => {
            /**
             * Sucessfull Http Response Time.
             */
			if (event instanceof HttpResponse) {
				const elapsed = Date.now() - started;
			}

		}, (err: any) => {
            /**
             * redirect to the error_handler route according to error status or error_code
             * or show a modal
             */
			if (err instanceof HttpErrorResponse) {

				if (err.status === 401) {
					this.commonService.openAlert('Warning!', err.error.message, 'warning', '', cb => {
						this.router.navigate(['/citizen/auth/login']);
					});

				} else if (err.status === 500) {

					this.commonService.openAlert('Error!', err.error.message, 'error');

				} else if (err.status === 400) {

					//this.commonService.openAlert('Warning!', err.error.message, 'warning');

				} else if (err.status === 404) {

					this.commonService.openAlert('Warning!', err.error.message, 'warning');

				} else if (err.status === 0) {

					this.commonService.openAlert('Error!', err.error.message, 'error', '', cb => {
						this.router.navigate(['/citizen/auth/login']);
					});
					
				}
			}
		});
	}


}