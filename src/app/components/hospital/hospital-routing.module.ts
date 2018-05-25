import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalGuard } from './../../core/guard/hospital.guard';
import { HospitalAuthModule } from './hospital-auth/hospital-auth.module';
import { ManageRoutes } from './../../config/routes-conf';

/* Import hospital components start */
import { HospitalDashboardComponent } from './dashboard/dashboard.component';
import { HospitalLayoutComponent } from '../../layouts/hospital-layout/hospital-layout.component';
/* Import hospital components end */

const routes: Routes = [

	{
		path: ManageRoutes.getPrefixRoute('HOSPITALMODULE'), component: HospitalLayoutComponent, canActivate: [HospitalGuard],
		children: [
			{ path: '', redirectTo: ManageRoutes.getMainRoute('HOSPITALDASHBOARD'), pathMatch: 'full' },
			{ path: ManageRoutes.getMainRoute('HOSPITALDASHBOARD'), component: HospitalDashboardComponent, canActivate: [HospitalGuard] }
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
