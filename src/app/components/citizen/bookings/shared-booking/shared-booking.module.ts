import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingFileUploadComponent } from './components/booking-file-upload/booking-file-upload.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  declarations: [BookingFileUploadComponent],
  exports: [
    BookingFileUploadComponent,
  ...MODULES],
  providers: [BookingService]
})
export class SharedBookingModule { }
