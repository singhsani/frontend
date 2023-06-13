import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RefundApplicationModule } from '../refund-application.module';


@Injectable()
export class RefundApplicationDataSharingService {

  applicationNo: any;
 
  private isShowForm = new BehaviorSubject(null);
  setIsShowForm(data: any) {
    this.isShowForm.next(data);
  }
  getIsShowForm(): Observable<any> {
    return this.isShowForm.asObservable();
  }

  private isShowApproval = new BehaviorSubject(null);
  setIsShowApproval(data: any) {
    this.isShowApproval.next(data);
  }
  getIsShowApproval(): Observable<any> {
    return this.isShowApproval.asObservable();
  }

  private refundModel = new BehaviorSubject(null);
  setRefundModel(data: any) {
    this.refundModel.next(data);
  }
  getRefundModel(): Observable<any> {
    return this.refundModel.asObservable();
  }

  private isBack = new BehaviorSubject(null);
  setIsBack(data: any) {
    this.isBack.next(data);
  }
  getIsBack(): Observable<any> {
    return this.isBack.asObservable();
  }

  
  private propertyEditModel = new BehaviorSubject(null);
  setPropertyEditModel(model: any) {
    this.propertyEditModel.next(model);
  }
  getPropertyEditModel(): Observable<any> {
    return this.propertyEditModel.asObservable();
  }
}
