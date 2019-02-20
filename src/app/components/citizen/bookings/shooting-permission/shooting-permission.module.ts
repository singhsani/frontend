import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookPermissionComponent } from './book-permission/book-permission.component';
import { ShootingPermissionRoutingModule } from './shooting-permission-routing.module';
import { SharedBookingModule } from '../shared-booking/shared-booking.module';

@NgModule({
  imports: [
    CommonModule,
    SharedBookingModule,
    ShootingPermissionRoutingModule
  ],
  declarations: [BookPermissionComponent]
})
export class ShootingPermissionModule { }
