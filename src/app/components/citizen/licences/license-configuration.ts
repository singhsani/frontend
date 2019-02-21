import { ComponentConfig } from './../../component-config';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';

export class LicenseConfiguration extends ComponentConfig {

    public currentTabIndex: number = 0;
    public isAttachmentButtonsVisible: boolean = false;

    /**
     * This method use to get output event of tab change
     * @param index - current index
     */
    public onFormTabChange(index: number) {
        this.currentTabIndex = index;
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

}
