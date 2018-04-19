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

}
