import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { VacancyPremiseCertificateModule } from '../vacancy-premise-certificate.module';


@Injectable()
export class VacancyPremiseCertificateService {

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
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchByPage`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
  getvacancyPremiseDocUpload(id: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/getDocumentList?vacancyPremiseCertficateId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
  save(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
  approveDept(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/submitNewgen?vacancyPremiseCertficateId=${data}`,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  approve(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/approve`, data,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  reject(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/reject`, data,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getBankList() {
    return this.http.get(`${Constants.baseApiUrl}bank/list`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getBranchList(bankId: number) {
    return this.http.get(`${Constants.baseApiUrl}bank/listbranches/${bankId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getOutsatndingDetails(occupierId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/occupier/outsatndingDetails?occupierId=${occupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.serverApiIp}/property/vacancypremisecertificate/attachments?serviceFormId=${serviceFormId}`);
  }

  getApplicationDetails(serviceId) {
    return this.http.get(`${Constants.serverApiIp}/api/form/vacantPremisesCertificate/getApplicationDetails?serviceId=${serviceId}`,
    { observe: 'response' })
    .pipe(map((response: any) => response))
  }

  getvacancypremiseapplication(occupierId: string) {
    return this.http.get(`${Constants.serverApiIp}/property/vacancypremisecertificate/getApplicationNo?propertyOccupierId=${occupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  } 

  checkIsOwnerAsOccupier(occupierId: string){
    return this.http.get(`${Constants.serverApiIp}/property/vacancypremisecertificate/isOwnerAsOccupier?propertyOccupierId=${occupierId}`,
    { observe: 'response' })
    .pipe(map((response: any) => response))   
  }

  getVersionById(applicationId : number){
    return this.http.get(`${Constants.serverApiIp}/property/vacancypremisecertificate/DraftDetailForVacency?applicationNo=${applicationId}`,
    { observe: 'response' })
    .pipe(map((response: any) => response))
  }
}
