import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../config/routes-conf';
import { PropertyModule } from './property/property.module';
import { AuthGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getPrefixRoute('PROPERTYMODULE'), pathMatch: 'full' },
	{ path: ManageRoutes.getPrefixRoute('PROPERTYMODULE'), loadChildren: () => PropertyModule, canLoad: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TaxRoutingModule { }
