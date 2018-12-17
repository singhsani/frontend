import { ManageRoutes } from './../../../config/routes-conf';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { PrcRegistrationComponent } from './prc-registration/prc-registration.component';
import { PecRegistrationComponent } from './pec-registration/pec-registration.component';

const routes: Routes = [
  { path: ManageRoutes.getMainRoute('PEC_REG') + '/:id/:apiCode', component: PecRegistrationComponent, canActivate: [AuthGuard] },
  { path: ManageRoutes.getMainRoute('PRC_REG'), component: PrcRegistrationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalTaxRoutingModule { }
