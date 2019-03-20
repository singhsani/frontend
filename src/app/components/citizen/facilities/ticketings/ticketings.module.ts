import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketingsRoutingModule } from './ticketings-routing.module';
import { MyTicketingsComponent } from './components/my-ticketings/my-ticketings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedTicketingModule } from './shared-ticketing/shared-ticketing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedTicketingModule,
    TicketingsRoutingModule
  ],
  declarations: [MyTicketingsComponent, DashboardComponent]
})
export class TicketingsModule {}
