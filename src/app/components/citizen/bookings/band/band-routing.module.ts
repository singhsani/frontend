import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { BandBookingComponent } from './band-booking/band-booking.component';
import { BandBookingListComponent } from './band-booking-list/band-booking-list.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('BANDBOOKINGLIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('BANDBOOKINGLIST'), component: BandBookingListComponent  },
	{ path: ManageRoutes.getMainRoute('BANDBOOKING'), component: BandBookingComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BandRoutingModule { }
