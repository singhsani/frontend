import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { FireFacilitiesRoutingModule } from './fire-facilities-routing.module';
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
import { AarogyaParvanoNocComponent } from './aarogya-parvano-noc/aarogya-parvano-noc.component';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		FireFacilitiesRoutingModule
	],
	declarations: [ProvisionalNocComponent, FinalFireNocComponent, FireRenewalNocComponent, WaterTankerAppComponent, AmbulanceAppComponent, BodyWanAppComponent, TempStructureNocComponent, TempFireworksNocComponent, GasConnectionNocComponent, EleConnectionNocComponent, NavratriNocComponent, AarogyaParvanoNocComponent]
})
export class FireFacilitiesModule { }
