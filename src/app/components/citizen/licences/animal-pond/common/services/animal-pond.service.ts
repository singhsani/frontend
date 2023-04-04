import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnimalPondService {
  	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService,
		private https: HttpClient,) {}

	searchLicence(licenceNumber) {
    	return this.http.post(`api/form/APLicense/searchFromNewgen`,licenceNumber);
	}

	changeStatusOfBusinessAccordingAtatchment(subject:String,documents:any,formName : FormGroup){
		for (const document of documents) {
		
			if(subject == 'TENANT'){
			if (document.documentIdentifier == 'POLICE_VERIFICATION' || document.documentIdentifier == 'RENT_AGREEMENT')
				document.mandatory = true;
			}
			else if(subject == 'PROPRIETORSHIPFIRM'){
				if (document.documentIdentifier == 'POLICE_VERIFICATION' || document.documentIdentifier == 'RENT_AGREEMENT')
				document.mandatory = false;
			}
		}
		return formName.get('serviceDetail').patchValue({ 'serviceUploadDocuments': documents });
	}

	getWardZoneFirstLevel(level: any, key: any) {
		return this.http.post(`master/wardzoneMst/searchByLevel?levelOrderSeq=${level}&moduleKey=${key}`,
		  { observe: 'response' })
		  .pipe(map((response: any) => response))
	  }
	
	  getWardZone(data: any) {
		return this.https.post(`${Constants.baseApiUrl}wardzoneMst/search`, data,
		  { observe: 'response' })
		  .pipe(map((response: any) => response))
	  }
}
