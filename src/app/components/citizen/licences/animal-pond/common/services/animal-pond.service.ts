import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnimalPondService {

  	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {}

	searchLicence(licenceNumber) {
    	return this.http.post(`api/form/APLicense/searchFromNewgen`,licenceNumber);
	}
}
