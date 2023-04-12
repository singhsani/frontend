import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';


@Injectable()
export class RevaluationService {

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

  save(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}revaluation/save`, data,
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

  revaluationCallback(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}revaluation/callback`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  submit(revaluationId: number) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}revaluation/submit?revaluationId=${revaluationId}`, null,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  
  getrevaluationDocUpload(revaluationId: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}revaluation/getDocumentList?revaluationId=${revaluationId}`,
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

  viewBasic(propertybasicId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}basic/view/${propertybasicId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getAttachmentList(serviceFormId) {
    return this.http.get<Array<Object>>(`${Constants.assessmentModuleApiUrl}revaluation/attachments?serviceFormId=${serviceFormId}`);
  }

  saveMeasurementTax(measurementVersionId: Number, roomId:Number) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}measurement/calculateTax?measurementVersionId=${measurementVersionId}&roomVersionId=${roomId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
}