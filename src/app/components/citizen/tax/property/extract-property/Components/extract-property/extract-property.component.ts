import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ExtractPropertyDataSharingService } from '../../Services/extract-property-data-sharing.service';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { ExtractPropertyService } from '../../Services/extract-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { MatStepper } from '@angular/material';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';

@Component({
    selector: 'app-extract-property',
    templateUrl: './extract-property.component.html',
    styleUrls: ['./extract-property.component.scss']
})

export class ExtractPropertyComponent implements OnInit {
   
    @ViewChild('stepper') stepper: MatStepper;
   
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    serviceCharge: any = {};
    paymentModel: any = {};
    subscription: Subscription;

    constructor(
        private extractPropertyDataSharingService: ExtractPropertyDataSharingService,
        private paymentDataSharingService: PaymentDataSharingService,
        private extractPropertyService: ExtractPropertyService,
        private alertService: AlertService,
        private commonService:CommonService,
        private addressService: ApplicantAddressService) {
    }

    ngOnInit() {
        this.extractPropertyDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.extractPropertyDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
        this.paymentDataSharingService.observableDataModel.subscribe(data => {
            this.serviceCharge = data;
        });
        this.paymentDataSharingService.observablePamentModel.subscribe(data => {
            this.paymentModel = data;
        });
        this.paymentDataSharingService.observableIsCancelForExtractProperty.subscribe(data => {
            if (data) {
                this.extractPropertyDataSharingService.updatedIsShowForm(false);
            }
        });
        this.subscription = this.paymentDataSharingService.observableIsPaymentForExtractProperty.subscribe(data => {
            if (data) {
                this.onGenerate();
            }
        });
    }

    ngOnDestroy() {
        this.extractPropertyDataSharingService.updatedIsShowForm(false);
        this.extractPropertyDataSharingService.updatedIsShowTable(false);
        this.paymentDataSharingService.updatedIsPaymentForExtractProperty(false);
        this.subscription.unsubscribe();
    }

    onGenerate() {
        this.paymentModel.asOnDate = this.commonService.getPayloadDate(this.serviceCharge.asonDate);
        this.paymentModel.numberOfCopies = this.serviceCharge.noofCopies;
        this.paymentModel.occupierId = this.serviceCharge.occupierId;
        this.paymentModel.propertyServiceApplicationId = 3; // TODO
        this.paymentModel.paymentDetail.amount = this.serviceCharge.totalAmount;
        this.paymentModel.applicationNo = this.serviceCharge.applicationNo;
        this.extractPropertyService.generatePropertyExtract(this.paymentModel).subscribe(
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
            })
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
