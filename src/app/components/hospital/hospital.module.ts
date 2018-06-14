import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { HospitalAuthModule } from './hospital-auth/hospital-auth.module';
import { HospitalRoutingModule } from './hospital-routing.module';
/* Import all shared, core and routing module end */

/* Import hospital components start */
import { HospitalDashboardComponent } from './dashboard/dashboard.component';
import { HospitalLayoutComponent } from '../../layouts/hospital-layout/hospital-layout.component';
import { BirthRegistrationComponent } from './birth-registration/birth-registration.component';
import { DeathRegistrationComponent } from './death-registration/death-registration.component';
import { StillBirthComponent } from './still-birth/still-birth.component';
import { HosMyApplicationsComponent } from './hos-my-applications/hos-my-applications.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
/* Import hospital components end */

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CoreModule,
		HospitalAuthModule,
		HospitalRoutingModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule
	],
	declarations: [
		HospitalDashboardComponent,
		HospitalLayoutComponent,
		BirthRegistrationComponent,
		DeathRegistrationComponent,
		StillBirthComponent,
		HosMyApplicationsComponent
	]
})
export class HospitalModule { }
