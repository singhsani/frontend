import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';

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
  declarations: [BookingDashboardComponent]
})
export class BookingsModule { }
