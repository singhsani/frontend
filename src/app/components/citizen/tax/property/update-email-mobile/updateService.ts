import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class UpdateService {
    [x: string]: any;


  requestURL: string;
  resourceType: string;
  moduleName: string = 'Property-Tax';
  headers: any;
  apiType: string;
  pageSize: number;
  pageIndex: number;

  /**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
  constructor(public http: HttpService) { }

serchByPropertyno(propertyNo:any){

    this.requestURL = `api/property/getDetails?propertyNo=${propertyNo}`;
    return this.http.get(this.requestURL);
}


sendOnEmail(email:any){

  this.requestURL = `api/property/sendOnEmail?email=${email}`;
  return this.http.get(this.requestURL);
}

saveEmail(propertyNo:any,email:any){

   this.requestURL = `api/property/saveEmail?propertyNo=${propertyNo}&email=${email}`;
   return this.http.get(this.requestURL);

}
//************************************************************************************** */
sendOnMobile(mobile:any){

  this.requestURL = `api/property/sendOnMobile?mobile=${mobile}`;
  return this.http.get(this.requestURL);
}

saveMobile(propertyNo:any,mobile:any){

  this.requestURL = `api/property/saveMobile?propertyNo=${propertyNo}&mobile=${mobile}`;
  return this.http.get(this.requestURL);

}

}