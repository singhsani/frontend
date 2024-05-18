import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../../../../core/guard/auth.guard';
import { CanDeactivateGuard } from '../../../../core/guard/can-deactivate.guard';
import { MyTicketingsComponent } from './components/my-ticketings/my-ticketings.component';
import { ZooDashboardComponent } from './shared-ticketing/components/zoo-dashboard/zoo-dashboard.component';

const routes: Routes = [
  { path: 'planetarium', loadChildren: './modules/planetarium/planetarium.module#PlanetariumModule', canLoad: [AuthGuard] },
  // { path: 'adoption', loadChildren: './modules/animal-adoption/animal-adoption.module#AnimalAdoptionModule', canLoad: [AuthGuard] },
  // { path: 'zoo', loadChildren: './modules/zoo-ticketing/zoo-ticketing.module#ZooTicketingModule', canLoad: [AuthGuard] },

  //{ path: 'zoo-dashboard', component: ZooDashboardComponent, canActivate: [AuthGuard],
  { path: 'zoo-dashboard', component: ZooDashboardComponent, 
   children: [
      { path: ':adoption', loadChildren: './modules/animal-adoption/animal-adoption.module#AnimalAdoptionModule', canLoad: [AuthGuard] },
      { path: ':zoo', loadChildren: './modules/zoo-ticketing/zoo-ticketing.module#ZooTicketingModule', canLoad: [AuthGuard] }
    ]},
  { path: 'my-ticketings', component: MyTicketingsComponent, canActivate: [AuthGuard] },
 // { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketingsRoutingModule {}
