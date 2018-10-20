import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SessionStorageService } from 'angular-web-storage';

import swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from 'moment';


@Injectable()
export class CommonService {

	/**
	 * This property use for toggle the loading on routing
	 */
	public loading = new Subject<{ loading: boolean }>();
	/**
	 * This property use for share the profile data
	 */
	profileSubject = new Subject<any>();
	public isLoading = new BehaviorSubject(false);


	constructor(private session: SessionStorageService) { }

	openAlert(title: string, message: string, type: string, html?: any, cb?: any) {
		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			confirmButtonText: 'Ok'
		}

		swal(options as any).then((result) => {
			if (result.value && cb) {
				cb();
			}
		});

	}

	openAlertFormSaveValidation(title: string, message: any, type: string, html?: any, cb?: any) {

		var html1 = '<div class="row small setHeight">';

		_.forEach(message, (value, key) => {
			html1 += '<div class="col-md-12 alert alert-danger" role="alert" *ngFor="let errorType of message">';
			html1 += value.property + " - " + value.message + " / " + value.gujMessage;
			html1 += '</div>';
		});

		html1 += '</div>';

		let options = {
			title: title,
			text: message,
			//type: type,
			html: html1,
			confirmButtonText: 'Ok',
		}

		swal(options as any).then((result) => {
			if (result.value && cb) {
				cb();
			}
		})

	}

	deleteAlert(title: string, message: string, type: string, html?: any, performDelete?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}

		swal(options as any).then((result) => {
			if (result.value && performDelete) {
				performDelete();
			}
		})
	}

	submitAlert(title: string, message: string, type: string, html?: any, performSubmit?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Make a Payment!'
		}

		swal(options as any).then((result) => {
			if (result.value && performSubmit) {
				performSubmit();
			}
		})
	}

	successAlert(title: string, message: string, type: string) {

		let options = {
			title: title,
			text: message,
			type: type
		}

		swal(options as any);
	}

	paymentAlert(title: string, message: string, type: string, pay?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Make a Payment'
		}

		swal(options as any).then((result) => {
			if (result.value && pay) {
				pay();
			}
		})
	}

	getUserType(): string {

		if (this.session.get('access_token')) {
			return this.session.get('access_token').userType;
		} else if (this.session.get('hos_access_token')) {
			return this.session.get('hos_access_token').userType;
		}

	}

	fromAdmin(): boolean {
		if (this.session.get('fromAdmin')) {
			if (this.session.get('fromAdmin') === 'fromAdmin')
				return true;
			else
				return false;
		}
	}

	getDateFormat(date: string, withTime:boolean) {

		if(withTime){
			return moment(date).format('DD-MM-YYYY HH:MM:SS');
		} else {
			return moment(date).format('DD-MM-YYYY');
		}
	}

	/**
	* This method is use for confirmation.
	*/
	confirmAlert(title: string, message: string, type: string, html?: any, performEvent?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!'
		}

		swal(options as any).then((result) => {
			if (result.value && performEvent) {
				performEvent();
			}
		})
	}

}
