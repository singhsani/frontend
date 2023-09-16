import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CitizenRoutingModule } from './citizen-routing.module';
import { AuthModule } from './auth/auth.module';
/* Import all shared, core and routing module end */

/* Import citizen components start */
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyResourceComponent } from './my-resource/my-resource.component';
import { TransactionsComponent, TransactionDataDialog } from './transactions/transactions.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { GujPocComponent } from './guj-poc/guj-poc.component';
import { PayableServicesComponent } from './payable-services/payable-services.component';
import { CommonPaybleComponent } from './common-payble/common-payble.component';
import { LoiPaymentComponent } from './loi-payment/loi-payment.component';
import { LoiPaymentComponentBooking } from './loi-payment-booking/loi-payment.component-booking';
import { SharedTicketingModule } from './facilities/ticketings/shared-ticketing/shared-ticketing.module';
import { PropertyTaxDetailComponent } from './common-payble/property-tax-detail/property-tax-detail.component';
import { WaterTaxDetailComponent } from './common-payble/water-tax-detail/water-tax-detail.component';
import { ViewPecPrcReceiptComponent } from './view-pec-prc-receipt/view-pec-prc-receipt.component';

/* Import citizen components end */


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		SharedTicketingModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		AuthModule,
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
		PayableServicesComponent,
		CommonPaybleComponent,
		LoiPaymentComponent,
		LoiPaymentComponentBooking,
		PropertyTaxDetailComponent,
		WaterTaxDetailComponent,
		ViewPecPrcReceiptComponent
	]
})
export class CitizenModule { }
