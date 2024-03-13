import { ToastrService } from 'ngx-toastr';
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
import { debug } from 'util';


@Injectable({
	providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

	private requests: HttpRequest<any>[] = [];

	constructor(
		private toaster: ToastrService,
		private commonService: CommonService,
		private appService: AppService,
		private session: SessionStorageService,
		private hosAppService: HosAppService) {

	}

    /**
     *
     * @param req - parameter to handle http request
     * @param next - parameter for http handler
     */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



		this.requests.push(req);
		this.commonService.isLoading.next(true);

		var isCustomHeader: boolean = false;
		// For skip header
		if (req.headers.has('X-Skip-Interceptor')) {
			const headers = req.headers.delete('X-Skip-Interceptor');
			return next.handle(req.clone({ headers }));
		}
		/* If headers not present then set the authorisation headers for elegant request */
		if (req.headers instanceof HttpHeaders) {
			if (req.headers.keys().length == 0) {
				if (this.session.get("access_token")) {
					var authReq = req.clone({
						headers: new HttpHeaders({
							"Authorization": "Bearer " + this.session.get("access_token").token,
							"Content-Type": "application/json"
						})
					});
				}
				isCustomHeader = true;
			} else {
				isCustomHeader = false;
			}
		}

		return Observable.create(observer => {
			const subscription = next.handle(isCustomHeader ? authReq : req)
				.subscribe(
					event => {
						if (event instanceof HttpResponse) {
							this.removeRequest(req);
							observer.next(event);
						}
					},
					err => {
						this.removeRequest(req);
						observer.error(err);

						if (err instanceof HttpErrorResponse) {

							switch (err.status) {
								case 0:
									let userType = this.commonService.getUserType();
									if (userType) {
										if (userType == 'HOSPITAL') {
											this.hosAppService.logout();
										} else {
											this.appService.logout();
										}
									}
									this.toaster.error("Something went wrong!");
									// this.commonService.openAlert('Oops...', 'Something went wrong!', 'error', '', cb => {
									// 	if (this.commonService.getUserType() === 'HOSPITAL') {
									// 		this.hosAppService.logout();
									// 	} else {
									// 		this.appService.logout();
									// 	}
									// });
									break;
								 case 400:
								 	this.commonService.openAlert('Error', err ? (err.error.error_description ? err.error.error_description : err.error[0].message ) : 'Bad Request', 'error');
								 	break;
								case 401:
									this.toaster.error(err.error.message ? err.error.message : err.error.error);
									if (this.commonService.getUserType()) {
										if (this.commonService.getUserType() === 'HOSPITAL') {
											this.hosAppService.logout();
										} else {
											this.appService.logout();
										}
									}
									// this.commonService.openAlert('Warning!', err.error.message ? err.error.message : err.error.error, 'warning', '', cb => {
									// 	if (this.commonService.getUserType() === 'HOSPITAL') {
									// 		this.hosAppService.logout();
									// 	} else {
									// 		this.appService.logout();
									// 	}
									// });
									break;
								case 404:
									this.commonService.openAlert('Error!', err.error.message ? err.error.message : err.error.error, 'error');
									break;
								case 500:
								case 501:
									// for professional Tax
									if (typeof err.error === 'string')
										this.commonService.openAlert('Error', JSON.parse(err.error)[0].message, 'error');
									else if (err.error)
										this.commonService.openAlert('Error', err.error[0].message, 'error');
									else
										this.commonService.openAlert('Error', "Internal Server Error", 'error');
									break;
								case 601:// form save as draft error handling
									this.commonService.openAlertFormSaveValidation('Error', err.error, 'error');
									break;
								case 602:// for payment status
									this.toaster.error(err.error[0].message);
									break;
								default:
									break;
							}
						}

					},
					() => { this.removeRequest(req); observer.complete(); });
			// teardown logic in case of cancelled requests
			return () => {
				this.removeRequest(req);
				subscription.unsubscribe();
			};
		});
	}


	/**
	 * This method is use to check whether request are running or not
	 * @param req - Http request
	 */
	removeRequest(req: HttpRequest<any>) {
		const i = this.requests.indexOf(req);
		if (i >= 0) {
			this.requests.splice(i, 1);

		}
		this.commonService.isLoading.next(this.requests.length > 0);
	}


}
