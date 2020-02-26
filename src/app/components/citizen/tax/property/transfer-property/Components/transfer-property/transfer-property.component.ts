import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';

@Component({
    selector: 'app-transfer-property',
    templateUrl: './transfer-property.component.html',
    styleUrls: ['./transfer-property.component.scss']
})

export class TransferPropertyComponent implements OnInit {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    isRefreshTable: boolean = false;
    constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService) { }

    ngOnInit() {
        this.transferPropertyDataSharingService.observableIsRefreshTable.subscribe(data => {
            this.isRefreshTable = data;
        });
        this.transferPropertyDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
            if (this.isRefreshTable) {
                this.transferPropertyDataSharingService.updatedIsShowTable(true);
            }
        });
        this.transferPropertyDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
    }
    
    ngOnDestroy() {
        this.transferPropertyDataSharingService.updatedIsShowForm(false);
        this.transferPropertyDataSharingService.updatedIsShowTable(false);
    }
}
