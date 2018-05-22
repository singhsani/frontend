import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CitizenRoutingModule } from './citizen-routing.module';
import { AuthModule } from './auth/auth.module';
import { LicencesModule } from './licences/licences.module';
import { BookingsModule } from './bookings/bookings.module';
import { CertificatesModule } from './certificates/certificates.module';
import { FireFacilitiesModule } from './fire-facilities/fire-facilities.module';
import { GrievanceModule } from './grievance/grievance.module';
/* Import all shared, core and routing module end */

/* Import citizen components start */
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent, TransactionDataDialog } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { TaxModule } from './tax/tax.module';
import { AppointmentModule } from './appointment/appointment.module';
import { GujPocComponent } from './guj-poc/guj-poc.component';
/* Import citizen components end */


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		AuthModule,
		LicencesModule,
		BookingsModule,
		CertificatesModule,
		FireFacilitiesModule,
		GrievanceModule,
		TaxModule,
		AppointmentModule,
		CitizenRoutingModule
	],
	entryComponents: [
		TransactionDataDialog
	],
	declarations: [
		HomeLayoutComponent,
		DashboardComponent,
		MyResourceComponent,
		TransactionsComponent,
		TransactionDataDialog,
		UserProfileComponent,
		MyApplicationsComponent,
		GujPocComponent,
		
	]
})
export class CitizenModule { }
