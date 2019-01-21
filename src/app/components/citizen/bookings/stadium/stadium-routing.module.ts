import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { BookStadiumComponent } from './book-stadium/book-stadium.component';


const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('STADIUMBOOK'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('STADIUMBOOK'), component: BookStadiumComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StadiumRoutingModule { }
