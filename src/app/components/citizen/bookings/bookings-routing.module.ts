import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TownHallModule } from './town-hall/town-hall.module';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../config/routes-conf';

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getPrefixRoute('TOWNHALLMODULE'), pathMatch: 'full' },
  { path: ManageRoutes.getPrefixRoute('TOWNHALLMODULE'), loadChildren: () => TownHallModule, canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
