import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guard/auth.guard';// citizen guard

/* Import child modules start */
import { AuthModule } from './components/citizen/auth/auth.module';
import { CitizenModule } from './components/citizen/citizen.module';
import { HospitalModule } from './components/hospital/hospital.module';
/* Import child modules end */

/* Import all the layout component start */
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
/* Import all the layout component end */

const routes: Routes = [

	{ path: '', redirectTo: 'citizen', pathMatch: 'full' },
	{
		path: '', component: HomeLayoutComponent, canActivate: [AuthGuard],
		children: [
			{ path: 'citizen', loadChildren: () => CitizenModule }
		]
	},
	{
		path: 'citizen', component: LoginLayoutComponent,
		children: [
			{ path: 'auth', loadChildren: () => AuthModule }
		]
	},
		
	{ path: 'hospital', loadChildren: () => HospitalModule },

	{ path: '**', redirectTo: ''},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
