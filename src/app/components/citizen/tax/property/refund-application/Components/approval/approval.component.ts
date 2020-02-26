import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { RefundApplicationDataSharingService } from '../../Services/refund-application-data-sharing.service';
import { RefundApplicationService } from '../../Services/refund-application.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';

@Component({
  selector: 'app-refund-application-approval',
  templateUrl: './approval.component.html'
})
export class ApprovalComponent implements OnInit {
  subscription: Subscription;
  isApproved: boolean = false;
  modelFileDownload: any = [];
  isApproveOrDecline: boolean = false;
  model: any = {};
  constructor(
    private refundApplicationDataSharingService: RefundApplicationDataSharingService,
    private refundApplicationService: RefundApplicationService,
    private commonService:CommonService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.refundApplicationDataSharingService.getRefundModel().subscribe(data => {
      this.model = data;
      this.modelFileDownload = data.responseDTOList;
    });
  }

  ngOnDestroy() {

  }

  onBack() {
    this.refundApplicationDataSharingService.setIsBack(true);
  }


  onDecline() {
    this.refundApplicationService.reject(this.model).subscribe(
      (data) => {
        this.isApproveOrDecline = true;
        //downloadFile(data, "reject-receipt-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
      },
      (error) => {
        this.commonService.callErrorResponse(error);
    });
  }

  onApprove() {
    this.refundApplicationService.approve(this.model).subscribe(
      (data) => {
        if (data.status === 200) {
          this.alertService.success(data.body.message);
          this.isApproveOrDecline = true;
          this.modelFileDownload = data.body.data.responseDTOList;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }


  downloadFile(item) {
    this.refundApplicationService.downloadFile(item.fileUrl).subscribe(
      (data) => {
        downloadFile(data, item.fileName + "-" + Date.now() + ".pdf", 'application/pdf');
      },
      (error) => {
        this.commonService.callErrorResponse(error);
    });
  }
}
