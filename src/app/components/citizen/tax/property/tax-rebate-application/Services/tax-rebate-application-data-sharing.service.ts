import { Injectable } from '@angular/core';
import { TaxRebateApplicationModule } from '../tax-rebate-application.module';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class TaxRebateApplicationDataSharingService {
  
  applicationNumber :any;
  isShowForm: boolean = false;
  propertyTaxRebateId : any;
  serviceCode : any;
  serviceId : any;
  isPaymentReceipt : boolean;
  

  dataSourceIsShowForm = new BehaviorSubject<boolean>(this.isShowForm);
  observableIsShowForm = this.dataSourceIsShowForm.asObservable();
  updatedIsShowForm(data: boolean) {
    this.dataSourceIsShowForm.next(data);
  }

  isShowTable: boolean = false;
  dataSourceIsShowTable = new BehaviorSubject<boolean>(this.isShowTable);
  observableIsShowTable = this.dataSourceIsShowTable.asObservable();
  updatedIsShowTable(data: boolean) {
    this.dataSourceIsShowTable.next(data);
  }

  isClear: boolean = false;
  dataSourceIsClear = new BehaviorSubject<boolean>(this.isClear);
  observableIsClear = this.dataSourceIsClear.asObservable();
  updatedIsClear(data: boolean) {
    this.dataSourceIsClear.next(data);
  }


  isSearchByPropertyNo: boolean = false;
  dataSourceIsSearchByPropertyNo = new BehaviorSubject<boolean>(this.isSearchByPropertyNo);
  observableIsSearchByPropertyNo = this.dataSourceIsSearchByPropertyNo.asObservable();
  updatedIsSearchByPropertyNo(data: boolean) {
      this.dataSourceIsSearchByPropertyNo.next(data);
  }
  
  searchModel: any ;
  dataSourceSearchModel = new BehaviorSubject<any>(this.searchModel);
  observableSearchModel = this.dataSourceSearchModel.asObservable();
  updatedSearchModel(data: any) {
    this.dataSourceSearchModel.next(data);
  }

  dataModel: any ;
  dataSourceDataModel = new BehaviorSubject<any>(this.dataModel);
  observableDataModel = this.dataSourceDataModel.asObservable();
  updatedDataModel(data: any) {
    this.dataSourceDataModel.next(data);
  }

}
