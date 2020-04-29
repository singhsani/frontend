import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationDisconnectionService } from '../../Services/application-disconnection.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ConnectionsModel, DataModel, ConnectionDetail, MeterDetail, ApplicationModel } from '../../Models/application-disconnection.model';
import { Constants } from 'src/app/vmcshared/Constants';
import { NgForm } from '@angular/forms';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-application-disconnection-form',
    templateUrl: './application-disconnection-form.component.html'
})

export class ApplicationDisconnectionFormComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    applictionDisconnectionDocumentUploadDocs : Array<any> = [];
    reasonList = [];
    disconnectionTypeList = [];
    connectioNo: string;
    dataModel: DataModel
    connectionsModel: ConnectionsModel;
    applicationModel: ApplicationModel;
    isShowSaveButton: boolean = false;
    outstandingDetail: any = {};
    disconncetionId : any ;

    constructor(private commonService: CommonService,
        private alertService: AlertService,
        private applicationDisconnectionService: ApplicationDisconnectionService,
        private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService) { }

    ngOnInit() {
        this.dataModel = new DataModel();
        this.connectionsModel = new ConnectionsModel();
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        this.connectionsModel.meterDetail = new MeterDetail();

        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110002";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";

        this.getLookups();

    }

    getLookups() {
        let lookupcode = `lookup_codes=${Constants.LookupCodes.Disconnection_Type}&lookup_codes=${Constants.LookupCodes.Reason_for_Disconnection}`;
        this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
            this.reasonList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Reason_for_Disconnection))[0].items;
            this.disconnectionTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Disconnection_Type))[0].items;
        });
    }

    searchByConnectionNo() {
        if (!this.connectioNo || (this.connectioNo && this.connectioNo.toString().trim() == '')) {
            this.alertService.error('Please enter Connectio No');
        }
        else {
            if (this.connectioNo) {
                this.connectioNo = this.connectioNo.toString().trim();
                this.applicationDisconnectionService.searchByConnection(this.connectioNo.toString().trim()).subscribe(
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

    getFormDataDocuments(id : any) {
        this.applictionDisconnectionDocumentUploadDocs = [];
        this.applicationDisconnectionService.getDisconnectionDocUpload(id).subscribe(
          (data) => {
            data.forEach(app => {
              this.applictionDisconnectionDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }

onSubmitApproved(){
         
    this.applicationDisconnectionService.submitNewgen(this.disconncetionId).subscribe(
        (data) => {
          
            this.alertService.success(data.message);
            this.applicationDisconnectionDataSharingService.setIsShowApproval(true);
          
        },
        (error) => {
          this.alertService.error(error.error.message);
        });
     
      }  
    save(formDetail: NgForm) {
        if (formDetail.form.valid) {
            this.dataModel.applicationNumber = this.applicationModel.applicationNumber;
            this.dataModel.connectionDtlId = this.connectionsModel.connectionDetail.connectionDtlId;
            if(this.connectionsModel.meterDetail) {
                this.dataModel.meterDetailId = this.connectionsModel.meterDetail.meterDetailId;
            }
            this.applicationDisconnectionService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.disconncetionId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.disconncetionId = data.body.data;
                        this.getFormDataDocuments(this.dataModel.disconncetionId);
                        this.applicationDisconnectionDataSharingService.setApprovalModel(this.dataModel);
                        this.dataModel = new DataModel();
                        this.connectionsModel = new ConnectionsModel();
                        this.connectionsModel.connectionDetail = new ConnectionDetail();
                        this.connectionsModel.meterDetail = new MeterDetail();
                        this.connectioNo = null;
                        this.isShowSaveButton = false;
                        //this.applicationDisconnectionDataSharingService.setIsShowApproval(true);
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
    
    onWaterDetailClick() {
        this.applicationDisconnectionDataSharingService.setWaterBillDetail(this.outstandingDetail.waterOutstandingDTO.billWiseOutstandings);
        this.applicationDisconnectionDataSharingService.setIsShowWaterBillDetail(true);
    }

    onPropertyDetailClick() {
        this.applicationDisconnectionDataSharingService.setPropertyDetail(this.outstandingDetail.propertyOutstandings);
        this.applicationDisconnectionDataSharingService.setIsShowPropertyDetail(true);
    }
}
