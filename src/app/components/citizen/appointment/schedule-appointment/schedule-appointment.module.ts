import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ScheduleAppointmentRoutingModule } from './schedule-appointment-routing.module';
import { SlotBookingComponent } from './slot-booking/slot-booking.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        ScheduleAppointmentRoutingModule
    ],
    declarations: [SlotBookingComponent]
})
export class ScheduleAppointmentModule { }
