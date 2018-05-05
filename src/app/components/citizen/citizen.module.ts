import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CitizenRoutingModule } from './citizen-routing.module';
/* Import all shared, core and routing module end */

/* Import citizen components start */
import { DashboardComponent } from './dashboard/dashboard.component';
import { BirthCertiAppComponent } from './birth-certi-app/birth-certi-app.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent, TransactionDataDialog } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MarriageCertiComponent } from './marriage-cert/marriage-cert.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
import { DeathCertificateComponent } from './death-certificate/death-certificate.component'
/* Import citizen components end */

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		CitizenRoutingModule
	],
	entryComponents: [
		TransactionDataDialog
	],
	declarations: [
		DashboardComponent,
		BirthCertiAppComponent,
		MyResourceComponent,
		TransactionsComponent,
		TransactionDataDialog,
		UserProfileComponent,
		MarriageCertiComponent,
		MyApplicationsComponent,
		NoBirthRecordComponent,
		NoDeathRecordComponent,
		CremationCertificateComponent,
		DeathCertificateComponent
	]
})
export class CitizenModule { }
