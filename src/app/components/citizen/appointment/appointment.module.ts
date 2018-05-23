import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { ScheduleAppointmentModule } from './schedule-appointment/schedule-appointment.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		AppointmentRoutingModule,
		ScheduleAppointmentModule
	],
	declarations: []
})
export class AppointmentModule { }
