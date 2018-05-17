import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TownHallModule } from './town-hall/town-hall.module';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../config/routes-conf';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';
import { BandModule } from './band/band.module';
import { GardenModule } from './garden/garden.module';
import { GuestHouseModule } from './guest-house/guest-house.module';
import { PlanetAreaModule } from './planet-area/planet-area.module';
import { StadiumModule } from './stadium/stadium.module';
import { SwimmingPoolModule } from './swimming-pool/swimming-pool.module';
import { TheaterModule } from './theater/theater.module';
import { ZooModule } from './zoo/zoo.module';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';

const routes: Routes = [
	{ path: '', component: BookingDashboardComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('TOWNHALLMODULE'), loadChildren: () => TownHallModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('BANDMODULE'), loadChildren: () => BandModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('GARDENMODULE'), loadChildren: () => GardenModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('GUESTHOUSEMODULE'), loadChildren: () => GuestHouseModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('PLANETAREAMODULE'), loadChildren: () => PlanetAreaModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('STADIUMMODULE'), loadChildren: () => StadiumModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('SWIMMINGMODULE'), loadChildren: () => SwimmingPoolModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('THEATERMODULE'), loadChildren: () => TheaterModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('ZOOMODULE'), loadChildren: () => ZooModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CANCELBOOKING'),component:CancelBookingComponent ,canActivate: [AuthGuard] }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BookingsRoutingModule { }
