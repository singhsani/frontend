import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookPermissionComponent } from './book-permission/book-permission.component';
import { ShootingPermissionRoutingModule } from './shooting-permission-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { BookingFileUploadComponent } from '../booking-file-upload/booking-file-upload.component';

@NgModule({
  imports: [
    CommonModule,
    ShootingPermissionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BookPermissionComponent,BookingFileUploadComponent]
})
export class ShootingPermissionModule { }
