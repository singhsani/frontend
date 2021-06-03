import { Component, OnInit, ViewChild } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-change-usage.model';
import { ApplicationChangeUsageService } from '../../Services/application-change-usage.service';
import { NgForm } from '@angular/forms';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-application-change-usage-form',
    templateUrl: './application-change-usage-form.component.html',
    styleUrls: ['./application-change-usage-form.component.scss']
})

export class ApplicationChangeUsageFormComponent implements OnInit {
    errorMessage = Constants.errorMessage;
    connectionSubUsageList = [];
    connectionUsageList = [];
    connectioNo: string;
    dataModel: DataModel
    connectionsModel: ConnectionsModel;
    applicationModel: ApplicationModel;
    isShowSaveButton: boolean = false;

    @ViewChild('stepper') stepper: MatStepper;
    changeOfUsageDocumentUploadDocs : Array<any> = [];
    changeOfUsageId : any;
    outstandingDetail: any = {};

    constructor(public commonService: CommonService,
        private alertService: AlertService,
        private applicationChangeUsageService: ApplicationChangeUsageService,
        private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

    ngOnInit() {
        this.dataModel = new DataModel();
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110004";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";

        this.getUsageList();
    }

    onChangedConnectionUsage(val) {
        this.dataModel.subusageId = null;
        this.connectionSubUsageList = [];
        if (val)
            this.getSubUsageList(val);
    }

    getUsageList() {
        this.applicationChangeUsageService.getUsageList({active:true}).subscribe(
            (data) => {
                if (data.status === 200 && data.body.length) {
                    this.connectionUsageList = data.body;
                }
            },
            (error) => {
                this.alertService.error(error.error.message);
            }
        )
    }

    getSubUsageList(usageMasterId) {
        var postToData = {
            usageMasterId: usageMasterId,
            active: true
        }
        this.applicationChangeUsageService.getSubUsageList(postToData).subscribe(
            (data) => {
                if (data.status === 200 && data.body.length) {
                    this.connectionSubUsageList = data.body;
                }
            },
            (error) => {
                this.alertService.error(error.error.message);
            }
        )
    }

    searchByConnectionNo() {
        if (!this.connectioNo || (this.connectioNo && this.connectioNo.toString().trim() == '')) {
            this.alertService.error("Please enter Connectio No");
        }
        else {
            if (this.connectioNo) {
                this.connectioNo = this.connectioNo.toString().trim();
                this.applicationChangeUsageService.searchByConnection(this.connectioNo.toString().trim()).subscribe(
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
            this.dataModel.changedFromDate =this.commonService.getPayloadDate(this.dataModel.changedFromDate);
            this.applicationChangeUsageService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.changeOfUsageId = data.body.data;
                        this.changeOfUsageId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(this.dataModel.changeOfUsageId);
                        this.applicationChangeUsageDataSharingService.setApprovalModel(this.dataModel);

                        // this.dataModel = new DataModel();
                        // this.connectionsModel = new ConnectionsModel();
                        // this.connectionsModel.connectionDetail = new ConnectionDetail();
                        // this.connectioNo = null;
                        // this.isShowSaveButton = false;
                        //this.applicationChangeUsageDataSharingService.setIsShowApproval(true);
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

        this.applicationChangeUsageService.submitNewgen(this.changeOfUsageId).subscribe(
            (data) => {

                this.alertService.success(data.message);
                this.applicationChangeUsageDataSharingService.setIsShowApproval(true);

            },
            (error) => {
                this.alertService.error(error.error.message);
            });

    }
    getFormDataDocuments(id : any) {
        this.changeOfUsageDocumentUploadDocs = [];
        this.applicationChangeUsageService.getchangeOfUsageIdDocUpload(id).subscribe(
          (data) => {
            data.forEach(app => {
              this.changeOfUsageDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }

    onWaterDetailClick() {
        this.applicationChangeUsageDataSharingService.setWaterBillDetail(this.outstandingDetail.waterOutstandingDTO.billWiseOutstandings);
        this.applicationChangeUsageDataSharingService.setIsShowWaterBillDetail(true);
    }

    onPropertyDetailClick() {
        this.applicationChangeUsageDataSharingService.setPropertyDetail(this.outstandingDetail.propertyOutstandings);
        this.applicationChangeUsageDataSharingService.setIsShowPropertyDetail(true);
    }

    onBackClick(){
        this.stepper.selectedIndex = 0;
    }

    stepChanged(event, stepper){
        stepper.selected.interacted = false;
    }
}


