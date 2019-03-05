import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../core/guard/auth.guard';
import { ManageRoutes } from '../../config/routes-conf';

/* Import citizen components other than auth start */
import { HomeLayoutComponent } from './../../layouts/home-layout/home-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { PaymentResponsePageComponent } from '../../shared/components/payment-response-page/payment-response-page.component'
import { PayableServicesComponent } from './payable-services/payable-services.component';
import { GujPocComponent } from './guj-poc/guj-poc.component';
import { GatewayResponseComponent } from './../../shared/components/gateway-response/gateway-response.component';
/* Import citizen components other than auth end */

const routes: Routes = [

	{
		path: ManageRoutes.getPrefixRoute('CITIZENMODULE'), component: HomeLayoutComponent, canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: ManageRoutes.getMainRoute('CITIZENDASHBOARD'), pathMatch: 'full' },
			{ path: ManageRoutes.getMainRoute('CITIZENDASHBOARD'), component: DashboardComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('CITIZENMYAPPS'), component: MyApplicationsComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('CITIZENMYRESOURCE'), component: MyResourceComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('CITIZENMYTRANSACTIONS'), component: TransactionsComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('CITIZENMYPROFILE'), component: UserProfileComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('PAYMENTGATEWAYRESPONSE'), component: PaymentResponsePageComponent, canActivate: [AuthGuard] },
			{ path: ManageRoutes.getMainRoute('CITIZENPAYABLESERVICES'), component: PayableServicesComponent, canActivate: [AuthGuard] },
			{ path: 'payment-response', component: GatewayResponseComponent, canActivate: [AuthGuard] },

			{ path: ManageRoutes.getPrefixRoute('CERTIFICATESMODULE'), loadChildren: './certificates/certificates.module#CertificatesModule', canLoad: [AuthGuard] },
			{ path: 'bookings', loadChildren: './bookings/bookings.module#BookingsModule', canLoad: [AuthGuard] },
			{ path: 'ticketings', loadChildren: './ticketings/ticketings.module#TicketingsModule', canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('LICENCEMODULE'), loadChildren: './licences/licences.module#LicencesModule', canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('FIREFACILITIESMODULE'), loadChildren: './fire-facilities/fire-facilities.module#FireFacilitiesModule', canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('GRIEVANCEMODULE'), loadChildren: './grievance/grievance.module#GrievanceModule' , canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('TAXMODULE'), loadChildren: './tax/tax.module#TaxModule', canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('APPOINTMENT'), loadChildren: './appointment/appointment.module#AppointmentModule', canLoad: [AuthGuard] },
			{ path: 'gujPOC', component: GujPocComponent, canActivate: [AuthGuard] }
		]
	},
	{ path: ManageRoutes.getPrefixRoute('CITIZENAUTHMODULE'), loadChildren: './auth/auth.module#AuthModule' }

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
