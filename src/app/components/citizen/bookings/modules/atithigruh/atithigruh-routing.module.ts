import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookAtithigruhComponent } from './book-atithigruh/book-atithigruh.component';

const routes: Routes = [
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: 'book', component: BookAtithigruhComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtithigruhRoutingModule { }
