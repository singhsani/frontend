import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopAndEstablishmentCloseService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {

	}

	getLatestApplicationsByNumber(certificateNumber) {
    	return this.http.get(`api/form/shop-close/getLatestApplicationsByNumber?certificateNumber=` + certificateNumber);
	}

	getLatestApplicationByCertificationNumber(certificationNumber){
		return this.http.get(`api/form/shop-close/getLatestApplicationByCertificationNumber?certificationNumber=`+ certificationNumber);
	}
}
