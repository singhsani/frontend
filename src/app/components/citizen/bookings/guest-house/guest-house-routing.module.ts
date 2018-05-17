import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { GuestHouseListComponent } from './guest-house-list/guest-house-list.component';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('GUESTHOUSELIST'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('GUESTHOUSELIST'), component: GuestHouseListComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GuestHouseRoutingModule { }
