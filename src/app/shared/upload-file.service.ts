import { Injectable } from '@angular/core';
import { HttpService } from './services/http.service';
import { CommonService } from './services/common.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class UploadFileService {

	uploadFileUrl: string;
	progress: { percentage: number } = { percentage: 0 }

	constructor(
		private httpService: HttpService,
		private commonService: CommonService,
		private session: SessionStorageService
	) {
		this.uploadFileUrl = 'api/attachment/upload';
	}

	processFileToServer(formData: FormData, setProgress?: any, successResponse?: any){

		this.httpService.uploadFilePost(this.uploadFileUrl, formData).subscribe(event => {
			switch (event.type) {
				case HttpEventType.Sent:
					console.log('Request sent!');
					break;
				case HttpEventType.ResponseHeader:
					console.log('Response header received!');
					break;
				case HttpEventType.UploadProgress:
					return setProgress(Math.round(100 * event.loaded / event.total));
				case HttpEventType.Response:
					return successResponse(event.body);
			}
		});
	}
}