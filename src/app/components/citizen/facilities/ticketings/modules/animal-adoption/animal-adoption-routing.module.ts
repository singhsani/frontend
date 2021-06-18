import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimalAdoptionComponent } from './animal-adoption/animal-adoption.component';

const routes: Routes = [
  {
    path: 'animal-adoption',
    component: AnimalAdoptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalAdoptionRoutingModule { }
