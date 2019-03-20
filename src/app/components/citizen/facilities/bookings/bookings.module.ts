import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedBookingModule } from './shared-booking/shared-booking.module';
import { MyBookingComponent } from './components/my-booking/my-booking.component';
import { BookingDashboardComponent } from './components/booking-dashboard/booking-dashboard.component';

@NgModule({
  declarations: [MyBookingComponent, BookingDashboardComponent],

  imports: [
    CommonModule,
    BookingsRoutingModule,
    MyDatePickerModule,
    SharedBookingModule
  ],
})
export class BookingsModule { }
