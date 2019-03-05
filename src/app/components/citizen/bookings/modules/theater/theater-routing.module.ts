import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookTheaterComponent } from './book-theater/book-theater.component';



const routes: Routes = [
	{ path: '', redirectTo: 'book', pathMatch: 'full' },
	{ path: 'book', component: BookTheaterComponent},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TheaterRoutingModule { }
