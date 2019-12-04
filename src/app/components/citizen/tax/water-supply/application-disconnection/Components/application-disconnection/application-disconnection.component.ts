import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';

@Component({
    selector: 'app-application-disconnection',
    templateUrl: './application-disconnection.component.html'
})

export class ApplicationDisconnectionComponent implements OnInit,OnDestroy {
    isShowPropertyDetail: boolean = false;
    isShowPropertyTaxDetail: boolean = false;
    isShowPropertyBillDetail: boolean = false;
    isShowWaterBillDetail: boolean = false;
    isShowWaterTaxDetail: boolean = false;
    isShowForm: boolean = false;
    isShowApproval: boolean = false;
    constructor(
        private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService) { }

    ngOnInit() {

        this.applicationDisconnectionDataSharingService.getIsShowWaterBillDetail().subscribe(data => {
            this.isShowWaterBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationDisconnectionDataSharingService.getIsShowWaterTaxDetail().subscribe(data => {
            this.isShowWaterTaxDetail = data;
            this.isShowForm = data;
        });

        this.applicationDisconnectionDataSharingService.getIsShowPropertyDetail().subscribe(data => {
            this.isShowPropertyDetail = data;
            this.isShowForm = data;
        });
        this.applicationDisconnectionDataSharingService.getIsShowPropertyBillDetail().subscribe(data => {
            this.isShowPropertyBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationDisconnectionDataSharingService.getIsShowPropertyTaxDetail().subscribe(data => {
            this.isShowPropertyTaxDetail = data;
            this.isShowForm = data;
        });
        this.applicationDisconnectionDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
            this.isShowForm = data;
        });
    }

    ngOnDestroy() {
        this.applicationDisconnectionDataSharingService.setIsShowPropertyDetail(false);
        this.applicationDisconnectionDataSharingService.setIsShowPropertyTaxDetail(false);
        this.applicationDisconnectionDataSharingService.setIsShowPropertyBillDetail(false);
        this.applicationDisconnectionDataSharingService.setIsShowWaterBillDetail(false);
        this.applicationDisconnectionDataSharingService.setIsShowWaterTaxDetail(false);
        this.applicationDisconnectionDataSharingService.setIsShowApproval(false);
      }

}
