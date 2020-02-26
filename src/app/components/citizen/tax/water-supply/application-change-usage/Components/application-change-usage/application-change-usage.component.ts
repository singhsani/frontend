import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';


@Component({
    selector: 'app-application-change-usage',
    templateUrl: './application-change-usage.component.html'
})

export class ApplicationChangeUsageComponent implements OnInit,OnDestroy {

    isShowPropertyDetail: boolean = false;
    isShowPropertyTaxDetail: boolean = false;
    isShowPropertyBillDetail: boolean = false;
    isShowWaterBillDetail: boolean = false;
    isShowWaterTaxDetail: boolean = false;
    isShowForm: boolean = false;
    isShowApproval: boolean = false;

    constructor(private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

    ngOnInit() {
        this.applicationChangeUsageDataSharingService.getIsShowWaterBillDetail().subscribe(data => {
            this.isShowWaterBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationChangeUsageDataSharingService.getIsShowWaterTaxDetail().subscribe(data => {
            this.isShowWaterTaxDetail = data;
            this.isShowForm = data;
        });

        this.applicationChangeUsageDataSharingService.getIsShowPropertyDetail().subscribe(data => {
            this.isShowPropertyDetail = data;
            this.isShowForm = data;
        });
        this.applicationChangeUsageDataSharingService.getIsShowPropertyBillDetail().subscribe(data => {
            this.isShowPropertyBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationChangeUsageDataSharingService.getIsShowPropertyTaxDetail().subscribe(data => {
            this.isShowPropertyTaxDetail = data;
            this.isShowForm = data;
        });
        this.applicationChangeUsageDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
            this.isShowForm = data;
        });
    }

    ngOnDestroy() {
        this.applicationChangeUsageDataSharingService.setIsShowWaterBillDetail(false);
        this.applicationChangeUsageDataSharingService.setIsShowWaterTaxDetail(false);
        this.applicationChangeUsageDataSharingService.setIsShowPropertyDetail(false);
        this.applicationChangeUsageDataSharingService.setIsShowPropertyBillDetail(false);
        this.applicationChangeUsageDataSharingService.setIsShowPropertyTaxDetail(false);
        this.applicationChangeUsageDataSharingService.setIsShowApproval(false);
    }
}