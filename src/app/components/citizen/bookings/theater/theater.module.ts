import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */
import { TheaterRoutingModule } from './theater-routing.module';
import { BookTheaterComponent } from './book-theater/book-theater.component';
import { SharedBookingModule } from '../shared-booking/shared-booking.module';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedBookingModule,
		TheaterRoutingModule
	],
	declarations: [BookTheaterComponent]
})
export class TheaterModule { }
