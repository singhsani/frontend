import { Component, OnInit, OnDestroy, } from '@angular/core';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/vmcshared/Services/data-sharing.service';
import { VacancyPremiseCertificateService } from '../../Services/vacancy-premise-certificate.service';

@Component({
    selector: 'app-vacancy-premise-certificate',
    templateUrl: './vacancy-premise-certificate.component.html',
    styleUrls: ['./vacancy-premise-certificate.component.scss']
})

export class VacancyPremiseCertificateComponent implements OnInit,OnDestroy {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    formId : number;
    constructor(
        private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService,
        private route: ActivatedRoute,
        private propertyEntryAddDataSharingService : DataSharingService,
        private vacancyPremiseCertificateService : VacancyPremiseCertificateService) {
    }

    ngOnInit() {
        this.vacancyPremiseCertificateDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.vacancyPremiseCertificateDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
       
        this.route.paramMap.subscribe(param => {
            this.formId = Number(param.get('id'));
            if (this.formId != 0) {
                this.vacancyPremiseCertificateService.getVersionById(this.formId).subscribe(res => {
                    this.isShowForm = true;
                    this.isShowTable = false;
                    res.body.serviceApplicationId = this.formId;
                    this.vacancyPremiseCertificateDataSharingService.updatedDataModel(res.body);
                    this.propertyEntryAddDataSharingService.setApplicantDetailsEditModel(res.body.applicantDetail);
                })
            }
        });
        

    }

    ngOnDestroy(){
        this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(false);
      this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(false);
    }
}
