import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';

/* Import marriage certificate components start */
import { MarriageCreateComponent } from './marriage-create/marriage-create.component';
/* Import marriage certificate components end */

const routes: Routes = [
  { path: '', component: MarriageCreateComponent },
  { path: ManageRoutes.getMainRoute('MR') + '/:id', component: MarriageCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarriageRoutingModule { }
