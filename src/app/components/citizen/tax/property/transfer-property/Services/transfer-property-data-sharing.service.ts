import { Injectable } from '@angular/core';
import { TransferPropertyModule } from '../transfer-property.module';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class TransferPropertyDataSharingService {
  
  applicationNo :any;
  isShowForm: boolean = false;
  propertyBasicId :any;
  propertyTransferId : any;
  propertyServiceCode :any;
  isPaymentReceipt :boolean;
  serviceId :any;
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

  isRefreshTable: boolean = false;
  dataSourceIsRefreshTable = new BehaviorSubject<boolean>(this.isRefreshTable);
  observableIsRefreshTable = this.dataSourceIsRefreshTable.asObservable();
  updatedIsRefreshTable(data: boolean) {
    this.dataSourceIsRefreshTable.next(data);
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

  detailDataModel: any ;
  dataSourceDetailDataModel = new BehaviorSubject<any>(this.detailDataModel);
  observableDetailDataModel = this.dataSourceDetailDataModel.asObservable();
  updatedDetailDataModel(data: any) {
    this.dataSourceDetailDataModel.next(data);
  }

  isRefereshDetailTable: boolean = false;
  dataSourceIsRefereshDetailTable = new BehaviorSubject<boolean>(this.isRefereshDetailTable);
  observableIsRefereshDetailTable = this.dataSourceIsRefereshDetailTable.asObservable();
  updatedIsRefereshDetailTable(data: boolean) {
    this.dataSourceIsRefereshDetailTable.next(data);
  }

  modelMoveStepper: any = null;
  dataSourceMoveStepper = new BehaviorSubject(this.modelMoveStepper);
  observableMoveStepper = this.dataSourceMoveStepper.asObservable();
  updateDataSourceMoveStepper(data: any) {
    this.dataSourceMoveStepper.next(data);
  }

  propertyDetailModel: any ;
  dataSourcePropertyDetailModel = new BehaviorSubject<any>(this.propertyDetailModel);
  observablePropertyDetailModel = this.dataSourcePropertyDetailModel.asObservable();
  updatedPropertyDetailModel(data: any) {
    this.dataSourcePropertyDetailModel.next(data);
  }

  private propertyEditModel = new BehaviorSubject(null);
  setPropertyEditModel(model: any) {
    this.propertyEditModel.next(model);
  }
  getPropertyEditModel(): Observable<any> {
    return this.propertyEditModel.asObservable();
  }
}
