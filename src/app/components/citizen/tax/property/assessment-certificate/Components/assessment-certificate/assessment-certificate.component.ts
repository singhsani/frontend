import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AssessmentCertificateDataSharingService } from '../../Services/assessment-certificate-data-sharing.service';
import { AssessmentCertificateService } from '../../Services/assessment-certificate.service';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';

@Component({
    selector: 'app-assessment-certificate',
    templateUrl: './assessment-certificate.component.html',
    styleUrls: ['./assessment-certificate.component.scss']
})

export class AssessmentCertificateComponent implements OnInit {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    serviceCharge: any = {};
    paymentModel: any = {};
    subscription: Subscription;

    constructor(
        private assessmentCertificateDataSharingService: AssessmentCertificateDataSharingService,
        private paymentDataSharingService: PaymentDataSharingService,
        private assessmentCertificateService: AssessmentCertificateService,
        private alertService: AlertService) {
         }

    ngOnInit() {
        this.assessmentCertificateDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.assessmentCertificateDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
        this.paymentDataSharingService.observableDataModel.subscribe(data => {
            this.serviceCharge = data;
        });
        this.paymentDataSharingService.observablePamentModel.subscribe(data => {
            this.paymentModel = data;
        });
        this.paymentDataSharingService.observableIsCancelForAssessmentCertificate.subscribe(data => {
            if (data) {
                this.assessmentCertificateDataSharingService.updatedIsShowForm(false);
            }
        });
        this.subscription = this.paymentDataSharingService.observableIsPaymentForAssessmentCertificate.subscribe(data => {
            if (data) {
                this.onGenerate();
            }
        });
    }

    ngOnDestroy() {
        this.assessmentCertificateDataSharingService.updatedIsShowForm(false);
        this.assessmentCertificateDataSharingService.updatedIsShowTable(false);
        this.paymentDataSharingService.updatedIsPaymentForAssessmentCertificate(false);
        this.subscription.unsubscribe();
    }

    onGenerate() {
        this.paymentModel.propertyBasicId = this.serviceCharge.propertyBasicId;
        this.paymentModel.numberOfCopies = this.serviceCharge.noofCopies;
        this.paymentModel.occupierId = this.serviceCharge.occupierId;
        this.paymentModel.propertyServiceApplicationId = 3; // TODO
        this.paymentModel.paymentDetail.amount = this.serviceCharge.totalAmount;
        this.paymentModel.applicationNo = this.serviceCharge.applicationNo;
        this.assessmentCertificateService.generateAssessmentCertificate(this.paymentModel).subscribe(
            (data) => {
                this.alertService.success(data.body.message);
                this.paymentDataSharingService.updatedDataModelFileDownload(data.body.data);
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
            });
    }
}
