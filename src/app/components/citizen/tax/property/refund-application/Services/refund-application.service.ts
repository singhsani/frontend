import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { RefundApplicationModule } from '../refund-application.module';

@Injectable()
export class RefundApplicationService {

  constructor(private http: HttpClient) { }

  searchOccupierByPropertyNumber(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchoccupierbypropertynumber`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getVacancyPremiseApplicationInfo(certificateNumber: any, propertyOccupierId: any) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/getvacancypremiseapplicationinfo?certificateNumber=${certificateNumber}&propertyOccupierId=${propertyOccupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getVacancyPremiseCertificateNo(applicationNo: string) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}vacancypremisecertificate/getCertificateNo?applicationNo=${applicationNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  save(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  gettaxrabitDocUpload(id: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/getDocumentList?refundAgainstVacancyId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  approveDept(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/submitNewgen?refundAgainstVacancyId=${data}`,
    { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  // generateRefundReceipt(refundAgainstVacancyId: any) {
  //   return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/generaterefundreceipt?refundAgainstVacancyId=${refundAgainstVacancyId}`,
  //   { responseType: "arraybuffer" })
  //     .pipe(map((response: any) => response))
  // }

  approve(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/approve`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  reject(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}refundagainstvacancy/reject`, data,
    { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }
 
  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.serverApiIp}/property/refundagainstvacancy/attachments?serviceFormId=${serviceFormId}`);
  }
  
  getVersionById(applicationId : number){
    return this.http.get(`${Constants.serverApiIp}/property/refundagainstvacancy/DraftVacancyDetail?applicationNo=${applicationId}`,
    { observe: 'response' })
    .pipe(map((response: any) => response))
  }
}
