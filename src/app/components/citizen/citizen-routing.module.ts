import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../core/guard/auth.guard';

/* Import citizen components other than auth start */
import { DashboardComponent } from './dashboard/dashboard.component';
import { BirthCertiAppComponent } from './birth-certi-app/birth-certi-app.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MarriageCertiComponent } from './marriage-cert/marriage-cert.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';

/* Import citizen components other than auth end */

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'my-applications', component: MyApplicationsComponent, canActivate: [AuthGuard] },
	{ path: 'birthReg/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: 'deathReg/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: 'marriageReg/:id', component: MarriageCertiComponent, canActivate: [AuthGuard] },
	{ path: 'NRCBirth/:id', component: NoBirthRecordComponent, canActivate: [AuthGuard] },
	{ path: 'NRCDeath/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: 'cremationReg/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: 'my-resource', component: MyResourceComponent, canActivate: [AuthGuard] },
	{ path: 'my-transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
	{ path: 'my-profile', component: UserProfileComponent, canActivate: [AuthGuard] },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
