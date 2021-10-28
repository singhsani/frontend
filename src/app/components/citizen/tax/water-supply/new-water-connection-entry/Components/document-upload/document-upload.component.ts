import { Component, OnInit ,Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { NewWaterConnectionEntryDataSharingService } from '../../Services/new-water-connection-entry-data-sharing.service';
import { NewWaterConnectionEntryService } from '../../Services/new-water-connection-entry.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CitizenConfig } from 'src/app/components/citizen/citizen-config';
import { PaginationService } from 'src/app/core/services/citizen/data-services/pagination.service';
import * as _ from 'lodash';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Router } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { resolve } from 'url';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {

  subscription: Subscription;
  subscriptionDoc: Subscription;
  connectionDtlId: number;
  serviceFormId : String;

  newNewWaterConnectionDocs : Array<any> = [];
  
  constructor(private newNewWaterConnectionEntryDataSharingService: NewWaterConnectionEntryDataSharingService,private alertService: AlertService,private router: Router,
    private newNewWaterConnectionEntryService: NewWaterConnectionEntryService,
    private commonService: CommonService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.subscription = this.newNewWaterConnectionEntryDataSharingService.observableNewWaterConnectionEntry.subscribe((data) => {
      if (data != null) {
        this.connectionDtlId = data.connectionDtlId;
        this.getFormDataDocuments(this.connectionDtlId);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

    getFormDataDocuments(id : any) {
      this.newNewWaterConnectionDocs = [];
      this.newNewWaterConnectionEntryService.getNewWaterConnectionUpload(id).subscribe(
        (data) => {
          if(data && data.length > 0) {
            this.serviceFormId = data[0].id;
          }
          data.forEach(app => {
            this.newNewWaterConnectionDocs.push(app);
          });
          
        },
        (error) => {
          
        });
    } 
    
    finalSubmit() {
      this.mandatoryFileCheck().then( data => {


      if(data.status) {
        this.newNewWaterConnectionEntryService.submit(this.connectionDtlId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.alertService.success(data.body.message);
              this.newNewWaterConnectionEntryDataSharingService.updateDataSourceIsShowDocument(true);
              //this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(2);
              this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENMYAPPS'));
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

    onBackClick(){
        this.newNewWaterConnectionEntryDataSharingService.updateDataSourceBackMoveStepper();     
    }

  mandatoryFileCheck() {
    return new Promise<any>((resolve, reject) => {
      this.newNewWaterConnectionEntryService.getAttachmentList(this.serviceFormId).subscribe(uploadedDocs => {
        if (uploadedDocs) {
          let tempArray = [];
          uploadedDocs.forEach(element => {
            tempArray.push(element['fieldIdentifier']);
          });
          this.newNewWaterConnectionDocs.forEach(doc => {
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

