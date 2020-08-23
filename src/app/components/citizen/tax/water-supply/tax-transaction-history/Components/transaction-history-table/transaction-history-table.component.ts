import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxTransactionHistoryDataSharingService } from '../../Services/tax-transaction-history-data-sharing.service';
import { TaxTransactionHistoryService } from '../../Services/tax-transaction-history.service';
import { Subscription } from 'rxjs';
import { SearchModel } from '../../Models/tax-transaction-history.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { MatTableDataSource, MatSort } from '@angular/material';



@Component({
  selector: 'app-transaction-history-table',
  templateUrl: './transaction-history-table.component.html',
  styleUrls: ['./transaction-history-table.component.scss']
})
export class TransactionHistoryTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['date', 'transactionType', 'applicationNo', 'approvalDate'];
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;

  searchModel = new SearchModel();

  constructor(private taxTransactionHistoryDataSharingService: TaxTransactionHistoryDataSharingService,
    private taxTransactionHistoryService: TaxTransactionHistoryService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.taxTransactionHistoryDataSharingService.getsSearchModel().subscribe(data => {
      if (data) {
        this.searchModel = data;
      }
    });
    this.subscription = this.taxTransactionHistoryDataSharingService.getIsShowTransactionTable().subscribe(data => {
      if (data) {
        this.search();
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.taxTransactionHistoryService.getTransaction({ propertyNo: this.searchModel.propertyNo }).subscribe(
      (data) => {
        if (data.body.propertyTransactionDTOs.length == 0) {
          this.alertService.info('No Data Found!');
          this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(false);
          this.taxTransactionHistoryDataSharingService.setViewModel({});
        }
        else {
          var viewModel = {
            address: data.body.address,
            censusNo: data.body.censusNo,
            taxPayerName: data.body.taxPayerName
          }
          this.taxTransactionHistoryDataSharingService.setViewModel(viewModel);
          this.dataSource = new MatTableDataSource(data.body.propertyTransactionDTOs);
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(false);
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


  onPrint() {
    window.print();
  }

}
