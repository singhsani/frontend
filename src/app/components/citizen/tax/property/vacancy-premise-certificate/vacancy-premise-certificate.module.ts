import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { VacancyPremiseCertificateComponent } from './Components/vacancy-premise-certificate/vacancy-premise-certificate.component';
import { VacancyPremiseCertificateService } from './Services/vacancy-premise-certificate.service';
import { VacancyPremiseCertificateSearchComponent } from './Components/vacancy-premise-certificate-search/vacancy-premise-certificate-search.component';
import { VacancyPremiseCertificateTableComponent } from './Components/vacancy-premise-certificate-table/vacancy-premise-certificate-table.component';
import { VacancyPremiseCertificateDataSharingService } from './Services/vacancy-premise-certificate-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { BankDetailComponent } from './Components/bank-detail/bank-detail.component';

const routes: Routes = [
  { path: '', component: VacancyPremiseCertificateComponent }
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
    VacancyPremiseCertificateComponent,
    VacancyPremiseCertificateSearchComponent,
    VacancyPremiseCertificateTableComponent,
    BankDetailComponent
  ],
  providers: [
    VacancyPremiseCertificateService,
    VacancyPremiseCertificateDataSharingService
  ]
})
export class VacancyPremiseCertificateModule { }
