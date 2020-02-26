import { Injectable } from '@angular/core';
import { SessionStorageService, SessionStorage } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';
import * as _ from 'lodash';
declare var pramukhIME;
declare var PramukhIndic;
/**
 * This Class is use for perform common language translation for application.
 */
@Injectable({
	providedIn: 'root'
})
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

	/**
	 * This method is use for get current application language.
	 */
	getLanguageData(){
		
		let headers = {
			'Content-type': 'application/json'
		};

		this._http.get('public/locale/localeMsg',headers).subscribe(res => {
			this.data = res.data;
		});
	}

	/**
	 * This method is use for get current application language.
	 */
	getCurrentLanguage() {
		return this.currentLanguage;
	}
	
	/**
	 * This method is use for convert all key in to the current selected language.
	 * @param key - Particular key to identify language conversion - Type(STRING);
	 */
	translate(key: string, type?: string, lang?: string) {
		
		this.setCurrentLanguage();
		
		if(lang){
			if(_.isEmpty(_.get(this.data, `${type}.${key}.${lang}`, key))){
				return key;
			} else {
				return _.get(this.data, `${type}.${key}.${lang}`, key);
			}
		}

		if(_.has(this.data, type)){
			if(_.isEmpty(_.get(this.data, `${type}.${key}.${this.currentLanguage}`, key))){
				return key;
			} else {
				return _.get(this.data, `${type}.${key}.${this.currentLanguage}`, key);
			}
		} else {
			return key;
		}
	}

	getEngToGujTranslation(engValue:string):string{
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		return pramukhIME.convert(engValue)
	}

}
