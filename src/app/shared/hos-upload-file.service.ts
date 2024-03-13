import { Injectable } from '@angular/core';
import { HosHttpService } from './services/hos-http.service';
import { CommonService } from './services/common.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class HosUploadFileService {
  uploadFileUrl: string;
  uploadDMSFileUrl: string;
  progress: { percentage: number } = { percentage: 0 }

  constructor(
    private httpService: HosHttpService
  ) {
    this.uploadFileUrl = 'api/attachment/upload';
    this.uploadDMSFileUrl = 'api/attachment/uploadForDMS';
  }

  processFileToServer(formData: FormData, setProgress?: any, successResponse?: any,failureResponse?: any) {

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
    },err =>{
      console.log(err.error[0].message);
			  return failureResponse();
    });
  }

  	/**
	 * This method is used to upload file on DMS Server
	 * @param formData 
	 * @param setProgress 
	 * @param successResponse 
	 */
	processFileToDMSServer(formData: FormData, setProgress?: any, successResponse?: any,failureResponse?: any) {

		this.httpService.uploadFilePost(this.uploadDMSFileUrl, formData).subscribe(postEvent => {
			switch (postEvent.type) {
				case HttpEventType.Sent:
					break;
				case HttpEventType.ResponseHeader:
					break;
				case HttpEventType.UploadProgress:
					return setProgress(Math.round(100 * postEvent.loaded / postEvent.total));
				case HttpEventType.Response:
					return successResponse(postEvent.body);
			}
		},err =>{
      console.log(err.error[0].message);
			  return failureResponse();
    });
	}

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

  deleteFile(serviceFormId, fileId) {
    let getFileUrl = 'api/attachment/' + serviceFormId + '/getFile/' + fileId + "/delete";
    return this.httpService.deleteUploadedFile(getFileUrl)

  }
}