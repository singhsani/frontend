import { FormsActionsService } from './../../core/services/citizen/data-services/forms-actions.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
@Injectable({
	providedIn: 'root'
})
export class OfflinePaymentService {

    constructor(private httpService : HttpService){

    }

    getLookups(){
        return this.httpService.get("api/offline/payment/lookups");
    }

    getShopLookups(){
        return this.httpService.get("api/offline/payment/withoutChequelookups");
    }

}