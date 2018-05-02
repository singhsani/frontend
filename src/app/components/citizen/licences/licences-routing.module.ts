import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ShopEstablishLicenceComponent } from './shop-establish-licence/shop-establish-licence.component';

import { ManageRoutes } from '../../../config/routes-conf';

//var manage_route_main = new manageRoutes();

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('SHOP-LIC'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('SHOP-LIC')+'/:id', component: ShopEstablishLicenceComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class LicencesRoutingModule {}