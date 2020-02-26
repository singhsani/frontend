import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';

const routes: Routes = [
  { path: 'professional', loadChildren: './professional-tax/professional-tax.module#ProfessionalTaxModule', canLoad: [AuthGuard] },
  { path: 'property', loadChildren: './property/property.module#PropertyModule', canLoad: [AuthGuard] },
  { path: "vehicle", loadChildren: './vehicle/vehicle.module#VehicleModule', canLoad: [AuthGuard] },
  { path: "water-supply", loadChildren: './water-supply/water-supply.module#WaterSupplyModule', canLoad: [AuthGuard] },
  { path: 'water-drinage', loadChildren: '../water-drinage/water-drinage.module#WaterDrinageModule', canLoad: [AuthGuard] },
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
