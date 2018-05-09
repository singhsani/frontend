import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TownHallListComponent } from './town-hall-list/town-hall-list.component';
import { TownHallBookComponent } from './town-hall-book/town-hall-book.component';
import { ManageRoutes } from '../../../../config/routes-conf';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('TOWNHALLLIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('TOWNHALLLIST'), component: TownHallListComponent },
	{ path: ManageRoutes.getMainRoute('TOWNHALLBOOK'), component: TownHallBookComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TownHallRoutingModule { }
