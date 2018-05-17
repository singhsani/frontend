import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* import all citizen related services start */
import { HosAppService } from './services/hospital/app-services/hos-app.service';
import { AuthGuard } from './guard/auth.guard';
import { HospitalGuard } from './guard/hospital.guard';
import { AppService } from './services/citizen/app-services/app.service';
import { PaginationService } from './services/citizen/data-services/pagination.service';
import { FormsActionsService } from './services/citizen/data-services/forms-actions.service';
import { BookingService } from './services/citizen/data-services/booking.service';
/* import all citizen related services end */


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
	],
	providers: [
		HosAppService,
		AuthGuard,
		HospitalGuard,
		AppService,
		PaginationService,
		FormsActionsService,
		BookingService
	]
})

export class CoreModule { }
