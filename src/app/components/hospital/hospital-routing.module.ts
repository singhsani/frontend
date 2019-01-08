import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalGuard } from './../../core/guard/hospital.guard';
import { HospitalAuthModule } from './hospital-auth/hospital-auth.module';
import { ManageRoutes } from './../../config/routes-conf';

/* Import hospital components start */
import { HospitalDashboardComponent } from './dashboard/dashboard.component';
import { HospitalLayoutComponent } from '../../layouts/hospital-layout/hospital-layout.component';
import { BirthRegistrationComponent } from './birth-registration/birth-registration.component';
import { DeathRegistrationComponent } from './death-registration/death-registration.component';
import { StillBirthComponent } from './still-birth/still-birth.component';
import { HosMyApplicationsComponent } from './hos-my-applications/hos-my-applications.component';
import { HosPaymentResponsePageComponent } from '../../shared/components/hos-payment-response-page/hos-payment-response-page.component';
import { CanDeactivateGuard } from '../../core/guard/can-deactivate.guard';
/* Import hospital components end */

const routes: Routes = [

	{
		path: ManageRoutes.getPrefixRoute('HOSPITALMODULE'), component: HospitalLayoutComponent, canActivate: [HospitalGuard],
		children: [
			{ path: '', redirectTo: ManageRoutes.getMainRoute('HOSPITALDASHBOARD'), pathMatch: 'full' },
			{ path: ManageRoutes.getMainRoute('HOSPITALDASHBOARD'), component: HospitalDashboardComponent, canActivate: [HospitalGuard] },
			{ path: ManageRoutes.getMainRoute('HEL-BR') + '/:id/:apiCode', component: BirthRegistrationComponent, canActivate: [HospitalGuard], canDeactivate: [CanDeactivateGuard] },
			{ path: ManageRoutes.getMainRoute('HEL-DR') + '/:id/:apiCode', component: DeathRegistrationComponent, canActivate: [HospitalGuard], canDeactivate : [CanDeactivateGuard] },
			{ path: ManageRoutes.getMainRoute('HEL-SB') + '/:id/:apiCode', component: StillBirthComponent, canActivate: [HospitalGuard], canDeactivate: [CanDeactivateGuard]  },
			{ path: ManageRoutes.getMainRoute('HOSPITALMYAPPS'), component: HosMyApplicationsComponent, canActivate: [HospitalGuard] },
			{ path: ManageRoutes.getMainRoute('PAYMENTGATEWAYRESPONSE'), component: HosPaymentResponsePageComponent, canActivate: [HospitalGuard] },
		]
	},

	{
		path: 'auth', loadChildren: () => HospitalAuthModule
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HospitalRoutingModule { }
