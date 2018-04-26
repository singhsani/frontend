import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../core/guard/auth.guard';

/* Import all components start */
import { PropertyTaxComponent } from './property-tax/property-tax.component';
/* Import all components end */

const routes: Routes = [
  { path: '', redirectTo: 'property', pathMatch: 'full' },
  { path: 'property', component: PropertyTaxComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }
