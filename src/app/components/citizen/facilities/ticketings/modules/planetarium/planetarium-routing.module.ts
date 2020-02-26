import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookPlanetariumComponent } from './book-planetarium/book-planetarium.component';

const routes: Routes = [
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: 'book', component: BookPlanetariumComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanetariumRoutingModule { }
