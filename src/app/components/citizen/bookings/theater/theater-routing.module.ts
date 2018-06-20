import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheaterListComponent } from './theater-list/theater-list.component';
import { ManageRoutes } from '../../../../config/routes-conf';
import { BookTheaterComponent } from './book-theater/book-theater.component';
import { BookingStatusComponent } from './booking-status/booking-status.component';



const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('THEATERLIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('THEATERLIST'), component: TheaterListComponent },
	{ path: ManageRoutes.getMainRoute('THEATERBOOK'), component: BookTheaterComponent},
	{ path: ManageRoutes.getMainRoute('THEATERBOOKINGSTATUS'), component: BookingStatusComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TheaterRoutingModule { }
