import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyTaxComponent } from './property-tax/property-tax.component';

const routes: Routes = [
  { path: '', redirectTo: 'property', pathMatch: 'full' },
  { path: 'property', component: PropertyTaxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }
