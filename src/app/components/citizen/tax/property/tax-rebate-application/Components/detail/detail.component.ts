import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { MatStepper } from '@angular/material';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { CommonService as CommonService2 } from 'src/app/vmcshared/Services/common-service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/vmcshared/Constants';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  model: any = {};
  rebateTypeList = [];
  financialYear = [];
  isShaved: boolean = false;
  isApprovedorDecline: boolean = false;
  serviceFormId: String;

  taxrebateDocumentUploadDocs : Array<any> = [];

  constructor(
    private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private alertService: AlertService,
    private commonService: CommonService,
    private fromActionsService: FormsActionsService,
    private addressService: ApplicantAddressService,
    private commonService2: CommonService2,
    private router: Router) {

  }

  ngOnInit() {
    this.model = {};
    this.taxRebateApplicationDataSharingService.observableDataModel.subscribe(data => {
      if (data) {
        this.model = Object.assign({}, data);

      }
    });
    this.getRebatTypeList();
    this.getFinancialYear();
  }

 getRebatTypeList() {
    this.taxRebateApplicationService.getRebatType({ active: true,approvalRequired:true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {

        const obj = {};
        for (let i = 0, len = data.body.length; i < len; i++) {
          obj[data.body[i]['taxRebateTypeName']] = data.body[i];
        }

        let uniqueArray = new Array();

        for (const key in obj) { 
          uniqueArray.push(obj[key]);
        }
        this.rebateTypeList = uniqueArray;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }
  
  getFinancialYear() {
    this.taxRebateApplicationService.getFinancialYear().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.financialYear = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  cancelForm() {
    this.taxRebateApplicationDataSharingService.updatedIsShowForm(false);
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.model.propertyServiceApplicationId = 1; // TODO
      this.taxRebateApplicationService.save(this.model).subscribe(
        (data) => {
          this.isShaved = true;
          this.model.taxRebateApplicationId = data.body.data;
          this.taxRebateApplicationDataSharingService.propertyTaxRebateId  = data.body.data;
          //this.alertService.success(data.body.message);
          this.stepper.selectedIndex = 1;
          this.getFormDataDocuments(this.model.taxRebateApplicationId);
          this.getApplicationNo(this.model.taxRebateApplicationId );
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
            this.alertService.warning(error.error.message);
          }
        })
    }
  }

  getFormDataDocuments(id : any) {
    this.taxrebateDocumentUploadDocs = [];
    this.taxRebateApplicationService.gettaxrabitDocUpload(id).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.serviceFormId = data[0].id;
        }
        data.forEach(app => {
          this.taxrebateDocumentUploadDocs.push(app);
        });

      },
      (error) => {

      });
  }

  onSubmitApproved() {
    this.mandatoryFileCheck().then(data => {
      if (data.status) {
        this.submit();
      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
      }

    })

  }

  onDecline() {
    this.taxRebateApplicationService.approveOrReject({ approved: false, taxRebateApplicationId: this.model.taxRebateApplicationId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // downloadFile(data, "reject-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
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
  onApproved() {
    this.taxRebateApplicationService.approveOrReject({ approved: true, taxRebateApplicationId: this.model.taxRebateApplicationId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // downloadFile(data, "approve-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
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

  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.taxRebateApplicationService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.taxrebateDocumentUploadDocs.forEach(doc => {
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

  submit() {
    this.taxRebateApplicationService.approveDept({ taxRebateApplicationId: this.model.taxRebateApplicationId, applicationNo :  this.commonService2.applicationNo }).subscribe(
      (data) => {
        //  this.alertService.success(data.body.message);
        if (this.commonService.fromAdmin()) {
          this.alertService.propertyConfirm(data.body.message);
          var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
            if (isConfirm) {

              const url = '/citizen/my-applications' +
                '?printPaymentReceipt=' + this.taxRebateApplicationDataSharingService.isPaymentReceipt +
                '&apiCode=' + this.taxRebateApplicationDataSharingService.serviceCode +
                '&id=' + this.taxRebateApplicationDataSharingService.serviceId;

              this.router.navigateByUrl(url);

            }else{
              this.router.navigateByUrl('/citizen/my-applications');
            }

            subConfirm.unsubscribe();
          });

        } else {
            this.alertService.success(data.body.message);
             this.router.navigateByUrl('/citizen/my-applications');
        }
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


  getApplicationNo(taxRebateApplicationId:String){

    this.taxRebateApplicationService.getApplicationNo(taxRebateApplicationId).subscribe(
      (data) => {
        console.log('data 253 - >',data);
       this.taxRebateApplicationDataSharingService.applicationNumber = data.body.data.applicationNo;
       this.taxRebateApplicationDataSharingService.serviceCode  = data.body.data.serviceCode;
       this.taxRebateApplicationDataSharingService.serviceId   = data.body.data.serviceId;
       this.taxRebateApplicationDataSharingService.isPaymentReceipt   = data.body.data.paymentReceipt;
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

  stepChangedEvent(event){
    this.stepper.selectedIndex = event;
  }

  onAttchmentBack(){
    this.stepper.selectedIndex = this.stepper.selectedIndex -1;
  }

  saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
    applicantDetailsDTO.uniqueId = this.taxRebateApplicationDataSharingService.applicationNumber;
    this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
         (data) => {
           this.commonService2.applicationNo = data.body.applicationNo;
           this.commonService2.serviceFormId = data.body.id;
           this.stepper.selectedIndex = 2;
         },
         (error) => {
           this.commonService2.callErrorResponse(error);
         });
   }

   rebateTypeChange(model,event){
    if(event){
      this.model.taxRebateTypeId = model.filter(p=>p.taxRebateId == event)[0].taxRebateTypeLookupId;
    }else{
      this.model.taxRebateTypeId = null;
    }
   }

}
