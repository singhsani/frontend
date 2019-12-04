import { Component, OnInit, OnDestroy, } from '@angular/core';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-vacancy-premise-certificate',
    templateUrl: './vacancy-premise-certificate.component.html',
    styleUrls: ['./vacancy-premise-certificate.component.scss']
})

export class VacancyPremiseCertificateComponent implements OnInit,OnDestroy {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    
    constructor(
        private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService) {
    }

    ngOnInit() {
        this.vacancyPremiseCertificateDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.vacancyPremiseCertificateDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
    }

    ngOnDestroy(){
        this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(false);
      this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(false);
    }
}
