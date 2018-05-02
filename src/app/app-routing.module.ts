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

import { ROUTEPREFIX } from './config/routes-conf';
import * as _ from 'lodash';

const routes: Routes = [

	{ path: '', redirectTo: _.get(ROUTEPREFIX, 'CITIZENMODULE'), pathMatch: 'full' },
	{
		path: _.get(ROUTEPREFIX, 'CITIZENMODULE'), component: HomeLayoutComponent, canActivate: [AuthGuard],
		children: [ 
			{ path: '', loadChildren: () => CitizenModule },
			{ path: _.get(ROUTEPREFIX, 'TAXMODULE'), loadChildren: () => TaxesModule },
			{ path: _.get(ROUTEPREFIX, 'BOOKINGMODULE'), loadChildren: () => BookingsModule },
			{ path: _.get(ROUTEPREFIX, 'LICENCEMODULE'), loadChildren: () => LicencesModule },
		]
	},
	{
		path: _.get(ROUTEPREFIX, 'CITIZENMODULE'), component: LoginLayoutComponent,
		children: [
			{ path: _.get(ROUTEPREFIX, 'CITIZENAUTHMODULE'), loadChildren: () => AuthModule }
		]
	},
		
	{ path: _.get(ROUTEPREFIX, 'HOSPITALMODULE'), loadChildren: () => HospitalModule },

	{ path: '**', redirectTo: ''},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
