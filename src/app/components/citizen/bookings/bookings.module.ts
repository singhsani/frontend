import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { TownHallComponent } from './town-hall/town-hall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookingsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MyDatePickerModule
  ],
  declarations: [TownHallComponent]
})
export class BookingsModule { }
