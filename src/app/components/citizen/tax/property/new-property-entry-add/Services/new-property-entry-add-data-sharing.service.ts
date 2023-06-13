import { Injectable } from '@angular/core';
import { NewPropertyEntryAddModule } from '../new-property-entry-add.module';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class NewPropertyEntryAddDataSharingService {

  applicationNo :string ;

  modelMoveStepper: any = null;
  dataSourceMoveStepper = new BehaviorSubject(this.modelMoveStepper);
  observableMoveStepper = this.dataSourceMoveStepper.asObservable();
  updateDataSourceMoveStepper(data: any) {
    this.dataSourceMoveStepper.next(data);
  }

  modelProperty: any = null;
  dataSourceProperty = new BehaviorSubject(this.modelProperty);
  observableProperty = this.dataSourceProperty.asObservable();
  updateDataSourceProperty(data: any) {
    this.dataSourceProperty.next(data);
  }

  modelOccupier: any = null;
  dataSourceOccupier = new BehaviorSubject(this.modelOccupier);
  observableOccupier = this.dataSourceOccupier.asObservable();
  updateDataSourceOccupier(data: any) {
    this.dataSourceOccupier.next(data);
  }

  modelUnitList: any = null;
  dataSourceUnitList = new BehaviorSubject(this.modelUnitList);
  observableUnitList = this.dataSourceUnitList.asObservable();
  updateDataSourceUnitList(data: any) {
    this.dataSourceUnitList.next(data);
  }

  private ApplicantDetailsEditModel = new BehaviorSubject(null);
  setApplicantDetailsEditModel(model: any) {
    this.ApplicantDetailsEditModel.next(model);
  }
  getApplicantDetailsEditModel(): Observable<any> {
    return this.ApplicantDetailsEditModel.asObservable();
  }

  private propertyEditModel = new BehaviorSubject(null);
  setPropertyEditModel(model: any) {
    this.propertyEditModel.next(model);
  }
  getPropertyEditModel(): Observable<any> {
    return this.propertyEditModel.asObservable();
  }
}