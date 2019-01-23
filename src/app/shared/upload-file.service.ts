import { Injectable } from '@angular/core';
import { HttpService } from './services/http.service';
import { CommonService } from './services/common.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class UploadFileService {

	uploadFileUrl: string;
	progress: { percentage: number } = { percentage: 0 }

	constructor(
		private httpService: HttpService
	) {
		this.uploadFileUrl = 'api/attachment/upload';
	}

	processFileToServer(formData: FormData, setProgress?: any, successResponse?: any) {

		this.httpService.uploadFilePost(this.uploadFileUrl, formData).subscribe(event => {
			switch (event.type) {
				case HttpEventType.Sent:
					break;
				case HttpEventType.ResponseHeader:
					break;
				case HttpEventType.UploadProgress:
					return setProgress(Math.round(100 * event.loaded / event.total));
				case HttpEventType.Response:
					return successResponse(event.body);
			}
		});
	}

	/**
	 * Read file from server using service id.
	 * @param serviceFormId - service Id.
	 * @param fileId - file id.
	 * @param type - response type
	 */
	getFileFromServer(serviceFormId, fileId, type) {
		let getFileUrl = 'api/attachment/' + serviceFormId + '/getFile/' + fileId;
		return this.httpService.getUploadedFile(getFileUrl, type);
	}

	/**
	 * Delete file from server using service id.
	 * @param serviceFormId - reference number.
	 * @param fileId - file id
	 */
	deleteFile(serviceFormId, fileId) {
		let getFileUrl = 'api/attachment/' + serviceFormId + '/getFile/' + fileId + "/delete";
		return this.httpService.deleteUploadedFile(getFileUrl)
	}

	/**
	 * Read file from server for bookings.
	 * @param referenceNo - reference number.
	 * @param fileId - file id
	 */
	getFileFromServiceForBookings(referenceNo, fileId) {
		let getFileUrl = 'api/attachment/booking/' + referenceNo + '/getFile/' + fileId;
		return this.httpService.getUploadedFile(getFileUrl);
	}

	/**
	 * Read file from server for bookings.
	 * @param referenceNo - reference number.
	 * @param fileId - file id
	 */
	deleteFileFromServiceForBookings(referenceNo, fileId) {
		let getFileUrl = 'api/attachment/booking/' + referenceNo + '/getFile/' + fileId + '/delete';
		return this.httpService.deleteUploadedFile(getFileUrl);
	}
}