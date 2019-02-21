import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */

import { StadiumRoutingModule } from './stadium-routing.module';
import { BookStadiumComponent } from './book-stadium/book-stadium.component';
import { SharedBookingModule } from '../shared-booking/shared-booking.module';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedBookingModule,
		StadiumRoutingModule
	],
	declarations: [BookStadiumComponent]
})
export class StadiumModule { }
