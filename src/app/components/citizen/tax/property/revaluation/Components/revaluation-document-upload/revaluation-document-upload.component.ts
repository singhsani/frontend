import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RevaluationService } from '../../Services/revaluation.service';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-revaluation-document-upload',
  templateUrl: './revaluation-document-upload.component.html',
  styleUrls: ['./revaluation-document-upload.component.scss']
})
export class RevaluationDocumentUploadComponent implements OnInit {

  revaluationDocumentUploadDocs : Array<any> = [];
  subscription: Subscription;
  selectedDataModel: any = {}
  isApproveOrDecline: boolean = false;
  serviceFormId : String;
  constructor(private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private router: Router,
    private alertService:AlertService,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.subscription = this.revaluationDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
        this.getFormDataDocuments(this.selectedDataModel.revaluationId);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.mandatoryFileCheck().then( data => {

    if(data.status) {
      this.revaluationService.submit(this.selectedDataModel.revaluationId).subscribe(
        (data) => {
          if (data.status === 200) {
            this.alertService.success(data.body.message);
            //this.revaluationDataSharingService.updateDataSourceMoveStepper(3);
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
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
      } else {
        this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
        return
      }
    })
  }
  
  getFormDataDocuments(id : any) {
    this.revaluationDocumentUploadDocs = [];
    this.revaluationService.getrevaluationDocUpload(id).subscribe(
      (data) => {
        if(data && data.length > 0) {
          this.serviceFormId = data[0].id;
        }
        data.forEach(app => {
          this.revaluationDocumentUploadDocs.push(app);
        });
        
       },
       (error) => {
        
       });
   }

   mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.revaluationService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.revaluationDocumentUploadDocs.forEach(doc => {
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
