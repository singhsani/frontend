import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ApplicationReconnectionService } from '../../Services/application-reconnection.service';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';

@Component({
  selector: 'app-application-disconnection-approval',
  templateUrl: './approval.component.html'
})
export class ApprovalComponent implements OnInit {
  isPropertyApproved: boolean = false;
  modelFileDownload: any = [];
  isApproveOrDecline: boolean = false;
  isShowFinalApproveOrDecline: boolean = false;
  isShowBackButton: boolean = false;
  model: any = {};
  constructor(
    private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService,
    private applicationReconnectionService: ApplicationReconnectionService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getApprovalModel().subscribe(data => {
      if (data) {
        this.model = data;
        this.getDisConnectionDocuments();
      }
    });
  }

  ngOnDestroy() {
    this.applicationReconnectionDataSharingService.setApprovalModel(null);
  }

  onBack() {
    this.applicationReconnectionDataSharingService.setIsShowApproval(false);
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

    this.applicationReconnectionService.approveOrDecline(dataToPost).subscribe(
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
    this.applicationReconnectionService.finalApproveOrDecline(this.model.applicationNumber).subscribe(
      (data) => {
        if (data.status === 200) {
          this.alertService.success(data.body.message);
          this.isShowFinalApproveOrDecline = false;
          this.isShowBackButton=true;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  getDisConnectionDocuments() {
    this.applicationReconnectionService.getReconnectionDocuments(this.model.reconnectionId).subscribe(
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
    this.applicationReconnectionService.downloadFile(item.fileUrl).subscribe(
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
