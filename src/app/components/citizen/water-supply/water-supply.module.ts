import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaterSupplyRoutingModule } from './water-supply-routing.module';
import { WaterConnNewComponent } from './water-conn-new/water-conn-new.component';
import { WaterChangeOwnershipComponent } from './water-change-ownership/water-change-ownership.component';
import { WaterChangeUsageComponent } from './water-change-usage/water-change-usage.component';
import { WaterPermnantDisconComponent } from './water-permnant-discon/water-permnant-discon.component';
import { WaterPlumberLicComponent } from './water-plumber-lic/water-plumber-lic.component';
import { WaterPlumberLicRenewalComponent } from './water-plumber-lic-renewal/water-plumber-lic-renewal.component';
import { DrainageConnNewComponent } from './drainage-conn-new/drainage-conn-new.component';
import { DrainageDisconnComponent } from './drainage-disconn/drainage-disconn.component';
import { DrainageChangeOwnershipComponent } from './drainage-change-ownership/drainage-change-ownership.component';

@NgModule({
	imports: [
		CommonModule,
		WaterSupplyRoutingModule
	],
	declarations: [
		WaterConnNewComponent,
		WaterChangeOwnershipComponent,
		WaterChangeUsageComponent,
		WaterPermnantDisconComponent,
		WaterPlumberLicComponent,
		WaterPlumberLicRenewalComponent,
		DrainageConnNewComponent,
		DrainageDisconnComponent,
		DrainageChangeOwnershipComponent
	]
})
export class WaterSupplyModule { }
