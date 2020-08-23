import { Injectable } from '@angular/core';
import { TaxTransactionHistoryModule } from '../tax-transaction-history.module';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class TaxTransactionHistoryDataSharingService {

  private isShowHistoryTable = new BehaviorSubject(null);
  setIsShowHistoryTable(data: any) {
    this.isShowHistoryTable.next(data);
  }
  getIsShowHistoryTable(): Observable<any> {
    return this.isShowHistoryTable.asObservable();
  }

  private isShowTransactionTable = new BehaviorSubject(null);
  setIsShowTransactionTable(data: any) {
    this.isShowTransactionTable.next(data);
  }
  getIsShowTransactionTable(): Observable<any> {
    return this.isShowTransactionTable.asObservable();
  }

  private isShowDetail = new BehaviorSubject(null);
  setIsShowDetail(data: any) {
    this.isShowDetail.next(data);
  }
  getIsShowDetail(): Observable<any> {
    return this.isShowDetail.asObservable();
  }

  private searchModel = new BehaviorSubject(null);
  setSearchModel(data: any) {
    this.searchModel.next(data);
  }
  getsSearchModel(): Observable<any> {
    return this.searchModel.asObservable();
  }

  private viewModel = new BehaviorSubject(null);
  setViewModel(data: any) {
    this.viewModel.next(data);
  }
  getViewModel(): Observable<any> {
    return this.viewModel.asObservable();
  }

  private taxDetail = new BehaviorSubject(null);
  setTaxDetail(data: any) {
    this.taxDetail.next(data);
  }
  getTaxDetail(): Observable<any> {
    return this.taxDetail.asObservable();
  }
}
