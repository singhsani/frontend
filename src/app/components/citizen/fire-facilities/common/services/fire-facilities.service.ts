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
	 * @param provisionalNo - provisional noc number 
	 */
	searchByProvisionalNumber(provisionalNo:any) {
		//const formData = new FormData();
		//formData.append('provisionalNo', provisionalNo);
    let obj = { refNumber: provisionalNo };
    return this.http.postFormData(`api/form/finalFireNoc/searchFromNewgen`, obj);
		//return this.http.postFormData(`api/form/finalFireNoc/searchByProvisionalNumber`, obj);
	}

	/**
	 * This method for search Revised noc by using noc number
	 * @param nocNo - provisional noc number 
	 */
	searchRevisedFireNOC(nocNo:any) {
		// const formData = new FormData();
		// formData.append('nocNo', nocNo);
		// return this.http.postFormData(`api/form/revisedFireNoc/searchByNocNumber`, formData);

		let obj = { refNumber: nocNo };
		return this.http.postFormData(`api/form/revisedFireNoc/searchFromNewgen`, obj);
	}

	/**
	 * This method for search Final noc by using noc number
	 * @param finalNocNo - provisional noc number 
	 */
	searchRenewalFireNOC(finalNocNo:any) {
		// const formData = new FormData();
		// formData.append('finalNocNo', finalNocNo);
		// return this.http.postFormData(`api/form/renewalFireNoc/searchByFinalNocNumber`, formData);
		let obj = { refNumber: finalNocNo };
		return this.http.postFormData(`api/form/renewalFireNoc/searchFromNewgen`, obj);
	}

	/**
	 * This method for search Hospital noc by using noc number
	 * @param provisionalNo - provisional hospital noc number 
	 */
	searchFinalHospitalNOC(provisionalNo:any) {
		//const formData = new FormData();
		//formData.append('provisionalNo', provisionalNo);

    let obj = { refNumber: provisionalNo };
    return this.http.postFormData(`api/form/finalHospitalNoc/searchFromNewgen`, obj);

		//return this.http.postFormData(`api/form/finalHospitalNoc/searchByProvisionalNumber`, obj);
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
	 * This method for delete array details
	 * @param objId - Array item id
	 */
	deleteArrayDataTempFire(id:any, objId:any) {
		// api/form/provisionalHospitalNoc/hospitalOTDetail/{id}/delete/{hospitalOTDetailId}
		this.requestURL = `api/form/${this.apiType}/shopDetail/` + id + `/delete/` + objId;
		return this.http.delete(this.requestURL);
	}

	/**
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
