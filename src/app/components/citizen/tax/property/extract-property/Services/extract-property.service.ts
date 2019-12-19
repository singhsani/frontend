import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { ExtractPropertyModule } from '../extract-property.module';


@Injectable()
export class ExtractPropertyService {

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
    return this.http.post(`${Constants.assessmentModuleApiUrl}active/search`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  calculateFee(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}extract/calculatefee`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  generatePropertyExtract(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}extract/generatepropertyextract`, data,
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

  getOutsatndingDetail(occupierId: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}active/occupier/outsatndingDetails?occupierId=${occupierId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
 
}
