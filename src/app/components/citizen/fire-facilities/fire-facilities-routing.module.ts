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
	{ path: ManageRoutes.getMainRoute('FS-AARO') + '/:id', component: AarogyaParvanoNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-PROVI') + '/:id', component: ProvisionalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FINAL') + '/:id', component: FinalFireNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-REN') + '/:id', component: FireRenewalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-WATER') + '/:id', component: WaterTankerAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-AMBU') + '/:id', component: AmbulanceAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-BODY') + '/:id', component: BodyWanAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-STRUCT') + '/:id', component: TempStructureNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FIREWORK') + '/:id', component: TempFireworksNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-GAS') + '/:id', component: GasConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-ELE') + '/:id', component: EleConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-NAV') + '/:id', component: NavratriNocComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FireFacilitiesRoutingModule { }
