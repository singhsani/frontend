import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { TransferPropertyModule } from '../transfer-property.module';


@Injectable()
export class TransferPropertyService {
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

  gettranferPropertyUpload(id: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}transfer/getDocumentList?propertyTransferId=${id}`,
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

  generateApplication(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}transfer/generate/application`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  viewApplication(propertyTransferId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}transfer/view/application?propertyTransferId=${propertyTransferId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveDetail(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}transfer/save/details`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getCarpetArea(propertyNo: string) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/get/carpetarea?propertyNo=${propertyNo}`, 
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getFloors(propertyNo: string) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/get/transferPropertyFloors?propertyNo=${propertyNo}&lookup_code=${Constants.LookupCodes.Floor_No}`, 
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOwnerByPropertyNo(propertyNo: string) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/owner/search?propertyNo=${propertyNo}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveOwner(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}owner/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOwnerByPropertyVersionId(propertyVersionId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}owner/search/${propertyVersionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveDocument(data: any) {
    return this.http.post(`${Constants.commonApiUrl}document/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchDocument(propertyVersionId: number) {
    return this.http.get(`${Constants.commonApiUrl}document/search?propertyTransferId=${propertyVersionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  deleteOwner(id: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}owner/delete?id=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteDocument(id: number) {
    return this.http.delete(`${Constants.commonApiUrl}document/delete?documentId=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submitProperty(propertyTransferId: number) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}transfer/submit?propertyTransferId=${propertyTransferId}`,null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  transferCallback(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}transfer/callback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.serverApiIp}/property/transfer/attachments?serviceFormId=${serviceFormId}`);
  }

  getTransferSubTypeLookup(data:any) {
    return this.http.get(`${Constants.baseApiUrl}lookup/gets?lookup_codes=${data}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
 
}
