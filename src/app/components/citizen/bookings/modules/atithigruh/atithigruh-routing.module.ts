import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookAtithigruhComponent } from './book-atithigruh/book-atithigruh.component';

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getMainRoute('ATITHIGRUHBOOK'), pathMatch: 'full' },
  { path: ManageRoutes.getMainRoute('ATITHIGRUHBOOK'), component: BookAtithigruhComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtithigruhRoutingModule { }
