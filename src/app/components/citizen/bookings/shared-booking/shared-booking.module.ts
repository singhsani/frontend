import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingFileUploadComponent } from './components/booking-file-upload/booking-file-upload.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingDashboardComponent } from './components/booking-dashboard/booking-dashboard.component';
import { MyBookingComponent } from './components/my-booking/my-booking.component';
import { BookingService } from './services/booking-service.service';

const MODULES = [
  SharedModule,
  CoreModule,
  FormsModule,
  ReactiveFormsModule
]

@NgModule({
  imports: [
    CommonModule,
    ...MODULES
  ],
  declarations: [BookingFileUploadComponent, BookingDashboardComponent, MyBookingComponent],
  exports: [
    BookingFileUploadComponent,
    BookingDashboardComponent,
    MyBookingComponent,
  ...MODULES],
  providers: [BookingService]
})
export class SharedBookingModule { }
