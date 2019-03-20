import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZooBookingComponent } from './zoo-booking/zoo-booking.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'zoo-ticketing',
  },
  {
    path: 'zoo-ticketing',
    component: ZooBookingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZooTicketingRoutingModule { }
