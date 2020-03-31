import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { ApplicationDisconnectionModule } from '../application-disconnection.module';

@Injectable()
export class ApplicationDisconnectionService {

  constructor(private http: HttpClient) { }

  searchByConnection(connectionNo: string) {
    return this.http.get(`${Constants.baseApiWaterUrl}connection/active/searchByConnection?connectionNo=${connectionNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getDisconnectionDocUpload(id: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/getDocumentList?disconncetionId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submitNewgen(id: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/submitNewgen?disconncetionId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getDisConnectionDocuments(disconncetionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/getDisConnectionDocuments?disconncetionId=${disconncetionId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}disconnection/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }
}
