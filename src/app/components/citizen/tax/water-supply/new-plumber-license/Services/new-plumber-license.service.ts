import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { NewPlumberLicenseModule } from '../new-plumber-license.module';

@Injectable()
export class NewPlumberLicenseService {

  constructor(private http: HttpClient) { }

  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getPlumberLicenseDocuments(plumberLicenseVersionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/getPlumberLicenseDocuments?plumberLicenseVersionId=${plumberLicenseVersionId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

}
