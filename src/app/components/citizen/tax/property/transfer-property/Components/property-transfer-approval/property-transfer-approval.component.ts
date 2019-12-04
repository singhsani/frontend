import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { Subscription } from 'rxjs';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';

@Component({
  selector: 'app-property-transfer-approval',
  templateUrl: './property-transfer-approval.component.html',
  styleUrls: ['./property-transfer-approval.component.scss']
})

export class PropertyTransferApprovalComponent implements OnInit {

  subscription: Subscription;
  propertyDetailModel: any = {}
  modelFileDownload: any = [];
  isApprovedOrDecline: boolean = false;
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

  onApproved() {
    this.approveOrDecline(true);
  }

  onDecline() {
    this.approveOrDecline(false);
  }

  approveOrDecline(isApproved) {
    var dataToPost = {
      "approved": isApproved,
      "propertyTransferId": this.propertyDetailModel.propertyTransferId
    };

    this.transferPropertyService.transferCallback(dataToPost).subscribe(
      (data) => {
        if (data.status === 200) {
          this.isApprovedOrDecline=true;
          this.alertService.success(data.body.message);
          this.modelFileDownload = data.body.data;
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

  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(3);
  }

  downloadFile(item) {
    this.transferPropertyService.downloadFile(item.fileUrl).subscribe(
      (data) => {
        downloadFile(data, item.fileName + "-" + Date.now() + ".pdf", 'application/pdf');
      },
      (error) => {
        if (error.status === 400) {
            var errorMessage = '';
            JSON.parse( String.fromCharCode.apply(null, new Uint8Array(error.error)))[0].propertyList.forEach(element => {
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
