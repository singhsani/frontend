import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RenewalPlumberLicenseComponent } from './Components/renewal-plumber-license/renewal-plumber-license.component';
import { RenewalPlumberLicenseService } from './Services/renewal-plumber-license.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { RenewalPlumberLicenseFormComponent } from './Components/renewal-plumber-license-form/renewal-plumber-license-form.component';
import { RenewalPlumberLicenseDataSharingService } from './Services/new-plumber-license-data-sharing.service';
import { ApprovalComponent } from './Components/approval/approval.component';


const routes: Routes = [
  { path: '', component: RenewalPlumberLicenseComponent }
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
    RenewalPlumberLicenseComponent,
    RenewalPlumberLicenseFormComponent,
    ApprovalComponent
  ],
  providers: [
    RenewalPlumberLicenseService,
    RenewalPlumberLicenseDataSharingService
  ]
})
export class RenewalPlumberLicenseModule { }
