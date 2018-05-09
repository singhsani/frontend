import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';

import { ManageRoutes } from '../../../config/routes-conf';
import { AnimalPondModule } from './animal-pond/animal-pond.module';
import { MuttonFishModule } from './mutton-fish/mutton-fish.module';
import { ShopAndEstablishmentModule } from './shop-and-establishment/shop-and-establishment.module';

//var manage_route_main = new manageRoutes();

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('SHOPANDESTAMODULE'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('ANIMALPONDMODULE'), loadChildren: () => AnimalPondModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('MUTTONFISHMODULE'), loadChildren: () => MuttonFishModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('SHOPANDESTAMODULE'), loadChildren: () => ShopAndEstablishmentModule, canLoad: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class LicencesRoutingModule {}