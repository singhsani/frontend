import { Component, OnInit, ViewChild } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-reconnection.model';
import { ApplicationReconnectionService } from '../../Services/application-reconnection.service';
import { NgForm } from '@angular/forms';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-application-reconnection-form',
    templateUrl: './application-reconnection-form.component.html',
    styleUrls: ['./application-reconnection-form.component.scss']
})

export class ApplicationReconnectionFormComponent implements OnInit {
    
    @ViewChild('stepper') stepper: MatStepper;
    reconnectionDocumentUploadDocs : Array<any> = [];
    reconnectionId : any;
    connectioNo: string;
    dataModel: DataModel
    connectionsModel: ConnectionsModel;
    applicationModel: ApplicationModel;
    isShowSaveButton: boolean = false;
    outstandingDetail: any = {};
   
    constructor(private applicationReconnectionService: ApplicationReconnectionService,
        private alertService:AlertService,
        private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

    ngOnInit() {
        this.dataModel = new DataModel();
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110005";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";

    }
    

    searchByConnectionNo() {
        if (!this.connectioNo || (this.connectioNo && this.connectioNo.toString().trim() == '')) {
            this.alertService.error('Please enter connectio no');
        }
        else {
            if (this.connectioNo) {
                this.connectioNo = this.connectioNo.toString().trim();
                this.applicationReconnectionService.searchByConnection(this.connectioNo.toString().trim()).subscribe(
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
                                this.outstandingDetail=data.body;
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
                            errorMessage= error.error.message;
                        }
                        this.alertService.error(errorMessage);
                    });
            }
        }
    }
    getFormDataDocuments(id : any) {
        this.reconnectionDocumentUploadDocs = [];
        this.applicationReconnectionService.getreconnectionDocUpload(id).subscribe(
          (data) => {
            data.forEach(app => {
              this.reconnectionDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
      onSubmitApproved() {

        this.applicationReconnectionService.submitNewgen(this.reconnectionId).subscribe(
            (data) => {

                this.alertService.success(data.message);
                this.applicationReconnectionDataSharingService.setIsShowApproval(true);

            },
            (error) => {
                this.alertService.error(error.error.message);
            });

    }
    save(formDetail: NgForm) {
        if (formDetail.form.valid) {
            this.dataModel.applicationNumber = this.applicationModel.applicationNumber;
            this.dataModel.connectionDtlId = this.connectionsModel.connectionDetail.connectionDtlId;
            this.applicationReconnectionService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.reconnectionId = data.body.data;
                        this.reconnectionId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(this.dataModel.reconnectionId);
                        this.applicationReconnectionDataSharingService.setApprovalModel(this.dataModel);
                        this.dataModel = new DataModel();
                        this.connectionsModel = new ConnectionsModel();
                        this.connectionsModel.connectionDetail = new ConnectionDetail();
                        this.connectioNo = null;
                        this.isShowSaveButton = false;
                        //this.applicationReconnectionDataSharingService.setIsShowApproval(true);
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
                            errorMessage= error.error.message;
                        }
                        this.alertService.error(errorMessage);
                });
        }

        
    }
    
    onWaterDetailClick() {
        this.applicationReconnectionDataSharingService.setWaterBillDetail(this.outstandingDetail.waterOutstandingDTO.billWiseOutstandings);
        this.applicationReconnectionDataSharingService.setIsShowWaterBillDetail(true);
    }

    onPropertyDetailClick() {
        this.applicationReconnectionDataSharingService.setPropertyDetail(this.outstandingDetail.propertyOutstandings);
        this.applicationReconnectionDataSharingService.setIsShowPropertyDetail(true);
    }

    onBackClick(){
        this.stepper.selectedIndex = 0;
    }
}


