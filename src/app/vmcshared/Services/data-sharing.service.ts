import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  propertyBasicId: number = null;
  isPropertyListing: boolean = false;
  isEditProperyOwnerOfPropertyListing: boolean = false;
  searchModelOgPropertyListing: any;
  backToPropertyListing: boolean = false;
  isViewPropertyListing: boolean = false;
  isMoveToPropertyListing: boolean = false

  constructor() { }


  private propertyEditModel = new BehaviorSubject(null);
  setPropertyEditModel(model: any) {
    this.propertyEditModel.next(model);
  }
  getPropertyEditModel(): Observable<any> {
    return this.propertyEditModel.asObservable();
  }


  private revaluatioModelFromHearingRemarks = new BehaviorSubject(null);
  setRevaluatioModelFromHearingRemarks(model: any) {
    this.revaluatioModelFromHearingRemarks.next(model);
  }
  getRevaluatioModelFromHearingRemarks(): Observable<any> {
    return this.revaluatioModelFromHearingRemarks.asObservable();
  }

  private ApplicantDetailsEditModel = new BehaviorSubject(null);
  setApplicantDetailsEditModel(model: any) {
    this.ApplicantDetailsEditModel.next(model);
  }
  getApplicantDetailsEditModel(): Observable<any> {
    return this.ApplicantDetailsEditModel.asObservable();
  }
}