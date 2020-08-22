import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { TaxTransactionHistoryComponent } from './Components/tax-transaction-history/tax-transaction-history.component';
import { TaxTransactionHistoryService } from './Services/tax-transaction-history.service';
import { TaxTransactionHistorySearchComponent } from './Components/tax-transaction-history-search/tax-transaction-history-search.component';
import { TransactionHistoryTableComponent } from './Components/transaction-history-table/transaction-history-table.component';
import { TaxHistoryTableComponent } from './Components/tax-history-table/tax-history-table.component';
import { TaxTransactionHistoryDataSharingService } from './Services/tax-transaction-history-data-sharing.service';
import { DetailComponent } from './Components/detail/detail.component';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { CollectionService } from './Services/collection.service';


const routes: Routes = [
  { path: '', component: TaxTransactionHistoryComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedComponentModule
  ],
  declarations: [
    TaxTransactionHistoryComponent,
    TaxTransactionHistorySearchComponent,
    TaxHistoryTableComponent,
    TransactionHistoryTableComponent,
    DetailComponent    
  ],
  providers: [
    CollectionService,
    TaxTransactionHistoryService,
    TaxTransactionHistoryDataSharingService
  ]
})
export class TaxTransactionHistoryModule { }
