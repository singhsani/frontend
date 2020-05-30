import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewAffordableHousingComponent } from './new-affordable-housing/new-affordable-housing.component';
const routes: Routes = [
  { path: '', redirectTo: 'afhForm', pathMatch: 'full' },
  { path: 'afhForm/:id/:apiCode', component: NewAffordableHousingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffordableHousingRoutingModule { }
