import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ShopLicNewComponent } from './shop-lic-new/shop-lic-new.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('SHOP-LIC'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('SHOP-LIC') + '/:id/:apiCode', component: ShopLicNewComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('SHOP-CAN') + '/:id/:apiCode', component: ShopLicNewComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('SHOP-DUP') + '/:id/:apiCode', component: ShopLicNewComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('SHOP-REN') + '/:id/:apiCode', component: ShopLicNewComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('SHOP-TRAF') + '/:id/:apiCode', component: ShopLicNewComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ShopAndEstablishmentRoutingModule { }
