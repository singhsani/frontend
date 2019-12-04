import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreateFormulaSharingService {
 
  private isShowCreateFormulaForm = new BehaviorSubject(null);
  setIsShowCreateFormulaForm(model: any) {
    this.isShowCreateFormulaForm.next(model);
  }
  getIsShowCreateFormulaForm(): Observable<any> {
    return this.isShowCreateFormulaForm.asObservable();
  }

  private isOpenFrom = new BehaviorSubject(null);
  setIsOpenFrom(model: any) {
    this.isOpenFrom.next(model);
  }
  getIsOpenFrom(): Observable<any> {
    return this.isOpenFrom.asObservable();
  }

  private formulaModel = new BehaviorSubject(null);
  setFormulaModel(model: any) {
    this.formulaModel.next(model);
  }
  getFormulaModel(): Observable<any> {
    return this.formulaModel.asObservable();
  }

  private formulaValue = new BehaviorSubject(null);
  setFormulaValue(model: any) {
    this.formulaValue.next(model);
  }
  getFormulaValue(): Observable<any> {
    return this.formulaValue.asObservable();
  }
}
