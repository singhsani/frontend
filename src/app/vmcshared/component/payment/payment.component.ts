import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { PaymentModel, PaymentDetail } from './payment.model';
import { PaymentDataSharingService } from './payment-data-sharing.service';
import { PaymentService } from './payment.service';
import { downloadFile } from '../../downloadFile';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

  subscription: Subscription;
  paymentModel: PaymentModel;
  model: any = {};
  paymentModeList = [];
  bankList = [];
  branchList = [];
  paymentModeItemCode = Constants.ItemCodes;
  paymentMode: string = Constants.ItemCodes.Payment_Mode_Cash;
  pamentFromOption: string;
  modelFileDownload: any = [];
  isHideGenerateButton: boolean = false;
  instrumentDateMax: Date = new Date();
  instrumentDateMin: Date = new Date();

  constructor(
    private commonService: CommonService,
    private paymentDataSharingService: PaymentDataSharingService,
    private paymentService: PaymentService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.instrumentDateMin.setMonth(this.instrumentDateMin.getMonth() - 3);
    this.isHideGenerateButton = false;
    this.paymentModel = new PaymentModel();
    this.paymentModel.paymentDetail = new PaymentDetail();
    this.modelFileDownload = [];
    this.model = [];
    this.paymentDataSharingService.observableDataModel.subscribe(data => {
      if (data) {
        this.model = data;
      }
    });
    this.paymentDataSharingService.observablePamentFromOption.subscribe(data => {
      this.pamentFromOption = data;
    });

    this.subscription = this.paymentDataSharingService.observableDataModelFileDownload.subscribe(data => {
      if (data) {
        this.modelFileDownload = data;
      }
    });

    this.getLookups();
    this.getBankList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.paymentDataSharingService.updatedDataModelFileDownload(null);
    this.paymentDataSharingService.updatedIsPaymentForExtractProperty(false);
    this.paymentDataSharingService.updatedIsPaymentForNoDueCertificate(false);
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Paymode_Mode}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.paymentModeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Paymode_Mode))[0].items;
      this.paymentModel.paymentDetail.paymentModeLookupId = this.paymentModeList.filter(f => f.itemCode == Constants.ItemCodes.Payment_Mode_Cash)[0].itemId;
    });
  }

  onChangeBank(val) {
    this.branchList = [];
    this.paymentModel.paymentDetail.branchId = null;
    if (val)
      this.getBranchlist(val);
  }

  getBankList() {
    this.paymentService.getBankList().subscribe(
      (data) => {
        if (data.status === 200) {
          this.bankList = data.body.data;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getBranchlist(val) {
    this.paymentService.getBranchList(val).subscribe(
      (data) => {
        if (data.status === 200) {
          this.branchList = data.body.data;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  cancelForm() {
    if (this.pamentFromOption == Constants.Payment_From_Option.Extract_Property) {
      this.paymentDataSharingService.updatedIsCancelForExtractProperty(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.No_Due_Certificate) {
      this.paymentDataSharingService.updatedIsCancelForNoDueCertificate(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.Duplicate_Bill) {
      this.paymentDataSharingService.updatedIsCancelForDuplicateBill(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.Assessment_Certificate) {
      this.paymentDataSharingService.updatedIsCancelForAssessmentCertificate(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.Property_Collection) {
      this.paymentDataSharingService.updatedIsCancelForPropertyCollection(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.Water_Collection) {
      this.paymentDataSharingService.updatedIsCancelForWaterCollection(true);
    }
    if (this.pamentFromOption == Constants.Payment_From_Option.LOI_COLLECTION) {
      this.paymentDataSharingService.updatedIsCancelForLOICollection(true);
    }
  }

  onChangePaymentMode(event) {
    var obj = this.paymentModeList.filter(f => f.itemId == event.value)[0];
    this.paymentMode = obj.itemCode;
    this.paymentModel = new PaymentModel();
    this.paymentModel.paymentDetail = new PaymentDetail();
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.paymentDataSharingService.updatedPamentModel(this.paymentModel);
      if (this.pamentFromOption == Constants.Payment_From_Option.Extract_Property) {
        this.paymentDataSharingService.updatedIsPaymentForExtractProperty(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.No_Due_Certificate) {
        this.paymentDataSharingService.updatedIsPaymentForNoDueCertificate(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.Duplicate_Bill) {
        this.paymentDataSharingService.updatedIsPaymentForDuplicateBill(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.Assessment_Certificate) {
        this.paymentDataSharingService.updatedIsPaymentForAssessmentCertificate(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.Property_Collection) {
        this.paymentDataSharingService.updatedIsPaymentForPropertyCollection(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.Water_Collection) {
        this.paymentDataSharingService.updatedIsPaymentForWaterCollection(true);
      }
      if (this.pamentFromOption == Constants.Payment_From_Option.LOI_COLLECTION) {
        this.paymentDataSharingService.updatedIsPaymentForLOICollection(true);
      }
      this.isHideGenerateButton = true;
    }
  }

  downloadFile(item) {
    this.paymentService.downloadFile(item.fileUrl).subscribe(
      (data) => {
        downloadFile(data, item.fileName + "-" + Date.now() + ".pdf", 'application/pdf');
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }
}