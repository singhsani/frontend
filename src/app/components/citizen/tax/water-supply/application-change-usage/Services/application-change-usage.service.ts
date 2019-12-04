import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { ApplicationChangeUsageModule } from '../application-change-usage.module';

@Injectable()
export class ApplicationChangeUsageService {

  constructor(private http: HttpClient) { }

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
  
  searchByConnection(connectionNo: string) {
    return this.http.get(`${Constants.baseApiWaterUrl}connection/active/searchByConnection?connectionNo=${connectionNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}changeOfUsage/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getChangeOfUsageDocuments(changeOfUsageId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}changeOfUsage/getChangeOfUsageDocuments?changeOfUsageId=${changeOfUsageId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}changeOfUsage/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}changeOfUsage/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }
}
