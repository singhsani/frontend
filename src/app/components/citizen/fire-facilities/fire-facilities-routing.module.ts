import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
	{ path: 'provisionalFireNoc/:id/:apiCode', component: ProvisionalNocComponent },
	{ path: 'finalFireNoc/:id/:apiCode', component: FinalFireNocComponent },
	{ path: 'renewalFireNoc/:id/:apiCode', component: FireRenewalNocComponent },
	{ path: 'waterTankerSupply/:id/:apiCode', component: WaterTankerAppComponent },
	{ path: 'deadBodyWan/:id/:apiCode', component: DeadBodyWanComponent },
	{ path: 'temporaryStructureNoc/:id/:apiCode', component: TempStructureNocComponent },
	{ path: 'temporaryFireworkShopNoc/:id/:apiCode', component: TempFireworksNocComponent },
	{ path: 'gasConnectionNoc/:id/:apiCode', component: GasConnectionNocComponent },
	{ path: 'electricConnectionNoc/:id/:apiCode', component: EleConnectionNocComponent },
	{ path: 'navratriNoc/:id/:apiCode', component: NavratriNocComponent },
	{ path: 'revisedFireNoc/:id/:apiCode', component: RevisedFireNOCComponent },
	{ path: 'provisionalHospitalNoc/:id/:apiCode', component: ProHospitalNocComponent },
	{ path: 'finalHospitalNoc/:id/:apiCode', component: FinalHospitalNocComponent },
	{ path: 'fireCertificate/:id/:apiCode', component: FireCertificateComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FireFacilitiesRoutingModule { }
