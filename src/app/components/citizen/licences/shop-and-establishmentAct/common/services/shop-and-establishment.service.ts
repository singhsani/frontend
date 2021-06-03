import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopAndEstablishmentService {

	hidesave:boolean = false;
	workerTypes :Array<any> = [];

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(
		private http: HttpService,
		private commonService: CommonService) {
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
    	return this.http.get(`api/form/shop/sub-business-category/filter/${code}`);
	}
	
	searchLicence(licenceNumber) {
    	return this.http.get(`api/form/shopLicense/search/${licenceNumber}`);
	}

	searchLicenceFromNewgen(licenceNumber) {
    	return this.http.post(`api/form/shopLicense/searchFromNewgen`,licenceNumber);
	}

	duplicateWorkerTypeNotallow(workerType,index,control){
		this.workerTypes = [];
		this.hidesave = false;
		for(let i = 0; i < control.length; i++) {
				if(i != index){
					this.workerTypes.push(control[i].controls.workersType.value)
				}
			}
		this.worker(workerType);	
	}

	worker(worker: any){
		for(let i=0; i <= this.workerTypes.length; i++){
			if(worker == this.workerTypes[i]){
				this.hidesave = true;
				this.commonService.openAlert("Error", "Please enter different worker type","error");
			}
		}
	}
}
