import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookStadiumComponent } from './book-stadium/book-stadium.component';


const routes: Routes = [
	{ path: '', redirectTo: 'book', pathMatch: 'full' },
	{ path: 'book', component: BookStadiumComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StadiumRoutingModule { }
