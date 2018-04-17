import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import citizen components other than auth start */
import { DashboardComponent } from './dashboard/dashboard.component';
import { BirthCertiAppComponent } from './birth-certi-app/birth-certi-app.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent } from './transactions/transactions.component';
/* Import citizen components other than auth end */

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'birthcert/:id', component: BirthCertiAppComponent },
	{ path: 'my-resource', component: MyResourceComponent },
	{ path: 'my-transactions', component: TransactionsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
