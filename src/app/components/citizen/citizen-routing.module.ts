import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../core/guard/auth.guard';

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
import { CommonPaybleComponent } from './common-payble/common-payble.component';
import { LoiPaymentComponent } from './loi-payment/loi-payment.component';
import { LoiPaymentComponentBooking } from './loi-payment-booking/loi-payment.component-booking';
import { ViewPecPrcReceiptComponent } from './view-pec-prc-receipt/view-pec-prc-receipt.component';

/* Import citizen components other than auth end */

const routes: Routes = [

	{
		path: 'citizen', component: HomeLayoutComponent, canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
			{ path: 'my-applications', component: MyApplicationsComponent, canActivate: [AuthGuard] },
			{ path: 'my-resource', component: MyResourceComponent, canActivate: [AuthGuard] },
			{ path: 'my-transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
			{ path: 'my-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
			{ path: 'payment-gateway-response', component: PaymentResponsePageComponent, canActivate: [AuthGuard] },
			{ path: 'payable-services', component: CommonPaybleComponent, canActivate: [AuthGuard] },
			{ path: 'payment-response', component: GatewayResponseComponent, canActivate: [AuthGuard] },
			{ path: 'loi-payments/:uniqueId/:id/:code', component: LoiPaymentComponent, canActivate: [AuthGuard] },
			{ path: 'loi-payments-booking/:uniqueId/:id/:code', component: LoiPaymentComponentBooking, canActivate: [AuthGuard] },
			{ path: 'certificates', loadChildren: './certificates/certificates.module#CertificatesModule', canLoad: [AuthGuard] },
			{ path: 'bookings', loadChildren: './facilities/bookings/bookings.module#BookingsModule', canLoad: [AuthGuard] },
			{ path: 'ticketings', loadChildren: './facilities/ticketings/ticketings.module#TicketingsModule', canLoad: [AuthGuard] },
			{ path: 'license', loadChildren: './licences/licences.module#LicencesModule', canLoad: [AuthGuard] },
			{ path: 'fire-facilities', loadChildren: './fire-facilities/fire-facilities.module#FireFacilitiesModule', canLoad: [AuthGuard] },
			{ path: 'grievance', loadChildren: './grievance/grievance.module#GrievanceModule' , canLoad: [AuthGuard] },
			{ path: 'tax', loadChildren: './tax/tax.module#TaxModule', canLoad: [AuthGuard] },
			{ path: 'appointmant', loadChildren: './appointment/appointment.module#AppointmentModule', canLoad: [AuthGuard] },
			{ path: 'gujPOC', component: GujPocComponent, canActivate: [AuthGuard] },
			{ path: 'affordable-housing', loadChildren: './affordable-housing/affordable-housing.module#AffordableHousingModule', canLoad: [AuthGuard] },
			{ path: 'engineering', loadChildren: './engineering/engineering.module#EngineeringModule', canLoad: [AuthGuard] },
			{ path: 'pec-prc-receipt/:id/:apicode', component:ViewPecPrcReceiptComponent }
		]
	},
	{ path: 'auth', loadChildren: './auth/auth.module#AuthModule' }

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CitizenRoutingModule { }
