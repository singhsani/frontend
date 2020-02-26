import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewAffordableHousingComponent } from './new-affordable-housing/new-affordable-housing.component';
const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: 'new', component: NewAffordableHousingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffordableHousingRoutingModule { }
