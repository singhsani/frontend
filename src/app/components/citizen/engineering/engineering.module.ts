import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { ContractorRegsitrationComponent } from './contractor-regsitration/contractor-regsitration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'vendor', pathMatch: 'full' },
  { path: 'vendor-registration/:id/:apiCode', component: VendorRegistrationComponent },
  { path: 'contractor-regsitration/:id/:apiCode', component: ContractorRegsitrationComponent },
  { path: 'vendor-registration/:id/:apiCode/:code', component: VendorRegistrationComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VendorRegistrationComponent,
    ContractorRegsitrationComponent]
})
export class EngineeringModule { }
