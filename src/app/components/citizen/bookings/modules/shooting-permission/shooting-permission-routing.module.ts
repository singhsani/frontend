import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookPermissionComponent } from './book-permission/book-permission.component';


const routes: Routes = [
	{ path: '', redirectTo: 'bookPermission', pathMatch: 'full' },
	{ path: 'bookPermission', component: BookPermissionComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ShootingPermissionRoutingModule { }
