import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RefundApplicationService } from '../../Services/refund-application.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { OccupierModel, PropertyAddress, VacancyPremiseCertficateModel } from '../../Models/refund-application.model';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { RefundApplicationDataSharingService } from '../../Services/refund-application-data-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-refund-application-form',
    templateUrl: './refund-application-form.component.html'
})

export class RefundApplicationFormComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    refundApplicationDocumentUploadDocs : Array<any> = [];
    refundAgainstVacancyId : any ;
    applicationModel: any = {};
    propertyNo: string;
    vacancyCertificateNo: string;
    // vacancyPremiseCertficateModel.refundAmount: number;
    occupierModel: OccupierModel;
    isdisabledSearchButton: boolean = false;
    isdisabledSaveButton: boolean = false;
    // totalOutstanding: number;
    vacancyPremiseCertficateModel:VacancyPremiseCertficateModel;
    applicationNo: string;

    constructor(private refundApplicationService: RefundApplicationService,
        private alertService: AlertService,
        private commonService : CommonService,
        private refundApplicationDataSharingService: RefundApplicationDataSharingService) { }

    ngOnInit() {
        this.vacancyPremiseCertficateModel = new VacancyPremiseCertficateModel();
        this.occupierModel = new OccupierModel();
        this.occupierModel.propertyAddress = new PropertyAddress();
        this.applicationModel.applicationNumber = "1"; // TODO

        this.refundApplicationDataSharingService.getIsBack().subscribe(data => {
            if (data) {
                this.onClear();
            }
        });
    }

    onSearchByPropertyNo(form: NgForm) {
        if (form.form.valid) {
            this.refundApplicationService.searchOccupierByPropertyNumber({ propertyNo: this.propertyNo }).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.occupierModel = data.body[0];
                        this.isdisabledSearchButton = true;
                    }
                },
                (error) => {
                    this.commonService.callErrorResponse(error);
                });
        }
    }

    onChangeVacancyCertificateNo() {
        this.vacancyPremiseCertficateModel = new VacancyPremiseCertficateModel();
        this.isdisabledSaveButton = false;
    }

    onSearchByVacancyCertificateNo(form: NgForm) {
        if (form.form.valid) {
            this.refundApplicationService.getVacancyPremiseApplicationInfo(this.vacancyCertificateNo, this.occupierModel.propertyOccupierId).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.vacancyPremiseCertficateModel = data.body.data;
                        this.isdisabledSaveButton = true;
                    }
                },
                (error) => {
                    this.commonService.callErrorResponse(error);
                });
        }
    }

    onSave(form: NgForm) {
        if (form.form.valid) {
            this.vacancyPremiseCertficateModel.refundAmount = this.vacancyPremiseCertficateModel.refundAmount ? this.vacancyPremiseCertficateModel.refundAmount : 0;
            var dataToPost = {
                refundAmount: this.vacancyPremiseCertficateModel.refundAmount,
                certificateNumber: this.vacancyCertificateNo,
                occupierId: this.occupierModel.propertyOccupierId,
                propertyServiceApplicationId: this.applicationModel.applicationNumber,
                refundAgainstVacancyId: 0,
                applicationNo: this.applicationNo,
                responseDTOList : []
            };
            this.refundApplicationService.save(dataToPost).subscribe(
                (data) => {
                    if (data.status === 200) {
                        dataToPost.refundAgainstVacancyId = data.body.data.refundAgainstVacancyId;
                        this.refundAgainstVacancyId = data.body.data.refundAgainstVacancyId;
                        dataToPost.responseDTOList = data.body.data.responseDTOList;
                        this.refundApplicationDataSharingService.setRefundModel(dataToPost);
                        //this.generateRefundReceipt(data.body.data.fileUrl);
                       // this.refundApplicationDataSharingService.setIsShowForm(false);
                       // this.refundApplicationDataSharingService.setIsShowApproval(true);
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(dataToPost.refundAgainstVacancyId);
                    }
                },
                (error) => {
                    this.commonService.callErrorResponse(error);
                });
        }
    }
    getFormDataDocuments(id : any) {
        this.refundApplicationDocumentUploadDocs = [];
        this.refundApplicationService.gettaxrabitDocUpload(id).subscribe(
          (data) => {
            data.forEach(app => {
              this.refundApplicationDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
    
      onSubmitApproved() {
        this.refundApplicationService.approveDept({ refundAgainstVacancyId: this.refundAgainstVacancyId }).subscribe(
          (data) => {
            this.alertService.success(data.body.message);
            this.refundApplicationDataSharingService.setIsShowForm(false);
            this.refundApplicationDataSharingService.setIsShowApproval(true);
          },
          (error) => {
            if (error.status === 400) {
              var errorMessage = '';
              error.error[0].propertyList.forEach(element => {
                errorMessage = errorMessage + element + "</br>";
              });
              this.alertService.error(errorMessage);
            }
            else {
              this.alertService.error(error.error.message);
            }
          })
      }
    generateRefundReceipt(url) {
        this.refundApplicationService.downloadFile(url).subscribe(
            (data) => {
                downloadFile(data, "refund-receipt-" + Date.now() + ".pdf", 'application/pdf');
                this.refundApplicationDataSharingService.setIsShowForm(false);
                this.refundApplicationDataSharingService.setIsShowApproval(true);
            },
            (error) => {
               this.commonService.callErrorResponse(error);
            });
    }

    onClear() {
        this.propertyNo = null;
        this.vacancyCertificateNo = null;
        this.isdisabledSearchButton = false;
        this.isdisabledSaveButton = false;
        this.vacancyPremiseCertficateModel = new VacancyPremiseCertficateModel();
        this.occupierModel = new OccupierModel();
        this.occupierModel.propertyAddress = new PropertyAddress();
        this.applicationNo = null;
    }
}
