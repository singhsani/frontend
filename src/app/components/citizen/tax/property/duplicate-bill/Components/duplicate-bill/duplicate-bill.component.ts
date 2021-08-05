import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { DuplicateBillDataSharingService } from '../../Services/duplicate-bill-data-sharing.service';
import { Subscription } from 'rxjs';
import { DuplicateBillService } from '../../Services/duplicate-bill.service';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import swal from 'sweetalert2';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { MatStepper } from '@angular/material';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';

@Component({
    selector: 'app-duplicate-bill',
    templateUrl: './duplicate-bill.component.html',
    styleUrls: ['./duplicate-bill.component.scss']
})

export class DuplicateBillComponent implements OnInit {
    isShowForm: boolean = false;
    isShowTable: boolean = false;
    serviceCharge: any = {};
    paymentModel: any = {};
    subscription: Subscription;
    @ViewChild('stepper') stepper: MatStepper;
    constructor(
        private duplicateBillDataSharingService: DuplicateBillDataSharingService,
        private paymentDataSharingService: PaymentDataSharingService,
        private duplicateBillService: DuplicateBillService,
        private alertService: AlertService,
        private commonService:CommonService,
        private addressService: ApplicantAddressService) { }

    ngOnInit() {
        this.duplicateBillDataSharingService.observableIsShowForm.subscribe(data => {
            this.isShowForm = data;
            this.isShowTable = !data;
        });
        this.duplicateBillDataSharingService.observableIsShowTable.subscribe(data => {
            this.isShowTable = data;
        });
        this.paymentDataSharingService.observableDataModel.subscribe(data => {
            this.serviceCharge = data;
        });
        this.paymentDataSharingService.observablePamentModel.subscribe(data => {
            this.paymentModel = data;
        });
        this.paymentDataSharingService.observableIsCancelForDuplicateBill.subscribe(data => {
            if (data) {
                this.duplicateBillDataSharingService.updatedIsShowForm(false);
            }
        });
        this.subscription = this.paymentDataSharingService.observableIsPaymentForDuplicateBill.subscribe(data => {
            if (data) {
                this.onGenerate();
            }
        });
    }

    ngOnDestroy() {
        this.duplicateBillDataSharingService.updatedIsShowForm(false);
        this.paymentDataSharingService.updatedIsPaymentForDuplicateBill(false);
        this.duplicateBillDataSharingService.updatedIsShowTable(false);
        this.subscription.unsubscribe();
    }

    onGenerate() {
        this.paymentModel.billTypeLookupId = this.serviceCharge.billTypeLookupId;
        this.paymentModel.numberOfCopies = this.serviceCharge.noofCopies;
        this.paymentModel.occupierId = this.serviceCharge.occupierId;
        this.paymentModel.propertyBasicId = this.serviceCharge.propertyBasicId;
        this.paymentModel.propertyServiceApplicationId = 3; // TODO
        this.paymentModel.paymentDetail.amount = this.serviceCharge.totalAmount;
        this.paymentModel.applicationNo = this.serviceCharge.applicationNo;
        this.duplicateBillService.generateBill(this.paymentModel).subscribe(
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
               debugger
               this.moveStepper(1);
             },
             (error) => {
               this.commonService.callErrorResponse(error);
             });
       }

}
