import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {

  requestURL: string;
  constructor(private http: HttpService) { }

  /**
   * this api for guideline
   */
  loadGuideLine(moduleName: any, resourceType: any) {
    this.requestURL = `api/${moduleName}/${resourceType}/guideline`;
    return this.http.get(this.requestURL, 'printReceipt');
  }
}
