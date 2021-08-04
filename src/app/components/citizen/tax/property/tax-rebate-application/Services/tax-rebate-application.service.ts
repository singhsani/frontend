import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { TaxRebateApplicationModule } from '../tax-rebate-application.module';


@Injectable()
export class TaxRebateApplicationService {

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
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchBySearch`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  save(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}taxrebate/application/submit`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  gettaxrabitDocUpload(id: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}taxrebate/application/getDocumentList?taxRebateApplicationId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  approveDept(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}taxrebate/application/submitNewgen`, data,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrReject(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}taxrebate/application/callback`, data,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getOutsatndingDetails(propertyBasicId: any) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/outsatndingDetails?propertyBasicId=${propertyBasicId}`,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }
 
  getRebatType(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/rebatemaster/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getFinancialYear() {
    return this.http.get(`${Constants.baseApiUrl}financialyear/list`, 
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.serverApiIp}/property/taxrebate/application/attachments?serviceFormId=${serviceFormId}`);
  }

  getApplicationNo(taxRebateApplicationId) {
      return this.http.get(`${Constants.serverApiIp}/property/taxrebate/application/getApplicationNo?taxRebateApplicationId=${taxRebateApplicationId}`);
  }

}
