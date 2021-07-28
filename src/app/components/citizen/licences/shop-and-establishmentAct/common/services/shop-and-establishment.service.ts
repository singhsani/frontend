import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
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

	getSelectedWorkerType(workerTypeList:Array<any>,workerGrid:FormArray) {
		let workerData = workerTypeList.map((mapDataObj: any) => {
			mapDataObj.selected = false;
			return mapDataObj
		});

		workerGrid.controls.forEach(element => {
			let findRecord = workerData.find((obj: any) => obj.code == element.get('workersType').value)
			if (findRecord) {
				findRecord.selected = true;
			}
		});
		return workerData;
	}
}
