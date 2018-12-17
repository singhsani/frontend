import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class FireFacilitiesService {
	requestURL: string;
 	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) { }

	/**
	 * This method for search licence using number
	 * @param licenceNumber 
	 */
	searchLicence(licenceNumber) {
		// 	this.requestURL = `api/form/foodLicence/search`;
		//   	return this.http.post(this.requestURL,licenceNumber);
    // return this.http.get(`api/form/foodLicence/search/${licenceNumber}`);
    
    return this.http.get(`api/form/finalFireNoc/searchByProvisionalNumber/${licenceNumber}`);
	}
	
	/**
	 * 
	 * @param licenceNumber - serach bu licence num
	 * return this.http.get(`api/form/foodLicence/search/${licenceNumber}`);
	 */
	searchRevisedFireNOC(nocNo) {
    	return this.http.get(`api/form/revisedFireNoc/searchByNocNumber/${nocNo}`);
	}
}
