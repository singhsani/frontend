import { Component, OnInit, ViewChild } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-transfer-ownership.model';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicationTransferOwnershipService } from '../../Services/application-transfer-ownership.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { NgForm } from '@angular/forms';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';
import { CommonService as SharedCommonService } from 'src/app/shared/services/common.service';

@Component({
    selector: 'app-application-transfer-ownership-form',
    templateUrl: './application-transfer-ownership-form.component.html',
    styleUrls: ['./application-transfer-ownership-form.component.scss']
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

    serviceFormId: any;

    constructor(private commonService: CommonService,
        private alertService: AlertService,
        private applicationTransferOwnershipService: ApplicationTransferOwnershipService,
        private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService,
        private sharedCommonService: SharedCommonService) { }


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
                            if (data.body.data.connectionDetail == null) {
                                this.isShowSaveButton = false;
                                this.alertService.info('No data found!');
                                this.connectionsModel = new ConnectionsModel();
                                this.connectionsModel.connectionDetail = new ConnectionDetail();
                                this.dataModel = new DataModel();
                            }
                            else {
                                this.isShowSaveButton = true;
                                this.connectionsModel = data.body.data;
                                this.outstandingDetail = data.body.data;
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

    isDueAmount(): boolean {
        if (this.connectionsModel.hasOwnProperty('propertyDues') && this.connectionsModel.hasOwnProperty('waterDues')) {
            return this.connectionsModel.propertyDues + this.connectionsModel.waterDues !== 0;
        }
    }

    save(formDetail: NgForm) {
        if (formDetail.form.valid) {

            if (this.isDueAmount()) {
                this.alertService.warning('Can not proceed further due to remaining outstanding payment.' +
                    ' Please complete payment of remaining outstanding amount.');
                return;
            }

            this.dataModel.applicationNumber = this.applicationModel.applicationNumber;
            this.dataModel.connectionDtlId = this.connectionsModel.connectionDetail.connectionDtlId;
            this.dataModel.waterConnectionNumber = this.connectioNo;
            this.applicationTransferOwnershipService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.transferOfOwnershipId = data.body.data;
                        this.transferOfOwnershipId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(this.dataModel.transferOfOwnershipId);
                        this.applicationTransferOwnershipDataSharingService.setApprovalModel(this.dataModel);
                        // this.dataModel = new DataModel();
                        // this.connectionsModel = new ConnectionsModel();
                        // this.connectionsModel.connectionDetail = new ConnectionDetail();
                        // this.connectioNo = null;
                        // this.isShowSaveButton = false;
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

        this.mandatoryFileCheck().then(data => {


            if (data.status) {

                this.applicationTransferOwnershipService.submitNewgen(this.transferOfOwnershipId).subscribe(
                    (data) => {

                        this.alertService.success(data.message);
                        this.applicationTransferOwnershipDataSharingService.setIsShowApproval(true);

                    },
                    (error) => {
                        this.alertService.error(error.error.message);
                    });
            } else {
                this.sharedCommonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
                return
            }
        })

    }
    getFormDataDocuments(id: any) {
        if (this.applictionTrasferOwnDocumentUploadDocs.length == 0) {
            this.applictionTrasferOwnDocumentUploadDocs = [];
            this.applicationTransferOwnershipService.getTransferDocUpload(id).subscribe(
                (data) => {
                    this.serviceFormId = data[0].id;
                    data.forEach(app => {
                        this.applictionTrasferOwnDocumentUploadDocs.push(app);
                    });

                },
                (error) => {

                });
        }
    }


    onWaterDetailClick() {
        this.applicationTransferOwnershipDataSharingService.setWaterBillDetail(this.outstandingDetail.waterOutstandingDTO.billWiseOutstandings);
        this.applicationTransferOwnershipDataSharingService.setIsShowWaterBillDetail(true);
    }

    onPropertyDetailClick() {
        this.applicationTransferOwnershipDataSharingService.setPropertyDetail(this.outstandingDetail.propertyOutstandings);
        this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(true);
    }

    mandatoryFileCheck() {
        return new Promise<any>((resolve, reject) => {
            this.applicationTransferOwnershipService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
                console.log("Upload docs", uploadedDocs);
                if (uploadedDocs) {
                    let tempArray = [];
                    uploadedDocs.forEach(element => {
                        tempArray.push(element['fieldIdentifier']);
                    });
                    this.applictionTrasferOwnDocumentUploadDocs.forEach(doc => {
                        if (doc.mandatory && tempArray.indexOf(doc.fieldIdentifier) === -1) {
                            resolve({ fileName: doc.documentLabelEn, status: false })
                        }
                    });
                    resolve({ fileName: "", status: true });
                } else {
                    resolve({ fileName: "", status: true })
                }
            })
        })
    }

    onBackClick() {
        this.stepper.selectedIndex = 0;
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true
    }

    clear(aForm: NgForm) {
        this.connectioNo = '';
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        aForm.resetForm();
    }
}


