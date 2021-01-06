import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */
import { SharedBookingModule } from '../../shared-booking/shared-booking.module';
import { SwimmingPoolRoutingModule } from './swimming-pool-routing.module';
import { SwimmingPoolComponent } from './swimming-pool/swimming-pool.component';
import { SwimmingPoolRenewalComponent } from './swimming-pool-renewal/swimming-pool-renewal.component';
import { AppSwimmingPoolService } from './swimming-pool.service';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedBookingModule,
		SwimmingPoolRoutingModule
	],
	declarations: [SwimmingPoolComponent, SwimmingPoolRenewalComponent],
	providers: [
		AppSwimmingPoolService
	]
})
export class SwimmingPoolModule { }
