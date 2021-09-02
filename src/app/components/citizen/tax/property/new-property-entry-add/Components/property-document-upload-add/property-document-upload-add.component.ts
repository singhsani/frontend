import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ApplicantDetailsComponent } from 'src/app/shared/components/applicant-details/applicant-details.component';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';
@Component({
  selector: 'app-property-document-upload-add',
  templateUrl: './property-document-upload-add.component.html',
  styleUrls: ['./property-document-upload-add.component.scss']
})
export class PropertyDocumentUploadAddComponent implements OnInit {

  translateKey: string = 'newPropertyTaxScreen';
  subscription: Subscription;
  PropertyDocumentUploadDocs: Array<any> = [];
  modelProperty: any = {};
  serviceFormId : String;

  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private router: Router,
    private alertService: AlertService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private fromActionsService: FormsActionsService) {
    this.modelProperty = {};
  }

  ngOnInit() {
    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableProperty.subscribe((data) => {
      if (data) {
        this.modelProperty = data;
        this.getFormDataDocuments(this.modelProperty.propertyBasicId);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormDataDocuments(id: any) {
    this.PropertyDocumentUploadDocs = [];
    this.newNewPropertyEntryAddService.getPropertyAddUpload(id).subscribe(
      (data) => {
        if(data && data.length > 0) {
          this.serviceFormId = data[0].id;
        }
        data.forEach(app => {
          this.PropertyDocumentUploadDocs.push(app);
          this.PropertyDocumentUploadDocs.sort((a, b) => 
					a.fieldIdentifier - b.fieldIdentifier);
        });

      },
      (error) => {

      });
  }

  onSubmit() {
    this.mandatoryFileCheck().then(data => {

      if (data.status) {

        this.submit();

        // this.commonService.openDetailDialogBox().subscribe(details => {
        //   if (details) {
        //     var applicationNumber = this.newNewPropertyEntryAddDataSharingService.applicationNo;
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

      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }
    })

  }

  onBackClick() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(3);
  }

  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.newNewPropertyEntryAddService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.PropertyDocumentUploadDocs.forEach(doc => {
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

    this.newNewPropertyEntryAddService.submit(this.modelProperty.propertyBasicId).subscribe(
    
      (data) => {
        if (data.status === 200) {
          const lServFormId = this.serviceFormId;
          const url = `/citizen/my-applications?printPaymentReceipt=false&apiCode=PRO-ASS&id=${lServFormId}`;
          this.router.navigateByUrl(url);
          
         // this.alertService.success(data.body.message);
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

}
