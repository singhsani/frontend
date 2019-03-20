import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */
import { SharedBookingModule } from '../../shared-booking/shared-booking.module';
import { SwimmingPoolRoutingModule } from './swimming-pool-routing.module';
import { SwimmingPoolComponent } from './swimming-pool/swimming-pool.component';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedBookingModule,
		SwimmingPoolRoutingModule
	],
	declarations: [SwimmingPoolComponent]
})
export class SwimmingPoolModule { }
