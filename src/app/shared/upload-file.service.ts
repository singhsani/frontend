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
	uploadDMSFileUrl:string;
	progress: { percentage: number } = { percentage: 0 }

	constructor(
		private httpService: HttpService
	) {
		this.uploadFileUrl = 'api/attachment/upload';
		this.uploadDMSFileUrl = 'api/attachment/uploadForDMS'
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
	 * This method is used to upload file on DMS Server
	 * @param formData 
	 * @param setProgress 
	 * @param successResponse 
	 */
	processFileToDMSServer(formData: FormData, setProgress?: any, successResponse?: any) {

		this.httpService.uploadFilePost(this.uploadDMSFileUrl, formData).subscribe(event => {
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
	 * get the clicked file url from the server
	 * @param serviceFormId - service form id.
	 * @param fileId - file id
	 * @param docIndex - doc index
	 */
	getBase64StringURL(serviceFormId, fileId, docIndex) {
		let getFileUrl = `api/attachment/${serviceFormId}/getFileDMS/${fileId}/${docIndex}`;
		return this.httpService.get(getFileUrl);
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