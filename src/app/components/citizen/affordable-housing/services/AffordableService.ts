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
		return this.http.get(`api/afhForm/projectMaster/fetchBySchemeId/` + shemeId);
	}

	/**
		 * This method use for get all document
		 */
	getAllDocuments() {
		return this.http.get('api/afhForm/doc/list');
	}

	getHouseTypeLookup() {
		return this.http.get(`api/afhForm/projectMaster/lookups`);
	}

	getProjectLocation(projectCode) {
		return this.http.get(`api/afhForm/projectMaster/fetchByProjectId/` + projectCode);
	}

	getMyAfhStatus(appNo) {
		this.requestURL = `api/afhForm/getApplicationStatus/${appNo}`;
		return this.http.get(this.requestURL);
	}
	getWardZone() {
		return this.http.get(`api/afhForm/ward`);
	}

}
