import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxTransactionHistoryDataSharingService } from '../../Services/tax-transaction-history-data-sharing.service';
import { TaxTransactionHistoryService } from '../../Services/tax-transaction-history.service';
import { Subscription } from 'rxjs';
import { SearchModel } from '../../Models/tax-transaction-history.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { CollectionService } from '../../Services/collection.service';



@Component({
  selector: 'app-tax-history-table',
  templateUrl: './tax-history-table.component.html',
  styleUrls: ['./tax-history-table.component.scss']
})
export class TaxHistoryTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns1: string[] = ['date', 'financialYearName', 'billType', 'billNo', 'billDate', 'occupierName', 'billAmt', 'paidAmt', 'outstandingAmt', 'action'];
  dataSource1: any = [];

  displayedColumns2: string[] = ['date', 'receiptType', 'receiptNo', 'receiptDate', 'payerName', 'paidAmt', 'rebateAmt', 'advanceAmt', 'action'];
  dataSource2: any = [];

  isFoundBillDetail = true;
  isFoundRecieptDetail = true;
  searchModel = new SearchModel();

  constructor(private taxTransactionHistoryDataSharingService: TaxTransactionHistoryDataSharingService,
    private taxTransactionHistoryService: TaxTransactionHistoryService,
    private collectionService:CollectionService,
    private commonService:CommonService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.taxTransactionHistoryDataSharingService.getsSearchModel().subscribe(data => {
      if (data) {
        this.searchModel = data;
      }
    });
    this.subscription = this.taxTransactionHistoryDataSharingService.getIsShowHistoryTable().subscribe(data => {
      if (data) {
        this.search();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.taxTransactionHistoryService.getBillReceipts({ propertyNo: this.searchModel.propertyNo }).subscribe(
      (data) => {
        var viewModel = {
          address: data.body.address,
          censusNo: data.body.censusNo,
          taxPayerName: data.body.taxPayerName
        }
        this.taxTransactionHistoryDataSharingService.setViewModel(viewModel);
        this.dataSource1 = new MatTableDataSource(data.body.billDTOs);
        this.dataSource2 = new MatTableDataSource(data.body.receiptDTOs);

        this.isFoundBillDetail = data.body.billDTOs.length > 0;
        this.isFoundRecieptDetail = data.body.receiptDTOs.length > 0;

      },
      (error) => {
        this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(false);
        this.taxTransactionHistoryDataSharingService.setViewModel({});
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

  onDetailClick(item) {
    if (item.taxDTOs) {
      this.taxTransactionHistoryDataSharingService.setTaxDetail(item.taxDTOs);
    }
    else {
      this.taxTransactionHistoryDataSharingService.setTaxDetail(null);
    }
    this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(false);
    this.taxTransactionHistoryDataSharingService.setIsShowDetail(true);
  }

  onPrint() {
    // var printContents = document.getElementById('printArea').innerHTML;
    // var originalContents = document.body.innerHTML;

    // document.body.innerHTML = printContents;

    window.print();

    // document.body.innerHTML = originalContents;
  }

  onDownloaReceipt(receiptId:number) {
    this.collectionService.downloadReceipt(receiptId).subscribe(
      (data) => {
          downloadFile(data, "receipt-" + Date.now() + ".pdf", 'application/pdf');
      },
      (error) => {
          this.commonService.callErrorResponse(error);
      }
    );
  }

  deleteReceipt(receiptId:number) {
    this.alertService.confirm();
        var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
            if (isConfirm) {
                this.collectionService.deleteReceipt(receiptId).subscribe(
                    (data) => {
                        this.alertService.info(data.body.message);
                        this.search();
                    },
                    (error) => {
                        this.commonService.callErrorResponse(error);
                });
            }
            subConfirm.unsubscribe();
        });
  }
}
