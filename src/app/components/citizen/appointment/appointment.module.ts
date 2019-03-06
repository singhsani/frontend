import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
	{ path: '', redirectTo: 'schedule-appointment', pathMatch: 'full' },
	{ path: 'schedule-appointment', loadChildren: './schedule-appointment/schedule-appointment.module#ScheduleAppointmentModule', canLoad: [AuthGuard] }
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes)
	],
	declarations: []
})
export class AppointmentModule {}
