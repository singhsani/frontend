import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopAndEstablishmentService {

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {

	}

	/**
	 * This method is use to get business category
	 * @code is "YES" then category filter with more than ten
	 * @code is "NO" then category filter with less than ten 
	 * @code is "" , null , without param then category filter with all category data
	 */
	getCategoryByFilter(code) {
    	return this.http.get(`api/form/shopLicense/category/filter/${code}`);
	}
	/**
	 * This method is use to get business sub category
	 * @code is "" , null , without param then category filter with all category data
	 */
	getSubCategory(code) {
    	return this.http.get(`api/form/shopLicense/sub-category/filter/${code}`);
	}

	searchLicence(licenceNumber) {
    	return this.http.get(`api/form/shopLicense/search/${licenceNumber}`);
	}

	searchLicenceFromNewgen(licenceNumber) {
    	return this.http.post(`api/form/shopLicense/searchFromNewgen`,licenceNumber);
	}

	downloadGuidLineDocumemnt(filename: any, type: any) {
		return this.http.getUploadedFile(`api/form/shopLicense/download/${filename}`, type);
	  }
	
}
