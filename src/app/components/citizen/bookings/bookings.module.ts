import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { MyDatePickerModule } from 'mydatepicker';
import { PlanetariumComponent } from './planetarium/planetarium.component';
import { SharedBookingModule } from './shared-booking/shared-booking.module';

@NgModule({
  declarations: [
    PlanetariumComponent
  ],

  imports: [
    CommonModule,
    BookingsRoutingModule,
    MyDatePickerModule,
    SharedBookingModule,
  ],
})
export class BookingsModule { }
