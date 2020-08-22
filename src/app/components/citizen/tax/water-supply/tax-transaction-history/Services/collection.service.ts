import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

@Injectable()
export class CollectionService {

  constructor(private http: HttpClient) { }

  getoccupierOutstandingAmount(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}collection/occupierOutstandingAmount`, data,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

  generate(data: any) {
    return this.http.post(`${Constants.assessmentModuleApiUrl}collection/generate`, data,
      { responseType: 'arraybuffer' })
      .pipe(map((response: any) => response))
  }

  downloadReceipt(id: number) {
    return this.http.get(`${Constants.assessmentModuleApiUrl}collection/receipt/download/`+id,
      { responseType: 'arraybuffer' })
      .pipe(map((response: any) => response))
  }

  deleteReceipt(propertyReceiptMstId: number) {
    return this.http.delete(`${Constants.assessmentModuleApiUrl}collection/delete/`+propertyReceiptMstId,
      { observe: 'response' })
      .pipe(map((response: any) => response))
  }

}
