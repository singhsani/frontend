import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../config/routes-conf';

import { BirthAndDeathModule } from './birth-and-death/birth-and-death.module';
import { MarriageModule } from './marriage/marriage.module';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('BIRTHANDDEATHMODULE'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('BIRTHANDDEATHMODULE'), loadChildren: () => BirthAndDeathModule, canLoad: [AuthGuard] },
	{ path: ManageRoutes.getPrefixRoute('MARRIAGEMODULE'), loadChildren: () => MarriageModule, canLoad: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CertificatesRoutingModule { }
