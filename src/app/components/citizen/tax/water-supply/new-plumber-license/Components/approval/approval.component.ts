import { Component, OnInit } from '@angular/core';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NewPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';
import { NewPlumberLicenseService } from '../../Services/new-plumber-license.service';

@Component({
  selector: 'app-new-plumber-license-approval',
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
    private newPlumberLicenseDataSharingService: NewPlumberLicenseDataSharingService,
    private newPlumberLicenseService: NewPlumberLicenseService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.newPlumberLicenseDataSharingService.getApprovalModel().subscribe(data => {
      if (data) {
        this.model = data;
        this.getDisConnectionDocuments();
      }
    });
  }

  ngOnDestroy() {
    this.newPlumberLicenseDataSharingService.setApprovalModel(null);
  }

  onBack() {
    this.newPlumberLicenseDataSharingService.setIsShowApproval(false);
    this.newPlumberLicenseDataSharingService.setIsShowForm(true);
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

    this.newPlumberLicenseService.approveOrDecline(dataToPost).subscribe(
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
    this.newPlumberLicenseService.finalApproveOrDecline(this.model.applicationNumber).subscribe(
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
    this.newPlumberLicenseService.getPlumberLicenseDocuments(this.model.plumberLicenseId).subscribe(
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
    this.newPlumberLicenseService.downloadFile(item.fileUrl).subscribe(
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
