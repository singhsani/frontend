import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlumberLicenseModel, ApplicationModel } from '../../Models/new-plumber-license.model';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewPlumberLicenseService } from '../../Services/new-plumber-license.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NewPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';
import { MatStepper } from '@angular/material';
import { C } from '@angular/core/src/render3';
import { CommonService as CommonService2} from 'src/app/shared/services/common.service';


@Component({
    selector: 'app-new-plumber-license-form',
    templateUrl: './new-plumber-license-form.component.html',
    styleUrls: ['./new-plumber-license-form.component.scss']
})

export class NewPlumberLicenseFormComponent implements OnInit {
    errorMessage = Constants.errorMessage;
    model: PlumberLicenseModel;
    applicationModel: ApplicationModel;
    serviceFormId : String;

    @ViewChild('stepper') stepper: MatStepper;
    plumberLicenseDocumentUploadDocs : Array<any> = [];
    plumberLicenseId = 0;
    
    licenseForList = [];
    educationalQualificationList = [];
    minDate = new Date();
    maxDate = new Date();
    currentYear: any = {};
    constructor(private commonService: CommonService,
        private newPlumberLicenseService: NewPlumberLicenseService,
        private newPlumberLicenseDataSharingService: NewPlumberLicenseDataSharingService,
        private alertService: AlertService,
        private commonService2: CommonService2) { }

    ngOnInit() {
        this.model = new PlumberLicenseModel();
        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110006";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";

        this.getLookups();

        this.commonService.getCurrentfinancialyear().subscribe(
            (data) => {
                this.currentYear = data.body;
                this.model.licenseValidTill = this.currentYear.endDate;
            }
        );
    }

    getLookups() {
        let lookupcode = `lookup_codes=${Constants.LookupCodes.License_For}&lookup_codes=${Constants.LookupCodes.Education_Qualification}`
        this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
            this.licenseForList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.License_For))[0].items;
            this.educationalQualificationList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Education_Qualification))[0].items;
        });
    }

    onClickIsApplicationisConnectionOwner(event) {
        if (event.checked) {
            this.model.mobileNo1 = this.applicationModel.mobileNumber;
            this.model.nameOfApplicant = this.applicationModel.applicantName;
            this.model.aadharNo = this.applicationModel.aadharNumber;
        }
    }

    isValidationMinMaxAge = true;
    ValidateDOB(dateString) {
        var dtDOB = new Date(dateString);
        var dtCurrent = new Date();
        if (dtCurrent.getFullYear() - dtDOB.getFullYear() < 18) {
            return false;
        }

        if (dtCurrent.getFullYear() - dtDOB.getFullYear() == 18) {
            if (dtCurrent.getMonth() < dtDOB.getMonth()) {
                return false;
            }
            if (dtCurrent.getMonth() == dtDOB.getMonth()) {
                if (dtCurrent.getDate() < dtDOB.getDate()) {
                    this.isValidationMinMaxAge = true;
                    return false;
                }
            }
        }

        if (dtCurrent.getFullYear() - dtDOB.getFullYear() > 80) {
            return false;
        }

        if (dtCurrent.getFullYear() - dtDOB.getFullYear() == 80) {
            if (dtCurrent.getMonth() > dtDOB.getMonth()) {
                return false;
            }
            if (dtCurrent.getMonth() == dtDOB.getMonth()) {
                if (dtCurrent.getDate() > dtDOB.getDate()) {
                    this.isValidationMinMaxAge = true;
                    return false;
                }
            }
        }
        return true;

    }

    onDOBChange(event, control) {
        this.isValidationMinMaxAge = true;
        if (event.value) {
            control.control.status = 'VALID';
            this.isValidationMinMaxAge = this.ValidateDOB(this.commonService.getPayloadDate(this.model.birthdate));
            if (!this.isValidationMinMaxAge)
                control.control.status = 'INVALID';
        }
    }

    clear() {
        this.model = new PlumberLicenseModel();
        this.commonService.getCurrentfinancialyear().subscribe(
            (data) => {
                this.currentYear = data.body;
                this.model.licenseValidTill = this.currentYear.endDate;
            }
        );
    }
    saveDetail(formDetail: NgForm) {
        if (formDetail.form.valid) {
            this.model.plumberLicenseId = this.plumberLicenseId;
            this.model.applicationNumber = this.applicationModel.applicationNumber;
            var dataToPost = Object.assign({}, this.model);
            if (dataToPost.birthdate)
                dataToPost.birthdate = this.commonService.getPayloadDate(dataToPost.birthdate);
            if (dataToPost.licenseValidTill)
                dataToPost.licenseValidTill = this.commonService.getPayloadDate(dataToPost.licenseValidTill);
            this.newPlumberLicenseService.save(dataToPost).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.model.plumberLicenseId = data.body.data;
                        this.plumberLicenseId = data.body.data;
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(this.model.plumberLicenseId);
                        this.newPlumberLicenseDataSharingService.setApprovalModel(this.model);
                        // this.model = new PlumberLicenseModel();
                        //this.newPlumberLicenseDataSharingService.setIsShowForm(false);
                        //this.newPlumberLicenseDataSharingService.setIsShowApproval(true);
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
    getFormDataDocuments(id : any) {
        if(this.plumberLicenseDocumentUploadDocs.length == 0){
        this.plumberLicenseDocumentUploadDocs = [];
        this.newPlumberLicenseService.plumberLicenseDocUpload(id).subscribe(
          (data) => {
            if(data && data.length > 0) {
                this.serviceFormId = data[0].id;
              }

            data.forEach(app => {
              this.plumberLicenseDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
      }
    onSubmitApproved() {

        this.mandatoryFileCheck().then( data => {

            if(data.status) {
        this.newPlumberLicenseService.submitNewgen(this.plumberLicenseId).subscribe(
            (data) => {

                this.alertService.success(data.message);
                this.newPlumberLicenseDataSharingService.setIsShowForm(false);
                this.newPlumberLicenseDataSharingService.setIsShowApproval(true);

            },
            (error) => {
                this.alertService.error(error.error.message);
            });


        } else {
            this.commonService2.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
                    return
          }

        })
    }

    onBackClick(){
        this.stepper.selectedIndex = 0;
      }
    
      mandatoryFileCheck() {
        return new Promise<any>((resolve, reject) => {
          this.newPlumberLicenseService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
            if (uploadedDocs) {
              let tempArray = [];
              uploadedDocs.forEach(element => {
                tempArray.push(element['fieldIdentifier']);
              });
              this.plumberLicenseDocumentUploadDocs.forEach(doc => {
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




}

