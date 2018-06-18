import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class NewShopEstablishmentService {

  constructor(
    private httpService:HttpService
  ) {
    
   }

   /**
	 * This method is use to create new employer member
	 */
	createEmployerFamily(params) {
		let apiUrl = `api/form/shopLicense/${params.formId}/person/add?type=${params.type}`;
		return this.httpService.get(apiUrl);
  }

  removeEmployerFamily(params) {
		let apiUrl = `api/form/shopLicense/${params.formId}/person/remove?${params.type}`;
		return this.httpService.get(apiUrl);
	}
}