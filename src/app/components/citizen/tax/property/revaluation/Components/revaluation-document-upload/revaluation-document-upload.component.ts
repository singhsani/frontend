import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RevaluationService } from '../../Services/revaluation.service';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

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
    private alertService:AlertService) {
  }

  ngOnInit() {
    this.subscription = this.revaluationDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // getFormDataDocuments(id : any) {
  //   this.revaluationDocumentUploadDocs = [];
  //   this.taxRebateApplicationService.gettaxrabitDocUpload(id).subscribe(
  //     (data) => {
  //       data.forEach(app => {
  //         this.revaluationDocumentUploadDocs.push(app);
  //       });
        
  //     },
  //     (error) => {
        
  //     });
  // }

  
}
