import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { MatStepper } from '@angular/material';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';

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
    private fromActionsService: FormsActionsService) {

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
          this.rebateTypeList = data.body;
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
            this.alertService.error(error.error.message);
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
        this.commonService.openDetailDialogBox().subscribe(details => {
          if (details) {
            var applicationNumber = this.taxRebateApplicationDataSharingService.applicationNumber
            this.fromActionsService.setUserData(details, applicationNumber).subscribe(
              (data) => {
                if (data) {
                  this.submit();
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
              });
          }

        })

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

    this.taxRebateApplicationService.approveDept({ taxRebateApplicationId: this.model.taxRebateApplicationId }).subscribe(
      (data) => {
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


  getApplicationNo(taxRebateApplicationId:String){

    this.taxRebateApplicationService.getApplicationNo(taxRebateApplicationId).subscribe(
      (data) => {
       this.taxRebateApplicationDataSharingService.applicationNumber = data;    
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