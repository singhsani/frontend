import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RefundApplicationService } from '../../Services/refund-application.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { OccupierModel, PropertyAddress, VacancyPremiseCertficateModel } from '../../Models/refund-application.model';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { RefundApplicationDataSharingService } from '../../Services/refund-application-data-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { MatStepper } from '@angular/material';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService as Commonservice2} from 'src/app/shared/services/common.service';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { DataSharingService } from 'src/app/vmcshared/Services/data-sharing.service';

@Component({
    selector: 'app-refund-application-form',
    templateUrl: './refund-application-form.component.html',
    styleUrls: ['./refund-application-form.component.scss']
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
    isDisableCertificateGoBtn = true;
    // totalOutstanding: number;
    vacancyPremiseCertficateModel:VacancyPremiseCertficateModel;
    applicationNo: string;
    serviceFormId : String;
    submitBtn: boolean = true;
    isAppNoSearchDisable = true;
    vacancyApplicationNo: string;
    formId : number;


    constructor(private refundApplicationService: RefundApplicationService,
        private alertService: AlertService,
        private commonService : CommonService,
        private router: Router,
        private refundApplicationDataSharingService: RefundApplicationDataSharingService,
        private commoservice2 : Commonservice2,
        private addressService: ApplicantAddressService,
        private route: ActivatedRoute,
        private propertyEntryAddDataSharingService : DataSharingService) { }
        

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

        this.route.paramMap.subscribe(param => {
          this.formId = Number(param.get('id'));
          if (this.formId != 0) {
            this.refundApplicationService.getVersionById(this.formId).subscribe(res => {
              res.body.serviceApplicationId = this.formId;
              this.propertyNo = res.body.propertyNo
              this.vacancyApplicationNo = res.body.applicationNo;
              this.refundAgainstVacancyId = res.body.refundAgainstVacancyId
              this.onSearchByPropertyNo()
              this.getCertificateNoByApplicationNo()
              this.propertyEntryAddDataSharingService.setApplicantDetailsEditModel(res.body.detail)
            })
          }
        });
    }

    onSearchByPropertyNo() {
       // if (form.form.valid) {
            this.refundApplicationService.searchOccupierByPropertyNumber({ propertyNo: this.propertyNo }).subscribe(
                (data) => {
                    if (data.status === 200) {
                        this.occupierModel = data.body[0];
                        this.isAppNoSearchDisable = false;
                    }
                },
                (error) => {
                    this.commonService.callErrorResponse(error);
                });
     //   }
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
                refundAgainstVacancyId: this.refundAgainstVacancyId ? this.refundAgainstVacancyId :0,
                applicationNo: this.applicationNo,
                responseDTOList : [],
                serviceApplicationId : this.formId == 0 ? null : this.formId
            };
            this.refundApplicationService.save(dataToPost).subscribe(
                (data) => {
                    if (data.status === 200) {
                        dataToPost.refundAgainstVacancyId = data.body.data.refundAgainstVacancyId;
                        this.refundAgainstVacancyId = data.body.data.refundAgainstVacancyId;
                        dataToPost.responseDTOList = data.body.data.responseDTOList;
                        this.refundApplicationDataSharingService.setRefundModel(dataToPost);
                        this.refundApplicationDataSharingService.applicationNo = data.body.data.applicationNo ;
                        //this.generateRefundReceipt(data.body.data.fileUrl);
                       // this.refundApplicationDataSharingService.setIsShowForm(false);
                       // this.refundApplicationDataSharingService.setIsShowApproval(true);
                        this.stepper.selectedIndex = 1;
                        this.getFormDataDocuments(dataToPost.refundAgainstVacancyId);
                        this.submitBtn = false;
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
            if(data && data.length > 0) {
                this.serviceFormId = data[0].id;
              }

            data.forEach(app => {
              this.refundApplicationDocumentUploadDocs.push(app);
            });
            
          },
          (error) => {
            
          });
      }
    
      onSubmitApproved() {

        this.mandatoryFileCheck().then( data => {
        if(data.status) {
        this.refundApplicationService.approveDept(this.refundAgainstVacancyId).subscribe(
          (data) => {

            const url = `/citizen/my-applications?printPaymentReceipt=false&apiCode=PRO-REFUND&id=${this.serviceFormId}`;
            this.router.navigateByUrl(url);


            /* this.alertService.success(data.message);
            // this btn is used to enable or disable to submit btn of document screen 
            this.submitBtn = true;
            this.router.navigateByUrl('/citizen/my-applications'); */

           // this.refundApplicationDataSharingService.setIsShowForm(false);
           // this.refundApplicationDataSharingService.setIsShowApproval(true);
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
        } else {
            this.commoservice2.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
                    return
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
        this.isAppNoSearchDisable = true;
        this.vacancyApplicationNo = null;
    }


    mandatoryFileCheck() {
        return new Promise<any>((resolve, reject) => {
          this.refundApplicationService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
            if (uploadedDocs) {
              let tempArray = [];
              uploadedDocs.forEach(element => {
                tempArray.push(element['fieldIdentifier']);
              });
              this.refundApplicationDocumentUploadDocs.forEach(doc => {
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

      stepChangedEvent(event){
        this.stepper.selectedIndex = event;
      }

      saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
        applicantDetailsDTO.uniqueId = this.refundApplicationDataSharingService.applicationNo;
        this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
             (data) => {
               this.commonService.applicationNo = data.body.applicationNo;
               this.stepper.selectedIndex = 2;             },
             (error) => {
               this.commonService.callErrorResponse(error);
             });
       }

       getCertificateNoByApplicationNo(){
         if(this.vacancyApplicationNo){
           this.refundApplicationService.getVacancyPremiseCertificateNo(this.vacancyApplicationNo).subscribe(
             (data) => {
                 if (data.status === 200) {
                     this.vacancyCertificateNo = data.body;
                     this.isdisabledSearchButton = true;
                 }
             },
             (error) => {
               this.vacancyApplicationNo = null;
               this.isdisabledSearchButton = false;
               this.vacancyCertificateNo = null;
               this.vacancyPremiseCertficateModel = new VacancyPremiseCertficateModel();
               this.isdisabledSaveButton = false;
               this.commonService.callErrorResponse(error);
             });
          }
      }
}
