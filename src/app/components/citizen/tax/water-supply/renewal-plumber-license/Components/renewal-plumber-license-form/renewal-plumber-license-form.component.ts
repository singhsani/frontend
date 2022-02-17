import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApplicationModel, PlumberLicenseModel } from '../../Models/renewal-plumber-license.model';
import { RenewalPlumberLicenseService } from '../../Services/renewal-plumber-license.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { RenewalPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { MatStepper } from '@angular/material';
import * as moment from 'moment';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';

@Component({
    selector: 'app-renewal-plumber-license-form',
    templateUrl: './renewal-plumber-license-form.component.html',
    styleUrls: ['./renewal-plumber-license-form.component.scss']
})

export class RenewalPlumberLicenseFormComponent implements OnInit {
    
    @ViewChild('stepper') stepper: MatStepper;
    plumbeRenewalLicenseDocumentUploadDocs : Array<any> = [];
    plumberLicenseId : any;
    errorMessage = Constants.errorMessage;
    dateFormat = Constants.DateFormat.DDMMYYYY;
    plumberLicenseModel: PlumberLicenseModel;
    applicationModel: ApplicationModel;
    licenseNo: string;
    isShowSaveButton = false;
    renewUptoDate: any = {
        minDate: moment().add(1, 'M').startOf('M').toDate(),
        maxDate: moment().add(1, 'M').endOf('M').toDate()
    };

    constructor(private renewalPlumberLicenseService: RenewalPlumberLicenseService,
        private renewalPlumberLicenseDataSharingService: RenewalPlumberLicenseDataSharingService,
        private alertService: AlertService,
        private addressService: ApplicantAddressService,
        private commonService: CommonService, ) { }

    ngOnInit() {
        this.plumberLicenseModel = new PlumberLicenseModel();
        this.applicationModel = new ApplicationModel();

        // TODO
        // this.applicationModel.applicationNumber = "11110007";
        this.applicationModel.applicantName = "Test name";
        this.applicationModel.mobileNumber = 123456;
        this.applicationModel.aadharNumber = 123456;
        this.applicationModel.emailID = "test@test.com";
    }

    search(formDetail: NgForm) {
        if (formDetail.form.valid) {
            this.renewalPlumberLicenseService.search(this.licenseNo.toString().trim()).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.plumberLicenseModel = data.body;
                        this.plumberLicenseModel.birthdate = moment(data.body.birthdate).format('DD-MM-YYYY');
                        this.plumberLicenseModel.licenseValidTill = moment(data.body.licenseValidTill).format('DD-MM-YYYY');
                        this.renewUptoDate.maxDate = moment(
                            moment(this.plumberLicenseModel.licenseValidTill, 'DD-MM-YYYY')
                            ).add(1, 'y').toDate();

                        this.renewUptoDate.minDate = moment(
                            moment(this.plumberLicenseModel.licenseValidTill, 'DD-MM-YYYY')
                            ).add(1, 'd').toDate();

                        if (this.plumberLicenseModel.plumberLicenseId == null) {
                            this.isShowSaveButton = false;
                            this.alertService.info('No Data Found!');
                        } else {
                            this.isShowSaveButton = true;
                        }
                    }
                },
                (error) => {
                    this.alertService.error(error.error.message);
                });
        }
    }
    getFormDataDocuments(id : any) {
        this.plumbeRenewalLicenseDocumentUploadDocs = [];
        this.renewalPlumberLicenseService.plumberLicenseDocUpload(id).subscribe(
          (data) => {
            data.forEach(app => {
              this.plumbeRenewalLicenseDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
    onSubmitApproved() {

        this.renewalPlumberLicenseService.submitNewgen(this.plumberLicenseId).subscribe(
            (data) => {

                this.alertService.success(data.message);
                this.renewalPlumberLicenseDataSharingService.setIsShowForm(false);
                this.renewalPlumberLicenseDataSharingService.setIsShowApproval(true);

            },
            (error) => {
                this.alertService.error(error.error.message);
            });

    }

    saveDetail(formDetail: NgForm) {
        if (formDetail.form.valid) {

            this.plumberLicenseModel.applicationNumber = this.applicationModel.applicationNumber;
            var dataToPost = Object.assign({}, this.plumberLicenseModel);
            if (dataToPost.birthdate)
                dataToPost.birthdate = this.commonService.getPayloadDate(dataToPost.birthdate);
            if (dataToPost.licenseValidTill)
                dataToPost.licenseValidTill = this.commonService.getPayloadDate(dataToPost.licenseValidTill);
            if (dataToPost.licenseRenewUpto)
                dataToPost.licenseRenewUpto = this.commonService.getPayloadDate(dataToPost.licenseRenewUpto);

            this.renewalPlumberLicenseService.save(dataToPost).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.alertService.success(data.body.message);
                        this.plumberLicenseModel.plumberLicenseId = data.body.data;
                        this.plumberLicenseId = data.body.data;
                        this.stepper.selectedIndex = 2;
                        this.getFormDataDocuments(this.plumberLicenseModel.plumberLicenseId);
                        this.renewalPlumberLicenseDataSharingService.setApprovalModel(this.plumberLicenseModel);

                        // this.plumberLicenseModel = new PlumberLicenseModel();
                        // this.licenseNo = null;
                        // this.isShowSaveButton = false;
                        //this.renewalPlumberLicenseDataSharingService.setIsShowForm(false);
                        //this.renewalPlumberLicenseDataSharingService.setIsShowApproval(true);
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
    onBackClick(){
        this.stepper.selectedIndex = 0;
      }

    moveStepper(index: number) {
        this.stepper.selectedIndex = index;
    }

    stepChangedEvent(event){
        this.moveStepper(1);
    }

    saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO) {
        this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
            (data) => {
                this.commonService.applicationNo = data.body.applicationNo;
                this.moveStepper(1);
            },
            (error) => {
                this.commonService.callErrorResponse(error);
            });
    }
}
