import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { NoDueCertificateModule } from '../no-due-certificate.module';


@Injectable()
export class NoDueCertificateService {

  constructor(private http: HttpClient) { }
 
  getWardZoneLevel() {
    return this.http.post(`${Constants.baseApiUrl}wardzoneLevelDef/propertyWardzones`, null,
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

  search(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchPropertiesByPage`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getOutsatndingDetail(propertyBasicId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/outsatndingDetails?propertyBasicId=${propertyBasicId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  calculateFee(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}noduecertificate/calculatefee`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  generateNoDueCertificate(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}noduecertificate/generatenoduecertificate`, data,
    { observe: 'response' })
    .pipe(map((response: any) => response))
  }

}
