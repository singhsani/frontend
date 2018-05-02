import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guard/auth.guard';// citizen guard

/* Import child modules start */
import { AuthModule } from './components/citizen/auth/auth.module';
import { CitizenModule } from './components/citizen/citizen.module';
import { HospitalModule } from './components/hospital/hospital.module';
import { TaxesModule } from './components/citizen/taxes/taxes.module';
import { LicencesModule } from './components/citizen/licences/licences.module';
import { BookingsModule } from './components/citizen/bookings/bookings.module';
/* Import child modules end */

/* Import all the layout component start */
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
/* Import all the layout component end */

import { ManageRoutes } from './config/routes-conf';

const routes: Routes = [

	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('CITIZENMODULE'), pathMatch: 'full' },
	{
		path: ManageRoutes.getPrefixRoute('CITIZENMODULE'), component: HomeLayoutComponent, canActivate: [AuthGuard],
		children: [ 
			{ path: '', loadChildren: () => CitizenModule },
			{ path: ManageRoutes.getPrefixRoute('TAXMODULE'), loadChildren: () => TaxesModule },
			{ path: ManageRoutes.getPrefixRoute('BOOKINGMODULE'), loadChildren: () => BookingsModule },
			{ path: ManageRoutes.getPrefixRoute('LICENCEMODULE'), loadChildren: () => LicencesModule },
		]
	},
	{
		path: ManageRoutes.getPrefixRoute('CITIZENMODULE'), component: LoginLayoutComponent,
		children: [
			{ path: ManageRoutes.getPrefixRoute('CITIZENAUTHMODULE'), loadChildren: () => AuthModule }
		]
	},
		
	{ path: ManageRoutes.getPrefixRoute('HOSPITALMODULE'), loadChildren: () => HospitalModule },

	{ path: '**', redirectTo: ''},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
