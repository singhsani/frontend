import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { BookTheaterComponent } from './book-theater/book-theater.component';



const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('THEATERBOOK'), pathMatch: 'full' },
	// { path: ManageRoutes.getMainRoute('THEATERLIST'), component: TheaterListComponent },
	{ path: ManageRoutes.getMainRoute('THEATERBOOK'), component: BookTheaterComponent},
	// { path: ManageRoutes.getMainRoute('THEATERBOOKINGSTATUS'), component: BookingStatusComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TheaterRoutingModule { }
