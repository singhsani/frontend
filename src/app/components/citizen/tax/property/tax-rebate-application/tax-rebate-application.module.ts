import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TaxRebateApplicationComponent } from './Components/tax-rebate-application/tax-rebate-application.component';
import { TaxRebateApplicationService } from './Services/tax-rebate-application.service';
import { TaxRebateApplicationSearchComponent } from './Components/tax-rebate-application-search/tax-rebate-application-search.component';
import { TaxRebateApplicationTableComponent } from './Components/tax-rebate-application-table/tax-rebate-application-table.component';
import { TaxRebateApplicationDataSharingService } from './Services/tax-rebate-application-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { DetailComponent } from './Components/detail/detail.component';

const routes: Routes = [
  { path: '', component: TaxRebateApplicationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule
  ],
  declarations: [
    TaxRebateApplicationComponent,
    TaxRebateApplicationSearchComponent,
    TaxRebateApplicationTableComponent,
    DetailComponent
  ],
  providers: [
    TaxRebateApplicationService,
    TaxRebateApplicationDataSharingService
  ]
})
export class TaxRebateApplicationModule { }
