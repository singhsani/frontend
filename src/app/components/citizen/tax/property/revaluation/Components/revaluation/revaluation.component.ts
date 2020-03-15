import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { DataSharingService } from 'src/app/vmcshared/Services/data-sharing.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { RevaluationService } from '../../Services/revaluation.service';

@Component({
    selector: 'app-revaluation',
    templateUrl: './revaluation.component.html',
    styleUrls: ['./revaluation.component.scss']
})

export class RevaluationComponent implements OnInit {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    isRefreshTable: boolean = false;
    subs: Subscription;
    constructor(private revaluationDataSharingService: RevaluationDataSharingService,
        private dataSharingService: DataSharingService,
        private alertService: AlertService,
        private revaluationService: RevaluationService) { }

    ngOnInit() {
        this.subs = this.dataSharingService.getRevaluatioModelFromHearingRemarks().subscribe(data => {
            if (data) {
                this.searchPropertydetail(data);
            }
        });

        this.revaluationDataSharingService.observableIsRefreshTable.subscribe(data => {
            this.isRefreshTable = data;
        });
        this.revaluationDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
            if (this.isRefreshTable) {
                this.revaluationDataSharingService.updatedIsShowTable(true);
            }
        });
        this.revaluationDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
        this.dataSharingService.setRevaluatioModelFromHearingRemarks(null)
        this.revaluationDataSharingService.updatedIsShowForm(false);
        this.revaluationDataSharingService.updatedIsShowTable(false);
    }


    searchPropertydetail(model) {
        var dataModel: any = {};
        this.revaluationService.search({ propertyNo: model.propertyNo }).subscribe(
            (data) => {
                if (data.status === 200) {
                    dataModel = data.body[0];
                    dataModel.propertyVersionId = model.propertyVersionId;
                    dataModel.revaluationId = model.revaluationId;
                    this.revaluationDataSharingService.updateDataSourceOccupier(null);
                    this.revaluationDataSharingService.updatedDataModel(dataModel);
                    this.revaluationDataSharingService.updatedIsRefreshTable(false);
                    this.revaluationDataSharingService.updatedIsShowForm(true);

                }
            },
            (error) => {
                if (error.status === 400) {
                    var errorMessage = '';
                    error.error[0].propertyList.forEach(element => {
                        errorMessage = errorMessage + element + "</br>";
                    });
                    this.alertService.error(errorMessage);
                }
                else {
                    this.alertService.error(error.error.message);
                }
            })

    }
}
