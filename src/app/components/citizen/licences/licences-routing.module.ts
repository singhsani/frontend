import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';

import { ManageRoutes } from '../../../config/routes-conf';

//var manage_route_main = new manageRoutes();

const routes: Routes = [ ];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class LicencesRoutingModule {}