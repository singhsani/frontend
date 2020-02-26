import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssessmentCertificateComponent } from './Components/assessment-certificate/assessment-certificate.component';
import { AssessmentCertificateService } from './Services/assessment-certificate.service';
import { AssessmentCertificateSearchComponent } from './Components/assessment-certificate-search/assessment-certificate-search.component';
import { AssessmentCertificateTableComponent } from './Components/assessment-certificate-table/assessment-certificate-table.component';
import { AssessmentCertificateDataSharingService } from './Services/assessment-certificate-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';



const routes: Routes = [
  { path: '', component: AssessmentCertificateComponent }
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
    AssessmentCertificateComponent,
    AssessmentCertificateSearchComponent,
    AssessmentCertificateTableComponent

  ],
  providers: [
    AssessmentCertificateService,
    AssessmentCertificateDataSharingService
  ]
})
export class AssessmentCertificateModule { }
