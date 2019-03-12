import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZooTicketingRoutingModule } from './zoo-ticketing-routing.module';
import { ZooBookingComponent } from './zoo-booking/zoo-booking.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { SharedTicketingModule } from '../../shared-ticketing/shared-ticketing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedTicketingModule,
    ZooTicketingRoutingModule
  ],
  declarations: [ZooBookingComponent]
})
export class ZooTicketingModule { }
