import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ShopEstablishLicenceComponent } from './shop-establish-licence/shop-establish-licence.component';

import { ROUTEMAIN } from '../../../config/routes-conf';
import * as _ from 'lodash';

const routes: Routes = [
	{ path: '', redirectTo: _.get(ROUTEMAIN, 'SHOP-LIC.main'), pathMatch: 'full' },
	{ path: _.get(ROUTEMAIN, 'SHOP-LIC.main')+'/:id', component: ShopEstablishLicenceComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LicencesRoutingModule {}
