import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TownHallBookComponent } from './townhall-book/townhall-book.component';

const routes: Routes = [
	{ path: '', redirectTo: 'book', pathMatch: 'full' },
	{ path: 'book', component: TownHallBookComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TownHallRoutingModule { }
