import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RevaluationService } from '../../Services/revaluation.service';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';

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
  constructor(private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private router: Router,
    private alertService:AlertService) {
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
        })
    
  }

  getFormDataDocuments(id : any) {
    this.revaluationDocumentUploadDocs = [];
    this.revaluationService.getrevaluationDocUpload(id).subscribe(
      (data) => {
        data.forEach(app => {
          this.revaluationDocumentUploadDocs.push(app);
        });
        
       },
       (error) => {
        
       });
   }

  
}
