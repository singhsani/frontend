import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../config/routes-conf';

import { BirthAndDeathModule } from './birth-and-death/birth-and-death.module';
import { MarriageModule } from './marriage/marriage.module';

const routes: Routes = [
  { path: '', redirectTo: 'birth-death', pathMatch: 'full' },
  { path: 'birth-death', loadChildren: () => BirthAndDeathModule , canLoad: [AuthGuard]},
  { path: 'marriage', loadChildren: () => MarriageModule, canLoad: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificatesRoutingModule { }
