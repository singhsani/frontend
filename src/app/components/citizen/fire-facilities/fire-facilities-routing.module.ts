import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../config/routes-conf';
import { ProvisionalNocComponent } from './provisional-noc/provisional-noc.component';
import { FinalFireNocComponent } from './final-fire-noc/final-fire-noc.component';
import { FireRenewalNocComponent } from './fire-renewal-noc/fire-renewal-noc.component';
import { WaterTankerAppComponent } from './water-tanker-app/water-tanker-app.component';
import { TempStructureNocComponent } from './temp-structure-noc/temp-structure-noc.component';
import { TempFireworksNocComponent } from './temp-fireworks-noc/temp-fireworks-noc.component';
import { GasConnectionNocComponent } from './gas-connection-noc/gas-connection-noc.component';
import { EleConnectionNocComponent } from './ele-connection-noc/ele-connection-noc.component';
import { NavratriNocComponent } from './navratri-noc/navratri-noc.component';
import { RevisedFireNOCComponent } from './revised-fire-noc/revised-fire-noc.component';
import { DeadBodyWanComponent } from './dead-body-wan/dead-body-wan.component';
import { ProHospitalNocComponent } from './pro-hospital-noc/pro-hospital-noc.component';
import { FinalHospitalNocComponent } from './final-hospital-noc/final-hospital-noc.component';
import { FireCertificateComponent } from './fire-certificate/fire-certificate.component';

const routes: Routes = [
	{ path: '', component: ProvisionalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-PROVI') + '/:id/:apiCode', component: ProvisionalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FINAL') + '/:id/:apiCode', component: FinalFireNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-REN') + '/:id/:apiCode', component: FireRenewalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-WATER') + '/:id/:apiCode', component: WaterTankerAppComponent },
	{ path: ManageRoutes.getMainRoute('FS-BODY') + '/:id/:apiCode', component: DeadBodyWanComponent },
	{ path: ManageRoutes.getMainRoute('FS-TEMPSTRUCT') + '/:id/:apiCode', component: TempStructureNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FIREWORKSHOP') + '/:id/:apiCode', component: TempFireworksNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-GAS') + '/:id/:apiCode', component: GasConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-ELE') + '/:id/:apiCode', component: EleConnectionNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-NAV') + '/:id/:apiCode', component: NavratriNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-REVISED') + '/:id/:apiCode', component: RevisedFireNOCComponent },
	{ path: ManageRoutes.getMainRoute('FS-PROVI-HOSPITAL') + '/:id/:apiCode', component: ProHospitalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS-FINAL-HOSPITAL') + '/:id/:apiCode', component: FinalHospitalNocComponent },
	{ path: ManageRoutes.getMainRoute('FS_FIRE_CERTIFICATE') + '/:id/:apiCode', component: FireCertificateComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FireFacilitiesRoutingModule { }
