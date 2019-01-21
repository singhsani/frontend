import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { TownHallBookComponent } from './townhall-book/townhall-book.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('TOWNHALLBOOK'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('TOWNHALLBOOK'), component: TownHallBookComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TownHallRoutingModule { }
