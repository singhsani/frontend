import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';

@Component({
  selector: 'app-property-document-upload-add',
  templateUrl: './property-document-upload-add.component.html',
  styleUrls: ['./property-document-upload-add.component.scss']
})
export class PropertyDocumentUploadAddComponent implements OnInit {

  subscription: Subscription;
  PropertyDocumentUploadDocs : Array<any> = [];
  modelProperty: any = {};

  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private router: Router,
    private alertService: AlertService) { 
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

  getFormDataDocuments(id : any) {
    this.PropertyDocumentUploadDocs = [];
    this.newNewPropertyEntryAddService.getPropertyAddUpload(id).subscribe(
      (data) => {
        data.forEach(app => {
          this.PropertyDocumentUploadDocs.push(app);
        });
        
      },
      (error) => {
        
      });
  }

  onSubmit() {
        this.newNewPropertyEntryAddService.submit(this.modelProperty.propertyBasicId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.alertService.success(data.body.message);
              //this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(4);
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

}
