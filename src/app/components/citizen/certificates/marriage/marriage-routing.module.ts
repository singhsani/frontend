import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';

/* Import marriage certificate components start */
import { MarriageCreateComponent } from './marriage-create/marriage-create.component';
import { MarriageDuplicateComponent } from './marriage-duplicate/marriage-duplicate.component';
/* Import marriage certificate components end */

const routes: Routes = [
	{ path: '', component: MarriageCreateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-MR') + '/:id/:apiCode', component: MarriageCreateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPMR') + '/:id/:apiCode', component: MarriageDuplicateComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MarriageRoutingModule { }
