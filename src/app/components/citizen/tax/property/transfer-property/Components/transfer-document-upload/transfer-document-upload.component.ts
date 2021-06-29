import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-transfer-document-upload',
  templateUrl: './transfer-document-upload.component.html',
  styleUrls: ['./transfer-document-upload.component.scss']
})
export class TransferDocumentUploadComponent implements OnInit {

  subscription: Subscription;
  transferDocumentUploadDocs: Array<any> = [];
  propertyDetailModel: any = {};
  serviceFormId: String;

  constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private router: Router,
    private commonService: CommonService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.transferPropertyDataSharingService.observablePropertyDetailModel.subscribe((data) => {
      if (data) {
        this.propertyDetailModel = data;
        if (this.propertyDetailModel.propertyTransferId) {
          this.getFormDataDocuments(this.propertyDetailModel.propertyTransferId);
        }
      }
    })
  }

  onSubmit(formDetail: NgForm) {

    this.mandatoryFileCheck().then(data => {
      if (data.status) {
        if (formDetail.form.valid) {
          this.transferPropertyService.submitProperty(this.propertyDetailModel.propertyTransferId).subscribe(
            (data) => {
              this.alertService.success(data.body.message);
              this.transferPropertyDataSharingService.updateDataSourceMoveStepper(0);
              // this.router.navigate(['/citizen/dashboard']);
              this.router.navigateByUrl('/citizen/my-applications');
            },
            (error) => {
              if (error.status === 400) {
                var errorMessage = '';
                error.error[0].propertyList.forEach(element => {
                  errorMessage = errorMessage + element + "</br>";
                });
                this.alertService.info(errorMessage);
              }
              else {
                this.alertService.info(error.error.message);
              }
            })
        }

      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }

    })

  }

  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormDataDocuments(id: any) {
    this.transferDocumentUploadDocs = [];
    this.transferPropertyService.gettranferPropertyUpload(id).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.serviceFormId = data[0].id;
        }

        data.forEach(app => {
          this.transferDocumentUploadDocs.push(app);
        });

      },
      (error) => {

      });
  }

  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.transferPropertyService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.transferDocumentUploadDocs.forEach(doc => {
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
