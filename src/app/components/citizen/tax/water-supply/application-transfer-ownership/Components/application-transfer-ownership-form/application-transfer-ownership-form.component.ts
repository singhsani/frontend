import { Component, OnInit, ViewChild } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-transfer-ownership.model';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicationTransferOwnershipService } from '../../Services/application-transfer-ownership.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { NgForm } from '@angular/forms';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-application-transfer-ownership-form',
    templateUrl: './application-transfer-ownership-form.component.html'
})

export class ApplicationTransferOwnershipFormComponent implements OnInit {

    @ViewChild('stepper') stepper: MatStepper;
    applictionTrasferOwnDocumentUploadDocs: Array<any> = [];
    reasonList = [];
    connectioNo: string;
    dataModel: DataModel
    connectionsModel: ConnectionsModel;
    applicationModel: ApplicationModel;
    isShowSaveButton: boolean = false;
    transferOfOwnershipId: any;

    outstandingDetail: any = {};

    constructor(private commonService: CommonService,
        private alertService: AlertService,
        private applicationTransferOwnershipService: ApplicationTransferOwnershipService,
        private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService) { }


    ngOnInit() {
        this.dataModel = new DataModel();
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110003";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";

        this.getLookups();


    }

    getLookups() {
        let lookupcode = `lookup_codes=${Constants.LookupCodes.Water_Transfer_Reason}`;
        this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
            this.reasonList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Water_Transfer_Reason))[0].items;
        });
    }

    searchByConnectionNo() {
        if (!this.connectioNo || (this.connectioNo && this.connectioNo.toString().trim() == '')) {
            this.alertService.error('Please enter Connectio No');
        }
        else {
            if (this.connectioNo) {
                this.connectioNo = this.connectioNo.toString().trim();
                this.applicationTransferOwnershipService.searchByConnection(this.connectioNo.toString().trim()).subscribe(
                    (data) => {
                        if (data.status === 200) {
                            if (data.body.connectionDetail == null) {
                                this.isShowSaveButton = false;
                                this.alertService.info('No data found!');
                                this.connectionsModel = new ConnectionsModel();
                                this.connectionsModel.connectionDetail = new ConnectionDetail();
                                this.dataModel = new DataModel();
                            }
                            else {
                                this.isShowSaveButton = true;
                                this.connectionsModel = data.body;
                                this.outstandingDetail = data.body;
                            }
                        }
                    },
                    (error) => {
                        var errorMessage = '';
                        if (error.status === 400) {

                            error.error[0].propertyList.forEach(element => {
                                errorMessage = errorMessage + element + "</br>";
                            });
                        }
                        else {
                            errorMessage = error.error.message;
                        }
                        this.alertService.error(errorMessage);
                    });
            }
        }
    }

    save(formDetail: NgForm) {
        if (formDetail.form.valid) {
            this.dataModel.applicationNumber = this.applicationModel.applicationNumber;
            this.dataModel.connectionDtlId = this.connectionsModel.connectionDetail.connectionDtlId;
            this.applicationTransferOwnershipService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.transferOfOwnershipId = data.body.data;
                        this.transferOfOwnershipId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(this.dataModel.transferOfOwnershipId);
                        this.applicationTransferOwnershipDataSharingService.setApprovalModel(this.dataModel);
                        this.dataModel = new DataModel();
                        this.connectionsModel = new ConnectionsModel();
                        this.connectionsModel.connectionDetail = new ConnectionDetail();
                        this.connectioNo = null;
                        this.isShowSaveButton = false;
                        //this.applicationTransferOwnershipDataSharingService.setIsShowApproval(true);
                    }
                },
                (error) => {
                    var errorMessage = '';
                    if (error.status === 400) {
                        error.error[0].propertyList.forEach(element => {
                            errorMessage = errorMessage + element + "</br>";
                        });
                    }
                    else {
                        errorMessage = error.error.message;
                    }
                    this.alertService.error(errorMessage);
                });
        }
    }
    onSubmitApproved() {

        this.applicationTransferOwnershipService.submitNewgen(this.transferOfOwnershipId).subscribe(
            (data) => {

                this.alertService.success(data.message);
                this.applicationTransferOwnershipDataSharingService.setIsShowApproval(true);

            },
            (error) => {
                this.alertService.error(error.error.message);
            });

    }
    getFormDataDocuments(id: any) {
        this.applictionTrasferOwnDocumentUploadDocs = [];
        this.applicationTransferOwnershipService.getTransferDocUpload(id).subscribe(
            (data) => {
                data.forEach(app => {
                    this.applictionTrasferOwnDocumentUploadDocs.push(app);
                });

            },
            (error) => {

            });
    }


    onWaterDetailClick() {
        this.applicationTransferOwnershipDataSharingService.setWaterBillDetail(this.outstandingDetail.waterOutstandingDTO.billWiseOutstandings);
        this.applicationTransferOwnershipDataSharingService.setIsShowWaterBillDetail(true);
    }

    onPropertyDetailClick() {
        this.applicationTransferOwnershipDataSharingService.setPropertyDetail(this.outstandingDetail.propertyOutstandings);
        this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(true);
    }
}


