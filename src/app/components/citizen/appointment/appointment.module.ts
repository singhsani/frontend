import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from './../../../config/routes-conf';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { ScheduleAppointmentModule } from './schedule-appointment/schedule-appointment.module';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('SCHEDULEAPPOINTMENT'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('SCHEDULEAPPOINTMENT'), loadChildren: './schedule-appointment/schedule-appointment.module#ScheduleAppointmentModule', canLoad: [AuthGuard] }
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		ScheduleAppointmentModule,
		RouterModule.forChild(routes)
	],
	declarations: []
})
export class AppointmentModule { }
