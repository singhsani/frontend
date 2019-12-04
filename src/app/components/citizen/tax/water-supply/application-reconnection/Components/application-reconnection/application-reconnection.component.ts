import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-reconnection.model';
import { ApplicationReconnectionService } from '../../Services/application-reconnection.service';
import { NgForm } from '@angular/forms';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';

@Component({
    selector: 'app-application-reconnection',
    templateUrl: './application-reconnection.component.html'
})

export class ApplicationReconnectionComponent implements OnInit,OnDestroy {

    isShowPropertyDetail: boolean = false;
    isShowPropertyTaxDetail: boolean = false;
    isShowPropertyBillDetail: boolean = false;
    isShowWaterBillDetail: boolean = false;
    isShowWaterTaxDetail: boolean = false;
    isShowForm: boolean = false;
    isShowApproval: boolean = false;
    constructor(
        private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

    ngOnInit() {
        
        this.applicationReconnectionDataSharingService.getIsShowWaterBillDetail().subscribe(data => {
            this.isShowWaterBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationReconnectionDataSharingService.getIsShowWaterTaxDetail().subscribe(data => {
            this.isShowWaterTaxDetail = data;
            this.isShowForm = data;
        });

        this.applicationReconnectionDataSharingService.getIsShowPropertyDetail().subscribe(data => {
            this.isShowPropertyDetail = data;
            this.isShowForm = data;
        });
        this.applicationReconnectionDataSharingService.getIsShowPropertyBillDetail().subscribe(data => {
            this.isShowPropertyBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationReconnectionDataSharingService.getIsShowPropertyTaxDetail().subscribe(data => {
            this.isShowPropertyTaxDetail = data;
            this.isShowForm = data;
        });
        this.applicationReconnectionDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
            this.isShowForm = data;
        });
    }
    
    ngOnDestroy() {
        this.applicationReconnectionDataSharingService.setIsShowWaterBillDetail(false);
        this.applicationReconnectionDataSharingService.setIsShowWaterTaxDetail(false);
        this.applicationReconnectionDataSharingService.setIsShowPropertyDetail(false);
        this.applicationReconnectionDataSharingService.setIsShowPropertyBillDetail(false);
        this.applicationReconnectionDataSharingService.setIsShowPropertyTaxDetail(false);
        this.applicationReconnectionDataSharingService.setIsShowApproval(false);
    }
}