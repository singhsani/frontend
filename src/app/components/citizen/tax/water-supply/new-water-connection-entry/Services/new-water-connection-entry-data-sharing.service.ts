import { Injectable } from '@angular/core';
import { NewWaterConnectionEntryModule } from '../new-water-connection-entry.module';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class NewWaterConnectionEntryDataSharingService {
  

  modelNewWaterConnectionEntry: any = null;
  dataSourceNewWaterConnectionEntry = new BehaviorSubject(this.modelNewWaterConnectionEntry);
  observableNewWaterConnectionEntry = this.dataSourceNewWaterConnectionEntry.asObservable();
  currentStep : any;
  updateDataSourceNewWaterConnectionEntry(data: any) {
    this.dataSourceNewWaterConnectionEntry.next(data);
  }

  modelMoveStepper: any = null;
  dataSourceMoveStepper = new BehaviorSubject(this.modelMoveStepper);
  observableMoveStepper = this.dataSourceMoveStepper.asObservable();
  updateDataSourceMoveStepper(data: any,currentStep? : any) {
    this.dataSourceMoveStepper.next(data);
    this.currentStep = currentStep;
  }
  
  updateDataSourceBackMoveStepper() {
    const state = this.currentStep ? this.currentStep : 0;
    this.dataSourceMoveStepper.next(state);
  }

  isShowDocument: any = null;
  dataSourceIsShowDocument = new BehaviorSubject(this.isShowDocument);
  observableIsShowDocument = this.dataSourceIsShowDocument.asObservable();
  updateDataSourceIsShowDocument(data: any) {
    this.dataSourceIsShowDocument.next(data);
  }
}