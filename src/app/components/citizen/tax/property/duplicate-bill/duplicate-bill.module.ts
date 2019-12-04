import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import { DuplicateBillComponent } from './Components/duplicate-bill/duplicate-bill.component';
import { DuplicateBillService } from './Services/duplicate-bill.service';
import { DuplicateBillSearchComponent } from './Components/duplicate-bill-search/duplicate-bill-search.component';
import { DuplicateBillTableComponent } from './Components/duplicate-bill-table/duplicate-bill-table.component';
import { DuplicateBillDataSharingService } from './Services/duplicate-bill-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';



const routes: Routes = [
  { path: '', component: DuplicateBillComponent }
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
    DuplicateBillComponent,
    DuplicateBillSearchComponent,
    DuplicateBillTableComponent
    
  ],
  providers: [
    DuplicateBillService,
    DuplicateBillDataSharingService
  ]
})
export class DuplicateBillModule { }
