import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';

import { ManageRoutes } from '../../../config/routes-conf';
import { ScheduleAppointmentModule } from './schedule-appointment/schedule-appointment.module';

const routes: Routes = [
    { path: '', redirectTo: ManageRoutes.getPrefixRoute('SCHEDULEAPPOINTMENT'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('SCHEDULEAPPOINTMENT'), loadChildren: () => ScheduleAppointmentModule, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppointmentRoutingModule { }