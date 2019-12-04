import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentDataSharingService {
   
  dataModel: any ;
  dataSourceDataModel = new BehaviorSubject<any>(this.dataModel);
  observableDataModel = this.dataSourceDataModel.asObservable();
  updatedDataModel(data: any) {
    this.dataSourceDataModel.next(data);
  }

  pamentModel: any ;
  dataSourcePamentModel = new BehaviorSubject<any>(this.pamentModel);
  observablePamentModel = this.dataSourcePamentModel.asObservable();
  updatedPamentModel(data: any) {
    this.dataSourcePamentModel.next(data);
  }

  
  pamentFromOption: string ;
  dataSourcePamentFromOption = new BehaviorSubject<string>(this.pamentFromOption);
  observablePamentFromOption = this.dataSourcePamentFromOption.asObservable();
  updatedPamentFromOption(data: string) {
    this.dataSourcePamentFromOption.next(data);
  }

   
  isCancelForExtractProperty: boolean = false;
  dataSourceIsCancelForExtractProperty = new BehaviorSubject<boolean>(this.isCancelForExtractProperty);
  observableIsCancelForExtractProperty = this.dataSourceIsCancelForExtractProperty.asObservable();
  updatedIsCancelForExtractProperty(data: boolean) {
    this.dataSourceIsCancelForExtractProperty.next(data);
  }
   
  isPaymentForExtractProperty: boolean = false;
  dataSourceIsPaymentForExtractProperty = new BehaviorSubject<boolean>(this.isPaymentForExtractProperty);
  observableIsPaymentForExtractProperty = this.dataSourceIsPaymentForExtractProperty.asObservable();
  updatedIsPaymentForExtractProperty(data: boolean) {
    this.dataSourceIsPaymentForExtractProperty.next(data);
  }

   
  isCancelForNoDueCertificate: boolean = false;
  dataSourceIsCancelForNoDueCertificate = new BehaviorSubject<boolean>(this.isCancelForNoDueCertificate);
  observableIsCancelForNoDueCertificate = this.dataSourceIsCancelForNoDueCertificate.asObservable();
  updatedIsCancelForNoDueCertificate(data: boolean) {
    this.dataSourceIsCancelForNoDueCertificate.next(data);
  }
   
  isPaymentForNoDueCertificate: boolean = false;
  dataSourceIsPaymentForNoDueCertificate = new BehaviorSubject<boolean>(this.isPaymentForNoDueCertificate);
  observableIsPaymentForNoDueCertificate = this.dataSourceIsPaymentForNoDueCertificate.asObservable();
  updatedIsPaymentForNoDueCertificate(data: boolean) {
    this.dataSourceIsPaymentForNoDueCertificate.next(data);
  }

  isCancelForDuplicateBill: boolean = false;
  dataSourceIsCancelForDuplicateBill = new BehaviorSubject<boolean>(this.isCancelForDuplicateBill);
  observableIsCancelForDuplicateBill = this.dataSourceIsCancelForDuplicateBill.asObservable();
  updatedIsCancelForDuplicateBill(data: boolean) {
    this.dataSourceIsCancelForDuplicateBill.next(data);
  }
   
  isPaymentForDuplicateBill: boolean = false;
  dataSourceIsPaymentForDuplicateBill = new BehaviorSubject<boolean>(this.isPaymentForDuplicateBill);
  observableIsPaymentForDuplicateBill = this.dataSourceIsPaymentForDuplicateBill.asObservable();
  updatedIsPaymentForDuplicateBill(data: boolean) {
    this.dataSourceIsPaymentForDuplicateBill.next(data);
  }
   
  isCancelForAssessmentCertificate: boolean = false;
  dataSourceIsCancelForAssessmentCertificate = new BehaviorSubject<boolean>(this.isCancelForAssessmentCertificate);
  observableIsCancelForAssessmentCertificate = this.dataSourceIsCancelForAssessmentCertificate.asObservable();
  updatedIsCancelForAssessmentCertificate(data: boolean) {
    this.dataSourceIsCancelForAssessmentCertificate.next(data);
  }
  
  isPaymentForAssessmentCertificate: boolean = false;
  dataSourceIsPaymentForAssessmentCertificate = new BehaviorSubject<boolean>(this.isPaymentForAssessmentCertificate);
  observableIsPaymentForAssessmentCertificate = this.dataSourceIsPaymentForAssessmentCertificate.asObservable();
  updatedIsPaymentForAssessmentCertificate(data: boolean) {
    this.dataSourceIsPaymentForAssessmentCertificate.next(data);
  }

  isCancelForPropertyCollection: boolean = false;
  dataSourceIsCancelForPropertyCollection = new BehaviorSubject<boolean>(this.isCancelForPropertyCollection);
  observableIsCancelForPropertyCollection = this.dataSourceIsCancelForPropertyCollection.asObservable();
  updatedIsCancelForPropertyCollection(data: boolean) {
    this.dataSourceIsCancelForPropertyCollection.next(data);
  }
  
  isPaymentForPropertyCollection: boolean = false;
  dataSourceIsPaymentForPropertyCollection = new BehaviorSubject<boolean>(this.isPaymentForPropertyCollection);
  observableIsPaymentForPropertyCollection = this.dataSourceIsPaymentForPropertyCollection.asObservable();
  updatedIsPaymentForPropertyCollection(data: boolean) {
    this.dataSourceIsPaymentForPropertyCollection.next(data);
  }

  isCancelForWaterCollection: boolean = false;
  dataSourceIsCancelForWaterCollection = new BehaviorSubject<boolean>(this.isCancelForWaterCollection);
  observableIsCancelForWaterCollection = this.dataSourceIsCancelForWaterCollection.asObservable();
  updatedIsCancelForWaterCollection(data: boolean) {
    this.dataSourceIsCancelForWaterCollection.next(data);
  }
  
  isPaymentForWaterCollection: boolean = false;
  dataSourceIsPaymentForWaterCollection = new BehaviorSubject<boolean>(this.isPaymentForWaterCollection);
  observableIsPaymentForWaterCollection = this.dataSourceIsPaymentForWaterCollection.asObservable();
  updatedIsPaymentForWaterCollection(data: boolean) {
    this.dataSourceIsPaymentForWaterCollection.next(data);
  }
  
  
  dataModelFileDownload: any ;
  dataSourceDataModelFileDownload = new BehaviorSubject<any>(this.dataModelFileDownload);
  observableDataModelFileDownload = this.dataSourceDataModelFileDownload.asObservable();
  updatedDataModelFileDownload(data: any) {
    this.dataSourceDataModelFileDownload.next(data);
  }

  isCancelForLOICollection: boolean = false;
  dataSourceIsCancelForLOICollection = new BehaviorSubject<boolean>(this.isCancelForLOICollection);
  observableIsCancelForLOICollection = this.dataSourceIsCancelForLOICollection.asObservable();
  updatedIsCancelForLOICollection(data: boolean) {
    this.dataSourceIsCancelForLOICollection.next(data);
  }
   
  isPaymentForLOICollection: boolean = false;
  dataSourceIsPaymentForLOICollection = new BehaviorSubject<boolean>(this.isPaymentForLOICollection);
  observableIsPaymentForLOICollection = this.dataSourceIsPaymentForLOICollection.asObservable();
  updatedIsPaymentForLOICollection(data: boolean) {
    this.dataSourceIsPaymentForLOICollection.next(data);
  }
}
