import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaxTransactionHistoryDataSharingService } from '../../Services/tax-transaction-history-data-sharing.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['taxName', 'billAmount', 'paidAmount'];
  dataSource = [];
  totalPaidAmount: number;
  totalBillAmount: number

  constructor(private taxTransactionHistoryDataSharingService: TaxTransactionHistoryDataSharingService) { }

  ngOnInit() {
    this.taxTransactionHistoryDataSharingService.getTaxDetail().subscribe(data => {
      this.dataSource = data;
      if (this.dataSource) {
        this.totalPaidAmount = this.dataSource.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
        this.totalBillAmount = this.dataSource.map(t => t.billAmount).reduce((acc, value) => acc + value, 0);
      }

    });
  }



  cancelForm() {
    this.taxTransactionHistoryDataSharingService.setIsShowDetail(false);
    this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(true);
  }
}