import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketingsRoutingModule } from './ticketings-routing.module';
import { MyTicketingsComponent } from './components/my-ticketings/my-ticketings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedTicketingModule } from './shared-ticketing/shared-ticketing.module';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SharedTicketingModule,
    TicketingsRoutingModule
  ],
  declarations: [MyTicketingsComponent, DashboardComponent]
})
export class TicketingsModule {}
