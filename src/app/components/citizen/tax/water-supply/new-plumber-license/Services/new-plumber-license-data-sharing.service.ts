import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewPlumberLicenseModule } from '../new-plumber-license.module';


@Injectable()

export class NewPlumberLicenseDataSharingService {  
  
  private isShowForm= new BehaviorSubject(null);
  setIsShowForm(data: any) {
    this.isShowForm.next(data);
  }
  getIsShowForm(): Observable<any> {
    return this.isShowForm.asObservable();
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

  modelMoveStepper: any = null;
  dataSourceMoveStepper = new BehaviorSubject(this.modelMoveStepper);
  observableMoveStepper = this.dataSourceMoveStepper.asObservable();
  updateDataSourceMoveStepper(data: any) {
    this.dataSourceMoveStepper.next(data);
  }

  
}
