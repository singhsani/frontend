import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from '../../Constants';

@Injectable({
  providedIn: 'root'
})
export class CreateFormulaService {

  constructor(private http: HttpClient) { }

  getFormulaLookupProperty() {
    return this.http.get(`${Constants.baseApiUrl}formulaLookup/property`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  getFormulaLookupWater() {
    return this.http.get(`${Constants.baseApiUrl}formulaLookup/water`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }
  
}
