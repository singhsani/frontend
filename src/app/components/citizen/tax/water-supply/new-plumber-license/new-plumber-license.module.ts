import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NewPlumberLicenseComponent } from './Components/new-plumber-license/new-plumber-license.component';
import { NewPlumberLicenseService } from './Services/new-plumber-license.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { NewPlumberLicenseFormComponent } from './Components/new-plumber-license-form/new-plumber-license-form.component';
import { ApprovalComponent } from './Components/approval/approval.component';
import { NewPlumberLicenseDataSharingService } from './Services/new-plumber-license-data-sharing.service';


const routes: Routes = [
  { path: '', component: NewPlumberLicenseComponent }
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
    NewPlumberLicenseComponent,
    NewPlumberLicenseFormComponent,
    ApprovalComponent
    
  ],
  providers: [
    NewPlumberLicenseService,
    NewPlumberLicenseDataSharingService
  ]
})
export class NewPlumberLicenseModule { }
