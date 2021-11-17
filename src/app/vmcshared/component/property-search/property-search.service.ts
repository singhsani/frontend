import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from '../../Constants';

@Injectable({
  providedIn: 'root'
})
export class PropertySearchService {

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
  // serach occupier wise data 
  searchProperty(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  // search prperty wise data
  searchPropertyDetails(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchProperties`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  // search property wise data by page
  searchPropertyDetailsInPage(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchPropertiesByPage`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
 // serach occupier wise data 
  searchPropertyByPage(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/searchByPage?page=${data.pageNo}&limit=${data.pageSize}`, data.model,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
}
