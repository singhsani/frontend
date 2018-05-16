import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HospitalAuthRoutingModule { }
