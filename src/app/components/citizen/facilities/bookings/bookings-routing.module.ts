import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../../../core/guard/auth.guard';
import { BookingDashboardComponent } from './components/booking-dashboard/booking-dashboard.component';
import { MyBookingComponent } from './components/my-booking/my-booking.component';
import { SwimmingPoolDashboardComponent } from './shared-booking/components/swimming-pool-dashboard/swimming-pool-dashboard.component';

const routes: Routes = [
	{ path: '', component: BookingDashboardComponent, canActivate: [AuthGuard] },
	{ path: 'town-hall', loadChildren: './modules/town-hall/town-hall.module#TownHallModule', canLoad: [AuthGuard] },
	{ path: 'band', loadChildren: './modules/band/band.module#BandModule', canLoad: [AuthGuard] },	
	{ path: 'stadium', loadChildren: './modules/stadium/stadium.module#StadiumModule', canLoad: [AuthGuard] },
	{ path: 'children-theater', loadChildren: './modules/children-theater/children-theater.module#ChildrenTheaterModule', canLoad: [AuthGuard] },
	{ path: 'atithigruh', loadChildren: './modules/atithigruh/atithigruh.module#AtithigruhModule', canLoad: [AuthGuard] },
	{ path: 'swimming-pool', loadChildren: './modules/swimming-pool/swimming-pool.module#SwimmingPoolModule', canLoad: [AuthGuard] },
	{ path: 'theater', loadChildren: './modules/theater/theater.module#TheaterModule', canLoad: [AuthGuard] },
	{ path: 'shooting-permission', loadChildren: './modules/shooting-permission/shooting-permission.module#ShootingPermissionModule' ,canLoad: [AuthGuard] },
	{ path: 'my-bookings', component: MyBookingComponent, canActivate: [AuthGuard] },
	{ path: 'swimming-pool-dashboard', component: SwimmingPoolDashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: ':swimming-pool', loadChildren: './modules/swimming-pool/swimming-pool.module#SwimmingPoolModule', canLoad: [AuthGuard] },
      { path: ':swimming-pool-renewal', loadChildren: './modules/swimming-pool/swimming-pool.module#SwimmingPoolModule', canLoad: [AuthGuard]}
    ]},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingsRoutingModule { }
