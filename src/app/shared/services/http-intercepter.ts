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

import { HosAppService } from './../../core/services/hospital/app-services/hos-app.service';
import { AppService } from './../../core/services/citizen/app-services/app.service';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './common.service';
import { SessionStorageService } from 'angular-web-storage';
import { ManageRoutes } from '../../config/routes-conf';
import 'rxjs/add/operator/do';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(
		private commonService: CommonService,
		private router: Router,
		private session: SessionStorageService,
		private appService: AppService,
		private hosAppService: HosAppService) {

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
				switch (err.status) {
					case 0:
						this.commonService.openAlert('Oops...', 'Something went wrong!','error', '', cb => {
							if (this.commonService.getUserType() === 'HOSPITAL') {
								this.hosAppService.logout();
							} else {
								this.appService.logout();
							}
						});
						break;
					case 400:
						break;
					case 401:
						this.commonService.openAlert('Warning!', err.error.message, 'warning', '', cb => {
							if (this.commonService.getUserType() === 'HOSPITAL') {
								this.hosAppService.logout();
							} else {
								this.appService.logout();
							}
						});
						break;
					case 404:
						this.commonService.openAlert('Error!', err.error.message, 'error');
						break;
					case 500:
					case 601:// form save as draft error handling
						this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
						break;
					default:
						break;
				}
			}
		});
	}


}