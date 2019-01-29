import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

import { HosLoginLayoutComponent } from '../../../layouts/hos-login-layout/hos-login-layout.component';
import { HospitalLoginComponent } from './hospital-login/hospital-login.component';
import { HospitalRegisterComponent } from './hospital-register/hospital-register.component';

const routes: Routes = [
	{
		path: 'auth', component: HosLoginLayoutComponent,
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: HospitalLoginComponent },
			{ path: 'register', component: HospitalRegisterComponent }
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		SharedModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		HosLoginLayoutComponent,
		HospitalLoginComponent,
		HospitalRegisterComponent
	]
})
export class HospitalAuthModule { }
