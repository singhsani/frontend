import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../shared/services/http.service';

@Injectable({
	providedIn: 'root'
})
export class FireFacilitiesService {
	requestURL: string;
	apiType: string;
	/**
   * Constructor to declare defualt propeties of class.
   * @param http - Declare Http Service property.
   */
	constructor(private http: HttpService) { }

	/**
	 * This method for search final noc by using provisional number
	 * @param provisionalNo 
	 */
	searchByProvisionalNumber(provisionalNo:any) {
		const formData = new FormData();
		formData.append('provisionalNo', provisionalNo);
		return this.http.postFormData(`api/form/finalFireNoc/searchByProvisionalNumber`, formData);
	}

	/**
	 * 
	 * @param licenceNumber - serach licence number
	 * return this.http.get(`api/form/foodLicence/search/${licenceNumber}`);
	 */
	searchRevisedFireNOC(nocNo:any) {
		const formData = new FormData();
		formData.append('nocNo', nocNo);
		return this.http.postFormData(`api/form/revisedFireNoc/searchByNocNumber`, formData);
	}

	/**
	 * 
	 * @param licenceNumber - serach bu licence num
	 * return this.http.get(`api/form/foodLicence/search/${licenceNumber}`);
	 */
	searchRenewalFireNOC(finalNocNo:any) {
		const formData = new FormData();
		formData.append('finalNocNo', finalNocNo);
		return this.http.postFormData(`api/form/renewalFireNoc/searchByFinalNocNumber`, formData);
	}

	/**
	 * This method for delete array details
	 * @param objId - Array item id
	 */
	deleteArrayData(id:any, objId:any) {
		// api/form/provisionalHospitalNoc/hospitalOTDetail/{id}/delete/{hospitalOTDetailId}
		this.requestURL = `api/form/${this.apiType}/hospitalOTDetail/` + id + `/delete/` + objId;
		return this.http.delete(this.requestURL);
	}
	/**
	 * 
	 * @param propertyTaxNo - serach by propertyTaxNo
	 * return this.http.postFormData(`api/property/getOutstanding`, formData);
	 */

	getPropertyTaxNoStatus(propertyTaxNo:any) {
		const formData = new FormData();
		formData.append('propertyTaxNo', propertyTaxNo);
		return this.http.postFormData(`api/property/getOutstanding`, formData);
	}

	/**
	 * This methos for calculate water tanker fee.
	 */
	getWaterTankersFee(formData) {
		this.requestURL = `api/form/${this.apiType}/calculateAmount`;
		return this.http.post(this.requestURL, formData);
	}
}
