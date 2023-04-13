import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EngineeringService {
  requestURL: string;
  apiType: string;

  constructor(private http: HttpService) { }

  getAllDocuments() {
    return this.http.get('api/vendor/doc/list');
  }

   getLookup() {
    return this.http.get('api/vendor/lookups');
  }
  

  vendorSaveFormData(formData) {

    this.requestURL = `api/${this.apiType}/save`;

    return this.http.post(this.requestURL, formData);
  }

  createFormData() {

    this.requestURL = `api/${this.apiType}/create`;

    return this.http.get(this.requestURL);
  }

  getBankNames() {
    return this.http.get('api/bankMaster/get/active/all');
  }

  getAllLocationDetail() {
    return this.http.get('api/vendor/location/detail');
  }

  getFeeFromLocation(code) {
    return this.http.get(`api/vendor/location/feeAmount/` + code);
  }


  //-------------------Contractor---------------------//

  getAllLocationDetaill() {
    return this.http.get('api/contractor/location/detail');
  }
  getAllDocumentss() {
    return this.http.get('api/contractor/doc/list');
  }
  contractorSaveFormData(formData) {

    this.requestURL = `api/${this.apiType}/save`;

    return this.http.post(this.requestURL, formData);
  }
  createFormDataa() {

    this.requestURL = `api/${this.apiType}/create`;

    return this.http.get(this.requestURL);
  }
  getFeeFromLocationn(code) {
    return this.http.get(`api/contractor/location/feeAmount/` + code);
  }

  getLookups() {
    return this.http.get('api/contractor/lookups');
  }
  /**
    * Method is used to return array 
    */

  createArray(control: FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    this.createCloneAbstractControl(control, formGroup);
    return formGroup;
  }

  createCloneAbstractControl(copyFrom: FormGroup, copyTo: FormGroup) {
    Object.keys(copyFrom.controls).forEach(key => {
      const control = copyFrom.get(key);
      if (control instanceof FormControl) {
        copyTo.addControl(key, new FormControl(control.value, control.validator, control.asyncValidator) as any)
      } else if (control instanceof FormGroup) {
        const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
        this.createCloneAbstractControl(control, formGroup);
        copyTo.addControl(key, formGroup);
      } else if (control instanceof FormArray) {
        const formArray = new FormArray([], control.validator, control.asyncValidator);
        copyTo.addControl(key, new FormArray(control.value, control.validator, control.asyncValidator) as any)
        copyTo.addControl(key, formArray);
      }
    });
  }
}
