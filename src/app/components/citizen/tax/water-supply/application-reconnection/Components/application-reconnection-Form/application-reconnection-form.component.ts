import { Component, OnInit, ViewChild } from '@angular/core';
import { DataModel, ConnectionsModel, ApplicationModel, ConnectionDetail } from '../../Models/application-reconnection.model';
import { ApplicationReconnectionService } from '../../Services/application-reconnection.service';
import { NgForm } from '@angular/forms';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';
import { Constants } from 'src/app/vmcshared/Constants';
import { NewWaterConnectionEntryService } from '../../../new-water-connection-entry/Services/new-water-connection-entry.service';

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
    plumberList: any = [];

    constructor(private applicationReconnectionService: ApplicationReconnectionService,
        private alertService:AlertService,
        private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService,
         private newNewWaterConnectionEntryService: NewWaterConnectionEntryService) { }

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
        this.getPlumberList();
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
                                this.connectionsModel.address = data.body.propertyDetails ?data.body.propertyDetails[0].address:this.connectionsModel.address
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
        if(this.reconnectionDocumentUploadDocs.length == 0){
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
        if (formDetail.form.valid && this.dataModel.plumberId) { 
           if((this.connectionsModel.waterDues + this.connectionsModel.propertyDues) != 0){
            this.alertService.warning('Can not proceed further due to remaining outstanding payment.' +
            ' Please complete payment of remaining outstanding amount');
            return;
           }
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
                        // this.dataModel = new DataModel();
                        // this.connectionsModel = new ConnectionsModel();
                        // this.connectionsModel.connectionDetail = new ConnectionDetail();
                        // this.connectioNo = null;
                        // this.isShowSaveButton = false;
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
    getPlumberList() {
        this.newNewWaterConnectionEntryService.getPlumberList({ licenseFor: Constants.ItemCodes.License_Water,activeOnly:true }).subscribe(
          (data) => {
            if (data.status === 200 && data.body.length) {
              this.plumberList = data.body;
            }
          },
          (error) => {
            this.alertService.error(error.error.message);
          })
      }
      clear(aForm: NgForm) {
        this.connectioNo = '';
        this.dataModel = new DataModel();
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        aForm.resetForm();
    }
}


