import { ComponentConfig } from './../../../component-config';

export class FireFacilityConfig extends ComponentConfig {

    public currentTabIndex: number = 0;
    public isAttachmentButtonsVisible: boolean = false;
    public contactNumberLength = 12;
    public mobileNumber_maxLength: number = 10;
    public mobileNumber_minLength: number = 10;


    /**
     * This method use to get output event of tab change
     * @param index - current index
     */
    public onFormTabChange(index: number) {
        this.currentTabIndex = index;
    }
}
