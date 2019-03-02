import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../config/routes-conf';
import { BookingDashboardComponent } from './components/booking-dashboard/booking-dashboard.component';
import { MyBookingComponent } from './components/my-booking/my-booking.component';


const routes: Routes = [
	{ path: '', component: BookingDashboardComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('TOWNHALLMODULE'), loadChildren: './modules/town-hall/town-hall.module#TownHallModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('BANDMODULE'), loadChildren: './modules/band/band.module#BandModule', canLoad: [AuthGuard] },	
	// { path: ManageRoutes.getPrefixRoute('GARDENMODULE'), loadChildren: './garden/garden.module#GardenModule', canLoad: [AuthGuard] },
	// { path: ManageRoutes.getPrefixRoute('GUESTHOUSEMODULE'), loadChildren: './guest-house/guest-house.module#GuestHouseModule', canLoad: [AuthGuard] },
	// { path: ManageRoutes.getPrefixRoute('PLANETAREAMODULE'), loadChildren: './planet-area/planet-area.module#PlanetAreaModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('STADIUMMODULE'), loadChildren: './modules/stadium/stadium.module#StadiumModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('CHILDRENTHEATERMODULE'), loadChildren: './modules/children-theater/children-theater.module#ChildrenTheaterModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('ATITHIGRUHMODULE'), loadChildren: './modules/atithigruh/atithigruh.module#AtithigruhModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('SWIMMINGMODULE'), loadChildren: './modules/swimming-pool/swimming-pool.module#SwimmingPoolModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('THEATERMODULE'), loadChildren: './modules/theater/theater.module#TheaterModule', canLoad: [AuthGuard] },
	// { path: ManageRoutes.getPrefixRoute('ZOOMODULE'), loadChildren: './zoo/zoo.module#ZooModule', canLoad: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('SHOOTINGPERMISSION'), loadChildren: './modules/shooting-permission/shooting-permission.module#ShootingPermissionModule' ,canLoad: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CANCELBOOKING'), component: MyBookingComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingsRoutingModule { }
