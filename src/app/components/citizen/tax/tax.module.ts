import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from './../../../config/routes-conf';
import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getPrefixRoute('PROPERTYMODULE'), pathMatch: 'full' },
  { path: ManageRoutes.getPrefixRoute('PROFESSIONALMODULE'), loadChildren: './professional-tax/professional-tax.module#ProfessionalTaxModule', canLoad: [AuthGuard] },
  { path: ManageRoutes.getPrefixRoute('PROPERTYMODULE'), loadChildren: './property/property.module#PropertyModule', canLoad: [AuthGuard] },
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class TaxModule { }
