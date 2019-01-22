import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';
import { PlanetariumComponent } from './planetarium/planetarium.component';
import { ChildrenTheaterComponent } from './children-theater/children-theater.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
// import { BookingFileUploadComponent } from './booking-file-upload/booking-file-upload.component';

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
  declarations: [BookingDashboardComponent, MyBookingComponent, PlanetariumComponent, ChildrenTheaterComponent],
  // exports :[BookingFileUploadComponent]
})
export class BookingsModule { }
