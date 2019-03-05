import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketingsService } from './services/ticketings.service';

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
  declarations: [],
  exports : [
    ...MODULES
  ],
  providers : [TicketingsService]
})
export class SharedTicketingModule { }
