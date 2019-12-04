import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PropertySearchSharingService {

  private isOpenSearchForm = new BehaviorSubject(null);
  setIsOpenSearchForm(model: any) {
    this.isOpenSearchForm.next(model);
  }
  getIsOpenSearchForm(): Observable<any> {
    return this.isOpenSearchForm.asObservable();
  }

  private propertyModel = new BehaviorSubject(null);
  setPropertyModel(model: any) {
    this.propertyModel.next(model);
  }
  getPropertyModel(): Observable<any> {
    return this.propertyModel.asObservable();
  }

}
