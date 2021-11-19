import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { TaxTransactionHistoryDataSharingService } from '../../Services/tax-transaction-history-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { SearchModel } from '../../Models/tax-transaction-history.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tax-transaction-history-search',
  templateUrl: './tax-transaction-history-search.component.html',
  styleUrls: ['./tax-transaction-history-search.component.scss']
})
export class TaxTransactionHistorySearchComponent implements OnInit, OnDestroy {

  searchModel = new SearchModel();
  transactionTypeList = [];
  viewModel: any = {};
  viewModelSubscription: Subscription
  @ViewChild('formDetail') mytemplateForm : NgForm;
  constructor(
    private commonService: CommonService,
    private taxTransactionHistoryDataSharingService: TaxTransactionHistoryDataSharingService
  ) { }

  ngOnInit() {
    this.getLookups();
  }

  ngOnDestroy() {
    this.taxTransactionHistoryDataSharingService.setViewModel(null);
    this.viewModelSubscription.unsubscribe();
    this.viewModel = {};
  }


  getLookups() {
    const lookupcode = `lookup_codes=${Constants.LookupCodes.History_Transaction_Type}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.transactionTypeList = Object.assign([], data)
        .filter(f => f.lookupCode.includes(Constants.LookupCodes.History_Transaction_Type))[0].items;
    });
    this.viewModelSubscription = this.taxTransactionHistoryDataSharingService.getViewModel().subscribe(data => {
      if (data) {
        this.viewModel = data;
      }
    });
  }


  search(form: NgForm) {
    if (form.form.valid) {
      this.taxTransactionHistoryDataSharingService.setSearchModel(this.searchModel);
      var objType = this.transactionTypeList.filter(f => f.itemCode == Constants.ItemCodes.Property_History)[0];
      if (this.searchModel.transactionTypeId == objType.itemId) {
        this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(false);
        this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(true);
      }
      else {
        this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(false);
        this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(true);
      }
    }
  }

  clear(pForm: NgForm) {
     this.searchModel = new SearchModel();
     this.viewModel.censusNo = null;
     this.viewModel.taxPayerName = null;
     this.viewModel.address = null;
     this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(false);
     this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(false);
     pForm.resetForm();
  }
}
