import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZooRoutingModule } from './zoo-routing.module';
import { ZooBookingComponent } from './zoo-booking/zoo-booking.component';
import { SharedTicketingModule } from '../../shared-ticketing/shared-ticketing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedTicketingModule,
    ZooRoutingModule
  ],
  declarations: [ZooBookingComponent]
})
export class ZooTicketingModule { }
