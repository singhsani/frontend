import { GatewayResponseComponent } from './../../shared/components/gateway-response/gateway-response.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../core/guard/auth.guard';
import { ManageRoutes } from '../../config/routes-conf';

/* import all modules start */
import { AuthModule } from './auth/auth.module';
import { LicencesModule } from './licences/licences.module';
import { BookingsModule } from './bookings/bookings.module';
import { CertificatesModule } from './certificates/certificates.module';
import { FireFacilitiesModule } from './fire-facilities/fire-facilities.module';
import { GrievanceModule } from './grievance/grievance.module';
import { ProfessionalTaxModule } from './professional-tax/professional-tax.module';
/* import all modules end */

/* Import citizen components other than auth start */
import { HomeLayoutComponent } from './../../layouts/home-layout/home-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { PaymentResponsePageComponent } from '../../shared/components/payment-response-page/payment-response-page.component'
import { PayableServicesComponent } from './payable-services/payable-services.component';

import { TaxModule } from './tax/tax.module';
import { AppointmentModule } from './appointment/appointment.module';
import { GujPocComponent } from './guj-poc/guj-poc.component';
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

			{ path: ManageRoutes.getPrefixRoute('CERTIFICATESMODULE'), loadChildren: () => CertificatesModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('BOOKINGMODULE'), loadChildren: () => BookingsModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('LICENCEMODULE'), loadChildren: () => LicencesModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('FIREFACILITIESMODULE'), loadChildren: () => FireFacilitiesModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('GRIEVANCEMODULE'), loadChildren: () => GrievanceModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('TAXMODULE'), loadChildren: () => TaxModule, canLoad: [AuthGuard] },
			{ path: ManageRoutes.getPrefixRoute('APPOINTMENT'), loadChildren: () => AppointmentModule, canLoad: [AuthGuard] },
			
			{ path: ManageRoutes.getPrefixRoute('PROFESSIONALMODULE'), loadChildren: () => ProfessionalTaxModule, canLoad: [AuthGuard] },
			{ path: 'gujPOC', component:GujPocComponent, canActivate: [AuthGuard] }
		]
	},

	{
		path: ManageRoutes.getPrefixRoute('CITIZENAUTHMODULE'),loadChildren: () => AuthModule
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
