import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AarogyaParvanoNocComponent } from './aarogya-parvano-noc/aarogya-parvano-noc.component';
import { ManageRoutes } from '../../../config/routes-conf';
import { ProvisionalNocComponent } from './provisional-noc/provisional-noc.component';
import { FinalFireNocComponent } from './final-fire-noc/final-fire-noc.component';
import { FireRenewalNocComponent } from './fire-renewal-noc/fire-renewal-noc.component';
import { WaterTankerAppComponent } from './water-tanker-app/water-tanker-app.component';
import { AmbulanceAppComponent } from './ambulance-app/ambulance-app.component';
import { BodyWanAppComponent } from './body-wan-app/body-wan-app.component';
import { TempStructureNocComponent } from './temp-structure-noc/temp-structure-noc.component';
import { TempFireworksNocComponent } from './temp-fireworks-noc/temp-fireworks-noc.component';
import { GasConnectionNocComponent } from './gas-connection-noc/gas-connection-noc.component';
import { EleConnectionNocComponent } from './ele-connection-noc/ele-connection-noc.component';
import { NavratriNocComponent } from './navratri-noc/navratri-noc.component';

const routes: Routes = [
	{ path: '', component: AarogyaParvanoNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-AARO') + '/:id/:apiCode', component: AarogyaParvanoNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-PROVI') + '/:id/:apiCode', component: ProvisionalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FINAL') + '/:id/:apiCode', component: FinalFireNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-REN') + '/:id/:apiCode', component: FireRenewalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-WATER') + '/:id/:apiCode', component: WaterTankerAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-AMBU') + '/:id/:apiCode', component: AmbulanceAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-BODY') + '/:id/:apiCode', component: BodyWanAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-TEMPSTRUCT') + '/:id/:apiCode', component: TempStructureNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FIREWORKSHOP') + '/:id/:apiCode', component: TempFireworksNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-GAS') + '/:id/:apiCode', component: GasConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-ELE') + '/:id/:apiCode', component: EleConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-NAV') + '/:id/:apiCode', component: NavratriNocComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FireFacilitiesRoutingModule { }
