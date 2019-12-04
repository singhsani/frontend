import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';

@Component({
    selector: 'app-application-transfer-ownership',
    templateUrl: './application-transfer-ownership.component.html'
})

export class ApplicationTransferOwnershipComponent implements OnInit,OnDestroy {

    isShowPropertyDetail: boolean = false;
    isShowPropertyTaxDetail: boolean = false;
    isShowPropertyBillDetail: boolean = false;
    isShowWaterBillDetail: boolean = false;
    isShowWaterTaxDetail: boolean = false;
    isShowForm: boolean = false;
    isShowApproval: boolean = false;

    constructor( private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService) { }
        

    ngOnInit() {
       
        this.applicationTransferOwnershipDataSharingService.getIsShowWaterBillDetail().subscribe(data => {
            this.isShowWaterBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationTransferOwnershipDataSharingService.getIsShowWaterTaxDetail().subscribe(data => {
            this.isShowWaterTaxDetail = data;
            this.isShowForm = data;
        });

        this.applicationTransferOwnershipDataSharingService.getIsShowPropertyDetail().subscribe(data => {
            this.isShowPropertyDetail = data;
            this.isShowForm = data;
        });
        this.applicationTransferOwnershipDataSharingService.getIsShowPropertyBillDetail().subscribe(data => {
            this.isShowPropertyBillDetail = data;
            this.isShowForm = data;
        });
        this.applicationTransferOwnershipDataSharingService.getIsShowPropertyTaxDetail().subscribe(data => {
            this.isShowPropertyTaxDetail = data;
            this.isShowForm = data;
        });
        this.applicationTransferOwnershipDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
            this.isShowForm = data;
        });
    }

    ngOnDestroy() {
        this.applicationTransferOwnershipDataSharingService.setIsShowWaterBillDetail(false);
        this.applicationTransferOwnershipDataSharingService.setIsShowWaterTaxDetail(false);
        this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(false);
        this.applicationTransferOwnershipDataSharingService.setIsShowPropertyBillDetail(false);
        this.applicationTransferOwnershipDataSharingService.setIsShowPropertyTaxDetail(false);
        this.applicationTransferOwnershipDataSharingService.setIsShowApproval(false);
    }
}