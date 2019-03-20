import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwimmingPoolComponent } from './swimming-pool/swimming-pool.component';

const routes: Routes = [
	{ path: '', redirectTo: 'swimmingPool', pathMatch: 'full' },
	{ path: 'swimmingPool', component: SwimmingPoolComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SwimmingPoolRoutingModule { }
