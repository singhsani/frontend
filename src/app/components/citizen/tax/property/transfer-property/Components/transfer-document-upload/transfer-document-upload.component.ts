import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-document-upload',
  templateUrl: './transfer-document-upload.component.html',
  styleUrls: ['./transfer-document-upload.component.scss']
})
export class TransferDocumentUploadComponent implements OnInit {

  subscription: Subscription;
  transferDocumentUploadDocs : Array<any> = [];
  propertyDetailModel: any = {};
  
  constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private router: Router,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.transferPropertyDataSharingService.observablePropertyDetailModel.subscribe((data) => {
      if (data) {
        this.propertyDetailModel = data;
        if(this.propertyDetailModel.propertyTransferId){
          this.getFormDataDocuments(this.propertyDetailModel.propertyTransferId);
        }
      }
    })
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.transferPropertyService.submitProperty(this.propertyDetailModel.propertyTransferId).subscribe(
        (data) => {
          this.alertService.success(data.body.message);
          this.transferPropertyDataSharingService.updateDataSourceMoveStepper(4);
          this.router.navigate(['/citizen/dashboard']);
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

  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(2);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormDataDocuments(id : any) {
    this.transferDocumentUploadDocs = [];
    this.transferPropertyService.gettranferPropertyUpload(id).subscribe(
      (data) => {
        data.forEach(app => {
          this.transferDocumentUploadDocs.push(app);
        });
        
      },
      (error) => {
        
      });
  }

}
