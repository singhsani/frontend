import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { TownHallComponent } from './town-hall/town-hall.component';

@NgModule({
  imports: [
    CommonModule,
    BookingsRoutingModule
  ],
  declarations: [TownHallComponent]
})
export class BookingsModule { }
