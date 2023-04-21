import { ComponentConfig } from './../../component-config';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import * as _ from 'lodash';

export class LicenseConfiguration extends ComponentConfig {

    public currentTabIndex: number = 0;
    public isAttachmentButtonsVisible: boolean = false;

    /**
     * This method use to get output event of tab change
     * @param index - current index
     */
    public onTabChange(index: number, controlName, mainControl) {
        if(index > this.currentTabIndex){
            if (controlName.invalid) {
                this.getInvalidFormControlKey(controlName)
            } else {
                const organizationalAry = Object.keys(controlName.getRawValue());
                organizationalAry.forEach((element:any) => {
                       // push form Array data into main Controller
                    if (controlName.get(element) instanceof FormArray) {
                        const formGroupAry = this.createArray(controlName.get(element));
                        mainControl.get(element).value.push()
                        for(let i = 0; i < controlName.get(element).controls.length; i++) {
                            mainControl.get(element).value.push(formGroupAry.value[i]);
                            mainControl.get(element).controls.push(formGroupAry.controls[i]);
                        }   
                    }
                    else {
                        mainControl.get(element).setValue(controlName.get(element).value);
                    }
                });
                this.currentTabIndex = index;
            }
        }else{
            this.currentTabIndex= index;
        }

    }

    constructor() {
        super();
    }


    public requiredDocumentListMeetFish(licenseForm: FormGroup): Array<any> {
        let uploadFileArray = [];
        let statusOfBusinessId = licenseForm.get('statusOfBusinessId').value.code;
        if (statusOfBusinessId) {
            _.forEach(licenseForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
                if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
                    uploadFileArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    })
                }
                if (value.dependentFieldName) {
                    let dependentFieldArray = value.dependentFieldName.split(",");
                    if (dependentFieldArray.includes(statusOfBusinessId) && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
                        uploadFileArray.push({
                            'labelName': value.documentLabelEn,
                            'fieldIdentifier': value.fieldIdentifier,
                            'documentIdentifier': value.documentIdentifier
                        })
                    }
                }
            });
        }
        return uploadFileArray;
    }

    /**
     * Get invalid form control key
     * @param form - form group
     */
    getInvalidFormControlKey(form) {
        this.markAsTouched(form);
        for (const key in form.controls) {
            if (form.get(key).invalid) {
                console.log("Invalid from control key", key);
                return key;
            }
        }
    }

    /**
	 * Method is used to return array 
	 */
	
    createArray(control:FormGroup) {
        const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
        this.createCloneAbstractControl(control,formGroup);
        return formGroup;
	}

    createCloneAbstractControl(copyFrom: FormGroup, copyTo : FormGroup){
		Object.keys(copyFrom.controls).forEach(key => {
			const control = copyFrom.get(key);
			if(control instanceof FormControl){
				copyTo.addControl(key,new FormControl(control.value, control.validator, control.asyncValidator) as any)
			}else if(control instanceof FormGroup){
				const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
				this.createCloneAbstractControl(control,formGroup);
				copyTo.addControl(key,formGroup);
		  }else if (control instanceof FormArray) {
			const formArray = new FormArray([], control.validator, control.asyncValidator);
			copyTo.addControl(key,new FormArray(control.value, control.validator, control.asyncValidator) as any)
			copyTo.addControl(key,formArray);
		  }
		});
	}

    public onFormTabChange(index: number) {
            this.currentTabIndex = index;
        
    }
}
