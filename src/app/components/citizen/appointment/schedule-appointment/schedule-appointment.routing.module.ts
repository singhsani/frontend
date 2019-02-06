import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRoutes } from './../../../../config/routes-conf';
import { SlotBookingComponent } from './slot-booking/slot-booking.component';

const routes: Routes = [
    { path: '', component: SlotBookingComponent },
    { path: ManageRoutes.getMainRoute('SLOTBOOKING') + '/:id/:apiCode', component: SlotBookingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScheduleAppointmentRoutingModule { }
