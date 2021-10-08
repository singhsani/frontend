import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAfhStatusComponent } from './my-afh-status/my-afh-status.component';
import { NewAffordableHousingComponent } from './new-affordable-housing/new-affordable-housing.component';
const routes: Routes = [
  { path: '', redirectTo: 'afhForm', pathMatch: 'full' },
  { path: 'afhForm/:id/:apiCode', component: NewAffordableHousingComponent},
  {  path : 'myafhStatus' , component : MyAfhStatusComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffordableHousingRoutingModule { }
