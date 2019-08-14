import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwimmingPoolComponent } from './swimming-pool/swimming-pool.component';
import { SwimmingPoolRenewalComponent } from './swimming-pool-renewal/swimming-pool-renewal.component';

const routes: Routes = [
	{ path: '', redirectTo: 'swimmingPool', pathMatch: 'full' },
	{ path: 'swimmingPool', component: SwimmingPoolComponent },
	{ path: 'swimmingPoolRenewal', component: SwimmingPoolRenewalComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SwimmingPoolRoutingModule { }
