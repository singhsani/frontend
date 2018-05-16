import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import child modules start */
import { CitizenModule } from './components/citizen/citizen.module';
import { HospitalModule } from './components/hospital/hospital.module';
/* Import child modules end */

/* Import all the layout component start */

/* Import all the layout component end */

import { ManageRoutes } from './config/routes-conf';

const routes: Routes = [

	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('CITIZENMODULE'), pathMatch: 'full' },
	
	{ path: ManageRoutes.getPrefixRoute('CITIZENMODULE'), loadChildren: () => CitizenModule },
		
	{ path: ManageRoutes.getPrefixRoute('HOSPITALMODULE'), loadChildren: () => HospitalModule },

	{ path: '**', redirectTo: ManageRoutes.getPrefixRoute('CITIZENMODULE')},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
