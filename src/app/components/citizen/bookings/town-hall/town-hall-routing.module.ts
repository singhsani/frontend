import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TownHallComponent } from './town-hall_c/town-hall.component';

const routes: Routes = [
	{ path: '', redirectTo: 'town-hall', pathMatch: 'full' },
	{ path: 'town-hall', component: TownHallComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TownHallRoutingModule { }
