import { Injectable } from '@angular/core';
import { NewWaterConnectionEntryModule } from '../new-water-connection-entry.module'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

@Injectable()
export class NewWaterConnectionEntryService {

  constructor(private http: HttpClient) { }

  getConnectionSizeList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}water/connectionsize/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getUsageList(data:any) {
    return this.http.post(`${Constants.baseApiUrl}usage/waterUsages`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getSubUsageList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}subUsage/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getWardZoneLevel() {
    return this.http.post(`${Constants.baseApiUrl}wardzoneLevelDef/waterWardzones`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  getWardZoneFirstLevel(level: any, key: any) {
    return this.http.post(`${Constants.baseApiUrl}wardzoneMst/searchByLevel?levelOrderSeq=${level}&moduleKey=${key}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getWardZone(data: any) {
    return this.http.post(`${Constants.baseApiUrl}wardzoneMst/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveConnectionDataEntry(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}new/connection/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveProperty(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}connection/property/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteProperty(id: any) {
    return this.http.delete(`${Constants.baseApiWaterUrl}connection/property/delete?id=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getPropertyList(connectionId: any) {
    return this.http.get(`${Constants.baseApiWaterUrl}connection/property/list?connectionId=${connectionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  savePropertyAddress(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}connection/property/address/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submit(connectionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}connection/submit?connectionId=${connectionId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}connection/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: string) {
    return this.http.post(`${Constants.baseApiWaterUrl}connection/callback?applicationNo=${applicationNo}`,null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getPropertyAddress(propertyNo: any) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/searchwithoccupiercode?propertyNo=${propertyNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getNewWaterConnectionUpload(connectionDtlId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}new/connection/getDocumentList?connectionDtlId=${connectionDtlId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }



  getNewWaterConnectionDocuments(connectionDtlId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}new/connection/getNewWaterConnectionDocuments?connectionDtlId=${connectionDtlId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  


  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

  getPlumberList(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}plumber/list`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
}
