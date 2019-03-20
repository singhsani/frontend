import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandBookingListComponent } from './band-booking-list/band-booking-list.component';

const routes: Routes = [
	{ path: '', redirectTo: 'list', pathMatch: 'full' },
	{ path: 'list', component: BandBookingListComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BandRoutingModule { }
