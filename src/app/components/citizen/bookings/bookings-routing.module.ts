import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TownHallModule } from './town-hall/town-hall.module';
import { AuthGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'town-hall', pathMatch: 'full' },
  { path: 'town-hall', loadChildren: () => TownHallModule, canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
