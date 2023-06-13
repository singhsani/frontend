import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/vmcshared/Services/data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';

@Component({
    selector: 'app-transfer-property',
    templateUrl: './transfer-property.component.html',
    styleUrls: ['./transfer-property.component.scss']
})

export class TransferPropertyComponent implements OnInit {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    isRefreshTable: boolean = false;
    formId : number = 0;
    constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
        private route : ActivatedRoute,
        private propertyEntryAddDataSharingService : DataSharingService,
        private transferPropertyService : TransferPropertyService) { }

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

        this.route.paramMap.subscribe(param => {
            this.formId = Number(param.get('id'));
            if (this.formId != 0) {
                this.transferPropertyService.getVersionById(this.formId).subscribe(res => {
                    this.isShowForm = true;
                    this.isShowTable = false;
                    res.body.serviceApplicationId = this.formId;
                    this.transferPropertyDataSharingService.setPropertyEditModel(res.body);
                    this.propertyEntryAddDataSharingService.setApplicantDetailsEditModel(res.body);
                })
            }
        });
    }
    
    ngOnDestroy() {
        this.transferPropertyDataSharingService.updatedIsShowForm(false);
        this.transferPropertyDataSharingService.updatedIsShowTable(false);
    }
}
