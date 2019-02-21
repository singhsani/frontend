import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { BookChildrenTheaterComponent } from './book-children-theater/book-children-theater.component';

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getMainRoute('CHILDRENTHEATERBOOK'), pathMatch: 'full' },
  { path: ManageRoutes.getMainRoute('CHILDRENTHEATERBOOK'), component: BookChildrenTheaterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildrenTheaterRoutingModule { }
