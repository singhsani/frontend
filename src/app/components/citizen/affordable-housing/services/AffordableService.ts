import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';

@Injectable({
	providedIn: 'root'
})
export class AffodableService {
	requestURL: string;
	apiType: string;

  /**
   * Constructor to declare defualt propeties of class.
   * @param http - Declare Http Service property.
   */
	constructor(private http: HttpService) { }

 getApplydata() {
   return this.http.get(`api/afhForm/schemeMaster/getAll`);
   }

   getProject(shemeId) {
    return this.http.get(`api/afhForm/projectMaster/fetchBySchemeId/`+shemeId);
}

/**
	 * This method use for get all document
	 */
	getAllDocuments() {
		return this.http.get('api/afhForm/doc/list');
	}

}
