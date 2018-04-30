import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ShopEstablishLicenceComponent } from './shop-establish-licence/shop-establish-licence.component';

const routes: Routes = [
	{ path: '', redirectTo: 'shopLicense', pathMatch: 'full' },
	{ path: 'shopLicense/:id', component: ShopEstablishLicenceComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LicencesRoutingModule { }
