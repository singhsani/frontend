import { Component, OnInit, ViewChild } from '@angular/core';
import { NewWaterConnectionEntryService } from '../../Services/new-water-connection-entry.service';
import { Subscription } from 'rxjs';
import { NewWaterConnectionEntryDataSharingService } from '../../Services/new-water-connection-entry-data-sharing.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-property-approval',
  templateUrl: './property-approval.component.html',
  styleUrls: ['./property-approval.component.scss']
})
export class PropertyApprovalComponent implements OnInit {
  subscription: Subscription;
  subscriptionDoc: Subscription;
  isPropertyApproved: boolean = false;
  modelFileDownload: any = [];
  isApproveOrDecline: boolean = false;
  isShowFinalApproveOrDecline: boolean = false;
  model: any = {};
  constructor(
    private newNewWaterConnectionEntryDataSharingService: NewWaterConnectionEntryDataSharingService,
    private newNewWaterConnectionEntryService: NewWaterConnectionEntryService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.newNewWaterConnectionEntryDataSharingService.observableNewWaterConnectionEntry.subscribe((data) => {
      if (data != null) {
        this.model = data;
      }
    })
    this.subscriptionDoc = this.newNewWaterConnectionEntryDataSharingService.observableIsShowDocument.subscribe((data) => {
      if (data) {
        this.getNewWaterConnectionDocuments();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionDoc.unsubscribe();
  }

  onBackClick() {
    this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(0);
  }

  onApprove() {
    this.approveOrDecline(true);
  }

  onDecline() {
    this.approveOrDecline(false);
  }

  approveOrDecline(isApproved) {
    var dataToPost = {
      "approved": isApproved,
      "applicationNo": this.model.applicationNumber
    };

    this.newNewWaterConnectionEntryService.approveOrDecline(dataToPost).subscribe(
      (data) => {
        if (data.status === 200) {
          this.alertService.success(data.body.message);
          this.isApproveOrDecline = true;
          this.isShowFinalApproveOrDecline = true;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  finalApproveOrDecline() {
    this.newNewWaterConnectionEntryService.finalApproveOrDecline(this.model.applicationNumber).subscribe(
      (data) => {
        if (data.status === 200) {
          this.alertService.success(data.body.message);
          this.isShowFinalApproveOrDecline = false;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  getNewWaterConnectionDocuments() {
    this.newNewWaterConnectionEntryService.getNewWaterConnectionDocuments(this.model.connectionDtlId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.modelFileDownload = data.body.data.documents;
        }
      },
      (error) => {
         this.alertService.error(error.error.message);
      });
  }

  downloadFile(item) {
    this.newNewWaterConnectionEntryService.downloadFile(item.fileUrl).subscribe(
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
