import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import * as _ from 'lodash';

@Injectable()
export class CommonService {

	public loading = new Subject<{ loading: boolean }>();

	constructor() { }

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
		})

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

	deleteAlert(title: string, message: string, type: string, html?: any, performDelete?: any){
		
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

	submitAlert(title: string, message: string, type: string, html?: any, performSubmit?: any){
		
		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, submit it!'
		}

		swal(options as any).then((result) => {
			if (result.value && performSubmit) {
				performSubmit();
			}
		})
	}

	successAlert(title: string, message: string, type: string){

		let options = {
			title: title,
			text: message,
			type: type
		}

		swal(options as any);
	}

}
