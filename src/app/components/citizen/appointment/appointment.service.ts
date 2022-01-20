import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../shared/services/http.service';
import { CommonService } from '../../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentServices {

  /**
   * Class Instance variables.
   */
  requestURL: string;
  resourceType: string;
  headers: any;
  apiType: string;
  pageSize: number;
  pageIndex: number;

  constructor(private http: HttpService, private commonService : CommonService) { }

  /**
   * Method Is Used to get slots in appointment
   * @param resourcecode - code
   * @param startdate - start date
   * @param formId -service form id
   */
  getSlots(resourcecode: string, startdate:string, formId:string ):Observable<any> {
    let requestURL = `api/form/${this.apiType}/slots?resourceCode=${resourcecode}&startDate=${startdate}&serviceId=${formId}`;
    return this.http.get(requestURL);
  }

  getAvailableSlots(resourcecode: string, startdate:string):Observable<any> {
    let requestURL = `api/form/${this.apiType}/availableSlots?resourceCode=${resourcecode}&startDate=${startdate}`;
    return this.http.get(requestURL);
  }

  /**
   * Method is used to book slot.
   * @param formId - service form id.
   * @param uniqueId - application unique id.
   */
  bookSlot(formId:string, uniqueId:string): Observable<any>{
    let requestURL = `api/form/${this.apiType}/slot/book?serviceId=${formId}&slotId=${uniqueId}`;
    return this.http.get(requestURL);
  }

  /**
   * Method is used to cancel existing slot.
   * @param formId - service form id.
   * @param uniqueId - application unique id.
   */
  cancelSlot(formId:string, uniqueId:string): Observable<any>{
    let requestURL = `api/form/${this.apiType}/slot/cancel?serviceId=${formId}&slotId=${uniqueId}`;
    return this.http.get(requestURL);
  }

  /**
   * Method is used to get all appointment list.
   * @param formId - application service form id.
   */
  appointmentList(formId: string): Observable<any>{
    let requestURL = `api/form/${this.apiType}/appointments/${formId}`;
    return this.http.get(requestURL);
  }

  /**
	* This method is get available resource list 
	*/
  getResources(): Observable<any> {
    let requestURL = `api/form/${this.apiType}/resources`;
    return this.http.get(requestURL);
  }

}
