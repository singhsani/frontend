import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from '../../Constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  getBankList() {
    return this.http.get(`${Constants.baseApiUrl}bank/list`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getBranchList(bankId: number) {
    return this.http.get(`${Constants.baseApiUrl}bank/listbranches/${bankId}`,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  downloadFile(url: any) {
    return this.http.get(`${Constants.serverApiIp}${url}`,
      { responseType: "arraybuffer" })
      .pipe(map((response: any) => response))
  }
}
