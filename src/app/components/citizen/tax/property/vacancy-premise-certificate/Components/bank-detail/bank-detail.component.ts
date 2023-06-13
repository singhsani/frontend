import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { VacancyPremiseCertificateService } from '../../Services/vacancy-premise-certificate.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService as CommonService2 } from 'src/app/shared/services/common.service';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';


@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})

export class BankDetailComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;
  vacancyPremiseCertficateDocumentUploadDocs : Array<any> = [];
  model: any = {};
  modelForCliear: any = {};
  bankList = [];
  branchList = [];
  actionOnList = [];
  isShaved: boolean = false;
  isApprovedorDecline: boolean = false;
  minDate: Date = new Date();
  vacancyToMinDate: Date = new Date();
  isBankDetailRequired: boolean = false;
  modelSubscription: Subscription;
  count : number  = 0;
  submitBtn:boolean = true;
  serviceFormId: String;
  showBackBtn:boolean = true;
  constructor(
    private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService,
    private paymentDataSharingService: PaymentDataSharingService,
    private commonService: CommonService,
    private commonservice2 :CommonService2,
    private router: Router,
    private vacancyPremiseCertificateService: VacancyPremiseCertificateService,
    private alertService: AlertService,
    private fromActionsService: FormsActionsService,
    private addressService: ApplicantAddressService) {

  }

  ngOnInit() {
    this.model = {};
    this.modelForCliear = {};
    this.model.vacancyFrom = new Date();
    this.vacancyToMinDate = new Date(moment(new Date()).add("days", 1).toString());
    this.model.occupierId = 0;
    this.modelSubscription = this.vacancyPremiseCertificateDataSharingService.observableDataModel.subscribe(data => {
      if (data) {
        delete data.applicantDetail
        this.model = Object.assign({}, data);
        this.model.propertyAddress = data.propertyAddress.propertyAddress ? data.propertyAddress.propertyAddress : data.propertyAddress
        this.modelForCliear = Object.assign({}, data);
        this.model.actionOnVacancyAmountLookupId = data.actionOnVacancyAmountLookupId
        this.model.vacancyFrom = data.vacancyFrom ? moment(data.vacancyFrom).format("YYYY-MM-DD") : new Date();
        this.model.vacancyTo = data.vacancyTo ? moment(data.vacancyTo).format("YYYY-MM-DD") : null
        this.model.occupierId = data.propertyOccupierId
      }
        this.getLookups();
        this.getBankList();
    });
  }

  ngOnDestroy() {
    this.vacancyPremiseCertificateDataSharingService.updatedDataModel(null);
    this.modelSubscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Action_on_Vacancy_Amount}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.actionOnList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Action_on_Vacancy_Amount))[0].items;
      var obj = this.actionOnList.filter(f => f.itemCode == Constants.ItemCodes.Adjust_in_next_bill)[0];
      this.model.actionOnVacancyAmountLookupId = obj.itemId;

    });
  }

  onChangeVacancyFrom(event) {
    this.vacancyToMinDate = new Date(moment(new Date(this.model.vacancyFrom)).add("days", 1).toString());
  }

  onActionOnVacancy(val) {
    this.isBankDetailRequired = false;
    if (val) {
      var obj = this.actionOnList.filter(f => f.itemId == val)[0];
      if (obj.itemCode == Constants.ItemCodes.Refund) {
        this.isBankDetailRequired = true;
      }
    }
  }

  onChangeBank(val) {
    this.branchList = [];
    this.model.branchIdhId = null;
    if (val)
      this.getBranchlist(val);
  }

  getBankList() {
    this.vacancyPremiseCertificateService.getBankList().subscribe(
      (data) => {
        if (data.status === 200) {
          this.bankList = data.body.data;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  getBranchlist(val) {
    this.vacancyPremiseCertificateService.getBranchList(val).subscribe(
      (data) => {
        if (data.status === 200) {
          this.branchList = data.body.data;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  cancelForm() {
    this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(false);
    this.router.navigateByUrl('citizen/tax/property/vacantPremisesCertificate')
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.model.totalOutstanding = 0;
      this.model.propertyServiceApplicationId = 1; // TODO
      this.model.vacancyFrom = this.commonService.getPayloadDate(this.model.vacancyFrom);
      this.model.vacancyTo = this.commonService.getPayloadDate(this.model.vacancyTo);
      this.vacancyPremiseCertificateService.save(this.model).subscribe(
        (data) => {
          this.isShaved = true;
          this.model.vacancyPremiseCertficateId =  data.body.data.vacancyPremiseCertficateId;
          this.stepper.selectedIndex = 1;
          this.showBackBtn = false;
          this.vacancyPremiseCertificateDataSharingService.applicationNumber = data.body.data.applicationNo ;
          this.vacancyPremiseCertificateDataSharingService.vacancyPremisesCetiId = data.body.data.vacancyPremiseCertficateId;
          //this.alertService.success(data.body.message);
          this.getFormDataDocuments(this.model.vacancyPremiseCertficateId);
          //this.paymentDataSharingService.updatedDataModelFileDownload(data.body.data.responseDTOList);
        },
        (error) => {
          this.commonService.callErrorResponse(error);
        })
    }
  }

  getFormDataDocuments(id : any) {
    this.vacancyPremiseCertficateDocumentUploadDocs = [];
    this.vacancyPremiseCertificateService.getvacancyPremiseDocUpload(id).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.serviceFormId = data[0].id;
        }
        data.forEach(app => {
          this.vacancyPremiseCertficateDocumentUploadDocs.push(app);
          console.log(this.vacancyPremiseCertficateDocumentUploadDocs.length);
          console.log('HELLOW ');
        });
        
      },
      (error) => {
        
      });
  }


  onDecline() {
    this.vacancyPremiseCertificateService.reject({ vacancyPremiseCertficateId: this.model.vacancyPremiseCertficateId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // this.onClear();
        //downloadFile(data, "reject-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
        this.paymentDataSharingService.updatedDataModelFileDownload([]);
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }
  

  onSubmitApproved() {

    this.mandatoryFileCheck().then(data => {
      if (data.status) {
        // this.commonservice2.openDetailDialogBox().subscribe(details => {
        //   if (details) {
        //     var applicationNumber = this.vacancyPremiseCertificateDataSharingService.applicationNumber;
        //     this.fromActionsService.setUserData(details, applicationNumber).subscribe(
        //       (data) => {
        //         if (data) {
        //           this.submit();
        //         }
        //       },
        //       (error) => {
        //         if (error.status === 400) {
        //           var errorMessage = '';
        //           error.error[0].propertyList.forEach(element => {
        //             errorMessage = errorMessage + element + "</br>";
        //           });
        //           this.alertService.error(errorMessage);
        //         }
        //         else {
        //           this.alertService.error(error.error.message);
        //         }
        //       });
        //   }

        // })

        this.submit();
      } else {
        this.commonservice2.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }

    })

  }
  
  
  onApproved() {
    this.vacancyPremiseCertificateService.approve({ vacancyPremiseCertficateId: this.model.vacancyPremiseCertficateId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // this.onClear();
       //downloadFile(data, "approve-" + Date.now() + ".pdf", 'application/pdf');
       this.alertService.success(data.body.message);
       this.paymentDataSharingService.updatedDataModelFileDownload(data.body.data);
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onClear() {
    const bankDetail = {
      'refundAccountName': '',
      'refundAccountNumber': '',
      'bankId': null,
      'branchIdhId': null,
      'bankBranchId': null,
      'bankBranchName': null,
      'ifscCode': '',
      'vacancyFrom': new Date(),
      'vacancyTo' : null,
      'actionOnVacancyAmountLookupId' : null
    };
    this.getLookups();
    this.isBankDetailRequired = false;
    Object.assign(this.model, bankDetail);
    /* this.model = this.modelForCliear;
    this.model.vacancyFrom = new Date(); */
  }

  onUploadDoc(event:number){
    this.count = this.count + Number(event);
    if(this.vacancyPremiseCertficateDocumentUploadDocs.length ==  this.count){
    this.submitBtn = false; //  Disabled will false by this condition
    }
  }


  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.vacancyPremiseCertificateService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.vacancyPremiseCertficateDocumentUploadDocs.forEach(doc => {
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


submit(){

  this.vacancyPremiseCertificateService.approveDept(this.model.vacancyPremiseCertficateId).subscribe(
    (data) => {
      this.isApprovedorDecline = true;
      // this.onClear();
     //downloadFile(data, "approve-" + Date.now() + ".pdf", 'application/pdf');
     this.paymentDataSharingService.updatedDataModelFileDownload(data);

      if (this.commonservice2.fromAdmin()) {
      
        this.alertService.propertyConfirmForTransfer(data.message);
        var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
          if (isConfirm) {

            const url = '/citizen/my-applications' +
              '?printPaymentReceipt=' + this.vacancyPremiseCertificateDataSharingService.isPaymentReceipt +
              '&apiCode=' + this.vacancyPremiseCertificateDataSharingService.serviceCode +
              '&id=' + this.vacancyPremiseCertificateDataSharingService.serviceId;

            this.router.navigateByUrl(url);

          }else{
            this.router.navigateByUrl('/citizen/my-applications');
          }

          subConfirm.unsubscribe();
        });

      } else {
        this.alertService.success(data.message);
        this.router.navigateByUrl('/citizen/my-applications');
      }

    },
    (error) => {
      this.commonService.callErrorResponse(error);
    });
}

stepChangedEvent(event){
  this.stepper.selectedIndex = event;
  this.showBackBtn = true;
}

saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
  applicantDetailsDTO.uniqueId = this.vacancyPremiseCertificateDataSharingService.applicationNumber;
  this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
       (data) => {
         this.commonService.applicationNo = data.body.applicationNo;
         this.vacancyPremiseCertificateDataSharingService.serviceId = data.body.id
         this.getApplicationDetails(data.body.id);
         console.log(' data.body.id - > ', data.body.id);
         this.stepper.selectedIndex = 2;
         this.showBackBtn = true;
       },
       (error) => {
         this.commonService.callErrorResponse(error);
       });
 }

 getApplicationDetails(serviceId:any){

  this.vacancyPremiseCertificateService.getApplicationDetails(serviceId).subscribe(
    (data) => {
     this.vacancyPremiseCertificateDataSharingService.serviceCode  = data.body.data.serviceCode;
     this.vacancyPremiseCertificateDataSharingService.isPaymentReceipt   = data.body.data.paymentReceipt;
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

}