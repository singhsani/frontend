import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{ path: '', redirectTo: 'citizen', pathMatch: 'full' },
	{ path: 'citizen', loadChildren: './components/citizen/citizen.module#CitizenModule' },
	{ path: 'hospital', loadChildren: './components/hospital/hospital.module#HospitalModule' },
	
	{ path: '**', redirectTo: '404'},
	{ path: '404', component: PageNotFoundComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
