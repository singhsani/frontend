import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { PlanetariumComponent } from './planetarium/planetarium.component';
import { ChildrenTheaterComponent } from './children-theater/children-theater.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookingsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MyDatePickerModule,
    CoreModule
  ],
  declarations: [BookingDashboardComponent, CancelBookingComponent, PlanetariumComponent, ChildrenTheaterComponent]
})
export class BookingsModule { }
