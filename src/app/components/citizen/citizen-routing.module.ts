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

import { ManageRoutes } from '../../config/routes-conf';

const routes: Routes = [
	{ path: '', redirectTo: ManageRoutes.getMainRoute('CITIZENDASHBOARD'), pathMatch: 'full' },
	{ path: ManageRoutes.getMainRoute('CITIZENDASHBOARD'), component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CITIZENMYAPPS'), component: MyApplicationsComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('BR') + '/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('DR') + '/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('MR') + '/:id', component: MarriageCertiComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('NRC-BIRTH') + '/:id', component: NoBirthRecordComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('NRC-DEATH') + '/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CR') + '/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CITIZENMYRESOURCE'), component: MyResourceComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CITIZENMYTRANSACTIONS'), component: TransactionsComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('CITIZENMYPROFILE'), component: UserProfileComponent, canActivate: [AuthGuard] },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
