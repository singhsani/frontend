import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-check-list',
  templateUrl: './document-check-list.component.html',
  styleUrls: ['./document-check-list.component.scss']
})

export class DocumentCheckListComponent implements OnInit {

  subscription: Subscription;
  propertyDetailModel: any = {};
  constructor(private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.transferPropertyDataSharingService.observablePropertyDetailModel.subscribe((data) => {
      if (data) {
        this.propertyDetailModel = data;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.transferPropertyService.submitProperty(this.propertyDetailModel.propertyTransferId).subscribe(
        (data) => {
          this.alertService.success(data.body.message);
          this.transferPropertyDataSharingService.updateDataSourceMoveStepper(4);
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
}
