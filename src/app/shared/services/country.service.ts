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

	constructor(private http: HttpService) {
		this.getCountryData();
	}

	getCountryData(){
		this.http.get('public/lookup/countries').subscribe(res=>{
			this.countryData.next(res.data);
		})

	}


}