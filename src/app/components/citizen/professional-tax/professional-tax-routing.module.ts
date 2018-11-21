import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { PrcRegistrationComponent } from './prc-registration/prc-registration.component';
import { PecRegistrationComponent } from './pec-registration/pec-registration.component';

const routes: Routes = [
  { path: 'prc-registration', component: PrcRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'pec-registration', component: PecRegistrationComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalTaxRoutingModule { }
