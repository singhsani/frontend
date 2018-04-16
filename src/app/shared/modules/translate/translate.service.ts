import { Injectable } from '@angular/core';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';

/**
 * This Class is use for perform common language translation for application.
 */
@Injectable()
export class TranslateService {

	private currentLanguage: string;
	private data: any;

	/**
	 * Constructor to declare defualt propeties of class.
	 * @param _session - Declare session property.
	 * @param _http - Declare HTTP service property.
	 */
	constructor(
		private _session: SessionStorageService,
		private _http: HttpService
	) {
		this.setCurrentLanguage();
		this.getLanguageData();
	}

	/**
	 * This method is use for set current application language.
	 */
	setCurrentLanguage() {
		let lang = this._session.get('currentLanguage');

		if (lang) {
			this.currentLanguage = lang;
		} else {
			this.currentLanguage = 'en';
		}
	}

	getLanguageData(){
		
		let headers = {
			'Content-type': 'application/json'
		};

		this._http.get('public/locale/localeMsg',headers).subscribe(res => {
			this.data = res.data;
		});
	}
	
	/**
	 * This method is use for convert all key in to the current selected language.
	 * @param key - Particular key to identify language conversion - Type(STRING);
	 */
	translate(key: string, type?: string) {
		
		this.setCurrentLanguage();
		
		try {
			if (this.data[type][key][this.currentLanguage]) {
				return this.data[type][key][this.currentLanguage];
			} else {
				return `${key}`;
			}
		} catch (error) {
			return `${key}`;
		}
	}

}
