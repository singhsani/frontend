import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillPrintingComponent } from './components/bill-printing/bill-printing.component';
import { BillPrintingFormComponent } from './components/bill-printing-form/bill-printing-form.component';
import { BillPrintingTableComponent } from './components/bill-printing-table/bill-printing-table.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillprintingserviceService } from './services/billprintingservice.service';
import { BillprintingdatasharingserviceService } from './services/billprintingdatasharingservice.service';

const routes: Routes = [
  { path: '', component: BillPrintingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    BillPrintingComponent, 
    BillPrintingFormComponent, 
    BillPrintingTableComponent],
  providers: [
    BillprintingserviceService,
    BillprintingdatasharingserviceService
  ]
})
export class BillPrintingModule { }
