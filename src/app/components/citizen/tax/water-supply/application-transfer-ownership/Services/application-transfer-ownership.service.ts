import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationTransferOwnershipModule } from '../application-transfer-ownership.module';
import { Constants } from 'src/app/vmcshared/Constants';
import { map } from 'rxjs/operators';

@Injectable()
export class ApplicationTransferOwnershipService {

  constructor(private http: HttpClient) { }


  searchByConnection(connectionNo: string) {
    return this.http.get(`${Constants.baseApiWaterUrl}connection/active/searchByConnection?connectionNo=${connectionNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getTransferDocUpload(transferOfOwnershipId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/getDocumentList?transferOfOwnershipId=${transferOfOwnershipId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submitNewgen(transferOfOwnershipId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/submitNewgen?transferOfOwnershipId=${transferOfOwnershipId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getDisConnectionDocuments(transferOfOwnershipId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/getTransferOfOwnershipDocuments?transferOfOwnershipId=${transferOfOwnershipId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}transferOfOwnership/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.baseApiWaterUrl}transferOfOwnership/attachments?serviceFormId=${serviceFormId}`);
  }
}
