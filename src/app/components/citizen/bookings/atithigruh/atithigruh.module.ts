import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtithigruhRoutingModule } from './atithigruh-routing.module';
import { BookAtithigruhComponent } from './book-atithigruh/book-atithigruh.component';
import { SharedBookingModule } from '../shared-booking/shared-booking.module';

@NgModule({
  imports: [
    CommonModule,
    SharedBookingModule,
    AtithigruhRoutingModule
  ],
  declarations: [BookAtithigruhComponent]
})
export class AtithigruhModule { }
