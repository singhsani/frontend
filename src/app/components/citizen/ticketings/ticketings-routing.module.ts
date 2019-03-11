import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { MyTicketingsComponent } from './components/my-ticketings/my-ticketings.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'planetarium', loadChildren: './modules/planetarium/planetarium.module#PlanetariumModule', canLoad: [AuthGuard] },
  { path: 'zoo', loadChildren: './modules/zoo-ticketing/zoo-ticketing.module#ZooTicketingModule', canLoad: [AuthGuard] },
  { path: 'my-ticketings', component: MyTicketingsComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketingsRoutingModule {}
