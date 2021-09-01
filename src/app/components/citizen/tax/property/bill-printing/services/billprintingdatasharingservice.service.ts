import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillprintingdatasharingserviceService {

  isShowTable: boolean = false;
  dataSourceIsShowTable = new BehaviorSubject<boolean>(this.isShowTable);
  observableIsShowTable = this.dataSourceIsShowTable.asObservable();
  updatedIsShowTable(data: boolean) {
    this.dataSourceIsShowTable.next(data);
  }

  searchModel: any;
  dataSourceSearchModel = new BehaviorSubject<any>(this.searchModel);
  observableSearchModel = this.dataSourceSearchModel.asObservable();
  updatedSearchModel(data: any) {
    this.dataSourceSearchModel.next(data);
  }
}
