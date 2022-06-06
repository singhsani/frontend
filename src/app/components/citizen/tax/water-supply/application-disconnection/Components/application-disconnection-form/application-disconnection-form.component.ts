import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationDisconnectionService } from '../../Services/application-disconnection.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ConnectionsModel, DataModel, ConnectionDetail, MeterDetail, ApplicationModel } from '../../Models/application-disconnection.model';
import { Constants } from 'src/app/vmcshared/Constants';
import { NgForm} from '@angular/forms';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatStepper } from '@angular/material';
import { NewWaterConnectionEntryService } from '../../../new-water-connection-entry/Services/new-water-connection-entry.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';

@Component({
    selector: 'app-application-disconnection-form',
    templateUrl: './application-disconnection-form.component.html',
    styleUrls: ['./application-disconnection-form.component.scss']
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
    serviceFormId : String;
    plumberList: any = [];    

    constructor(private commonService: CommonService,
        private alertService: AlertService,
        private applicationDisconnectionService: ApplicationDisconnectionService,
        private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService,
        private newWaterConnectionEntryService: NewWaterConnectionEntryService,
        private newNewWaterConnectionEntryService: NewWaterConnectionEntryService,
        private addressService: ApplicantAddressService,
        private router:Router
    ) { }

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
        this.getPlumberList();

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
                            if (data.body.data.connectionDetail == null) {
                                this.isShowSaveButton = false;
                                this.alertService.info(data.body.message);
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

    getFormDataDocuments(id : any) {
        if(this.applictionDisconnectionDocumentUploadDocs.length == 0){
        this.applictionDisconnectionDocumentUploadDocs = [];
        this.applicationDisconnectionService.getDisconnectionDocUpload(id).subscribe(
          (data) => {
            
            data.forEach(app => {
                // app id  (serviceFormId)
                this.serviceFormId = app.id;
              this.applictionDisconnectionDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
      }

    onSubmitApproved() {
        this.mandatoryFileCheck().then( data => {
            if(data.status) {
                this.applicationDisconnectionService.submitNewgen(this.disconncetionId).subscribe(
                    (data) => {
                        this.alertService.success(data.message);
                        this.applicationDisconnectionDataSharingService.setIsShowApproval(true);
                        this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));

                    },
                    (error) => {
                        this.alertService.error(error.error.message);
                    });
            } else {
                this.alertService.warning("", `Please upload file for "${data.fileName}"`);
				  return
            }
        });
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
            this.dataModel.connectionNumber = this.connectioNo;
            if(this.connectionsModel.meterDetail) {
                this.dataModel.meterDetailId = this.connectionsModel.meterDetail.meterDetailId;
            }
            this.applicationDisconnectionService.save(this.dataModel).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.dataModel.disconncetionId = data.body.data;
                        this.stepper.selectedIndex = 2;
                        this.disconncetionId = data.body.data;
                        this.getFormDataDocuments(this.dataModel.disconncetionId);
                        this.applicationDisconnectionDataSharingService.setApprovalModel(this.dataModel);
                        // this.dataModel = new DataModel();
                        // this.connectionsModel = new ConnectionsModel();
                        // this.connectionsModel.connectionDetail = new ConnectionDetail();
                        // this.connectionsModel.meterDetail = new MeterDetail();
                        // this.connectioNo = null;
                        // this.isShowSaveButton = false;
                        //this.applicationDisconnectionDataSharingService.setIsShowApproval(true);
                    }
                },
                (error) => {
                    var errorMessage = '';
                    if (error.status === 400) {
                        error.error[0].propertyList.forEach(element => {
                            errorMessage = errorMessage + element + "</br>";
                        });
                    } else {
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

    mandatoryFileCheck() {
        return new Promise<any>((resolve, reject) => {
          this.newWaterConnectionEntryService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
            if (uploadedDocs) {
              let tempArray = [];
              uploadedDocs.forEach(element => {
                tempArray.push(element['fieldIdentifier']);
              });
              this.applictionDisconnectionDocumentUploadDocs.forEach(doc => {
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

    getPlumberList() {
        this.newNewWaterConnectionEntryService.getPlumberList({ licenseFor: Constants.ItemCodes.License_Water,activeOnly:true }).subscribe(
          (data) => {
            if (data.status === 200 && data.body.length) {
              this.plumberList = data.body;
            }
          },
          (error) => {
            this.alertService.error(error.error.message);
        });
    }

    moveStepper(index: number) {
        this.stepper.selectedIndex = index;
    }

    stepChangedEvent(event){
        this.moveStepper(1);
    }

    saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
        this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
             (data) => {
               this.commonService.applicationNo = data.body.applicationNo;
               this.moveStepper(1);
             },
             (error) => {
               this.commonService.callErrorResponse(error);
             });
    }
    //Added Clear Button Method
    clear(form : NgForm){
        this.connectioNo = null;
        this.connectionsModel.connectionDetail = new ConnectionDetail();
        this.connectionsModel.address = null;
        this.connectionsModel.propertyDues = null;
        this.connectionsModel.waterDues = null;
        form.resetForm();
    }
}
