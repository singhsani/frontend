import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRoutes } from './config/routes-conf';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('CITIZENMODULE'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('CITIZENMODULE'), loadChildren: './components/citizen/citizen.module#CitizenModule' },
	{ path: ManageRoutes.getPrefixRoute('HOSPITALMODULE'), loadChildren: './components/hospital/hospital.module#HospitalModule' },
	{ path: '**', redirectTo: '404'},
	{ path: '404', component: PageNotFoundComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
