import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from '../../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnimalPondService {

  	/**
	 * Constructor to declare defualt propeties of class.
	 * @param http - Declare Http Service property.
	 */
	constructor(private http: HttpService) {}

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
}
