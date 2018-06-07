import { FormsActionsService } from './../../core/services/citizen/data-services/forms-actions.service';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class CountryService {

	countryData = new BehaviorSubject(new Array());

	get countriesData() {
		return this.countryData.asObservable();

	}

	constructor(private http: HttpService, private formService: FormsActionsService) {
		this.getCountryData();
	}

	getCountryData(){
		this.formService.getCountryLookUp().subscribe(res=>{
			this.countryData.next(res.data);
		})

	}


}