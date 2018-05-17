import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { StadiumListComponent } from './stadium-list/stadium-list.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('STADIUMLIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('STADIUMLIST'), component: StadiumListComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StadiumRoutingModule { }
