import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import hospital components start */
import { DashboardComponent } from './dashboard/dashboard.component';
/* Import hospital components end */

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HospitalRoutingModule { }
