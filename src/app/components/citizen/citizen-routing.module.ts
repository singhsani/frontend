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

import { ROUTEMAIN } from '../../config/routes-conf';
import * as _ from 'lodash';

const routes: Routes = [
	{ path: '', redirectTo: _.get(ROUTEMAIN, 'CITIZENDASHBOARD.main'), pathMatch: 'full' },
	{ path: _.get(ROUTEMAIN, 'CITIZENDASHBOARD.main'), component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'CITIZENMYAPPS.main'), component: MyApplicationsComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'BR.main')+'/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'DR.main')+'/:id', component: BirthCertiAppComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'MR.main')+'/:id', component: MarriageCertiComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'NRC-BIRTH.main')+'/:id', component: NoBirthRecordComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'NRC-DEATH.main')+'/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'CR.main')+'/:id', component: NoDeathRecordComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'CITIZENMYRESOURCE.main'), component: MyResourceComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'CITIZENMYTRANSACTIONS.main'), component: TransactionsComponent, canActivate: [AuthGuard] },
	{ path: _.get(ROUTEMAIN, 'CITIZENMYPROFILE.main'), component: UserProfileComponent, canActivate: [AuthGuard] },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
