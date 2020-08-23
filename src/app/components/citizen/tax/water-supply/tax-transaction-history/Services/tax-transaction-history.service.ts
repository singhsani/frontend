import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { TaxTransactionHistoryModule } from '../tax-transaction-history.module';


@Injectable()
export class TaxTransactionHistoryService {

  constructor(private http: HttpClient) { }
 
  getBillReceipts(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}history/billreceipts`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  getTransaction(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}history/transaction`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

}
