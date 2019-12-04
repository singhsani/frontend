import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApplicationModel, PlumberLicenseModel } from '../../Models/renewal-plumber-license.model';
import { RenewalPlumberLicenseService } from '../../Services/renewal-plumber-license.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { RenewalPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


@Component({
    selector: 'app-renewal-plumber-license-form',
    templateUrl: './renewal-plumber-license-form.component.html'
})

export class RenewalPlumberLicenseFormComponent implements OnInit {
    errorMessage = Constants.errorMessage;
    dateFormat = Constants.DateFormat.DDMMYYYY;
    plumberLicenseModel: PlumberLicenseModel;
    applicationModel: ApplicationModel;
    licenseNo: string;
    isShowSaveButton: boolean = false;

    constructor(private renewalPlumberLicenseService: RenewalPlumberLicenseService,
        private renewalPlumberLicenseDataSharingService: RenewalPlumberLicenseDataSharingService,
        private alertService: AlertService,
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
                        if (this.plumberLicenseModel.plumberLicenseId == null) {
                            this.isShowSaveButton = false;
                            this.alertService.info('No Data Found!');
                        }
                        else {
                            this.isShowSaveButton = true;
                        }
                    }
                },
                (error) => {
                    this.alertService.error(error.error.message);
                });
        }
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
                        this.renewalPlumberLicenseDataSharingService.setApprovalModel(this.plumberLicenseModel);

                        this.plumberLicenseModel = new PlumberLicenseModel();
                        this.licenseNo = null;
                        this.isShowSaveButton = false;
                        this.renewalPlumberLicenseDataSharingService.setIsShowForm(false);
                        this.renewalPlumberLicenseDataSharingService.setIsShowApproval(true);
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
