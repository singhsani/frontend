import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';

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
    private alertService: AlertService,
    private fromActionsService: FormsActionsService) {
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

        // this.commonService.openDetailDialogBox().subscribe(details => {
        //   if (details) {
        //     var applicationNumber = this.transferPropertyDataSharingService.applicationNo;
        //     this.fromActionsService.setUserData(details, applicationNumber).subscribe(
        //       (data) => {
        //         if (data) {
        //           this.submit(formDetail);
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

        this.submit(formDetail);

      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }

    })

  }

  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(2);
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


  submit(formDetail){

    if (formDetail.form.valid) {
      this.transferPropertyService.submitProperty(this.propertyDetailModel.propertyTransferId).subscribe(
        (data) => {
          this.transferPropertyDataSharingService.updateDataSourceMoveStepper(0); 
          if (this.commonService.fromAdmin()) {
            this.alertService.propertyConfirm(data.body.message);
            var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {

              if (isConfirm) {

                const url = '/citizen/my-applications' +
                  '?printPaymentReceipt=' + this.transferPropertyDataSharingService.isPaymentReceipt +
                  '&apiCode=' + this.transferPropertyDataSharingService.propertyServiceCode +
                  '&id=' + this.transferPropertyDataSharingService.serviceId;

                this.router.navigateByUrl(url);

              } else {
                this.router.navigateByUrl('/citizen/my-applications');
              }
              subConfirm.unsubscribe();
            });

          } else {
            this.router.navigateByUrl('/citizen/my-applications');
          }


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

  }

}
