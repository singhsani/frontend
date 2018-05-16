import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalGuard } from './../../core/guard/hospital.guard';
import { HospitalAuthModule } from './hospital-auth/hospital-auth.module';

/* Import hospital components start */
import { HospitalDashboardComponent } from './dashboard/dashboard.component';
import { HospitalLayoutComponent } from '../../layouts/hospital-layout/hospital-layout.component';
/* Import hospital components end */

const routes: Routes = [
	
	{
		path: 'hospital', component: HospitalLayoutComponent, canActivate: [HospitalGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: HospitalDashboardComponent, canActivate: [HospitalGuard] }
		]
	},

	{
		path: 'auth', loadChildren: () => HospitalAuthModule
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HospitalRoutingModule { }
