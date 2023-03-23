import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingFileUploadComponent } from './components/booking-file-upload/booking-file-upload.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from './services/booking-service.service';
import { SwimmingPoolDashboardComponent } from './components/swimming-pool-dashboard/swimming-pool-dashboard.component';
import { RouterModule } from '@angular/router';

const MODULES = [
  SharedModule,
  CoreModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
]

@NgModule({
  imports: [
    CommonModule,
    ...MODULES
  ],
  declarations: [BookingFileUploadComponent, SwimmingPoolDashboardComponent],
  exports: [
    BookingFileUploadComponent,
    SwimmingPoolDashboardComponent,
  ...MODULES],
  providers: [BookingService]
})
export class SharedBookingModule { }
