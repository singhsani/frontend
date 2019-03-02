import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */

import { BandRoutingModule } from './band-routing.module';
import { BandBookingListComponent } from './band-booking-list/band-booking-list.component';
import { BandBookingComponent } from './band-booking/band-booking.component';
import { SharedBookingModule } from '../../shared-booking/shared-booking.module';

@NgModule({
	imports: [
		CommonModule,
		SharedBookingModule,
		BandRoutingModule
	],
	declarations: [
		BandBookingListComponent,
		BandBookingComponent]
})
export class BandModule { }