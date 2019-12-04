import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentModel, PaymentDetail } from './payment.model';
import { PaymentDataSharingService } from './payment-data-sharing.service';
import { PaymentService } from './payment.service';
import { downloadFile } from '../../downloadFile';
import { CommonService } from '../../Services/common-service';
import { AlertService } from '../../Services/alert.service';

@Component({
  selector: 'app-response-download-list',
  templateUrl: './response.download.list.html',
  styleUrls: ['./payment.component.scss']
})

export class ResponseDownloadListComponent implements OnInit {

  subscription: Subscription;
  modelFileDownload: any = [];
  

  constructor(
    private commonService: CommonService,
    private paymentDataSharingService: PaymentDataSharingService,
    private paymentService: PaymentService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.subscription = this.paymentDataSharingService.observableDataModelFileDownload.subscribe(data => {
      if (data) {
        this.modelFileDownload = data;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.paymentDataSharingService.updatedDataModelFileDownload(null);
  }

  downloadFile(item) {
    this.paymentService.downloadFile(item.fileUrl).subscribe(
      (data) => {
        downloadFile(data, item.fileName + "-" + Date.now() + ".pdf", 'application/pdf');
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      })
  }
}