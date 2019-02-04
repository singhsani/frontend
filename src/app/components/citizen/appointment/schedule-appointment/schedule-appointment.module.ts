import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ManageRoutes } from './../../../../config/routes-conf';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { SlotBookingComponent } from './slot-booking/slot-booking.component';

const routes: Routes = [
    // { path: '', redirectTo: ManageRoutes.getMainRoute('SLOTBOOKING'),  pathMatch : "full" },
    { path: ManageRoutes.getMainRoute('SLOTBOOKING') + '/:id/:apiCode', component: SlotBookingComponent }
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
    declarations: [
        SlotBookingComponent
    ]
})
export class ScheduleAppointmentModule { }
