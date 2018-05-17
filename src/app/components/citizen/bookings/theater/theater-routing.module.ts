import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheaterListComponent } from './theater-list/theater-list.component';
import { ManageRoutes } from '../../../../config/routes-conf';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('THEATERLIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('THEATERLIST'), component: TheaterListComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TheaterRoutingModule { }
