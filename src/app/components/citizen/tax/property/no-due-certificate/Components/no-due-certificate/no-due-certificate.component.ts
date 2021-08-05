import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { NoDueCertificateDataSharingService } from '../../Services/no-due-certificate-data-sharing.service';
import { Subscription } from 'rxjs';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { NoDueCertificateService } from '../../Services/no-due-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { MatStepper } from '@angular/material';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';

@Component({
    selector: 'app-no-due-certificate',
    templateUrl: './no-due-certificate.component.html',
    styleUrls: ['./no-due-certificate.component.scss']
})

export class NoDueCertificateComponent implements OnInit {

    @ViewChild('stepper') stepper: MatStepper;

    isShowForm: boolean = false;
    isShowTable: boolean = false;
    serviceCharge: any = {};
    paymentModel: any = {};
    subscription: Subscription;
    constructor(
        private noDueCertificateDataSharingService: NoDueCertificateDataSharingService,
        private paymentDataSharingService: PaymentDataSharingService,
        private noDueCertificateService: NoDueCertificateService,
        private alertService: AlertService,
        private commonService : CommonService,
        private addressService : ApplicantAddressService) { }

    ngOnInit() {
        this.noDueCertificateDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.noDueCertificateDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
        this.paymentDataSharingService.observableDataModel.subscribe(data => {
            this.serviceCharge = data;
        });
        this.paymentDataSharingService.observablePamentModel.subscribe(data => {
            this.paymentModel = data;
        });
        this.paymentDataSharingService.observableIsCancelForNoDueCertificate.subscribe(data => {
            if (data) {
                this.noDueCertificateDataSharingService.updatedIsShowForm(false);
            }
        });
        this.subscription = this.paymentDataSharingService.observableIsPaymentForNoDueCertificate.subscribe(data => {
            if (data) {
                this.onGenerate();
            }
        });
    }

    ngOnDestroy() {
        this.noDueCertificateDataSharingService.updatedIsShowForm(false);
        this.noDueCertificateDataSharingService.updatedIsShowTable(false);
        this.paymentDataSharingService.updatedIsPaymentForNoDueCertificate(false);
        this.subscription.unsubscribe();
    }

    onGenerate() {
        this.paymentModel.outstandingTax = this.serviceCharge.outstandingTax;
        this.paymentModel.numberOfCopies = this.serviceCharge.noofCopies;
        this.paymentModel.occupierId = this.serviceCharge.occupierId;
        this.paymentModel.propertyBasicId = this.serviceCharge.propertyBasicId;
        this.paymentModel.propertyServiceApplicationId = 3; // TODO
        this.paymentModel.paymentDetail.amount = this.serviceCharge.totalAmount;
        this.paymentModel.applicationNo = this.serviceCharge.applicationNo;
        this.noDueCertificateService.generateNoDueCertificate(this.paymentModel).subscribe(
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


    stepChanged(event, stepper){
        stepper.selected.interacted = false;
    }

    stepChangedEvent(event){
        this.moveStepper(1);
    }

    moveStepper(index: number) {
        this.stepper.selectedIndex = index;
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
         this.moveStepper(0);
        });
    }

    saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
        this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
             (data) => {
               this.commonService.applicationNo = data.body.applicationNo;
               this.commonService.serviceFormId = data.body.id;
               this.moveStepper(1);
             },
             (error) => {
               this.commonService.callErrorResponse(error);
             });
       }
}
