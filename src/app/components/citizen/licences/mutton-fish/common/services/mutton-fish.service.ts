import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class MuttonFishService {

  /**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
  constructor(private http: HttpService) {

  }
  searchLicence(licenceNumber) {
    return this.http.get(`api/form/MFLicense/search/${licenceNumber}`);
  }
}
