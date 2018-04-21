import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import all module starts*/
import { TaxesModule } from './taxes/taxes.module';
import { LicencesModule } from './licences/licences.module';
import { BookingsModule } from './bookings/bookings.module';
/* Import all module end*/

/* Import citizen components other than auth start */
import { DashboardComponent } from './dashboard/dashboard.component';
import { BirthCertiAppComponent } from './birth-certi-app/birth-certi-app.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MarriageCertiComponent } from './marriage-cert/marriage-cert.component';

/* Import citizen components other than auth end */

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'birthcert/:id', component: BirthCertiAppComponent },
	{ path: 'my-resource', component: MyResourceComponent },
	{ path: 'my-transactions', component: TransactionsComponent },
	{ path: 'my-profile', component: UserProfileComponent },
	{ path: 'marriagecert', component: MarriageCertiComponent },

	{ path: 'tax', loadChildren: () => TaxesModule},
	{ path: 'booking', loadChildren: () => BookingsModule},
	{ path: 'licence', loadChildren: () => LicencesModule},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
