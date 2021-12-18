import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { ApplicationReconnectionModule } from '../application-reconnection.module';

@Injectable()
export class ApplicationReconnectionService {

  constructor(private http: HttpClient) { }

  searchByConnection(connectionNo: string) {
    return this.http.get(`${Constants.baseApiWaterUrl}connection/active/searchForReConnection?connectionNo=${connectionNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  getreconnectionDocUpload(reconnectionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/getDocumentList?reconnectionId=${reconnectionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  submitNewgen(reconnectionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/submitNewgen?reconnectionId=${reconnectionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  
  getReconnectionDocuments(reconnectionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/getReconnectionDocuments?reconnectionId=${reconnectionId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}reconnection/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response));
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response));
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(
      `${Constants.baseApiWaterUrl}reconnection/attachments?serviceFormId=${serviceFormId}`);
  }
}
