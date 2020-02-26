import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NoDueCertificateComponent } from './Components/no-due-certificate/no-due-certificate.component';
import { NoDueCertificateService } from './Services/no-due-certificate.service';
import { NoDueCertificateSearchComponent } from './Components/no-due-certificate-search/no-due-certificate-search.component';
import { NoDueCertificateTableComponent } from './Components/no-due-certificate-table/no-due-certificate-table.component';
import { NoDueCertificateDataSharingService } from './Services/no-due-certificate-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';

const routes: Routes = [
  { path: '', component: NoDueCertificateComponent }
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
    NoDueCertificateComponent,
    NoDueCertificateSearchComponent,
    NoDueCertificateTableComponent    
  ],
  providers: [
    NoDueCertificateService,
    NoDueCertificateDataSharingService
  ]
})
export class NoDueCertificateModule { }
