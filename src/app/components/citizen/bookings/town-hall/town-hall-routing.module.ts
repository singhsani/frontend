import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TownHallListComponent } from './town-hall-list/town-hall-list.component';
import { TownHallBookComponent } from './town-hall-book/town-hall-book.component';

const routes: Routes = [
	{ path: '', redirectTo: 'list', pathMatch: 'full' },
	{ path: 'list', component: TownHallListComponent },
	{ path: 'book', component: TownHallBookComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TownHallRoutingModule { }
