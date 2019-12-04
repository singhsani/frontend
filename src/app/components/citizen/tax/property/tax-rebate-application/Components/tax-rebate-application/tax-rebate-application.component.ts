import { Component, OnInit, OnDestroy, } from '@angular/core';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tax-rebate-application',
    templateUrl: './tax-rebate-application.component.html',
    styleUrls: ['./tax-rebate-application.component.scss']
})

export class TaxRebateApplicationComponent implements OnInit, OnDestroy {
    isShowForm: boolean = false;
    isShowTable: boolean = false;

    constructor(
        private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService) {
    }

    ngOnInit() {
        this.taxRebateApplicationDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.taxRebateApplicationDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
    }

    ngOnDestroy() {
        this.taxRebateApplicationDataSharingService.updatedIsShowForm(false);
        this.taxRebateApplicationDataSharingService.updatedIsShowTable(false);
    }
}
