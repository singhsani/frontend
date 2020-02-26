import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildrenTheaterRoutingModule } from './children-theater-routing.module';
import { BookChildrenTheaterComponent } from './book-children-theater/book-children-theater.component';
import { SharedBookingModule } from '../../shared-booking/shared-booking.module';

@NgModule({
  imports: [
    CommonModule,
    SharedBookingModule,
    ChildrenTheaterRoutingModule
  ],
  declarations: [BookChildrenTheaterComponent]
})
export class ChildrenTheaterModule { }
