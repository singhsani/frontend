import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TicketingsService {

  requestURL: string;
  resourceType: string;

  constructor(
    private http: HttpService
  ) { }

	/**
	 * This method is use to get lookup data respective to api type
	 */
  getDataFromLookups() {
    this.requestURL = `api/booking/${this.resourceType}/lookups`;
    return this.http.get(this.requestURL);
  }
}
