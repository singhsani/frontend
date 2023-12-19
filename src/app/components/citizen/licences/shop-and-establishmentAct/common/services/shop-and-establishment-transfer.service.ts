import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopAndEstablishmentTransferService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {

	}

	getLatestApplicationsByIntimationNumber(intimationNumber) {
    	return this.http.get(`api/form/shop-transfer/getLatestApplicationsByIntimationNumber?intimationNumber=` + intimationNumber);
	}

	getLatestApplicationByCertificationNumber(certificationNumber){
		return this.http.get(`api/form/shop-transfer/getLatestApplicationByCertificationNumber?certificationNumber=`+ certificationNumber);
	}

	getLatestApplicationByINtimationOrCertificationNumber(certificationNumber){
		return this.http.get(`api/form/shop-transfer/getLatestApplicationByIntimationOrCertificationNumber?certificationNumber=`+ certificationNumber);
	}
}
