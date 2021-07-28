import { FormsActionsService } from './../../core/services/citizen/data-services/forms-actions.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
@Injectable({
	providedIn: 'root'
})
export class OfflinePaymentService {

    requestURL: string;

    constructor(private httpService : HttpService){

    }

    getLookups(){
        return this.httpService.get("api/offline/payment/lookups");
    }

    getShopLookups(){
        return this.httpService.get("api/offline/payment/withoutChequelookups");
    }

    /**
	 * This method is used to perform all payable service actions.
	 */
	 posPaymentNumberGet(reqData) {
		
		this.requestURL = `public/pos/UploadBilledTransaction`;

		return this.httpService.post(this.requestURL,reqData);
		

	}

	GetCloudBasedTxnStatus(reqData) {
		
		this.requestURL = `public/pos/GetCloudBasedTxnStatus`;

		return this.httpService.post(this.requestURL,reqData);
		

	}

	

	/**
	 * This method is used to perform all payable service actions.
	 */
	 posDetailsUpdate(reqData) {
		 
		this.requestURL = `public/pos/UpdatePosDetails`;

		return this.httpService.post(this.requestURL,reqData);
		

	}

	getPortalUserPosDetails() {
		
		this.requestURL = `public/pos/getPortalUserPosDetails`;

		return this.httpService.get(this.requestURL);
		

	}


}