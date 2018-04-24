import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class CommonService {

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

	successAlert(title: string, message: string, type: string){

		let options = {
			title: title,
			text: message,
			type: type
		}

		swal(options as any);
	}

}
