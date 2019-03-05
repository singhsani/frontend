import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookChildrenTheaterComponent } from './book-children-theater/book-children-theater.component';

const routes: Routes = [
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: 'book', component: BookChildrenTheaterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildrenTheaterRoutingModule { }
