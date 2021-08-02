import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Constants } from '../Constants';


@Injectable({
  providedIn: 'root'
})
export class ApplicantAddressService {

  constructor(
    private http: HttpClient
  ) { }

  saveApplicantDetail(data: any) {
    return this.http.post(`${Constants.serverApiIp}/api/applicantDetail/save`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
}