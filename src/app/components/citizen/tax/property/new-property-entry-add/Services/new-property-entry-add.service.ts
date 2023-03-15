import { Injectable } from '@angular/core';
import { NewPropertyEntryAddModule } from '../new-property-entry-add.module'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

@Injectable()
export class NewPropertyEntryAddService {

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

  saveBasic(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}basic/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getPropertyAddUpload(propertyBasicId: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}basic/getDocumentList?propertyBasicId=${propertyBasicId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveOwner(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}owner/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOwner(propertyVersionId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}owner/search/${propertyVersionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteOwner(id: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}owner/delete?id=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getPropertyTypeList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/propertyType/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getPropertySubTypeList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/subPropertyType/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getLocationFactor(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/locationfactormaster/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  savePropertyType(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}type/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveOccupier(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}occupier/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOccupier(propertyVersionId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}occupier/search/${propertyVersionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteOccupier(propertyOccupierId: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}occupier/delete?id=${propertyOccupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getUnitListByOccupierId(occupierId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}unit/list/${occupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveUnit(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}unit/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteUnit(id: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}unit/delete?id=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }


  getUsageList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}usage/propertyUsages`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getSubUsageList(data: any) {
    return this.http.post(`${Constants.baseApiUrl}subUsage/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchConstructionClass(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/constructionClass/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOccupancyType(data: any) {
    return this.http.post(`${Constants.baseApiUrl}property/occupancyType/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveMeasurement(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}measurement/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  viewMeasurement(unitId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}measurement/view/${unitId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  saveRoom(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}room/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  deleteRoom(id: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}room/delete?id=${id}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getRoomListByUnitId(unitId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}room/list/${unitId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submit(propertyVersionId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}basic/submit?propertyVersionId=${propertyVersionId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  approveOrDecline (data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}basic/approve`,data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  viewBasic(propertybasicId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}basic/view/${propertybasicId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.assessmentModuleApiUrl}basic/attachments?serviceFormId=${serviceFormId}`);
  }

  saveApplicantDetails(data:any){
    return this.http.post(`${Constants.commonApiUrl}api/form/propertyAssessment/saveApplicantDetails`,data,
    { observe: 'response' })
    .pipe(map((response: any) => response))
  }
  searchEmailIdOccupier(propertyBasicVersionId: number,emailAddress: any,propertyOccupierId) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}occupier/searchEmailIdOccupier?propertyBasicVersionId=${propertyBasicVersionId}&&emailAddress=${emailAddress}&&propertyOccupierId=${propertyOccupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  searchEmailIdOwner(propertyBasicVersionId: number,emailAddress: any,propertyOwnerId) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}owner/searchEmailIdOwner?propertyBasicVersionId=${propertyBasicVersionId}&&emailAddress=${emailAddress}&&propertyOwnerId=${propertyOwnerId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  saveMeasurementTax(measurementVersionId: Number, roomId:Number ) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}measurement/calculateTax?measurementVersionId=${measurementVersionId}&roomVersionId=${roomId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  searchOwnerIsPrimary(propertyBasicVersionId: number,propertyOwnerId,isPrimaryOwner: boolean) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}owner/checkPropertyOwnerIsPrimary?propertyBasicVersionId=${propertyBasicVersionId}&&propertyOwnerId=${propertyOwnerId}&&isPrimaryOwner=${isPrimaryOwner} `,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

}
