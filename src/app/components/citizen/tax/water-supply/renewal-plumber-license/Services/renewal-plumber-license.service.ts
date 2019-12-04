import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { RenewalPlumberLicenseModule } from '../renewal-plumber-license.module';

@Injectable()
export class RenewalPlumberLicenseService {

  constructor(private http: HttpClient) { }

  search(licenseNo: string) {
    return this.http.post(`${Constants.baseApiWaterUrl}plumber/search?licenseNo=${licenseNo}`,null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  save(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/renew`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getPlumberLicenseDocuments(plumberLicenseVersionId: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/renew/getPlumberLicenseDocuments?plumberLicenseVersionId=${plumberLicenseVersionId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline(data: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/renew/newGenCallback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  finalApproveOrDecline(applicationNo: any) {
    return this.http.post(`${Constants.baseApiWaterUrl}version/plumber/renew/callback?applicationNo=${applicationNo}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

}
