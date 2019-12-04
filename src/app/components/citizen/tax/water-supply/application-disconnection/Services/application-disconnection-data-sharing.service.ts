import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationDisconnectionModule } from '../application-disconnection.module';


@Injectable()

export class ApplicationDisconnectionDataSharingService {  
  
  private waterBillDetail= new BehaviorSubject(null);
  setWaterBillDetail(data: any) {
    this.waterBillDetail.next(data);
  }
  getWaterBillDetail(): Observable<any> {
    return this.waterBillDetail.asObservable();
  }

  private waterTaxDetail = new BehaviorSubject(null);
  setWaterTaxDetail(data: any) {
    this.waterTaxDetail.next(data);
  }
  getWaterTaxDetail(): Observable<any> {
    return this.waterTaxDetail.asObservable();
  }

  private propertyDetail= new BehaviorSubject(null);
  setPropertyDetail(data: any) {
    this.propertyDetail.next(data);
  }
  getPropertyDetail(): Observable<any> {
    return this.propertyDetail.asObservable();
  }

  private propertyBillDetail= new BehaviorSubject(null);
  setPropertyBillDetail(data: any) {
    this.propertyBillDetail.next(data);
  }
  getPropertyBillDetail(): Observable<any> {
    return this.propertyBillDetail.asObservable();
  }

  private propertyTaxDetail = new BehaviorSubject(null);
  setPropertyTaxDetail(data: any) {
    this.propertyTaxDetail.next(data);
  }
  getPropertyTaxDetail(): Observable<any> {
    return this.propertyTaxDetail.asObservable();
  }

  
  private isShowPropertyDetail= new BehaviorSubject(null);
  setIsShowPropertyDetail(data: any) {
    this.isShowPropertyDetail.next(data);
  }
  getIsShowPropertyDetail(): Observable<any> {
    return this.isShowPropertyDetail.asObservable();
  }
   
  private isShowPropertyBillDetail= new BehaviorSubject(null);
  setIsShowPropertyBillDetail(data: any) {
    this.isShowPropertyBillDetail.next(data);
  }
  getIsShowPropertyBillDetail(): Observable<any> {
    return this.isShowPropertyBillDetail.asObservable();
  }
   

  private isShowPropertyTaxDetail= new BehaviorSubject(null);
  setIsShowPropertyTaxDetail(data: any) {
    this.isShowPropertyTaxDetail.next(data);
  }
  getIsShowPropertyTaxDetail(): Observable<any> {
    return this.isShowPropertyTaxDetail.asObservable();
  }

  private isShowWaterBillDetail= new BehaviorSubject(null);
  setIsShowWaterBillDetail(data: any) {
    this.isShowWaterBillDetail.next(data);
  }
  getIsShowWaterBillDetail(): Observable<any> {
    return this.isShowWaterBillDetail.asObservable();
  }
   

  private isShowWaterTaxDetail= new BehaviorSubject(null);
  setIsShowWaterTaxDetail(data: any) {
    this.isShowWaterTaxDetail.next(data);
  }
  getIsShowWaterTaxDetail(): Observable<any> {
    return this.isShowWaterTaxDetail.asObservable();
  }

  private isShowApproval= new BehaviorSubject(null);
  setIsShowApproval(data: any) {
    this.isShowApproval.next(data);
  }
  getIsShowApproval(): Observable<any> {
    return this.isShowApproval.asObservable();
  }

  private approvalModel= new BehaviorSubject(null);
  setApprovalModel(data: any) {
    this.approvalModel.next(data);
  }
  getApprovalModel(): Observable<any> {
    return this.approvalModel.asObservable();
  }
}
