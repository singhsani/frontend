import { Component, OnInit } from '@angular/core';
import { RefundApplicationDataSharingService } from '../../Services/refund-application-data-sharing.service';

@Component({
    selector: 'app-refund-application',
    templateUrl: './refund-application.component.html'
})

export class RefundApplicationComponent implements OnInit {

    isShowForm: boolean = true;
    isShowApproval: boolean = true;

    constructor(private refundApplicationDataSharingService: RefundApplicationDataSharingService) { }

    ngOnInit() {
        this.refundApplicationDataSharingService.setIsShowForm(true);
        this.refundApplicationDataSharingService.getIsShowForm().subscribe(data => {
            this.isShowForm = data;
        });
        this.refundApplicationDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
        });
        this.refundApplicationDataSharingService.getIsBack().subscribe(data => {
            if (data) {
                this.refundApplicationDataSharingService.setIsShowApproval(false);
                this.refundApplicationDataSharingService.setIsShowForm(true);
            }
        });
    }

}