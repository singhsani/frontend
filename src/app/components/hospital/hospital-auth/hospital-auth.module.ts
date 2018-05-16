import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { HospitalAuthRoutingModule } from './hospital-auth-routing.module';

import { HosLoginLayoutComponent } from '../../../layouts/hos-login-layout/hos-login-layout.component';
import { HospitalLoginComponent } from './hospital-login/hospital-login.component';
import { HospitalRegisterComponent } from './hospital-register/hospital-register.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		SharedModule,
		HospitalAuthRoutingModule
	],
	declarations: [
		HosLoginLayoutComponent,
		HospitalLoginComponent,
		HospitalRegisterComponent
	]
})
export class HospitalAuthModule { }
