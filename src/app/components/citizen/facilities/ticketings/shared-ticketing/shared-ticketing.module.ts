import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { CoreModule } from '../../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketingsService } from './services/ticketings.service';
import { ZooDashboardComponent } from './components/zoo-dashboard/zoo-dashboard.component';
import { RouterModule } from '@angular/router';
import { TicketingFileUploadComponent } from './components/ticketing-file-upload/ticketing-file-upload.component';

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
  declarations: [ZooDashboardComponent, TicketingFileUploadComponent],
  exports : [
    TicketingFileUploadComponent,
    ...MODULES
  ],
  providers : [TicketingsService]
})
export class SharedTicketingModule { }
