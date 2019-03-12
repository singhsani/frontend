import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketingsService } from './services/ticketings.service';
import { ZooDashboardComponent } from './components/zoo-dashboard/zoo-dashboard.component';
import { TicketingsRoutingModule } from '../ticketings-routing.module';
import { RouterModule } from '@angular/router';


const MODULES = [
  SharedModule,
  CoreModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];

@NgModule({
  imports: [
    CommonModule,
    ...MODULES
  ],
  declarations: [ZooDashboardComponent],
  exports : [
    ...MODULES
  ],
  providers : [TicketingsService]
})
export class SharedTicketingModule { }
